import Link from "next/link";
import { expertCallScheduleEmailCopy, getExpertCallBookingUrl } from "@/lib/booking";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

const primaryButton = `inline-flex min-h-11 items-center justify-center rounded-md bg-action px-6 py-3 text-sm font-semibold text-text-on-action hover:bg-action-hover active:bg-action-active ${focusRing}`;

type BookExpertCallProps = {
  /** Signed-in or checkout email when known. */
  email: string | null;
  className?: string;
  /** Hide the link back to account when already on /account. */
  showAccountLink?: boolean;
};

export function BookExpertCall({
  email,
  className,
  showAccountLink = true,
}: BookExpertCallProps) {
  const bookingUrl = getExpertCallBookingUrl();

  return (
    <section
      className={className ?? "max-w-xl rounded-lg border border-border bg-surface px-5 py-5"}
      aria-labelledby="expert-call-heading"
    >
      <h2
        id="expert-call-heading"
        className="font-sans text-xl font-semibold text-text"
      >
        Your 45-minute expert call
      </h2>
      {bookingUrl ? (
        <>
          <p className="mt-3 text-sm text-text-muted">
            Book a time that works for you. Your purchase includes one expert call
            — we&apos;ll confirm details by email.
          </p>
          <p className="mt-4">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryButton}
            >
              Book your 45-minute expert call
            </a>
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm text-text-muted">
          {expertCallScheduleEmailCopy(email)}
        </p>
      )}
      {showAccountLink ? (
        <p className="mt-4 text-xs text-text-muted">
          <Link href="/account" className="text-action underline underline-offset-4">
            Account
          </Link>{" "}
          shows call-slot purchase limits for this month.
        </p>
      ) : null}
    </section>
  );
}
