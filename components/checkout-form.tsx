"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ATTRIBUTION_KEYS, captureAttributionForCheckout } from "@/lib/attribution";
import { initiateCheckoutParams, trackMetaEvent } from "@/lib/meta-pixel";
import type { PricingTierId } from "@/lib/site";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

const primaryFill =
  `min-h-11 rounded-md bg-action px-6 py-3 text-sm font-semibold text-text-on-action hover:bg-action-hover active:bg-action-active ${focusRing}`;

const busyLabel = "Sending you to checkout…";

function CheckoutSubmitButton({
  label,
  buttonClass,
  submitting,
}: {
  label: string;
  buttonClass: string;
  submitting: boolean;
}) {
  const { pending } = useFormStatus();
  const busy = pending || submitting;

  return (
    <button
      type="submit"
      disabled={busy}
      aria-busy={busy}
      className={`${buttonClass} disabled:opacity-60`}
    >
      {busy ? busyLabel : label}
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
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action="/api/checkout"
      method="post"
      className={className}
      onSubmit={(event) => {
        const form = event.currentTarget;
        const attribution = captureAttributionForCheckout();
        for (const key of ATTRIBUTION_KEYS) {
          const input = form.elements.namedItem(key);
          if (input instanceof HTMLInputElement) {
            input.value = attribution[key] ?? "";
          }
        }
        trackMetaEvent("InitiateCheckout", initiateCheckoutParams(tierId));
        setSubmitting(true);
      }}
    >
      <input type="hidden" name="tier" value={tierId} />
      {ATTRIBUTION_KEYS.map((key) => (
        <input key={key} type="hidden" name={key} defaultValue="" />
      ))}
      <CheckoutSubmitButton
        label={label}
        buttonClass={buttonClass}
        submitting={submitting}
      />
    </form>
  );
}
