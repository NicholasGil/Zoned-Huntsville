import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PurchaseAuthError } from "./auth-error.ts";
import {
  fulfillmentWebhookStatus,
  runAppliedPurchaseNotifications,
} from "./purchase-follow-up.ts";

describe("fulfillmentWebhookStatus", () => {
  it("returns 200 for applied", () => {
    assert.equal(fulfillmentWebhookStatus("applied"), 200);
  });
});

describe("runAppliedPurchaseNotifications", () => {
  it("keeps applied/200 when magic-link send throws and logs the error", async () => {
    const logged: unknown[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => {
      logged.push(args);
    };

    const fulfillment = {
      kind: "applied" as const,
      entitlementId: "ent-1",
      email: "buyer@example.com",
      amountUsd: 79,
    };

    try {
      await runAppliedPurchaseNotifications(
        { email: fulfillment.email, amountUsd: fulfillment.amountUsd },
        {
          async sendMagicLink() {
            throw new PurchaseAuthError("email rate limit exceeded", {
              code: "over_email_send_rate_limit",
              status: 429,
            });
          },
          async sendReceipt() {
            return { kind: "skipped", reason: "missing-api-key" };
          },
        },
      );

      const response = {
        status: fulfillmentWebhookStatus(fulfillment.kind),
        body: { received: true, result: fulfillment.kind },
      };

      assert.equal(response.status, 200);
      assert.equal(response.body.result, "applied");
      assert.equal(logged.length, 1);
      const payload = logged[0];
      assert.ok(Array.isArray(payload));
      const line = payload[0] as {
        event: string;
        email: string;
        message: string;
        code: string;
        status: number;
      };
      assert.equal(line.event, "purchase.magic_link_failed");
      assert.equal(line.email, "b***@example.com");
      assert.equal(line.message, "email rate limit exceeded");
      assert.equal(line.code, "over_email_send_rate_limit");
      assert.equal(line.status, 429);
      assert.equal(JSON.stringify(line).includes("buyer@example.com"), false);
    } finally {
      console.error = original;
    }
  });

  it("logs a thrown receipt failure without failing the webhook", async () => {
    const logged: unknown[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => {
      logged.push(args);
    };

    try {
      await runAppliedPurchaseNotifications(
        { email: "buyer@example.com", amountUsd: 79 },
        {
          async sendMagicLink() {},
          async sendReceipt() {
            throw new Error("resend exploded");
          },
        },
      );

      assert.equal(fulfillmentWebhookStatus("applied"), 200);
      assert.equal(logged.length, 1);
      const line = (logged[0] as unknown[])[0] as {
        event: string;
        message: string;
      };
      assert.equal(line.event, "purchase.receipt_failed");
      assert.equal(line.message, "resend exploded");
    } finally {
      console.error = original;
    }
  });
});
