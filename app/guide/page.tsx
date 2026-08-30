import type { Metadata } from "next";
import Link from "next/link";
import { AccessGate } from "@/components/gate";
import { PageShell } from "@/components/page-shell";
import { canReadGuide, getEntitlement } from "@/lib/entitlement";
import { GUIDE_MODULES } from "@/lib/guide-modules";

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
      <p className="mt-4 max-w-xl text-muted">
        Eight modules. Module 2 has the sourced district facts. The others list
        what belongs there and mark anything not yet verified.
      </p>
      <ol className="mt-10 max-w-xl space-y-4">
        {GUIDE_MODULES.map((module) => (
          <li key={module.slug}>
            <Link
              href={`/guide/${module.slug}`}
              className="font-serif text-xl text-ink hover:text-brick"
            >
              {module.number}. {module.title}
            </Link>
            <p className="mt-1 text-sm text-muted">{module.purpose}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10">
        <Link href="/guide/tools" className="text-brick hover:underline">
          Toolkit
        </Link>
      </p>
    </PageShell>
  );
}
