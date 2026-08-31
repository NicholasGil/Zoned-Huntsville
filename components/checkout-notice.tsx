"use client";

import { useSearchParams } from "next/navigation";

const messages: Record<string, string> = {
  "not-configured":
    "Stripe is not configured. Set STRIPE_SECRET_KEY before checkout can run.",
  "missing-price":
    "That price is not configured. Set the matching STRIPE_PRICE_ID_* variable.",
  "invalid-tier": "That checkout tier is not one of $79, $149, or $349.",
};

export function CheckoutNotice() {
  const searchParams = useSearchParams();
  const code = searchParams.get("checkout");
  if (!code) {
    return null;
  }

  const message = messages[code] ?? "Checkout could not start.";

  return (
    <p className="mb-8 border border-danger px-4 py-3 text-sm text-danger" role="alert">
      {message}
    </p>
  );
}
