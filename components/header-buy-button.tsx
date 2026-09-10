"use client";

import { CheckoutForm } from "@/components/checkout-form";

export function HeaderBuyButton() {
  return (
    <CheckoutForm
      tierId="79"
      label="Buy · $79"
      variant="brick"
      className="w-auto shrink-0 [&_button]:w-auto [&_button]:min-h-11 [&_button]:whitespace-nowrap [&_button]:px-3 [&_button]:text-xs [&_button]:sm:px-4 [&_button]:sm:text-sm"
    />
  );
}
