#!/usr/bin/env node
/**
 * Creates a Stripe Checkout Session in test mode and prints the hosted URL.
 * Requires STRIPE_SECRET_KEY (sk_test_*) and optional STRIPE_PRICE_ID_* vars.
 *
 * Usage: node scripts/probe-checkout-tax.mjs [79|149|349]
 */
import Stripe from "stripe";

const tier = process.argv[2] ?? "79";
const secret = process.env.STRIPE_SECRET_KEY?.trim();
if (!secret) {
  console.error("Set STRIPE_SECRET_KEY (sk_test_*) before running.");
  process.exit(1);
}
if (!secret.startsWith("sk_test_")) {
  console.error("Use test-mode keys only (sk_test_*). Live keys are not allowed here.");
  process.exit(1);
}

const priceEnv = {
  "79": process.env.STRIPE_PRICE_ID_79,
  "149": process.env.STRIPE_PRICE_ID_149,
  "349": process.env.STRIPE_PRICE_ID_349,
};
const catalogPriceId = priceEnv[tier]?.trim() || null;

const amounts = { "79": 7900, "149": 14900, "349": 34900 };
const names = {
  "79": "The Huntsville School Guide — Guide",
  "149": "The Huntsville School Guide — Guide + Toolkit",
  "349": "The Huntsville School Guide — Guide + Toolkit + Call",
};

const stripe = new Stripe(secret);
const lineItem = catalogPriceId
  ? { quantity: 1, price: catalogPriceId }
  : {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: amounts[tier],
        tax_behavior: "exclusive",
        product_data: {
          name: names[tier],
          tax_code: "txcd_10000000",
        },
      },
    };

const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [lineItem],
  automatic_tax: { enabled: true },
  billing_address_collection: "auto",
  success_url: "https://example.com/thank-you?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "https://example.com/#pricing",
  metadata: { tier },
});

console.log(JSON.stringify({ id: session.id, url: session.url, tier, catalogPriceId }, null, 2));
