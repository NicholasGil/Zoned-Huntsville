"use client";

import { useActionState } from "react";
import { submitSampleOptIn, type SampleState } from "@/app/sample/actions";

const initial: SampleState = { kind: "idle" };

export function SampleOptInForm({ className = "mt-10 max-w-md" }: { className?: string }) {
  const [state, action, pending] = useActionState(submitSampleOptIn, initial);

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
        className="mt-4 bg-action px-4 py-2.5 text-sm text-text-on-action hover:bg-action-hover disabled:opacity-60"
      >
        Email me the sample
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
