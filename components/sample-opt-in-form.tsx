"use client";

import { useActionState } from "react";
import { submitSampleOptIn, type SampleState } from "@/app/sample/actions";

const initial: SampleState = { kind: "idle" };

export function SampleOptInForm({ className = "mt-10 max-w-md" }: { className?: string }) {
  const [state, action, pending] = useActionState(submitSampleOptIn, initial);

  return (
    <form action={action} className={className}>
      <label htmlFor="sample-email" className="block text-sm text-ink">
        Email
      </label>
      <input
        id="sample-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="mt-2 w-full border border-rule bg-paper px-3 py-2"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-4 bg-brick px-4 py-2.5 text-sm text-paper hover:bg-brick-dark disabled:opacity-60"
      >
        Email me the sample
      </button>
      {state.kind === "invalid-email" ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          That email address is not valid.
        </p>
      ) : null}
      {state.kind === "received" ? (
        <p className="mt-4 text-sm text-muted" role="status">
          Request received. Email delivery is not wired in this scaffold.
        </p>
      ) : null}
    </form>
  );
}
