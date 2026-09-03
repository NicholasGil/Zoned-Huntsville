import Link from "next/link";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const SEND_LINK_LABEL = "Send link";

export type SendLinkError =
  | "invalid-email"
  | "not-configured"
  | "send-failed"
  | "auth";

/**
 * The one magic-link request form, shared by /login and /account.
 * Primary CTA matches the homepage buy button: bg-action, min-h-11.
 */
export function SendLinkForm({
  action,
  inputId,
  label,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  inputId: string;
  label: string;
  className?: string;
}) {
  return (
    <form action={action} className={className}>
      <label htmlFor={inputId} className="block text-sm font-semibold text-text">
        {label}
      </label>
      <input
        id={inputId}
        name="email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        className={`mt-2 min-h-11 w-full rounded-md border border-border bg-surface px-3 py-2 text-text placeholder:text-n-5 ${focusRing}`}
      />
      <button
        type="submit"
        className={`mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-action px-6 py-3 text-sm font-semibold text-text-on-action hover:bg-action-hover active:bg-action-active sm:w-auto ${focusRing}`}
      >
        {SEND_LINK_LABEL}
      </button>
    </form>
  );
}

function errorHeadline(error: SendLinkError, sendFailedCopy: string | null): string {
  switch (error) {
    case "invalid-email":
      return "That email address doesn't look right. Check it and try again.";
    case "not-configured":
      return "Sign-in isn't available on this site right now. Please contact us and we'll get you in.";
    case "auth":
      return "That sign-in link didn't work. It may have expired or already been used. Send a new one below.";
    case "send-failed":
      return (
        sendFailedCopy ??
        "We couldn't send the link just now. Try again in a minute, or contact us if it keeps happening."
      );
  }
}

export function SendLinkStatus({
  sent,
  error,
  sendFailedCopy = null,
  supportDetail = null,
}: {
  sent: boolean;
  error: SendLinkError | null;
  sendFailedCopy?: string | null;
  supportDetail?: string | null;
}) {
  if (sent) {
    return (
      <section
        role="status"
        aria-live="polite"
        className="mt-6 max-w-md rounded-lg border border-border bg-surface px-5 py-4"
      >
        <h2 className="font-sans text-lg font-semibold text-text">Link sent</h2>
        <p className="mt-2 text-sm text-text-muted">
          Check your inbox (and spam) for the sign-in email. Opening that link
          signs you in and takes you straight to the guide. No password needed.
        </p>
      </section>
    );
  }

  if (!error) {
    return null;
  }

  return (
    <section
      role="alert"
      className="mt-6 max-w-md rounded-lg border border-danger/40 bg-surface px-5 py-4"
    >
      <p className="text-sm font-semibold text-danger">
        {errorHeadline(error, sendFailedCopy)}
      </p>
      {error === "not-configured" || error === "send-failed" ? (
        <p className="mt-2 text-sm text-text-muted">
          Still stuck?{" "}
          <Link href="/contact" className="font-semibold text-action underline underline-offset-4">
            Contact us
          </Link>{" "}
          with the email you used at checkout.
        </p>
      ) : null}
      {supportDetail ? (
        <p className="mt-2 text-xs text-text-muted">Error detail for support: {supportDetail}</p>
      ) : null}
    </section>
  );
}
