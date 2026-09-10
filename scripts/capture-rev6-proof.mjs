import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.PROOF_PORT ?? "34568";
const baseUrl = process.env.PROOF_BASE_URL ?? `http://127.0.0.1:${port}`;

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server not ready: ${url}`);
}

mkdirSync(join(repoRoot, "public/proof"), { recursive: true });
mkdirSync(join(repoRoot, "docs/proof"), { recursive: true });

if (!process.env.PROOF_BASE_URL) {
  const { spawn } = await import("node:child_process");
  const child = spawn("npm", ["run", "start", "--", "-p", port], {
    cwd: repoRoot,
    stdio: "ignore",
    env: { ...process.env, PORT: port },
  });
  await waitForServer(baseUrl, 90_000);
  try {
    await capture();
  } finally {
    child.kill("SIGTERM");
  }
} else {
  await waitForServer(baseUrl, 30_000);
  await capture();
}

async function capture() {
  const browser = await chromium.launch();
  const samplePath = join(repoRoot, "public/proof/sample-guide-hero.png");
  const pageSample = await browser.newPage();
  await pageSample.setViewportSize({ width: 390, height: 844 });
  await pageSample.goto(`${baseUrl}/sample`, { waitUntil: "networkidle" });
  await pageSample.screenshot({ path: samplePath, fullPage: false });
  await pageSample.close();

  const page375 = await browser.newPage();
  await page375.setViewportSize({ width: 375, height: 667 });
  await page375.goto(baseUrl, { waitUntil: "networkidle" });
  await page375.evaluate(() => window.scrollTo(0, 0));
  await page375.screenshot({
    path: join(repoRoot, "docs/proof/hormozi-rev6-375x667.png"),
    fullPage: false,
  });
  await page375.close();

  const page1280 = await browser.newPage();
  await page1280.setViewportSize({ width: 1280, height: 800 });
  await page1280.goto(baseUrl, { waitUntil: "networkidle" });
  await page1280.evaluate(() => window.scrollTo(0, 0));
  await page1280.screenshot({
    path: join(repoRoot, "docs/proof/hormozi-rev6-1280x800.png"),
    fullPage: false,
  });
  await page1280.close();

  await browser.close();
  console.log("Captured sample + homepage proof PNGs");
}
