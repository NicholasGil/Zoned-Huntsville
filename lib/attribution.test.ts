import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  attributionFromFormData,
  checkoutSessionMetadata,
  checkoutSuccessUrl,
  mergeAttribution,
  parseAttributionRecord,
  parseAttributionSearch,
  sanitizeAttributionValue,
} from "./attribution.ts";

describe("sanitizeAttributionValue", () => {
  it("keeps ordinary click ids and rejects markup", () => {
    assert.equal(sanitizeAttributionValue(" facebook "), "facebook");
    assert.equal(sanitizeAttributionValue("IwAR.abc-123"), "IwAR.abc-123");
    assert.equal(sanitizeAttributionValue("<script>"), null);
    assert.equal(sanitizeAttributionValue(""), null);
    assert.equal(sanitizeAttributionValue(12), null);
  });
});

describe("parseAttributionSearch", () => {
  it("reads utm_*, fbclid, and gclid and ignores other keys", () => {
    const parsed = parseAttributionSearch(
      "?utm_source=facebook&utm_medium=paid&utm_campaign=guide&utm_content=hero&utm_term=zone&fbclid=abc&gclid=xyz&session_id=cs_1&evil=<x>",
    );
    assert.deepEqual(parsed, {
      utm_source: "facebook",
      utm_medium: "paid",
      utm_campaign: "guide",
      utm_content: "hero",
      utm_term: "zone",
      fbclid: "abc",
      gclid: "xyz",
    });
  });

  it("accepts a search string without a leading question mark", () => {
    assert.deepEqual(parseAttributionSearch("utm_source=meta&fbclid=1"), {
      utm_source: "meta",
      fbclid: "1",
    });
  });
});

describe("parseAttributionRecord and form data", () => {
  it("drops empty and unsafe values", () => {
    assert.deepEqual(
      parseAttributionRecord({
        utm_source: "facebook",
        utm_medium: "",
        fbclid: "ok",
        gclid: "bad<script>",
        extra: "nope",
      }),
      { utm_source: "facebook", fbclid: "ok" },
    );
  });

  it("reads the same keys from FormData", () => {
    const form = new FormData();
    form.set("tier", "79");
    form.set("utm_source", "facebook");
    form.set("fbclid", "click-1");
    form.set("utm_medium", "");
    assert.deepEqual(attributionFromFormData(form), {
      utm_source: "facebook",
      fbclid: "click-1",
    });
  });
});

describe("mergeAttribution", () => {
  it("lets a new landing click overwrite only the keys it brought", () => {
    assert.deepEqual(
      mergeAttribution(
        { utm_source: "newsletter", utm_campaign: "old", fbclid: "keep" },
        { utm_source: "facebook", fbclid: "new" },
      ),
      { utm_source: "facebook", utm_campaign: "old", fbclid: "new" },
    );
  });
});

describe("checkoutSuccessUrl and metadata", () => {
  it("keeps the Stripe session placeholder unencoded", () => {
    assert.equal(
      checkoutSuccessUrl("https://example.com/"),
      "https://example.com/checkout/success?session_id={CHECKOUT_SESSION_ID}",
    );
  });

  it("appends attribution beside session_id and always keeps metadata.tier", () => {
    const attribution = {
      utm_source: "facebook",
      fbclid: "abc 123",
    };
    const url = checkoutSuccessUrl("https://example.com", attribution);
    assert.match(url, /session_id=\{CHECKOUT_SESSION_ID\}/);
    assert.match(url, /utm_source=facebook/);
    assert.match(url, /fbclid=abc(\+|%20)123/);

    const metadata = checkoutSessionMetadata("149", attribution);
    assert.equal(metadata.tier, "149");
    assert.equal(metadata.utm_source, "facebook");
    assert.equal(metadata.fbclid, "abc 123");
  });
});
