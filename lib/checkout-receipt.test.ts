import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  checkoutOffer,
  stripeCheckoutLineItem,
  stripeCheckoutSessionParams,
} from "./checkout-offer.ts";
import {
  mapCheckoutSession,
  mapLastPayment,
  purchaseSummaryLabel,
  receiptHasInventedAmount,
  unavailableReceipt,
} from "./checkout-receipt.ts";

const receiptViewSource = readFileSync(
  new URL("../components/checkout-receipt.tsx", import.meta.url),
  "utf8",
);
const successPageSource = readFileSync(
  new URL("../app/checkout/success/page.tsx", import.meta.url),
  "utf8",
);

const BUYER_JARGON = [
  "webhook",
  "Checkout Session",
  "session_id",
  "Not returned by Stripe",
  "Purchase confirmation",
  "Checkout not confirmed",
] as const;

const FAKE_PROOF = [
  "testimonial",
  "5-star",
  "families served",
  "customers love",
  "as seen in",
] as const;

describe("stripeCheckoutLineItem", () => {
  it("names the product and maps only the three catalog prices", () => {
    assert.deepEqual(stripeCheckoutLineItem("79"), {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: 7900,
        product_data: {
          name: "The Huntsville School Guide — Guide",
          description: "Guide",
        },
      },
    });
    assert.deepEqual(stripeCheckoutLineItem("149").price_data, {
      currency: "usd",
      unit_amount: 14900,
      product_data: {
        name: "The Huntsville School Guide — Guide + Toolkit",
        description: "Guide + Toolkit",
      },
    });
    assert.deepEqual(stripeCheckoutLineItem("349").price_data, {
      currency: "usd",
      unit_amount: 34900,
      product_data: {
        name: "The Huntsville School Guide — Guide + Toolkit + Call",
        description: "Guide + Toolkit + Call",
      },
    });
    assert.equal(checkoutOffer("79").amountUsd, 79);
    assert.equal(checkoutOffer("149").amountUsd, 149);
    assert.equal(checkoutOffer("349").amountUsd, 349);
  });

  it("keeps mode payment, catalog unit_amounts, and metadata.tier 79|149|349", () => {
    const expected = [
      ["79", 7900],
      ["149", 14900],
      ["349", 34900],
    ] as const;

    for (const [tier, unitAmount] of expected) {
      const params = stripeCheckoutSessionParams(tier, "https://example.com");
      assert.equal(params.mode, "payment");
      assert.equal(params.metadata.tier, tier);
      assert.equal(params.line_items[0]?.price_data.currency, "usd");
      assert.equal(params.line_items[0]?.price_data.unit_amount, unitAmount);
      assert.equal(
        params.success_url,
        "https://example.com/checkout/success?session_id={CHECKOUT_SESSION_ID}",
      );
      assert.equal(params.cancel_url, "https://example.com/#pricing");
    }
  });

  it("copies UTMs and fbclid onto metadata and success_url without dropping tier", () => {
    const params = stripeCheckoutSessionParams("79", "https://example.com", {
      utm_source: "facebook",
      utm_medium: "paid",
      utm_campaign: "guide",
      utm_content: "hero",
      utm_term: "school+guide",
      fbclid: "IwAR.test",
      gclid: "Cjw.test",
    });

    assert.equal(params.metadata.tier, "79");
    assert.equal(params.metadata.utm_source, "facebook");
    assert.equal(params.metadata.utm_medium, "paid");
    assert.equal(params.metadata.utm_campaign, "guide");
    assert.equal(params.metadata.fbclid, "IwAR.test");
    assert.equal(params.metadata.gclid, "Cjw.test");
    assert.match(params.success_url, /session_id=\{CHECKOUT_SESSION_ID\}/);
    assert.match(params.success_url, /utm_source=facebook/);
    assert.match(params.success_url, /fbclid=IwAR\.test/);
    assert.match(params.success_url, /gclid=Cjw\.test/);
    assert.equal(params.line_items[0]?.price_data.unit_amount, 7900);
  });
});

describe("mapCheckoutSession", () => {
  it("maps amount_total, metadata.tier, and customer_email", () => {
    const receipt = mapCheckoutSession({
      payment_status: "paid",
      amount_total: 7900,
      currency: "usd",
      customer_email: "buyer@example.com",
      metadata: { tier: "guide" },
    });

    assert.deepEqual(receipt, {
      kind: "confirmed",
      productName: "The Huntsville School Guide",
      tier: "guide",
      tierLabel: "Guide",
      amountUsd: 79,
      amountDisplay: "$79",
      currency: "usd",
      email: "buyer@example.com",
    });
  });

  it("maps price-id metadata.tier and prefers customer_details.email", () => {
    const receipt = mapCheckoutSession({
      payment_status: "paid",
      amount_total: 14900,
      currency: "usd",
      customer_email: "ignored@example.com",
      customer_details: { email: "toolkit-buyer@example.com" },
      metadata: { tier: "149" },
    });

    assert.equal(receipt.kind, "confirmed");
    if (receipt.kind === "confirmed") {
      assert.equal(receipt.tier, "toolkit");
      assert.equal(receipt.tierLabel, "Toolkit");
      assert.equal(receipt.amountUsd, 149);
      assert.equal(receipt.amountDisplay, "$149");
      assert.equal(receipt.currency, "usd");
      assert.equal(receipt.email, "toolkit-buyer@example.com");
    }
  });

  it("maps tier from a line item when metadata.tier is missing", () => {
    const receipt = mapCheckoutSession({
      payment_status: "paid",
      amount_total: 34900,
      currency: "usd",
      line_items: {
        data: [
          {
            description: "Guide + Toolkit + Call",
            price: { unit_amount: 34900, nickname: "Call" },
          },
        ],
      },
    });

    assert.equal(receipt.kind, "confirmed");
    if (receipt.kind === "confirmed") {
      assert.equal(receipt.tier, "call");
      assert.equal(receipt.tierLabel, "Call");
      assert.equal(receipt.amountUsd, 349);
      assert.equal(receipt.amountDisplay, "$349");
      assert.equal(receipt.currency, "usd");
    }
  });

  it("does not invent an amount when the session is missing", () => {
    const receipt = mapCheckoutSession(null);

    assert.deepEqual(receipt, { kind: "unavailable", reason: "missing-session" });
    assert.equal(receiptHasInventedAmount(receipt), false);
    assert.equal("amountUsd" in receipt, false);
    assert.equal("amountDisplay" in receipt, false);
  });

  it("does not invent an amount when Stripe retrieve failed", () => {
    const receipt = unavailableReceipt("retrieve-failed");

    assert.deepEqual(receipt, { kind: "unavailable", reason: "retrieve-failed" });
    assert.equal(receiptHasInventedAmount(receipt), false);
    assert.equal("amountUsd" in receipt, false);
  });

  it("does not invent an amount when Stripe is unset", () => {
    const receipt = unavailableReceipt("stripe-unset");

    assert.deepEqual(receipt, { kind: "unavailable", reason: "stripe-unset" });
    assert.equal(receiptHasInventedAmount(receipt), false);
  });

  it("does not invent an amount when amount_total is missing from a paid session", () => {
    const receipt = mapCheckoutSession({
      payment_status: "paid",
      currency: "usd",
      customer_email: "buyer@example.com",
      metadata: { tier: "79" },
    });

    assert.equal(receipt.kind, "confirmed");
    if (receipt.kind === "confirmed") {
      assert.equal(receipt.tierLabel, "Guide");
      assert.equal(receipt.amountUsd, null);
      assert.equal(receipt.amountDisplay, null);
      assert.equal(receipt.currency, "usd");
      assert.equal(receipt.email, "buyer@example.com");
    }
    assert.equal(receiptHasInventedAmount(receipt), false);
  });

  it("does not treat an unpaid session as a paid amount", () => {
    const receipt = mapCheckoutSession({
      payment_status: "unpaid",
      amount_total: 7900,
      currency: "usd",
      metadata: { tier: "guide" },
    });

    assert.deepEqual(receipt, { kind: "unavailable", reason: "not-paid" });
    assert.equal(receiptHasInventedAmount(receipt), false);
  });
});

describe("purchaseSummaryLabel", () => {
  it("names only the tier the session returned", () => {
    const guide = mapCheckoutSession({
      payment_status: "paid",
      amount_total: 7900,
      currency: "usd",
      metadata: { tier: "79" },
    });
    assert.equal(guide.kind, "confirmed");
    if (guide.kind === "confirmed") {
      const label = purchaseSummaryLabel(guide);
      assert.equal(label, "The Huntsville School Guide — Guide");
      assert.doesNotMatch(label, /toolkit/i);
      assert.doesNotMatch(label, /call/i);
    }

    const call = mapCheckoutSession({
      payment_status: "paid",
      amount_total: 34900,
      currency: "usd",
      metadata: { tier: "call" },
    });
    assert.equal(call.kind, "confirmed");
    if (call.kind === "confirmed") {
      assert.equal(purchaseSummaryLabel(call), "The Huntsville School Guide — Call");
    }
  });

  it("falls back to the product name when the tier is unknown", () => {
    const receipt = mapCheckoutSession({
      payment_status: "paid",
      amount_total: 500,
      currency: "usd",
    });
    assert.equal(receipt.kind, "confirmed");
    if (receipt.kind === "confirmed") {
      assert.equal(receipt.tierLabel, null);
      assert.equal(purchaseSummaryLabel(receipt), "The Huntsville School Guide");
    }
  });
});

describe("checkout success buyer copy", () => {
  it("never shows plumbing terms to buyers", () => {
    for (const term of BUYER_JARGON) {
      assert.equal(
        receiptViewSource.toLowerCase().includes(term.toLowerCase()),
        false,
        `checkout-receipt.tsx must not contain "${term}"`,
      );
    }
    assert.equal(successPageSource.includes("Purchase confirmation"), false);
    assert.equal(successPageSource.includes("Checkout not confirmed"), false);
    assert.equal(successPageSource.includes("webhook"), false);
  });

  it("does not invent social proof or outcomes", () => {
    const lower = receiptViewSource.toLowerCase();
    for (const term of FAKE_PROOF) {
      assert.equal(lower.includes(term), false, `must not contain "${term}"`);
    }
    assert.doesNotMatch(receiptViewSource, /guarantee[sd]? (a )?(spot|seat|placement)/i);
  });

  it("keeps the receipt note and makes Open the guide the post-pay action", () => {
    assert.match(receiptViewSource, /Stripe emails a receipt/);
    assert.match(receiptViewSource, /min-h-11/);
    assert.match(receiptViewSource, /href="\/guide"/);
    assert.match(receiptViewSource, /Open the guide/);
    assert.match(receiptViewSource, /purchaseSummaryLabel\(receipt\)/);
    assert.match(receiptViewSource, /receipt\.amountDisplay/);
    assert.match(receiptViewSource, /receipt\.email/);
    assert.doesNotMatch(receiptViewSource, /check your inbox/i);
    assert.doesNotMatch(receiptViewSource, /may take a minute/i);
    assert.doesNotMatch(
      receiptViewSource,
      /font-serif|text-brick|text-ink\b|border-rule|(?<!text-)text-muted/,
    );
  });

  it("does not make pricing or Send link the primary action after a paid checkout", () => {
    const confirmed = receiptViewSource.slice(receiptViewSource.indexOf("function ConfirmedView"));
    assert.equal(confirmed.includes("/#pricing"), false);
    assert.equal(confirmed.includes("Send link"), false);
    assert.match(confirmed, /access\.kind === "ready"/);
    const primaryGuide = confirmed.indexOf('href="/guide" className={primaryButton}');
    assert.ok(primaryGuide >= 0);
    assert.ok(primaryGuide < confirmed.indexOf('id="order-heading"'));
  });
});

describe("mapLastPayment", () => {
  it("does not invent a last payment when there is no entitlement", () => {
    const view = mapLastPayment({ entitlement: null, session: null });
    assert.deepEqual(view, { kind: "none" });
    assert.equal("amountDisplay" in view, false);
  });

  it("maps amount, date, and tier from an entitlement plus a paid Stripe session", () => {
    const view = mapLastPayment({
      entitlement: {
        tier: "guide",
        purchased_at: "2026-08-31T00:00:00.000Z",
      },
      session: {
        payment_status: "paid",
        amount_total: 7900,
        currency: "usd",
      },
    });

    assert.deepEqual(view, {
      kind: "recorded",
      productName: "The Huntsville School Guide",
      tierLabel: "Guide",
      amountDisplay: "$79",
      dateDisplay: "Aug 31, 2026",
    });
  });

  it("uses the catalog amount for a known entitlement tier when Stripe has no amount", () => {
    const view = mapLastPayment({
      entitlement: {
        tier: "toolkit",
        purchased_at: "2026-01-15T12:00:00.000Z",
      },
      session: null,
    });

    assert.equal(view.kind, "recorded");
    if (view.kind === "recorded") {
      assert.equal(view.tierLabel, "Toolkit");
      assert.equal(view.amountDisplay, "$149");
      assert.equal(view.dateDisplay, "Jan 15, 2026");
    }
  });
});
