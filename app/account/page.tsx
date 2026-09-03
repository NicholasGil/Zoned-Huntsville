import type { Metadata } from "next";
import Link from "next/link";
import { requestPurchaseEmailLink } from "@/app/account/actions";
import { PageShell } from "@/components/page-shell";
import { getCallSlot, type CallSlotQuery } from "@/lib/call-slots";
import { getEntitlement } from "@/lib/entitlement";
import { getOwnEntitlements, getSignedInAdminState } from "@/lib/facts";
import { loadLastPayment } from "@/lib/load-last-payment";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage({
  searchParams,
}: PageProps<"/account">) {
  const query = await searchParams;
  const status = typeof query.status === "string" ? query.status : null;
  const error = typeof query.error === "string" ? query.error : null;

  const entitlement = await getEntitlement();
  const identity = await getSignedInAdminState();
  const rows = entitlement.kind === "signed-in" ? await getOwnEntitlements() : [];
  const lastPayment = await loadLastPayment(rows);
  const unavailable: CallSlotQuery = { kind: "unavailable" };
  const callSlot =
    entitlement.kind === "signed-in" ? await getCallSlot() : unavailable;

  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Account</h1>
      <p className="mt-4 max-w-xl text-muted">
        Access is matched to the Stripe checkout email. toolkit and call include
        every lower tier.
      </p>
      <dl className="mt-8 max-w-md border border-rule px-5 py-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Status</dt>
          <dd>{entitlement.kind}</dd>
        </div>
        {identity.email ? (
          <div className="mt-3 flex justify-between gap-4">
            <dt className="text-muted">Signed-in email</dt>
            <dd className="break-all">{identity.email}</dd>
          </div>
        ) : null}
        <div className="mt-3 flex justify-between gap-4">
          <dt className="text-muted">Guide access</dt>
          <dd>
            {entitlement.kind === "signed-in" && entitlement.hasGuide
              ? "yes"
              : "no"}
          </dd>
        </div>
        <div className="mt-3 flex justify-between gap-4">
          <dt className="text-muted">Toolkit access</dt>
          <dd>
            {entitlement.kind === "signed-in" && entitlement.hasToolkit
              ? "yes"
              : "no"}
          </dd>
        </div>
        <div className="mt-3 flex justify-between gap-4">
          <dt className="text-muted">Call access</dt>
          <dd>
            {entitlement.kind === "signed-in" && entitlement.hasCall
              ? "yes"
              : "no"}
          </dd>
        </div>
      </dl>

      {lastPayment.kind === "recorded" ? (
        <section className="mt-10 max-w-md">
          <h2 className="font-serif text-2xl text-ink">Last payment</h2>
          <dl className="mt-4 border border-rule px-5 py-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Amount</dt>
              <dd>{lastPayment.amountDisplay ?? "Not returned by Stripe"}</dd>
            </div>
            <div className="mt-3 flex justify-between gap-4">
              <dt className="text-muted">Date</dt>
              <dd>{lastPayment.dateDisplay}</dd>
            </div>
            <div className="mt-3 flex justify-between gap-4">
              <dt className="text-muted">Tier</dt>
              <dd>{lastPayment.tierLabel ?? "Not returned"}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-muted">
            Stripe emails a receipt for the card charge.
          </p>
        </section>
      ) : null}

      {!(entitlement.kind === "signed-in" && entitlement.hasGuide) ? (
        <section className="mt-10 max-w-md">
          <h2 className="font-serif text-2xl text-ink">Purchase email</h2>
          <p className="mt-3 text-sm text-muted">
            If you checked out with a different address, enter it here and
            we&apos;ll send a link that opens the guide. Access will not appear
            on this session until that email signs in.
          </p>
          <form action={requestPurchaseEmailLink} className="mt-6">
            <label htmlFor="purchase-email" className="block text-sm text-ink">
              Checkout email
            </label>
            <input
              id="purchase-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full border border-rule bg-paper px-3 py-2"
            />
            <button
              type="submit"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-action px-6 py-3 text-sm font-semibold text-text-on-action outline-none hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:bg-action-active"
            >
              Send link
            </button>
          </form>
        </section>
      ) : null}

      {error === "invalid-email" ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          That email address is not valid.
        </p>
      ) : null}
      {error === "not-configured" ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          Supabase is not configured.
        </p>
      ) : null}
      {error === "send-failed" ? (
        <p className="mt-4 text-sm text-brick" role="alert">
          Supabase did not send the link.
        </p>
      ) : null}
      {status === "link-sent" ? (
        <p className="mt-4 text-sm text-muted" role="status">
          Link sent. Check your inbox (and spam) for the sign-in email. Opening
          that link signs you in and takes you straight to the guide.
        </p>
      ) : null}

      {entitlement.kind === "signed-in" && entitlement.hasCall ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl text-ink">Call slots this month</h2>
          {callSlot.kind === "row" ? (
            <p className="mt-3 text-sm text-muted">
              {callSlot.remaining} of {callSlot.capacity} remaining (
              {callSlot.bookings} booked).
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Call-slot counts are not available until Supabase can read paid
              call entitlements for this month.
            </p>
          )}
        </section>
      ) : null}

      {rows.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl text-ink">Entitlements</h2>
          <ul className="mt-4 divide-y divide-rule border border-rule text-sm">
            {rows.map((row) => (
              <li key={row.id} className="flex justify-between gap-4 px-4 py-3">
                <span>{row.tier}</span>
                <span className="text-muted">
                  {row.refunded_at ? "refunded" : "active"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {identity.isAdmin ? (
        <p className="mt-10">
          <Link href="/admin/stale-facts" className="text-brick hover:underline">
            Stale facts and corrections
          </Link>
        </p>
      ) : null}

      <p className="mt-8">
        <Link href="/login" className="text-brick hover:underline">
          Sign in
        </Link>
      </p>
    </PageShell>
  );
}
