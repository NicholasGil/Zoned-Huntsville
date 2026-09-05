"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  ATTRIBUTION_KEYS,
  captureAttributionForCheckout,
  type Attribution,
} from "@/lib/attribution";
import { initiateCheckoutParams, trackMetaEvent } from "@/lib/meta-pixel";
import type { PricingTierId } from "@/lib/site";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

const primaryFill =
  `min-h-11 rounded-md bg-action px-6 py-3 text-sm font-semibold text-text-on-action hover:bg-action-hover active:bg-action-active ${focusRing}`;

const busyLabel = "Sending you to checkout…";

function writeAttributionFields(form: HTMLFormElement, attribution: Attribution) {
  for (const key of ATTRIBUTION_KEYS) {
    const input = form.querySelector(`input[name="${CSS.escape(key)}"]`);
    if (input instanceof HTMLInputElement) {
      input.value = attribution[key] ?? "";
    }
  }
}

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
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) {
      return;
    }
    writeAttributionFields(form, captureAttributionForCheckout());
  }, []);

  return (
    <form
      ref={formRef}
      action="/api/checkout"
      method="post"
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        writeAttributionFields(form, captureAttributionForCheckout());
        trackMetaEvent("InitiateCheckout", initiateCheckoutParams(tierId));
        setSubmitting(true);
        form.submit();
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
