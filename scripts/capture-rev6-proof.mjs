import { mkdirSync } from "node:fs";
import { createServer } from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function pickFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("could not allocate proof port"));
        return;
      }
      const port = address.port;
      server.close((error) => {
        if (error) reject(error);
        else resolve(port);
      });
    });
    server.on("error", reject);
  });
}

const port =
  process.env.PROOF_PORT ??
  (process.env.PROOF_BASE_URL ? null : String(await pickFreePort()));
const baseUrl =
  process.env.PROOF_BASE_URL ?? `http://127.0.0.1:${port}`;

const HOME_H1 = "City name isn’t the school zone.";
const SAMPLE_H1 = "Address → zone";
const HOME_PAGE_MARKERS = [
  "City name isn’t the school zone.",
  "Know the zone before I sign — $79",
];

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

async function assertHomeFold(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const h1 = await page.locator("#hero-heading").textContent();
  if (!h1?.includes("City name")) {
    throw new Error(`Expected homepage H1, got: ${h1}`);
  }
  const path = await page.evaluate(() => location.pathname);
  if (path !== "/") {
    throw new Error(`Expected pathname /, got ${path}`);
  }
  const fold = await page.evaluate(() => {
    const vh = window.innerHeight;
    const visible = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= vh && r.height > 0;
    };
    const textIncludes = (snippet) =>
      document.body.innerText.includes(snippet);
    return {
      h1: visible("#hero-heading"),
      cta: visible('button[type="submit"]'),
      sampleLink: textIncludes("See the free sample"),
      mechanism: textIncludes("Sourced, dated assembly across five systems"),
    };
  });
  if (!fold.h1 || !fold.mechanism || !fold.sampleLink) {
    throw new Error(`Home fold missing elements: ${JSON.stringify(fold)}`);
  }
  return fold;
}

async function assertMobileBuyClusterInView(page) {
  const fold = await assertHomeFold(page);
  if (!fold.cta) {
    throw new Error(
      `$79 CTA must be in 375×667 viewport at scrollY=0: ${JSON.stringify(fold)}`,
    );
  }
  const layout = await page.evaluate(() => {
    const vh = window.innerHeight;
    const buy = document.getElementById("hero-buy-cluster");
    const link = document.getElementById("hero-sample-demo-link");
    const phone = document.querySelector("#hero-fold [aria-hidden='true']");
    const inView = (el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= vh;
    };
    const buyRect = buy?.getBoundingClientRect();
    const linkRect = link?.getBoundingClientRect();
    const phoneRect = phone?.getBoundingClientRect();
    return {
      chips: document.body.innerText.includes("30-day money-back"),
      linkInView: inView(link),
      buyAbovePhone:
        buyRect &&
        linkRect &&
        phoneRect &&
        buyRect.bottom <= linkRect.bottom + 2 &&
        linkRect.bottom <= phoneRect.top + 2,
      path: location.pathname,
      h1: document.querySelector("#hero-heading")?.textContent?.trim(),
    };
  });
  if (layout.path !== "/") {
    throw new Error(`Homepage proof must be /, got ${layout.path}`);
  }
  if (!layout.h1?.includes("City name")) {
    throw new Error(`Homepage proof H1 wrong: ${layout.h1}`);
  }
  if (!layout.linkInView || !layout.chips) {
    throw new Error(`Buy cluster incomplete in viewport: ${JSON.stringify(layout)}`);
  }
  if (!layout.buyAbovePhone) {
    throw new Error(`Phone must sit below buy cluster: ${JSON.stringify(layout)}`);
  }
}

async function assertSampleCardInFirstScreen(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const visible = await page.evaluate(() => {
    const heading = document.getElementById("hcs-zone-demo-heading");
    const verified = document.body.innerText.includes("verified");
    if (!heading) return { ok: false, reason: "missing heading" };
    const r = heading.getBoundingClientRect();
    const inView = r.top >= 0 && r.top < window.innerHeight * 0.55;
    return { ok: inView && verified, headingTop: r.top, verified };
  });
  if (!visible.ok) {
    throw new Error(`Sample HCS card not in first screen: ${JSON.stringify(visible)}`);
  }
}

async function assertSamplePage(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const h1 = await page.locator("h1").first().textContent();
  if (!h1?.includes(SAMPLE_H1)) {
    throw new Error(`Expected sample H1, got: ${h1}`);
  }
}

async function assertSampleMobileHeader(page) {
  const header = page.locator("header");
  const nav = header.locator('nav[aria-label="Primary"]');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(`${baseUrl}/sample`, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 0));
  const navBox = await nav.boundingBox();
  if (navBox && navBox.width > 0 && navBox.height > 0) {
    throw new Error("Desktop primary nav should be hidden on 375px /sample");
  }
  const menu = header.getByRole("button");
  if ((await menu.count()) < 1) {
    throw new Error("Expected mobile menu button on /sample header");
  }
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

  const page375 = await browser.newPage();
  await page375.setViewportSize({ width: 375, height: 667 });
  await page375.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await assertMobileBuyClusterInView(page375);
  await page375.screenshot({
    path: join(repoRoot, "docs/proof/hormozi-rev6-375x667.png"),
    fullPage: false,
  });
  await page375.screenshot({
    path: join(repoRoot, "docs/proof/revenue-fold-375x667.png"),
    fullPage: false,
  });
  await page375.close();

  const page1280 = await browser.newPage();
  await page1280.setViewportSize({ width: 1280, height: 800 });
  await page1280.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await assertHomeFold(page1280);
  await page1280.screenshot({
    path: join(repoRoot, "docs/proof/hormozi-rev6-1280x800.png"),
    fullPage: false,
  });
  await page1280.screenshot({
    path: join(repoRoot, "docs/proof/revenue-fold-1280x800.png"),
    fullPage: false,
  });
  await page1280.close();

  const pageSample375 = await browser.newPage();
  await pageSample375.setViewportSize({ width: 375, height: 667 });
  await pageSample375.goto(`${baseUrl}/sample`, { waitUntil: "networkidle" });
  await assertSamplePage(pageSample375);
  await assertSampleCardInFirstScreen(pageSample375);
  await pageSample375.screenshot({
    path: join(repoRoot, "docs/proof/sample-375x667.png"),
    fullPage: false,
  });
  await pageSample375.close();

  const samplePath = join(repoRoot, "public/proof/sample-guide-hero.png");
  const pageSample = await browser.newPage();
  await pageSample.setViewportSize({ width: 390, height: 844 });
  await pageSample.goto(`${baseUrl}/sample`, { waitUntil: "networkidle" });
  const citation = pageSample.locator("text=/verified/i").first();
  if (await citation.count()) {
    await citation.scrollIntoViewIfNeeded();
  }
  await pageSample.screenshot({
    path: samplePath,
    fullPage: false,
    clip: { x: 0, y: 0, width: 390, height: 520 },
  });
  await pageSample.close();

  const pageSampleHeader = await browser.newPage();
  await assertSampleMobileHeader(pageSampleHeader);
  await pageSampleHeader.close();

  await browser.close();
  console.log("Captured homepage + sample proof PNGs");
}
