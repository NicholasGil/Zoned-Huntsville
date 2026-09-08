import { after, NextResponse } from "next/server";
import { getAppEnv } from "@/lib/env";
import {
  fulfillmentWebhookStatus,
  runAppliedPurchaseNotifications,
} from "@/lib/purchase-follow-up";
import { fulfillStripeEvent, sendPurchaseMagicLink } from "@/lib/stripe-fulfillment";
import { sendPurchaseReceipt } from "@/lib/transactional-mail";
import { getStripe } from "@/lib/stripe";
import { alertWebhookFulfillmentFailure } from "@/lib/webhook-ops-alert";

function failureResponse(
  event: { id: string; type: string },
  result:
    | { kind: "missing-admin" }
    | { kind: "write-failed"; reason: string }
    | { kind: "uncaught"; reason: string },
) {
  const httpStatus = fulfillmentWebhookStatus(
    result.kind === "uncaught" ? "write-failed" : result.kind,
  );
  const reason =
    result.kind === "missing-admin"
      ? "Purchase write path needs NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY."
      : result.reason;

  after(() =>
    alertWebhookFulfillmentFailure({
      kind: result.kind === "uncaught" ? "uncaught" : result.kind,
      eventId: event.id,
      eventType: event.type,
      httpStatus,
      reason,
    }),
  );

  if (result.kind === "missing-admin") {
    return NextResponse.json({ error: reason }, { status: httpStatus });
  }

  return NextResponse.json({ error: reason }, { status: httpStatus });
}

export async function POST(request: Request) {
  const env = getAppEnv();
  const stripe = getStripe();

  if (env.stripe.kind === "missing" || !stripe || !env.stripe.webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const payload = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.stripe.webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  let result;
  try {
    result = await fulfillStripeEvent(event);
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Webhook fulfillment threw an unexpected error.";
    return failureResponse(event, { kind: "uncaught", reason });
  }

  if (result.kind === "missing-admin") {
    return failureResponse(event, result);
  }
  if (result.kind === "write-failed") {
    return failureResponse(event, result);
  }

  if (result.kind === "applied") {
    after(() =>
      runAppliedPurchaseNotifications(
        { email: result.email, amountUsd: result.amountUsd },
        {
          sendMagicLink: sendPurchaseMagicLink,
          sendReceipt: sendPurchaseReceipt,
        },
      ),
    );
  }

  return NextResponse.json({ received: true, result: result.kind });
}
