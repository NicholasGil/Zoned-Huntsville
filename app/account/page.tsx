import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getEntitlement } from "@/lib/entitlement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const entitlement = await getEntitlement();

  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Account</h1>
      <p className="mt-4 max-w-xl text-muted">
        Purchase records are not stored in this scaffold. The server ran the
        entitlement stub and returned <code>{entitlement.kind}</code>.
      </p>
      <dl className="mt-8 max-w-md border border-rule px-5 py-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Status</dt>
          <dd>{entitlement.kind}</dd>
        </div>
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
      </dl>
      <p className="mt-8">
        <Link href="/login" className="text-brick hover:underline">
          Sign in
        </Link>
      </p>
    </PageShell>
  );
}
