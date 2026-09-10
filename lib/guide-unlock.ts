import {
  signInBrowserAsCheckoutEmail,
  type UnlockAuthAdmin,
  type UnlockSessionClient,
} from "./checkout-unlock.ts";
import { ensureConfirmedAuthUser, type PurchaseAuthAdmin } from "./purchase-auth.ts";

export type EntitlementLookupAdmin = {
  from: (table: "entitlements") => {
    select: (columns: "id") => {
      is: (
        column: "refunded_at",
        value: null,
      ) => {
        eq: (
          column: "email",
          value: string,
        ) => {
          limit: (count: number) => PromiseLike<{
            data: { id: string }[] | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  };
};

export type GuideUnlockAdmin = EntitlementLookupAdmin & PurchaseAuthAdmin & UnlockAuthAdmin;

export type GuideUnlockByEmailOutcome =
  | { kind: "signed-in" }
  | { kind: "no-entitlement" }
  | { kind: "auth-user-failed" }
  | { kind: "sign-in-failed"; reason: "generate-link" | "verify" };

/**
 * Active, non-refunded rows for the checkout email (case-insensitive).
 * Matches `link_my_entitlements` / JWT email pairing.
 */
export async function hasActiveEntitlementForEmail(
  admin: EntitlementLookupAdmin,
  email: string,
): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const { data, error } = await admin
    .from("entitlements")
    .select("id")
    .is("refunded_at", null)
    .eq("email", normalized)
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
}

/**
 * Email-only guide unlock: possession of the purchase email is proof.
 * No mail is sent; session is minted via generateLink + verifyOtp.
 */
export async function unlockGuideByPurchaseEmail(
  admin: GuideUnlockAdmin,
  supabase: UnlockSessionClient,
  email: string,
): Promise<GuideUnlockByEmailOutcome> {
  const normalized = email.trim().toLowerCase();

  const entitled = await hasActiveEntitlementForEmail(admin, normalized);
  if (!entitled) {
    return { kind: "no-entitlement" };
  }

  try {
    await ensureConfirmedAuthUser(admin, normalized);
  } catch {
    return { kind: "auth-user-failed" };
  }

  const outcome = await signInBrowserAsCheckoutEmail(admin, supabase, normalized);
  if (outcome.kind === "signed-in") {
    return { kind: "signed-in" };
  }

  if (outcome.reason === "generate-link" || outcome.reason === "verify") {
    return { kind: "sign-in-failed", reason: outcome.reason };
  }

  return { kind: "sign-in-failed", reason: "verify" };
}
