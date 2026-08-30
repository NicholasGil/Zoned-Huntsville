import type { Metadata } from "next";
import { AccessGate } from "@/components/gate";
import { PageShell } from "@/components/page-shell";
import { VerifyToken } from "@/components/verify-token";
import { canReadGuide, getEntitlement } from "@/lib/entitlement";

export const metadata: Metadata = {
  title: "Guide module",
};

export default async function GuideModulePage({
  params,
}: PageProps<"/guide/[module]">) {
  const { module: moduleSlug } = await params;
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
      <p className="text-sm uppercase tracking-[0.16em] text-muted">Module</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">{moduleSlug}</h1>
      <p className="mt-4 text-muted">
        Content for this module is not written in this scaffold. No school facts
        are listed here.
      </p>
      <p className="mt-3 text-muted">
        <VerifyToken>{`sourced content for module ${moduleSlug}`}</VerifyToken>
      </p>
    </PageShell>
  );
}
