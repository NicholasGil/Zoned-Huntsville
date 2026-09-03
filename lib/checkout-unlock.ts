import type { CheckoutReceipt } from "./checkout-receipt.ts";

/**
 * How the thank-you page gets a paid buyer into the guide without email.
 *
 * - `ready`: this browser is already signed in as the checkout email.
 * - `unlock`: send the browser through the unlock route, which signs it in
 *   from the paid Checkout Session and bounces back here.
 * - `needs-sign-in`: unlock was tried (or cannot work), so the honest
 *   fallback is signing in with the checkout email.
 * - `none`: not a confirmed payment; nothing to unlock.
 */
export type CheckoutAccess =
  | { kind: "ready"; email: string }
  | { kind: "unlock"; href: string }
  | { kind: "needs-sign-in" }
  | { kind: "none" };

export const UNLOCK_PATH = "/checkout/success/unlock";
export const SUCCESS_PATH = "/checkout/success";

/** Checkout Session ids are only useful for unlock for a limited window. */
export const UNLOCK_MAX_AGE_SECONDS = 24 * 60 * 60;

export function sameEmail(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) {
    return false;
  }
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function unlockHref(sessionId: string): string {
  const params = new URLSearchParams({ session_id: sessionId });
  return `${UNLOCK_PATH}?${params.toString()}`;
}

export function successHref(sessionId: string, unlock: "ok" | "failed"): string {
  const params = new URLSearchParams({ session_id: sessionId, unlock });
  return `${SUCCESS_PATH}?${params.toString()}`;
}

export function planCheckoutAccess(input: {
  receipt: CheckoutReceipt;
  sessionId: string | null;
  signedInEmail: string | null;
  unlockParam: string | null;
}): CheckoutAccess {
  const { receipt } = input;
  if (receipt.kind !== "confirmed") {
    return { kind: "none" };
  }

  if (receipt.email && sameEmail(receipt.email, input.signedInEmail)) {
    return { kind: "ready", email: receipt.email };
  }

  if (!receipt.email || !input.sessionId) {
    return { kind: "needs-sign-in" };
  }

  if (input.unlockParam === "ok" || input.unlockParam === "failed") {
    return { kind: "needs-sign-in" };
  }

  return { kind: "unlock", href: unlockHref(input.sessionId) };
}

/**
 * Only a recently created, paid session may sign a browser in. The
 * webhook keeps writing entitlements for older sessions; the buyer signs
 * in with the checkout email instead.
 */
export function isCheckoutUnlockFresh(
  session: { created?: number | null; payment_status?: string | null },
  nowSeconds: number = Math.floor(Date.now() / 1000),
): boolean {
  if (session.payment_status !== "paid") {
    return false;
  }
  if (typeof session.created !== "number") {
    return false;
  }
  return nowSeconds - session.created <= UNLOCK_MAX_AGE_SECONDS;
}

/**
 * processed_events row that marks a Checkout Session as already used to sign
 * a browser in. The success URL lives in browser history, so unlock is
 * one-shot; any later device takes the sign-in-with-checkout-email path.
 */
export function unlockMarkerId(sessionId: string): string {
  return `checkout-unlock:${sessionId}`;
}

export type UnlockOutcome =
  | { kind: "signed-in" }
  | {
      kind: "failed";
      reason:
        | "missing-session"
        | "stripe-unset"
        | "retrieve-failed"
        | "not-paid"
        | "no-email"
        | "stale"
        | "already-used"
        | "supabase-unset"
        | "auth-user"
        | "generate-link"
        | "verify";
    };

export type UnlockAuthAdmin = {
  auth: {
    admin: {
      generateLink: (params: { type: "magiclink"; email: string }) => Promise<{
        data: { properties: { hashed_token: string } | null } | null;
        error: { message: string } | null;
      }>;
    };
  };
};

export type UnlockSessionClient = {
  auth: {
    verifyOtp: (params: {
      type: "magiclink" | "email";
      token_hash: string;
    }) => PromiseLike<{ error: { message: string } | null }>;
  };
  rpc: (name: "link_my_entitlements") => unknown;
};

/**
 * Sign the current browser in as `email` with no mail: mint a one-time
 * token hash server-side and consume it against the cookie-backed client.
 */
export async function signInBrowserAsCheckoutEmail(
  admin: UnlockAuthAdmin,
  supabase: UnlockSessionClient,
  email: string,
): Promise<UnlockOutcome> {
  const generated = await admin.auth.admin.generateLink({ type: "magiclink", email });
  const tokenHash = generated.data?.properties?.hashed_token;
  if (generated.error || !tokenHash) {
    return { kind: "failed", reason: "generate-link" };
  }

  const first = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: tokenHash });
  if (first.error) {
    const second = await supabase.auth.verifyOtp({ type: "email", token_hash: tokenHash });
    if (second.error) {
      return { kind: "failed", reason: "verify" };
    }
  }

  await supabase.rpc("link_my_entitlements");
  return { kind: "signed-in" };
}
