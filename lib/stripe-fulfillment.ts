import type Stripe from "stripe";
import type { PricingTier } from "@/lib/database";
import { isPricingTierId } from "@/lib/site";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type FulfillmentResult =
  | { kind: "ignored" }
  | { kind: "duplicate" }
  | { kind: "applied"; purchaseId: string }
  | { kind: "refunded"; purchaseId: string }
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

function readTier(session: Stripe.Checkout.Session): PricingTier | null {
  const raw = session.metadata?.tier;
  if (typeof raw !== "string" || !isPricingTierId(raw)) {
    return null;
  }
  return raw;
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

async function resolveUserId(email: string, clientReferenceId: string | null) {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return null;
  }

  if (clientReferenceId) {
    const { data: byId } = await admin
      .from("profiles")
      .select("id")
      .eq("id", clientReferenceId)
      .maybeSingle();
    if (byId) {
      return byId.id;
    }
  }

  const { data: byEmail } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  return byEmail?.id ?? null;
}

export async function fulfillStripeEvent(
  event: Stripe.Event,
): Promise<FulfillmentResult> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { kind: "missing-admin" };
  }

  if (event.type === "checkout.session.completed") {
    if (await alreadyProcessed(event.id)) {
      return { kind: "duplicate" };
    }

    const session = event.data.object;
    const email = readCheckoutEmail(session);
    const tier = readTier(session);
    if (!email) {
      return { kind: "invalid", reason: "Checkout session has no customer email." };
    }
    if (!tier) {
      return { kind: "invalid", reason: "Checkout session metadata.tier is missing or unknown." };
    }

    const userId = await resolveUserId(email, session.client_reference_id);
    const paymentIntentId = readPaymentIntentId(session.payment_intent);

    const { data, error } = await admin
      .from("purchases")
      .upsert(
        {
          email,
          user_id: userId,
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId,
          tier,
          status: "paid",
        },
        { onConflict: "stripe_checkout_session_id" },
      )
      .select("id")
      .single();

    if (error || !data) {
      return { kind: "write-failed", reason: error?.message ?? "Purchase write failed." };
    }

    await markProcessed(event.id);
    return { kind: "applied", purchaseId: data.id };
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
      .from("purchases")
      .update({ status: "refunded" })
      .eq("stripe_payment_intent_id", paymentIntentId)
      .select("id")
      .maybeSingle();

    if (error) {
      return { kind: "write-failed", reason: error.message };
    }
    if (!data) {
      return { kind: "ignored" };
    }
    await markProcessed(event.id);
    return { kind: "refunded", purchaseId: data.id };
  }

  return { kind: "ignored" };
}
