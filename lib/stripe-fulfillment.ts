import type Stripe from "stripe";
import type { EntitlementTier } from "@/lib/database";
import { getAppEnv } from "@/lib/env";
import { sendConfirmedPurchaseMagicLink } from "@/lib/purchase-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isPriceTierMetadata, productTierFromPrice } from "@/lib/tiers";

export type FulfillmentResult =
  | { kind: "ignored" }
  | { kind: "duplicate" }
  | { kind: "applied"; entitlementId: string; email: string; amountUsd: number | null }
  | { kind: "refunded"; entitlementId: string }
  | { kind: "missing-admin" }
  | { kind: "invalid"; reason: string }
  | { kind: "write-failed"; reason: string };

function readPaymentIntentId(
  value: string | Stripe.PaymentIntent | null | undefined,
): string | null {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  if (value && typeof value === "object" && typeof value.id === "string") {
    return value.id;
  }
  return null;
}

function readCheckoutEmail(session: Stripe.Checkout.Session): string | null {
  const detailsEmail = session.customer_details?.email;
  if (typeof detailsEmail === "string" && detailsEmail.trim().length > 0) {
    return detailsEmail.trim().toLowerCase();
  }
  if (typeof session.customer_email === "string" && session.customer_email.trim().length > 0) {
    return session.customer_email.trim().toLowerCase();
  }
  return null;
}

function readPaidAmountUsd(session: Stripe.Checkout.Session): number | null {
  if (typeof session.amount_total !== "number") {
    return null;
  }
  const currency = session.currency?.toLowerCase();
  if (currency && currency !== "usd") {
    return null;
  }
  return session.amount_total / 100;
}

function readProductTier(session: Stripe.Checkout.Session): EntitlementTier | null {
  const raw = session.metadata?.tier;
  if (typeof raw !== "string") {
    return null;
  }
  if (raw === "guide" || raw === "toolkit" || raw === "call") {
    return raw;
  }
  if (!isPriceTierMetadata(raw)) {
    return null;
  }
  return productTierFromPrice(raw);
}

async function alreadyProcessed(eventId: string): Promise<boolean> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return false;
  }

  const { data } = await admin
    .from("processed_events")
    .select("event_id")
    .eq("event_id", eventId)
    .maybeSingle();

  return Boolean(data);
}

async function markProcessed(eventId: string): Promise<void> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return;
  }

  const { error } = await admin.from("processed_events").insert({ event_id: eventId });
  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }
}

export async function sendPurchaseMagicLink(email: string): Promise<void> {
  const admin = createSupabaseAdminClient();
  const env = getAppEnv();
  if (!admin) {
    return;
  }

  await sendConfirmedPurchaseMagicLink(admin, env.siteUrl, email);
}

type AdminClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

export type PaidSessionResult = Extract<
  FulfillmentResult,
  { kind: "ignored" | "applied" | "invalid" | "write-failed" }
>;

/**
 * Write the entitlement for one paid Checkout Session. Upserts on
 * stripe_session_id, so the webhook and the thank-you page unlock can both
 * call this for the same session without a double write.
 */
export async function applyPaidCheckoutSession(
  admin: AdminClient,
  session: Stripe.Checkout.Session,
): Promise<PaidSessionResult> {
  if (session.payment_status !== "paid") {
    return { kind: "ignored" };
  }

  const email = readCheckoutEmail(session);
  const tier = readProductTier(session);
  if (!email) {
    return { kind: "invalid", reason: "Checkout session has no customer email." };
  }
  if (!tier) {
    return { kind: "invalid", reason: "Checkout session metadata.tier is missing or unknown." };
  }

  let userId: string | null = null;
  if (
    typeof session.client_reference_id === "string" &&
    session.client_reference_id.length > 0
  ) {
    try {
      const { data: existing } = await admin.auth.admin.getUserById(
        session.client_reference_id,
      );
      if (existing.user) {
        userId = existing.user.id;
      }
    } catch {
      userId = null;
    }
  }
  const paymentIntentId = readPaymentIntentId(session.payment_intent);

  const { data, error } = await admin
    .from("entitlements")
    .upsert(
      {
        email,
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent: paymentIntentId,
        tier,
      },
      { onConflict: "stripe_session_id" },
    )
    .select("id")
    .single();

  if (error || !data) {
    return { kind: "write-failed", reason: error?.message ?? "Entitlement write failed." };
  }

  return {
    kind: "applied",
    entitlementId: data.id,
    email,
    amountUsd: readPaidAmountUsd(session),
  };
}

export async function fulfillStripeEvent(
  event: Stripe.Event,
): Promise<FulfillmentResult> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { kind: "missing-admin" };
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    if (await alreadyProcessed(event.id)) {
      return { kind: "duplicate" };
    }

    const result = await applyPaidCheckoutSession(admin, event.data.object);
    if (result.kind === "applied") {
      await markProcessed(event.id);
    }
    return result;
  }

  if (event.type === "charge.refunded") {
    if (await alreadyProcessed(event.id)) {
      return { kind: "duplicate" };
    }

    const charge = event.data.object;
    const paymentIntentId = readPaymentIntentId(charge.payment_intent);
    if (!paymentIntentId) {
      return { kind: "ignored" };
    }

    const { data, error } = await admin
      .from("entitlements")
      .update({ refunded_at: new Date().toISOString() })
      .eq("stripe_payment_intent", paymentIntentId)
      .is("refunded_at", null)
      .select("id")
      .maybeSingle();

    if (error) {
      return { kind: "write-failed", reason: error.message };
    }
    if (!data) {
      return { kind: "ignored" };
    }
    await markProcessed(event.id);
    return { kind: "refunded", entitlementId: data.id };
  }

  return { kind: "ignored" };
}
