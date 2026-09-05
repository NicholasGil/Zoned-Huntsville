import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getMetaPixelId,
  initiateCheckoutParams,
  isValidMetaPixelId,
  leadEventParams,
  META_PIXEL_ID_ENV,
  purchaseDedupKey,
  purchasePixelEvent,
} from "./meta-pixel.ts";

describe("pixel id", () => {
  it("accepts only a numeric Meta Pixel ID from env", () => {
    assert.equal(META_PIXEL_ID_ENV, "NEXT_PUBLIC_META_PIXEL_ID");
    assert.equal(isValidMetaPixelId("123456789012345"), true);
    assert.equal(isValidMetaPixelId(" 998877 "), true);
    assert.equal(isValidMetaPixelId(""), false);
    assert.equal(isValidMetaPixelId("not-a-pixel"), false);
    assert.equal(isValidMetaPixelId("12"), false);
    assert.equal(getMetaPixelId(), null);
  });
});

describe("initiateCheckoutParams", () => {
  it("uses the catalog amount for the clicked tier", () => {
    assert.deepEqual(initiateCheckoutParams("79"), {
      content_ids: ["79"],
      content_name: "The Huntsville School Guide — Guide",
      content_type: "product",
      value: 79,
      currency: "USD",
      num_items: 1,
    });
    assert.equal(initiateCheckoutParams("149").value, 149);
    assert.equal(initiateCheckoutParams("349").value, 349);
  });
});

describe("leadEventParams", () => {
  it("names the sample, not a paid product", () => {
    const lead = leadEventParams();
    assert.equal(lead.content_name, "Huntsville City Schools sample");
    assert.equal(lead.content_category, "lead");
  });
});

describe("purchasePixelEvent", () => {
  it("does not track unpaid receipts and does not invent a value", () => {
    const unpaid = purchasePixelEvent({
      kind: "unavailable",
      sessionId: "cs_test_1",
      amountUsd: 79,
      currency: "usd",
      contentName: "The Huntsville School Guide — Guide",
      contentIds: ["guide"],
    });
    assert.equal(unpaid.shouldTrack, false);

    const paidUnknownAmount = purchasePixelEvent({
      kind: "confirmed",
      sessionId: "cs_test_1",
      amountUsd: null,
      currency: "usd",
      contentName: "The Huntsville School Guide — Guide",
      contentIds: ["guide"],
    });
    assert.equal(paidUnknownAmount.shouldTrack, true);
    assert.equal("value" in paidUnknownAmount.params, false);
    assert.equal(paidUnknownAmount.params.currency, "USD");
    assert.equal(paidUnknownAmount.eventId, "purchase:cs_test_1");
  });

  it("uses the session amount, currency, and content for a confirmed payment", () => {
    const paid = purchasePixelEvent({
      kind: "confirmed",
      sessionId: "cs_test_paid",
      amountUsd: 79,
      currency: "usd",
      contentName: "The Huntsville School Guide — Guide",
      contentIds: ["guide"],
    });
    assert.deepEqual(paid, {
      shouldTrack: true,
      eventId: "purchase:cs_test_paid",
      params: {
        content_name: "The Huntsville School Guide — Guide",
        content_type: "product",
        content_ids: ["guide"],
        value: 79,
        currency: "USD",
      },
    });
    assert.equal(purchaseDedupKey("cs_test_paid", paid.eventId), "meta_pixel:purchase:cs_test_paid");
  });
});
