import Link from "next/link";
import {
  purchaseSummaryLabel,
  type CheckoutReceipt,
} from "@/lib/checkout-receipt";
import type { CheckoutAccess } from "@/lib/checkout-unlock";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

const primaryButton = `inline-flex min-h-11 items-center justify-center rounded-md bg-action px-6 py-3 text-sm font-semibold text-text-on-action hover:bg-action-hover active:bg-action-active ${focusRing}`;

const secondaryButton = `inline-flex min-h-11 items-center justify-center rounded-md border border-text bg-transparent px-6 py-3 text-sm font-semibold text-text hover:border-action ${focusRing}`;

const quietLink = `inline-flex min-h-11 items-center text-sm text-text-muted underline-offset-4 hover:text-text hover:underline ${focusRing}`;

const inlineLink = `font-semibold text-action underline underline-offset-4 hover:text-action-hover ${focusRing}`;

const UNAVAILABLE_COPY = {
  "missing-session":
    "This link didn't include a checkout reference, so there was nothing for us to look up.",
  "stripe-unset":
    "Checkout lookups aren't available on this site right now, so we can't show an order here.",
  "retrieve-failed":
    "We couldn't find a checkout that matches this link. It may have expired, or the link may be incomplete.",
  "not-paid":
    "This checkout hasn't been completed, so there's no payment to confirm.",
} as const;

function OrderRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-text-muted">{label}</dt>
      <dd className="font-semibold text-text sm:text-right break-words">{value}</dd>
    </div>
  );
}

function QuietLinks({
  links,
}: {
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <p className="mt-6 flex flex-wrap gap-x-6">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={quietLink}>
          {link.label}
        </Link>
      ))}
    </p>
  );
}

function UnavailableView({
  reason,
}: {
  reason: Extract<CheckoutReceipt, { kind: "unavailable" }>["reason"];
}) {
  return (
    <>
      <h1 className="font-sans text-4xl font-semibold text-text">
        We couldn&apos;t confirm this order
      </h1>
      <p className="mt-4 max-w-xl text-text-muted">
        This isn&apos;t a completed order, so there&apos;s no product or amount
        to show here. {UNAVAILABLE_COPY[reason]}
      </p>

      <section
        aria-labelledby="charged-heading"
        className="mt-8 max-w-xl rounded-lg border border-border bg-surface px-5 py-5"
      >
        <h2 id="charged-heading" className="font-sans text-xl font-semibold text-text">
          If your card was charged
        </h2>
        <p className="mt-3 text-text-muted">
          Sign in with the email you used at checkout and we&apos;ll send a link
          that opens the guide. Stripe emails a receipt for every successful
          payment, so if you have one, the payment went through and we can sort
          out access.
        </p>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link href="/login" className={primaryButton}>
          Sign in with checkout email
        </Link>
        <Link href="/contact" className={secondaryButton}>
          Contact
        </Link>
      </div>
      <QuietLinks
        links={[
          { href: "/account", label: "Account" },
          { href: "/#pricing", label: "Return to pricing" },
        ]}
      />
    </>
  );
}

function ConfirmedView({
  receipt,
  access,
}: {
  receipt: Extract<CheckoutReceipt, { kind: "confirmed" }>;
  access: CheckoutAccess;
}) {
  const ready = access.kind === "ready";
  const missingDetails = receipt.amountDisplay === null || receipt.email === null;
  const checkoutEmail = receipt.email ?? "the email you used at checkout";

  return (
    <>
      <p className="text-xs uppercase tracking-[0.16em] text-action">
        Payment received
      </p>
      <h1 className="mt-2 font-sans text-4xl font-semibold text-text">
        Thank you — your order is confirmed.
      </h1>
      <p className="mt-4 max-w-xl text-text-muted">
        {ready
          ? `Your payment went through, and this browser is signed in as ${access.email}. You can open the guide right now.`
          : "Your payment went through. One more step to get in: sign in with the email you used at checkout, and we'll send a link that opens the guide."}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {ready ? (
          <Link href="/guide" className={primaryButton}>
            Open the guide
          </Link>
        ) : (
          <Link href="/login" className={primaryButton}>
            Sign in to open the guide
          </Link>
        )}
      </div>

      <section
        aria-labelledby="order-heading"
        className="mt-10 max-w-md rounded-lg border border-border bg-surface px-5 py-5"
      >
        <h2
          id="order-heading"
          className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted"
        >
          Your order
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <OrderRow label="What you bought" value={purchaseSummaryLabel(receipt)} />
          {receipt.amountDisplay ? (
            <OrderRow label="Amount paid" value={receipt.amountDisplay} />
          ) : null}
          {receipt.email ? <OrderRow label="Email" value={receipt.email} /> : null}
        </dl>
        <p className="mt-4 text-xs text-text-muted">
          Stripe emails a receipt for this payment to {checkoutEmail}.
          {missingDetails
            ? " Some details didn't come back from checkout; that receipt has the full record."
            : ""}
        </p>
      </section>

      <section aria-labelledby="access-heading" className="mt-8 max-w-xl">
        <h2 id="access-heading" className="font-sans text-xl font-semibold text-text">
          Getting in later
        </h2>
        <p className="mt-3 text-text-muted">
          {ready
            ? "You're signed in here, so the guide opens straight away in this browser. "
            : ""}
          On another device, or if you get signed out,{" "}
          <Link href="/login" className={inlineLink}>
            sign in
          </Link>{" "}
          with {checkoutEmail} and we&apos;ll email you a link that opens the
          guide. No password needed.
        </p>
      </section>

      <QuietLinks
        links={[
          { href: "/account", label: "Account" },
          { href: "/contact", label: "Contact" },
        ]}
      />
    </>
  );
}

export function CheckoutReceiptView({
  receipt,
  access,
}: {
  receipt: CheckoutReceipt;
  access: CheckoutAccess;
}) {
  if (receipt.kind === "unavailable") {
    return <UnavailableView reason={receipt.reason} />;
  }
  return <ConfirmedView receipt={receipt} access={access} />;
}
