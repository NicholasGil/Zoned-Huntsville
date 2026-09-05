import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

const layoutSource = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const metaPixelSource = readFileSync(
  new URL("../components/meta-pixel.tsx", import.meta.url),
  "utf8",
);
const checkoutFormSource = readFileSync(
  new URL("../components/checkout-form.tsx", import.meta.url),
  "utf8",
);
const sampleFormSource = readFileSync(
  new URL("../components/sample-opt-in-form.tsx", import.meta.url),
  "utf8",
);
const successPageSource = readFileSync(
  new URL("../app/checkout/success/page.tsx", import.meta.url),
  "utf8",
);
const checkoutApiSource = readFileSync(
  new URL("../app/api/checkout/route.ts", import.meta.url),
  "utf8",
);
const privacySource = readFileSync(
  new URL("../app/legal/privacy/page.tsx", import.meta.url),
  "utf8",
);
const envExample = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
const metaPixelLib = readFileSync(new URL("./meta-pixel.ts", import.meta.url), "utf8");
const guideIndexSource = readFileSync(
  new URL("../app/guide/page.tsx", import.meta.url),
  "utf8",
);

const HARDCODED_PIXEL = /fbq\(\s*['"]init['"]\s*,\s*['"]\d+/;
const HARDCODED_ID_ASSIGN = /NEXT_PUBLIC_META_PIXEL_ID\s*=\s*['"]\d+/;

describe("meta pixel wiring", () => {
  it("loads fbevents from env only and no-ops without an ID", () => {
    assert.match(layoutSource, /<MetaPixel \/>/);
    assert.match(metaPixelSource, /next\/script/);
    assert.match(metaPixelSource, /fbevents\.js/);
    assert.match(metaPixelSource, /fbq\('init'/);
    assert.match(metaPixelSource, /fbq\('track', 'PageView'\)/);
    assert.match(metaPixelSource, /getMetaPixelId\(\)/);
    assert.match(metaPixelLib, /process\.env\.NEXT_PUBLIC_META_PIXEL_ID/);
    assert.match(envExample, /NEXT_PUBLIC_META_PIXEL_ID=/);
    assert.equal(HARDCODED_PIXEL.test(metaPixelSource), false);
    assert.equal(HARDCODED_ID_ASSIGN.test(envExample), false);
    assert.equal(HARDCODED_PIXEL.test(metaPixelLib), false);
  });

  it("fires InitiateCheckout on checkout submit and posts attribution fields", () => {
    assert.match(checkoutFormSource, /InitiateCheckout/);
    assert.match(checkoutFormSource, /captureAttributionForCheckout/);
    assert.match(checkoutFormSource, /ATTRIBUTION_KEYS/);
    assert.match(checkoutFormSource, /form\.submit\(\)/);
    assert.match(checkoutFormSource, /writeAttributionFields/);
    assert.match(checkoutApiSource, /stripeCheckoutSessionParams\(tierValue, env\.siteUrl, attribution\)/);
    assert.match(checkoutApiSource, /attributionFromFormData|parseAttributionRecord/);
  });

  it("fires Lead after sample opt-in success and Purchase only on checkout success", () => {
    assert.match(sampleFormSource, /state\.kind !== "received"/);
    assert.match(sampleFormSource, /Lead/);
    assert.match(successPageSource, /PurchasePixel/);
    assert.match(successPageSource, /receipt=\{receipt\}/);
    assert.equal(existsSync(new URL("../app/thank-you", import.meta.url)), false);
    assert.equal(existsSync(new URL("../app/thanks", import.meta.url)), false);
    assert.equal(existsSync(new URL("../app/success", import.meta.url)), false);
  });

  it("keeps unpaid /guide gated and discloses the pixel in privacy", () => {
    assert.match(guideIndexSource, /AccessGate/);
    assert.match(guideIndexSource, /canReadGuide/);
    assert.match(privacySource, /Meta Pixel/);
    assert.match(privacySource, /fbevents/);
    assert.match(privacySource, /InitiateCheckout/);
    assert.match(privacySource, /Purchase after a confirmed payment/);
    assert.match(privacySource, /fbclid/);
    assert.equal(/\d+\s+days/.test(privacySource), false);
  });
});
