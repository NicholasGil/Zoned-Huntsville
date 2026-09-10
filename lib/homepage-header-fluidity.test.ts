import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it, before, after } from "node:test";
import { chromium, type Browser, type Page } from "playwright";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROOF_DIRS = ["docs/proof", "public/proof"] as const;
const VIEWPORT = { width: 375, height: 667 };

type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

function findCommitted375Proof(): string | null {
  for (const dir of PROOF_DIRS) {
    const proofDir = join(repoRoot, dir);
    if (!existsSync(proofDir)) {
      continue;
    }
    for (const name of readdirSync(proofDir)) {
      if (!name.endsWith(".png")) {
        continue;
      }
      if (!/(375|375x667)/i.test(name)) {
        continue;
      }
      const fullPath = join(proofDir, name);
      const header = readFileSync(fullPath, { encoding: "latin1", flag: "r" }).slice(
        0,
        8,
      );
      if (header.startsWith("\x89PNG\r\n\x1a\n")) {
        return fullPath;
      }
    }
  }
  return null;
}

function findCommitted1280Proof(): string | null {
  for (const dir of PROOF_DIRS) {
    const proofDir = join(repoRoot, dir);
    if (!existsSync(proofDir)) {
      continue;
    }
    for (const name of readdirSync(proofDir)) {
      if (!name.endsWith(".png")) {
        continue;
      }
      if (!/(1280|1280x800)/i.test(name)) {
        continue;
      }
      const fullPath = join(proofDir, name);
      const header = readFileSync(fullPath, { encoding: "latin1", flag: "r" }).slice(
        0,
        8,
      );
      if (header.startsWith("\x89PNG\r\n\x1a\n")) {
        return fullPath;
      }
    }
  }
  return null;
}

async function waitForServer(baseUrl: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { redirect: "follow" });
      if (response.ok) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Fluidity server did not become ready at ${baseUrl}`);
}

let child: ChildProcess | undefined;
let baseUrl = process.env.FLUIDITY_BASE_URL ?? "";
let browser: Browser | undefined;

describe("homepage header fluidity gate", () => {
  it("(d) has committed 375×667 and 1280×800 PNG proof artifacts", () => {
    const mobile375 = findCommitted375Proof();
    assert.ok(
      mobile375,
      `missing 375×667 PNG under ${PROOF_DIRS.join(" or ")}`,
    );
    const desktop1280 = findCommitted1280Proof();
    assert.ok(
      desktop1280,
      `missing 1280×800 PNG under ${PROOF_DIRS.join(" or ")}`,
    );
  });

  describe("playwright @ 375×667 scrollY=0", () => {
    before(async () => {
      if (!baseUrl) {
        const buildIdPath = join(repoRoot, ".next", "BUILD_ID");
        assert.ok(
          existsSync(buildIdPath),
          "run `npm run build` before fluidity tests (or set FLUIDITY_BASE_URL)",
        );
        const port = process.env.FLUIDITY_PORT ?? "34567";
        baseUrl = `http://127.0.0.1:${port}`;
        child = spawn(
          "npm",
          ["run", "start", "--", "-p", port],
          {
            cwd: repoRoot,
            stdio: "ignore",
            env: { ...process.env, PORT: port },
          },
        );
        await waitForServer(baseUrl, 90_000);
      }
      browser = await chromium.launch();
    });

    after(async () => {
      await browser?.close();
      if (child && !child.killed) {
        child.kill("SIGTERM");
      }
    });

    async function assertHeaderFluidityAtScrollTop(page: Page, menuOpen: boolean) {
      await page.evaluate(() => {
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      });

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      assert.ok(
        overflow.scrollWidth <= overflow.clientWidth,
        `(b) horizontal overflow: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`,
      );

      const intersections = await page.evaluate(() => {
        const header = document.querySelector("header");
        if (!header) {
          return { error: "missing header" as const };
        }
        const rects: Rect[] = [];
        const walker = document.createTreeWalker(header, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const text = node.textContent?.replace(/\s+/g, " ").trim();
          if (!text) {
            continue;
          }
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const rect of range.getClientRects()) {
            if (rect.width > 0 && rect.height > 0) {
              rects.push({
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height,
              });
            }
          }
        }
        const pairs: string[] = [];
        for (let i = 0; i < rects.length; i += 1) {
          for (let j = i + 1; j < rects.length; j += 1) {
            const a = rects[i];
            const b = rects[j];
            if (
              a.width > 0 &&
              a.height > 0 &&
              b.width > 0 &&
              b.height > 0 &&
              a.left < b.right &&
              a.right > b.left &&
              a.top < b.bottom &&
              a.bottom > b.top
            ) {
              pairs.push(`rect ${i}×${j}`);
            }
          }
        }
        return { pairs };
      });

      assert.equal(
        "error" in intersections ? intersections.error : undefined,
        undefined,
      );
      assert.equal(
        intersections.pairs?.length ?? 0,
        0,
        `(a) header text rects intersect: ${intersections.pairs?.join(", ")}`,
      );

      const menuToggle = page.getByRole("button", {
        name: menuOpen ? "Close menu" : "Open menu",
      });
      await menuToggle.waitFor({ state: "visible" });
      const toggleBox = await menuToggle.boundingBox();
      assert.ok(toggleBox, "(c) hamburger control missing bounding box");
      assert.ok(
        toggleBox.width >= 44 && toggleBox.height >= 44,
        `(c) hamburger control ${toggleBox.width}×${toggleBox.height} < 44×44`,
      );

      if (menuOpen) {
        const linkSizes = await page.evaluate(() => {
          const menus = Array.from(
            document.querySelectorAll("header nav[aria-label='Primary']"),
          );
          const menu = menus.find((nav) => {
            const style = window.getComputedStyle(nav);
            return style.display !== "none" && nav.getClientRects().length > 0;
          });
          if (!menu) {
            return { error: "no visible header menu nav" as const };
          }
          const links = Array.from(menu.querySelectorAll("a"));
          return {
            sizes: links.map((link, index) => {
              const rect = link.getBoundingClientRect();
              return {
                index,
                label: link.textContent?.trim() ?? "",
                width: rect.width,
                height: rect.height,
              };
            }),
          };
        });

        assert.equal("error" in linkSizes ? linkSizes.error : undefined, undefined);
        for (const link of linkSizes.sizes ?? []) {
          assert.ok(
            link.width >= 44 && link.height >= 44,
            `(c) menu link "${link.label}" ${link.width}×${link.height} < 44×44`,
          );
        }
      }
    }

    it("passes with menu closed", async () => {
      assert.ok(browser);
      const page = await browser.newPage();
      await page.setViewportSize(VIEWPORT);
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await assertHeaderFluidityAtScrollTop(page, false);
      await page.close();
    });

    it("passes with menu open (menu tap targets)", async () => {
      assert.ok(browser);
      const page = await browser.newPage();
      await page.setViewportSize(VIEWPORT);
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("button", { name: "Close menu" }).waitFor({
        state: "visible",
      });
      await assertHeaderFluidityAtScrollTop(page, true);
      await page.close();
    });
  });
});
