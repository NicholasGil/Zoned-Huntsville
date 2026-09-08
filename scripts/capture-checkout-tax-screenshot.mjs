#!/usr/bin/env node
/**
 * Opens a Stripe Checkout URL, fills a taxable US address, and screenshots
 * the order summary when a Tax line appears. Test mode only.
 *
 * Usage:
 *   CHECKOUT_URL=https://checkout.stripe.com/c/pay/cs_test_... node scripts/capture-checkout-tax-screenshot.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const checkoutUrl = process.env.CHECKOUT_URL?.trim();
if (!checkoutUrl) {
  console.error("Set CHECKOUT_URL to a cs_test_* hosted Checkout URL.");
  process.exit(1);
}
if (!checkoutUrl.includes("cs_test_")) {
  console.error("CHECKOUT_URL must be a test-mode Checkout session (cs_test_*).");
  process.exit(1);
}

const outDir = process.env.ARTIFACT_DIR ?? "/opt/cursor/artifacts/screenshots";
await mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, "checkout_tax_line_test_mode.png");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  await page.goto(checkoutUrl, { waitUntil: "networkidle", timeout: 120_000 });

  const email = page.locator('input[name="email"], input[type="email"]').first();
  if (await email.isVisible({ timeout: 10_000 }).catch(() => false)) {
    await email.fill("tax-proof@example.com");
  }

  const cardAccordion = page.getByText("Card", { exact: false }).first();
  if (await cardAccordion.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await cardAccordion.click();
  }

  const cardNumber = page.locator('input[name="cardNumber"], input[autocomplete="cc-number"]').first();
  if (await cardNumber.isVisible({ timeout: 10_000 }).catch(() => false)) {
    await cardNumber.fill("4242 4242 4242 4242");
    const expiry = page.locator('input[name="cardExpiry"], input[autocomplete="cc-exp"]').first();
    const cvc = page.locator('input[name="cardCvc"], input[autocomplete="cc-csc"]').first();
    if (await expiry.isVisible().catch(() => false)) await expiry.fill("12/34");
    if (await cvc.isVisible().catch(() => false)) await cvc.fill("123");
  }

  const addressLine1 = page.locator('input[name="billingAddressLine1"], input[autocomplete="address-line1"]').first();
  if (await addressLine1.isVisible({ timeout: 10_000 }).catch(() => false)) {
    await addressLine1.fill("123 Main St");
    const city = page.locator('input[name="billingLocality"], input[autocomplete="address-level2"]').first();
    const state = page.locator('select[name="billingAdministrativeArea"], input[autocomplete="address-level1"]').first();
    const zip = page.locator('input[name="billingPostalCode"], input[autocomplete="postal-code"]').first();
    if (await city.isVisible().catch(() => false)) await city.fill("Huntsville");
    if (await state.isVisible().catch(() => false)) {
      const tag = await state.evaluate((el) => el.tagName.toLowerCase());
      if (tag === "select") await state.selectOption("AL");
      else await state.fill("AL");
    }
    if (await zip.isVisible().catch(() => false)) await zip.fill("35801");
  }

  await page.waitForTimeout(3_000);

  const bodyText = await page.locator("body").innerText();
  const hasTaxLine = /\bTax\b/i.test(bodyText) && !/Tax ID/i.test(bodyText);

  await page.screenshot({ path: outPath, fullPage: true });
  console.log(
    JSON.stringify(
      {
        screenshot: outPath,
        hasTaxLine,
        checkoutUrl,
        snippet: bodyText.split("\n").filter((line) => /tax|total|79/i.test(line)).slice(0, 10),
      },
      null,
      2,
    ),
  );

  if (!hasTaxLine) {
    console.error("Tax line not detected in checkout summary. Enable Stripe Tax in Dashboard.");
    process.exit(2);
  }
} finally {
  await browser.close();
}
