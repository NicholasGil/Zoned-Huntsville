"use client";

import { useActionState, useEffect } from "react";
import { submitSampleOptIn, type SampleState } from "@/app/sample/actions";
import {
  hasTrackedOnce,
  leadEventParams,
  markTrackedOnce,
  trackMetaEvent,
} from "@/lib/meta-pixel";

const initial: SampleState = { kind: "idle" };

export function SampleOptInForm({
  className = "mt-10 max-w-md",
  submitLabel = "Email me the sample",
}: {
  className?: string;
  submitLabel?: string;
}) {
  const [state, action, pending] = useActionState(submitSampleOptIn, initial);

  useEffect(() => {
    if (state.kind !== "received") {
      return;
    }
    const key = "meta_pixel:lead:sample";
    if (hasTrackedOnce(key)) {
      return;
    }
    if (trackMetaEvent("Lead", leadEventParams())) {
      markTrackedOnce(key);
    }
  }, [state.kind]);

  return (
    <form action={action} className={className}>
      <label htmlFor="sample-email" className="block text-sm text-text">
        Email
      </label>
      <input
        id="sample-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="mt-2 w-full border border-border bg-surface px-3 py-2"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-4 min-h-11 rounded-md bg-action px-6 py-3 text-sm font-semibold text-text-on-action hover:bg-action-hover active:bg-action-active outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
      >
        {submitLabel}
      </button>
      {state.kind === "invalid-email" ? (
        <p className="mt-4 text-sm text-danger" role="alert">
          That email address is not valid.
        </p>
      ) : null}
      {state.kind === "received" ? (
        <p className="mt-4 text-sm text-text-muted" role="status">
          Request received. The Huntsville City Schools profile will be sent to
          this address.
        </p>
      ) : null}
    </form>
  );
}
