import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { spawn } from "node:child_process";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = "34569";
const baseUrl = `http://127.0.0.1:${port}`;

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(baseUrl)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error("no server");
}

const child = spawn("npm", ["run", "start", "--", "-p", port], {
  cwd: repoRoot,
  stdio: "ignore",
});
await waitForServer();
try {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 0));
  const info = await page.evaluate(() => {
    const h1 = document.querySelector("#hero-heading");
    const rect = h1?.getBoundingClientRect();
    const inView = (el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= 667;
    };
    return {
      h1: h1?.textContent?.trim(),
      h1Top: rect?.top,
      path: location.pathname,
      ctaVisible: inView(document.querySelector('form button[type="submit"]')),
      heroInView: inView(h1),
      bodyTop: document.body.innerText.slice(0, 200),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
} finally {
  child.kill("SIGTERM");
}
