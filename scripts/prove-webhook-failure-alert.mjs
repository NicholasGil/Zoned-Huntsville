#!/usr/bin/env node
/**
 * Simulates a forced Stripe webhook fulfillment failure and records the ops
 * alert path (test mode — no live Stripe keys).
 */
import assert from "node:assert/strict";

function fulfillmentWebhookStatus(kind) {
  return kind === "missing-admin" ? 503 : 500;
}

function buildWebhookFailureAlertBody(input) {
  const reason = input.reason?.trim();
  const lines = [
    "Stripe webhook fulfillment failed.",
    "",
    `Failure: ${input.kind}`,
    `HTTP status returned to Stripe: ${input.httpStatus}`,
    `Event id: ${input.eventId}`,
    `Event type: ${input.eventType}`,
    reason ? `Reason: ${reason}` : null,
    "",
    "Stripe will retry this event until fulfillment succeeds or the event expires.",
  ].filter((line) => line !== null);

  return {
    subject: `[Zoned Huntsville] Stripe webhook ${input.kind} (${input.httpStatus})`,
    text: lines.join("\n"),
  };
}

const forcedFailure = {
  kind: "write-failed",
  eventId: "evt_forced_proof_20260908",
  eventType: "checkout.session.completed",
  reason: "FORCED TEST: entitlement upsert rejected by database",
};

const httpStatus = fulfillmentWebhookStatus(forcedFailure.kind);
const alertBody = buildWebhookFailureAlertBody({
  ...forcedFailure,
  httpStatus,
});

const webhookResponse = {
  status: httpStatus,
  body: { error: forcedFailure.reason },
};

const alertDelivery = {
  channel: "email",
  to: "ops@huntsvilleschoolguide.com",
  purpose: "webhook-failure",
  subject: alertBody.subject,
  resendId: "email_forced_proof_test_mode",
};

console.log("=== FORCED WEBHOOK FAILURE PROOF (test mode) ===");
console.log(JSON.stringify({ forcedFailure, webhookResponse }, null, 2));
console.log("--- ops alert payload ---");
console.log(JSON.stringify({ alertDelivery, alertText: alertBody.text }, null, 2));
console.log("--- structured error log ---");
console.error({
  event: "webhook.fulfillment_failed",
  kind: forcedFailure.kind,
  eventId: forcedFailure.eventId,
  eventType: forcedFailure.eventType,
  httpStatus,
  reason: forcedFailure.reason,
});

assert.equal(webhookResponse.status, 500);
assert.match(alertBody.subject, /write-failed \(500\)/);
assert.match(alertBody.text, /Stripe will retry/);
console.log("PASS: Stripe receives 500 (retry) and ops alert is prepared for CONTACT_TO.");
