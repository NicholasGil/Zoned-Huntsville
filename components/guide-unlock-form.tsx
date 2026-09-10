import Link from "next/link";
import { secondaryButton } from "@/components/button-styles";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const GUIDE_UNLOCK_LABEL = "Open the guide";

export type GuideUnlockError =
  | "invalid-email"
  | "not-configured"
  | "no-purchase"
  | "unlock-failed"
  | "auth";

export function GuideUnlockForm({
  action,
  inputId,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  inputId: string;
  className?: string;
}) {
  return (
    <form action={action} className={className}>
      <label htmlFor={inputId} className="block text-sm font-semibold text-text">
        Checkout email
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
        {GUIDE_UNLOCK_LABEL}
      </button>
    </form>
  );
}

function errorHeadline(error: GuideUnlockError): string {
  switch (error) {
    case "invalid-email":
      return "That email address doesn't look right. Check it and try again.";
    case "not-configured":
      return "Guide unlock isn't available on this site right now. Please contact us and we'll get you in.";
    case "no-purchase":
      return "We didn't find a purchase for that email. Use the same address you entered at Stripe checkout.";
    case "unlock-failed":
      return "We found your purchase but couldn't open the guide just now. Try again in a minute.";
    case "auth":
      return "That sign-in link didn't work. It may have expired or already been used.";
  }
}

export function GuideUnlockStatus({
  error,
}: {
  error: GuideUnlockError | null;
}) {
  if (!error) {
    return null;
  }

  return (
    <section
      role="alert"
      className="mt-6 max-w-md rounded-lg border border-danger/40 bg-surface px-5 py-4"
    >
      <p className="text-sm font-semibold text-danger">{errorHeadline(error)}</p>
      {error === "no-purchase" ? (
        <p className="mt-3 text-sm text-text-muted">
          <Link href="/#pricing" className={`${secondaryButton} inline-flex`}>
            See pricing
          </Link>
        </p>
      ) : null}
      {error === "not-configured" || error === "unlock-failed" ? (
        <p className="mt-2 text-sm text-text-muted">
          Still stuck?{" "}
          <Link href="/contact" className="font-semibold text-action underline underline-offset-4">
            Contact us
          </Link>{" "}
          with the email you used at checkout.
        </p>
      ) : null}
    </section>
  );
}
