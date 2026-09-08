import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fulfillmentWebhookStatus } from "./purchase-follow-up.ts";

const webhookRouteSource = readFileSync(
  new URL("../app/api/webhooks/stripe/route.ts", import.meta.url),
  "utf8",
);

describe("Stripe webhook failure retry semantics", () => {
  it("returns 503 for missing-admin so Stripe retries", () => {
    assert.equal(fulfillmentWebhookStatus("missing-admin"), 503);
  });

  it("returns 500 for write-failed so Stripe retries", () => {
    assert.equal(fulfillmentWebhookStatus("write-failed"), 500);
  });

  it("keeps 200 for applied so Stripe does not retry a fulfilled event", () => {
    assert.equal(fulfillmentWebhookStatus("applied"), 200);
  });
});

describe("Stripe webhook route failure alerting", () => {
  it("alerts ops on missing-admin and write-failed without changing retry statuses", () => {
    assert.match(webhookRouteSource, /alertWebhookFulfillmentFailure/);
    assert.match(webhookRouteSource, /failureResponse/);
    assert.match(webhookRouteSource, /result\.kind === "missing-admin"/);
    assert.match(webhookRouteSource, /result\.kind === "write-failed"/);
    assert.match(webhookRouteSource, /kind: "uncaught"/);
    assert.match(webhookRouteSource, /after\(\(\) =>/);
  });
});
