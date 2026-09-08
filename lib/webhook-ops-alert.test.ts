import assert from "node:assert/strict";
import { describe, it } from "node:test";

type WebhookFailureAlertInput = {
  kind: "missing-admin" | "write-failed" | "uncaught";
  eventId: string;
  eventType: string;
  httpStatus: number;
  reason?: string;
};

function buildWebhookFailureAlertBody(input: WebhookFailureAlertInput): {
  subject: string;
  text: string;
} {
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
  ].filter((line): line is string => line !== null);

  return {
    subject: `[Zoned Huntsville] Stripe webhook ${input.kind} (${input.httpStatus})`,
    text: lines.join("\n"),
  };
}

type SendEmailInput = {
  purpose: string;
  to: string;
  subject: string;
  text: string;
};

type SendEmailResult =
  | { kind: "sent"; id: string }
  | { kind: "skipped"; reason: string }
  | { kind: "failed"; message: string };

async function alertWebhookFulfillmentFailure(
  input: WebhookFailureAlertInput,
  deps: {
    sendEmail: (input: SendEmailInput) => Promise<SendEmailResult>;
    readContactTo: () => string | null;
    captureSentry?: (input: WebhookFailureAlertInput) => Promise<boolean>;
  },
): Promise<
  | { channel: "sentry" }
  | { channel: "email"; email: SendEmailResult }
  | { channel: "console-only" }
> {
  console.error({
    event: "webhook.fulfillment_failed",
    kind: input.kind,
    eventId: input.eventId,
    eventType: input.eventType,
    httpStatus: input.httpStatus,
    reason: input.reason ?? null,
  });

  if (deps.captureSentry && (await deps.captureSentry(input))) {
    return { channel: "sentry" };
  }

  const contactTo = deps.readContactTo();
  if (!contactTo) {
    return { channel: "console-only" };
  }

  const body = buildWebhookFailureAlertBody(input);
  const email = await deps.sendEmail({
    purpose: "webhook-failure",
    to: contactTo,
    subject: body.subject,
    text: body.text,
  });
  return { channel: "email", email };
}

describe("buildWebhookFailureAlertBody", () => {
  it("includes event metadata and retry note", () => {
    const body = buildWebhookFailureAlertBody({
      kind: "write-failed",
      eventId: "evt_test_123",
      eventType: "checkout.session.completed",
      httpStatus: 500,
      reason: "Entitlement write failed.",
    });

    assert.match(body.subject, /write-failed \(500\)/);
    assert.match(body.text, /evt_test_123/);
    assert.match(body.text, /checkout\.session\.completed/);
    assert.match(body.text, /Entitlement write failed\./);
    assert.match(body.text, /Stripe will retry/);
  });
});

describe("alertWebhookFulfillmentFailure", () => {
  it("prefers Sentry when wired", async () => {
    const result = await alertWebhookFulfillmentFailure(
      {
        kind: "write-failed",
        eventId: "evt_sentry",
        eventType: "checkout.session.completed",
        httpStatus: 500,
        reason: "db down",
      },
      {
        readContactTo: () => "ops@example.com",
        sendEmail: async () => ({ kind: "sent", id: "should-not-send" }),
        captureSentry: async () => true,
      },
    );

    assert.deepEqual(result, { channel: "sentry" });
  });

  it("emails CONTACT_TO when Sentry is not wired", async () => {
    const sent: SendEmailInput[] = [];
    const result = await alertWebhookFulfillmentFailure(
      {
        kind: "missing-admin",
        eventId: "evt_email",
        eventType: "checkout.session.completed",
        httpStatus: 503,
        reason: "No service role key.",
      },
      {
        readContactTo: () => "ops@example.com",
        sendEmail: async (input) => {
          sent.push(input);
          return { kind: "sent", id: "email_test_1" };
        },
        captureSentry: async () => false,
      },
    );

    assert.equal(result.channel, "email");
    assert.equal(sent.length, 1);
    assert.equal(sent[0]?.purpose, "webhook-failure");
    assert.equal(sent[0]?.to, "ops@example.com");
    assert.match(sent[0]?.subject ?? "", /missing-admin \(503\)/);
    if (result.channel === "email") {
      assert.equal(result.email.kind, "sent");
      assert.equal(result.email.id, "email_test_1");
    }
  });

  it("logs only when neither Sentry nor CONTACT_TO is configured", async () => {
    const logged: unknown[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => {
      logged.push(args);
    };

    try {
      const result = await alertWebhookFulfillmentFailure(
        {
          kind: "write-failed",
          eventId: "evt_console",
          eventType: "checkout.session.completed",
          httpStatus: 500,
          reason: "timeout",
        },
        {
          readContactTo: () => null,
          sendEmail: async () => ({ kind: "sent", id: "unused" }),
          captureSentry: async () => false,
        },
      );

      assert.deepEqual(result, { channel: "console-only" });
      assert.equal(logged.length, 1);
      const line = (logged[0] as unknown[])[0] as {
        event: string;
        kind: string;
        eventId: string;
        httpStatus: number;
      };
      assert.equal(line.event, "webhook.fulfillment_failed");
      assert.equal(line.kind, "write-failed");
      assert.equal(line.eventId, "evt_console");
      assert.equal(line.httpStatus, 500);
    } finally {
      console.error = original;
    }
  });
});
