import Link from "next/link";
import type { CheckoutReceipt } from "@/lib/checkout-receipt";

const UNAVAILABLE_COPY = {
  "missing-session":
    "No session_id was supplied, so Stripe was not asked for a checkout session.",
  "stripe-unset":
    "Stripe is not configured on this site, so this page cannot load a checkout session.",
  "retrieve-failed":
    "Stripe did not return this checkout session. The session id may be invalid, expired, or unreachable.",
  "not-paid":
    "Stripe has not marked this checkout session as paid.",
} as const;

function ReceiptRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function ReceiptLinks() {
  return (
    <p className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
      <Link href="/#pricing" className="text-brick hover:underline">
        Return to pricing
      </Link>
      <Link href="/account" className="text-brick hover:underline">
        Account
      </Link>
      <Link href="/contact" className="text-brick hover:underline">
        Contact
      </Link>
      <Link href="/login" className="text-brick hover:underline">
        Sign in
      </Link>
    </p>
  );
}

export function CheckoutReceiptView({
  receipt,
}: {
  receipt: CheckoutReceipt;
}) {
  if (receipt.kind === "unavailable") {
    return (
      <>
        <h1 className="font-serif text-4xl text-ink">Checkout not confirmed</h1>
        <p className="mt-4 max-w-xl text-muted">
          This is not a completed order. We could not load a paid Stripe
          Checkout Session, so this page does not show a product, tier, or
          amount.
        </p>
        <p className="mt-4 max-w-xl text-muted">{UNAVAILABLE_COPY[receipt.reason]}</p>
        <p className="mt-4 max-w-xl text-muted">
          If you were charged, sign in with the email you used at checkout.
          Access is granted only after the webhook writes the purchase. Stripe
          emails a receipt for successful Checkout payments.
        </p>
        <ReceiptLinks />
      </>
    );
  }

  return (
    <>
      <h1 className="font-serif text-4xl text-ink">Purchase confirmation</h1>
      <p className="mt-4 max-w-xl text-muted">
        This page is your purchase confirmation. Stripe emails a receipt for
        this payment to the checkout address.
      </p>
      <dl className="mt-8 max-w-md border border-rule px-5 py-4 text-sm">
        <ReceiptRow label="Product" value={receipt.productName} />
        <div className="mt-3">
          <ReceiptRow
            label="Tier"
            value={receipt.tierLabel ?? "Not returned by Stripe"}
          />
        </div>
        <div className="mt-3">
          <ReceiptRow
            label="Amount paid"
            value={receipt.amountDisplay ?? "Not returned by Stripe"}
          />
        </div>
        <div className="mt-3">
          <ReceiptRow
            label="Email"
            value={receipt.email ?? "Not returned by Stripe"}
          />
        </div>
      </dl>
      <p className="mt-6 max-w-xl text-muted">
        Access is granted only after the webhook writes the purchase. Sign in
        with the checkout email if the guide is still locked.
      </p>
      <ReceiptLinks />
    </>
  );
}
