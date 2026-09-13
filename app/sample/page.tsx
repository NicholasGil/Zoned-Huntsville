import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { PageShell } from "@/components/page-shell";
import { SampleOptInForm } from "@/components/sample-opt-in-form";
import { ViewContentPixel } from "@/components/view-content-pixel";
import { SourcedFact } from "@/components/sourced-fact";
import {
  FIVE_SYSTEM_SLUGS,
  fieldLabel,
  huntsvilleCityZoneDemoFacts,
} from "@/lib/seed-facts";
import { edition, hero } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Free zone check demo",
  description:
    "Free address-to-zone decision demo for Huntsville City Schools: official locator steps with sourced, dated citations. The paid Guide covers all five Huntsville metro school systems.",
};

const FIVE_SYSTEM_LABELS =
  "Huntsville City, Madison City, Madison County, Athens City, and Limestone County";

export default function SamplePage() {
  const facts = huntsvilleCityZoneDemoFacts();

  return (
    <PageShell>
      <ViewContentPixel />
      <p className="text-xs uppercase tracking-[0.14em] text-muted">
        Free decision demo
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">
        Address → zone: how you check before you sign
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        This is the free decision demo — one system, Huntsville City Schools. The
        paid {edition} Guide applies the same sourced, dated assembly across all
        five metro systems ({FIVE_SYSTEM_LABELS}).
      </p>

      <ol className="mt-8 max-w-xl list-decimal space-y-3 pl-5 text-ink">
        <li>
          The city name on a listing is not the school district. Huntsville metro
          has {FIVE_SYSTEM_SLUGS.length} separate systems.
        </li>
        <li>
          Use each district&apos;s official zone locator — not a realtor or
          listing map.
        </li>
        <li>
          Read what the district publishes, with a source link and verification
          date (below for Huntsville City).
        </li>
      </ol>

      <section
        aria-labelledby="hcs-zone-demo-heading"
        className="mt-10 max-w-xl rounded-lg border border-border bg-surface px-5 py-6"
      >
        <h2
          id="hcs-zone-demo-heading"
          className="font-sans text-xl font-semibold text-ink"
        >
          Huntsville City Schools — official check
        </h2>
        <p className="mt-2 text-sm text-muted">
          Worked example for one address. Other systems use their own locators in
          the paid Guide.
        </p>
        <dl className="mt-6 space-y-5">
          {facts.map((fact) => (
            <div key={fact.field}>
              <dt className="text-sm text-muted">{fieldLabel(fact.field)}</dt>
              <dd className="mt-1 text-ink">
                <SourcedFact fact={fact} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-10 max-w-xl text-muted">
        Want the same decision workflow for Madison City, Madison County, Athens
        City, and Limestone County?{" "}
        <Link href="/#pricing" className="text-action hover:underline">
          See the Guide on the homepage
        </Link>
        .
      </p>

      <p className="mt-6 max-w-xl text-muted">
        Leave an email if you want this demo sent to you.
      </p>
      <SampleOptInForm submitLabel="Email me this demo" />
      <CheckoutForm
        tierId="79"
        label={hero.cta}
        variant="brick"
        className="mt-10 max-w-sm"
      />
    </PageShell>
  );
}
