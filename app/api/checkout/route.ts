import { NextResponse } from "next/server";
import {
  attributionFromFormData,
  parseAttributionRecord,
  type Attribution,
} from "@/lib/attribution";
import { stripeCheckoutSessionParams } from "@/lib/checkout-offer";
import { getAppEnv } from "@/lib/env";
import { isPricingTierId } from "@/lib/site";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CheckoutRequest = {
  tier: string | null;
  attribution: Attribution;
};

async function readCheckoutRequest(request: Request): Promise<CheckoutRequest> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null) {
      return { tier: null, attribution: {} };
    }
    const record = body as Record<string, unknown>;
    const tier = record.tier;
    return {
      tier: typeof tier === "string" ? tier : null,
      attribution: parseAttributionRecord(record),
    };
  }

  const form = await request.formData();
  const tier = form.get("tier");
  return {
    tier: typeof tier === "string" ? tier : null,
    attribution: attributionFromFormData(form),
  };
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
  const { tier: tierValue, attribution } = await readCheckoutRequest(request);
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

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  const idempotencyKey =
    request.headers.get("idempotency-key") ?? crypto.randomUUID();

  const session = await stripe.checkout.sessions.create(
    {
      ...stripeCheckoutSessionParams(tierValue, env.siteUrl, attribution),
      ...(user?.id ? { client_reference_id: user.id } : {}),
      ...(user?.email ? { customer_email: user.email } : {}),
    },
    { idempotencyKey },
  );

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 502 });
  }

  return NextResponse.redirect(session.url, 303);
}
