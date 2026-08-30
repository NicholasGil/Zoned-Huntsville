import { NextResponse } from "next/server";
import { getAppEnv } from "@/lib/env";
import { isPricingTierId } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

async function readTier(request: Request): Promise<string | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body: unknown = await request.json();
    if (typeof body === "object" && body !== null && "tier" in body) {
      const tier = body.tier;
      return typeof tier === "string" ? tier : null;
    }
    return null;
  }

  const form = await request.formData();
  const tier = form.get("tier");
  return typeof tier === "string" ? tier : null;
}

function wantsHtml(request: Request): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  const accept = request.headers.get("accept") ?? "";
  return (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data") ||
    accept.includes("text/html")
  );
}

export async function POST(request: Request) {
  const env = getAppEnv();
  const tierValue = await readTier(request);
  const html = wantsHtml(request);

  if (!tierValue || !isPricingTierId(tierValue)) {
    if (html) {
      return NextResponse.redirect(new URL("/?checkout=invalid-tier", env.siteUrl), 303);
    }
    return NextResponse.json({ error: "Unknown pricing tier." }, { status: 400 });
  }

  if (env.stripe.kind === "missing") {
    if (html) {
      return NextResponse.redirect(new URL("/?checkout=not-configured", env.siteUrl), 303);
    }
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }

  const priceId = env.stripe.priceIds[tierValue];
  if (!priceId) {
    if (html) {
      return NextResponse.redirect(new URL("/?checkout=missing-price", env.siteUrl), 303);
    }
    return NextResponse.json(
      { error: `Set STRIPE_PRICE_ID_${tierValue} before creating a session.` },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.siteUrl}/`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 502 });
  }

  return NextResponse.redirect(session.url, 303);
}
