import { NextResponse } from "next/server";
import { logAuthSendError, redactEmail } from "@/lib/auth-error";
import { mapCheckoutSession } from "@/lib/checkout-receipt";
import {
  isCheckoutUnlockFresh,
  SUCCESS_PATH,
  signInBrowserAsCheckoutEmail,
  successHref,
  unlockMarkerId,
  type UnlockOutcome,
} from "@/lib/checkout-unlock";
import { getAppEnv } from "@/lib/env";
import { ensureConfirmedAuthUser } from "@/lib/purchase-auth";
import { getStripe } from "@/lib/stripe";
import { applyPaidCheckoutSession } from "@/lib/stripe-fulfillment";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Sign the returning browser in as the checkout email using the paid
 * Checkout Session as proof of purchase. No mail is sent here; the magic
 * link the webhook sends stays a backup for other devices.
 */
async function unlock(sessionId: string): Promise<UnlockOutcome> {
  const stripe = getStripe();
  if (!stripe) {
    return { kind: "failed", reason: "stripe-unset" };
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch {
    return { kind: "failed", reason: "retrieve-failed" };
  }

  const receipt = mapCheckoutSession(session);
  if (receipt.kind !== "confirmed") {
    return { kind: "failed", reason: "not-paid" };
  }
  if (!receipt.email) {
    return { kind: "failed", reason: "no-email" };
  }
  if (!isCheckoutUnlockFresh(session)) {
    return { kind: "failed", reason: "stale" };
  }

  const admin = createSupabaseAdminClient();
  const supabase = await createSupabaseServerClient();
  if (!admin || !supabase) {
    return { kind: "failed", reason: "supabase-unset" };
  }

  const marker = unlockMarkerId(session.id);
  const { data: used } = await admin
    .from("processed_events")
    .select("event_id")
    .eq("event_id", marker)
    .maybeSingle();
  if (used) {
    return { kind: "failed", reason: "already-used" };
  }

  const email = receipt.email.toLowerCase();
  try {
    await ensureConfirmedAuthUser(admin, email);
  } catch (error) {
    logAuthSendError("checkout.unlock.auth_user_failed", { email: redactEmail(email) }, error);
    return { kind: "failed", reason: "auth-user" };
  }

  const applied = await applyPaidCheckoutSession(admin, session);
  if (applied.kind === "write-failed" || applied.kind === "invalid") {
    console.error({
      event: "checkout.unlock.entitlement_not_written",
      email: redactEmail(email),
      reason: applied.reason,
    });
  }

  const outcome = await signInBrowserAsCheckoutEmail(admin, supabase, email);
  if (outcome.kind === "signed-in") {
    await admin.from("processed_events").insert({ event_id: marker });
  }
  return outcome;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const env = getAppEnv();
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.redirect(new URL(SUCCESS_PATH, env.siteUrl));
  }

  const outcome = await unlock(sessionId);
  if (outcome.kind === "failed") {
    console.error({ event: "checkout.unlock.failed", reason: outcome.reason });
  }

  return NextResponse.redirect(
    new URL(successHref(sessionId, outcome.kind === "signed-in" ? "ok" : "failed"), env.siteUrl),
  );
}
