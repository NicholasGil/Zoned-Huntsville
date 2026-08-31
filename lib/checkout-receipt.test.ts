import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkoutOffer } from "./checkout-offer.ts";
import {
  mapCheckoutSession,
  receiptHasInventedAmount,
  unavailableReceipt,
} from "./checkout-receipt.ts";

describe("checkoutOffer", () => {
  it("restates only the three catalog prices on the pay CTA", () => {
    assert.equal(checkoutOffer("79").payCta, "Pay $79 — Guide");
    assert.equal(checkoutOffer("149").payCta, "Pay $149 — Toolkit");
    assert.equal(checkoutOffer("349").payCta, "Pay $349 — Call");
    assert.equal(checkoutOffer("79").productName, "The Huntsville School Guide");
    assert.equal(checkoutOffer("149").amountUsd, 149);
    assert.equal(checkoutOffer("349").tierLabel, "Call");
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
