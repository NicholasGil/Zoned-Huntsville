import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getCallSlot, type CallSlotQuery } from "@/lib/call-slots";
import { getEntitlement } from "@/lib/entitlement";
import { getOwnPurchases, getSignedInProfile } from "@/lib/facts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const entitlement = await getEntitlement();
  const profile = await getSignedInProfile();
  const purchases = entitlement.kind === "signed-in" ? await getOwnPurchases() : [];
  const unavailableSlot: CallSlotQuery = { kind: "unavailable" };
  const callSlot =
    entitlement.kind === "signed-in" && entitlement.hasCall
      ? await getCallSlot()
      : unavailableSlot;

  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Account</h1>
      <p className="mt-4 max-w-xl text-muted">
        Access comes from paid purchases on this sign-in email. The $149 and $349
        tiers include every lower tier.
      </p>
      <dl className="mt-8 max-w-md border border-rule px-5 py-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Status</dt>
          <dd>{entitlement.kind}</dd>
        </div>
        {profile ? (
          <div className="mt-3 flex justify-between gap-4">
            <dt className="text-muted">Email</dt>
            <dd className="break-all">{profile.email}</dd>
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

      {entitlement.kind === "signed-in" && !entitlement.hasGuide ? (
        <p className="mt-6 max-w-xl text-sm text-muted">
          No paid purchase is attached to this email. Sign in with the address
          used at Stripe Checkout, then refresh this page.
        </p>
      ) : null}

      {entitlement.kind === "signed-in" && entitlement.hasCall ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl text-ink">Call slots this month</h2>
          {callSlot.kind === "row" ? (
            <p className="mt-3 text-sm text-muted">
              {callSlot.slot.remaining} of {callSlot.slot.capacity} remaining (
              {callSlot.slot.bookings} booked).
            </p>
          ) : callSlot.kind === "missing" ? (
            <p className="mt-3 text-sm text-muted">
              No call-slot row exists for this month, so remaining is not shown.
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Call-slot counts are not available until Supabase is configured.
            </p>
          )}
        </section>
      ) : null}

      {purchases.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl text-ink">Purchases</h2>
          <ul className="mt-4 divide-y divide-rule border border-rule text-sm">
            {purchases.map((purchase) => (
              <li key={purchase.id} className="flex justify-between gap-4 px-4 py-3">
                <span>${purchase.tier}</span>
                <span className="text-muted">{purchase.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile?.is_admin ? (
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
