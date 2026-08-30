import type { Metadata } from "next";
import Link from "next/link";
import { AccessGate } from "@/components/gate";
import { PageShell } from "@/components/page-shell";
import { VerifyToken } from "@/components/verify-token";
import { canReadGuide, getEntitlement } from "@/lib/entitlement";

export const metadata: Metadata = {
  title: "Guide",
};

export default async function GuideIndexPage() {
  const entitlement = await getEntitlement();

  if (!canReadGuide(entitlement)) {
    return (
      <PageShell>
        <AccessGate entitlement={entitlement} need="guide" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Guide modules</h1>
      <p className="mt-4 text-muted">
        Module titles and slugs are not published in this scaffold.
      </p>
      <p className="mt-3 text-muted">
        <VerifyToken>published module list</VerifyToken>
      </p>
      <p className="mt-8">
        <Link href="/guide/tools" className="text-brick hover:underline">
          Toolkit
        </Link>
      </p>
    </PageShell>
  );
}
