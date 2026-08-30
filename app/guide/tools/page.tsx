import type { Metadata } from "next";
import { AccessGate } from "@/components/gate";
import { PageShell } from "@/components/page-shell";
import { VerifyToken } from "@/components/verify-token";
import { canReadToolkit, getEntitlement } from "@/lib/entitlement";

export const metadata: Metadata = {
  title: "Toolkit",
};

export default async function GuideToolsPage() {
  const entitlement = await getEntitlement();

  if (!canReadToolkit(entitlement)) {
    return (
      <PageShell>
        <AccessGate entitlement={entitlement} need="toolkit" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Toolkit</h1>
      <p className="mt-4 text-muted">
        Toolkit-tier tools are not implemented in this scaffold.
      </p>
      <p className="mt-3 text-muted">
        <VerifyToken>toolkit contents and which paid tier unlocks them</VerifyToken>
      </p>
    </PageShell>
  );
}
