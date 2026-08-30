import { logAuthSendError, redactEmail } from "./auth-error.ts";

export type AppliedPurchaseNotifyDeps = {
  sendMagicLink: (email: string) => Promise<void>;
  sendReceipt: (input: {
    to: string;
    amountUsd: number | null;
  }) => Promise<unknown>;
};

/**
 * Post-entitlement mail. Failures must not change the webhook HTTP
 * result — Stripe would retry and we must not double-write.
 */
export async function runAppliedPurchaseNotifications(
  input: { email: string; amountUsd: number | null },
  deps: AppliedPurchaseNotifyDeps,
): Promise<void> {
  try {
    await deps.sendMagicLink(input.email);
  } catch (error) {
    logAuthSendError(
      "purchase.magic_link_failed",
      { email: redactEmail(input.email) },
      error,
    );
  }

  try {
    await deps.sendReceipt({
      to: input.email,
      amountUsd: input.amountUsd,
    });
  } catch (error) {
    logAuthSendError(
      "purchase.receipt_failed",
      { email: redactEmail(input.email) },
      error,
    );
  }
}

export function fulfillmentWebhookStatus(
  kind:
    | "ignored"
    | "duplicate"
    | "applied"
    | "refunded"
    | "missing-admin"
    | "invalid"
    | "write-failed",
): number {
  if (kind === "missing-admin") {
    return 503;
  }
  if (kind === "write-failed") {
    return 500;
  }
  return 200;
}
