import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SourcedFact } from "@/components/sourced-fact";
import {
  getAdminCorrections,
  getSignedInAdminState,
  getStaleFacts,
} from "@/lib/facts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stale facts",
};

export default async function StaleFactsPage() {
  const identity = await getSignedInAdminState();

  if (!identity.isAdmin) {
    return (
      <PageShell>
        <h1 className="font-serif text-4xl text-ink">Admin</h1>
        <p className="mt-4 max-w-xl text-muted">
          This page lists facts older than 90 days. It is limited to admins
          (`app_metadata.is_admin`).
        </p>
        <p className="mt-8">
          <Link href="/account" className="text-brick hover:underline">
            Account
          </Link>
        </p>
      </PageShell>
    );
  }

  const [staleFacts, corrections] = await Promise.all([
    getStaleFacts(),
    getAdminCorrections(),
  ]);

  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Stale facts</h1>
      <p className="mt-4 max-w-xl text-muted">
        Facts whose verified_at is older than 90 days. Re-verify from the source
        before publishing.
      </p>

      {staleFacts.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No stale facts right now.</p>
      ) : (
        <ul className="mt-8 divide-y divide-rule border border-rule">
          {staleFacts.map((fact) => (
            <li key={fact.id} className="px-4 py-4 text-sm">
              <p className="font-medium text-ink">
                {fact.entity_type} / {fact.entity_slug} / {fact.field}
              </p>
              <p className="mt-2">
                <SourcedFact fact={fact} />
              </p>
              <p className="mt-2 break-all text-muted">
                verified {fact.verified_at} · {fact.verification_method} ·{" "}
                {fact.source_url.startsWith("http") ? (
                  <a href={fact.source_url} className="text-brick hover:underline">
                    {fact.source_url}
                  </a>
                ) : (
                  fact.source_url
                )}
              </p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-14 font-serif text-2xl text-ink">Corrections</h2>
      {corrections.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No correction reports yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-rule border border-rule">
          {corrections.map((row) => (
            <li key={row.id} className="px-4 py-4 text-sm">
              <p className="mt-2 text-muted">{row.message}</p>
              <p className="mt-2 text-muted">
                {row.reporter_email ?? "no reporter email"} · {row.created_at}
                {row.resolved_at ? ` · resolved ${row.resolved_at}` : " · open"}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10">
        <Link href="/account" className="text-brick hover:underline">
          Account
        </Link>
      </p>
    </PageShell>
  );
}
