import "server-only";

import { getContactTo, sendTransactionalEmail, type SendEmailResult } from "@/lib/resend";

export type WebhookFailureKind = "missing-admin" | "write-failed" | "uncaught";

export type WebhookFailureAlertInput = {
  kind: WebhookFailureKind;
  eventId: string;
  eventType: string;
  httpStatus: number;
  reason?: string;
};

export type WebhookFailureAlertResult =
  | { channel: "sentry" }
  | { channel: "email"; email: SendEmailResult }
  | { channel: "console-only" };

export function buildWebhookFailureAlertBody(input: WebhookFailureAlertInput): {
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

type SentryLike = {
  captureMessage?: (message: string, context?: unknown) => void;
  captureException?: (error: unknown, context?: unknown) => void;
};

async function importOptionalSentry(): Promise<SentryLike | null> {
  try {
    const importer = new Function("specifier", "return import(specifier)") as (
      specifier: string,
    ) => Promise<SentryLike>;
    return await importer("@sentry/nextjs");
  } catch {
    return null;
  }
}

async function captureWithSentry(
  input: WebhookFailureAlertInput,
  captureSentry?: (input: WebhookFailureAlertInput) => Promise<boolean>,
): Promise<boolean> {
  if (captureSentry) {
    return captureSentry(input);
  }

  const sentryModule = await importOptionalSentry();
  if (!sentryModule) {
    return false;
  }

  const capture =
    typeof sentryModule.captureMessage === "function"
      ? sentryModule.captureMessage
      : typeof sentryModule.captureException === "function"
        ? sentryModule.captureException
        : null;
  if (!capture) {
    return false;
  }

  const body = buildWebhookFailureAlertBody(input);
  capture(`${body.subject}\n${body.text}`, {
    level: "error",
    tags: {
      webhook_failure_kind: input.kind,
      stripe_event_type: input.eventType,
    },
    extra: {
      eventId: input.eventId,
      httpStatus: input.httpStatus,
      reason: input.reason ?? null,
    },
  });
  return true;
}

export type WebhookFailureAlertDeps = {
  sendEmail?: typeof sendTransactionalEmail;
  readContactTo?: () => string | null;
  captureSentry?: (input: WebhookFailureAlertInput) => Promise<boolean>;
};

export async function alertWebhookFulfillmentFailure(
  input: WebhookFailureAlertInput,
  deps: WebhookFailureAlertDeps = {},
): Promise<WebhookFailureAlertResult> {
  const sendEmail = deps.sendEmail ?? sendTransactionalEmail;
  const readContactTo = deps.readContactTo ?? getContactTo;

  console.error({
    event: "webhook.fulfillment_failed",
    kind: input.kind,
    eventId: input.eventId,
    eventType: input.eventType,
    httpStatus: input.httpStatus,
    reason: input.reason ?? null,
  });

  if (await captureWithSentry(input, deps.captureSentry)) {
    return { channel: "sentry" };
  }

  const contactTo = readContactTo();
  if (!contactTo) {
    return { channel: "console-only" };
  }

  const body = buildWebhookFailureAlertBody(input);
  const email = await sendEmail({
    purpose: "webhook-failure",
    to: contactTo,
    subject: body.subject,
    text: body.text,
  });
  return { channel: "email", email };
}
