import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { PageShell } from "@/components/page-shell";
import { SampleOptInForm } from "@/components/sample-opt-in-form";
import { ViewContentPixel } from "@/components/view-content-pixel";
import { SourcedFact } from "@/components/sourced-fact";
import { fieldLabel, huntsvilleCityZoneDemoFacts } from "@/lib/seed-facts";
import { edition, hero } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Free zone check demo",
  description:
    "Free address-to-zone decision demo for Huntsville City Schools: official locator steps with sourced, dated citations. The paid Guide covers all five Huntsville metro school systems.",
};

export default function SamplePage() {
  const facts = huntsvilleCityZoneDemoFacts();
  const [leadFact, ...moreFacts] = facts;

  return (
    <PageShell>
      <ViewContentPixel />
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted sm:text-xs">
        Free decision demo
      </p>
      <h1 className="mt-1 font-serif text-[1.35rem] leading-tight text-ink sm:mt-2 sm:text-4xl">
        Address → zone: check before you sign
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted sm:mt-4 sm:text-base">
        Huntsville City Schools worked example. The paid {edition} Guide covers
        all five metro systems the same way.
      </p>

      <section
        aria-labelledby="hcs-zone-demo-heading"
        className="mt-3 max-w-xl rounded-lg border border-border bg-surface px-4 py-4 sm:mt-6 sm:px-5 sm:py-6"
      >
        <h2
          id="hcs-zone-demo-heading"
          className="font-sans text-lg font-semibold text-ink sm:text-xl"
        >
          Huntsville City Schools — official check
        </h2>
        {leadFact ? (
          <p className="mt-3 text-sm leading-relaxed text-ink">
            <span className="font-medium text-ink">
              {fieldLabel(leadFact.field)}:{" "}
            </span>
            <SourcedFact fact={leadFact} />
          </p>
        ) : null}
        <dl className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
          {moreFacts.map((fact) => (
            <div key={fact.field}>
              <dt className="text-sm text-muted">{fieldLabel(fact.field)}</dt>
              <dd className="mt-1 text-ink">
                <SourcedFact fact={fact} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <ol className="mt-4 max-w-xl list-decimal space-y-2 pl-5 text-sm text-ink sm:mt-8 sm:space-y-3 sm:text-base">
        <li>
          Listing city ≠ school district — five separate systems in this metro.
        </li>
        <li>Use each district&apos;s official zone locator, not a listing map.</li>
        <li>Each line in the card links to its source and verification date.</li>
      </ol>

      <p className="mt-8 max-w-xl text-muted sm:mt-10">
        Want Madison City, Madison County, Athens City, and Limestone County too?{" "}
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
