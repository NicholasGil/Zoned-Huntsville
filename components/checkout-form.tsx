"use client";

import { useFormStatus } from "react-dom";
import type { PricingTierId } from "@/lib/site";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

const primaryFill =
  `min-h-11 rounded-md bg-action px-6 py-3 text-sm font-semibold text-text-on-action hover:bg-action-hover active:bg-action-active ${focusRing}`;

const busyLabel = "Sending you to checkout…";

function CheckoutSubmitButton({
  label,
  buttonClass,
}: {
  label: string;
  buttonClass: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`${buttonClass} disabled:opacity-60`}
    >
      {pending ? busyLabel : label}
    </button>
  );
}

export function CheckoutForm({
  tierId,
  label,
  variant,
  className,
}: {
  tierId: PricingTierId;
  label: string;
  variant: "brick" | "ink" | "brick-full";
  className?: string;
}) {
  const buttonClass =
    variant === "ink"
      ? `w-full min-h-11 rounded-md border border-text bg-transparent px-6 py-3 text-sm font-semibold text-text hover:border-action ${focusRing}`
      : `w-full ${primaryFill}`;

  return (
    <form action="/api/checkout" method="post" className={className}>
      <input type="hidden" name="tier" value={tierId} />
      <CheckoutSubmitButton label={label} buttonClass={buttonClass} />
    </form>
  );
}
