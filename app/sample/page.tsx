import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SampleOptInForm } from "@/components/sample-opt-in-form";
import { SourcedFact } from "@/components/sourced-fact";
import { fieldLabel, huntsvilleCitySampleFacts } from "@/lib/seed-facts";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Free sample",
  description:
    "The free Huntsville City Schools district profile from The Huntsville School Guide.",
};

export default function SamplePage() {
  const facts = huntsvilleCitySampleFacts();

  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Huntsville City Schools</h1>
      <p className="mt-4 max-w-xl text-muted">
        This is the free district profile. Other districts stay in the paid
        guide. Every figure below has a source link and the date it was
        verified.
      </p>
      <dl className="mt-10 max-w-xl space-y-5">
        {facts.map((fact) => (
          <div key={fact.field}>
            <dt className="text-sm text-muted">{fieldLabel(fact.field)}</dt>
            <dd className="mt-1 text-ink">
              <SourcedFact fact={fact} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-10 max-w-xl text-muted">
        Leave an email if you want this profile sent to you.
      </p>
      <SampleOptInForm />
    </PageShell>
  );
}
