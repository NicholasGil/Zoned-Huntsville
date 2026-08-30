"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/contact/actions";

const initial: ContactState = { kind: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  return (
    <form action={action} className="mt-10 max-w-md">
      <label htmlFor="contact-name" className="block text-sm text-ink">
        Name
      </label>
      <input
        id="contact-name"
        name="name"
        type="text"
        autoComplete="name"
        className="mt-2 w-full border border-rule bg-paper px-3 py-2"
      />

      <label htmlFor="contact-email" className="mt-4 block text-sm text-ink">
        Email
      </label>
      <input
        id="contact-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="mt-2 w-full border border-rule bg-paper px-3 py-2"
      />

      <label htmlFor="contact-message" className="mt-4 block text-sm text-ink">
        Message
      </label>
      <textarea
        id="contact-message"
        name="message"
        required
        rows={5}
        className="mt-2 w-full border border-rule bg-paper px-3 py-2"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-4 bg-brick px-4 py-2.5 text-sm text-paper hover:bg-brick-dark disabled:opacity-60"
      >
        Send
      </button>

      {state.kind === "invalid-email" ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          That email address is not valid.
        </p>
      ) : null}
      {state.kind === "missing-message" ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          Write a message before sending.
        </p>
      ) : null}
      {state.kind === "received" ? (
        <p className="mt-4 text-sm text-muted" role="status">
          Message received.
        </p>
      ) : null}
    </form>
  );
}
