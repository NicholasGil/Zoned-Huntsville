import { NextResponse } from "next/server";
import { getAppEnv } from "@/lib/env";
import { fulfillStripeEvent } from "@/lib/stripe-fulfillment";
import { getStripe } from "@/lib/stripe";

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

  const result = await fulfillStripeEvent(event);
  if (result.kind === "missing-admin") {
    return NextResponse.json(
      {
        error:
          "Purchase write path needs NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }
  if (result.kind === "write-failed") {
    return NextResponse.json({ error: result.reason }, { status: 500 });
  }

  return NextResponse.json({ received: true, result: result.kind });
}
