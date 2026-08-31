import type { Metadata } from "next";
import { AccessGate } from "@/components/gate";
import { PageShell } from "@/components/page-shell";
import { ToolkitWorksheets } from "@/components/toolkit-worksheets";
import { canReadToolkit, getEntitlement } from "@/lib/entitlement";
import { getPublishedFacts } from "@/lib/facts";
import { isToolkitFact } from "@/lib/toolkit";

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

  const facts = await getPublishedFacts(isToolkitFact);

  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Toolkit</h1>
      <p className="mt-4 max-w-xl text-muted">
        Included with the $149 and $349 purchases. These are on-page printable
        checklists built from sourced facts already in the Guide. There is no
        downloadable PDF pack.
      </p>
      <ToolkitWorksheets facts={facts} />
    </PageShell>
  );
}
