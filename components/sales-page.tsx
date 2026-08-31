import { Suspense } from "react";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { CheckoutNotice } from "@/components/checkout-notice";
import { Pricing } from "@/components/pricing";
import { SampleOptInForm } from "@/components/sample-opt-in-form";
import { salesCopy } from "@/lib/sales";
import { edition, hero, namedSources, officialPortals, site } from "@/lib/site";

export function SalesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-24">
      <Suspense fallback={null}>
        <CheckoutNotice />
      </Suspense>
      <section aria-labelledby="hero-heading">
        <p className="text-sm uppercase tracking-[0.18em] text-text-muted">{site.name}</p>
        <p className="mt-2 text-sm text-text-muted">{edition} edition</p>
        <h1
          id="hero-heading"
          className="mt-5 max-w-3xl font-sans text-[32px] font-semibold leading-tight text-text sm:text-[48px]"
        >
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          {hero.subhead}
        </p>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-text-muted">
          Sourced from the{" "}
          <a
            href={namedSources.alsdeReportCard.href}
            className="text-action hover:underline"
          >
            {namedSources.alsdeReportCard.label}
          </a>
          ,{" "}
          <a href={namedSources.nces.href} className="text-action hover:underline">
            {namedSources.nces.label}
          </a>
          , each district&apos;s own published policy, and the schools themselves.
          Every claim is linked. Nothing here is a star rating.
        </p>
        <ul className="mt-3 max-w-2xl space-y-1 text-sm text-text-muted">
          {officialPortals.map((portal) => (
            <li key={portal.href}>
              <a href={portal.href} className="text-action hover:underline">
                {portal.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 max-w-sm rounded-lg border border-border bg-surface px-6 py-6">
          <p className="font-sans text-[32px] font-semibold leading-none text-text">$79</p>
          <CheckoutForm
            tierId="79"
            label={hero.cta}
            variant="brick"
            className="mt-4"
          />
          <p className="mt-3 text-sm font-normal text-text-muted">{hero.guarantee}</p>
        </div>
      </section>

      <section aria-labelledby="problem-heading" className="mt-20">
        <h2 id="problem-heading" className="font-sans text-2xl font-semibold text-text">
          The problem
        </h2>
        <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          {salesCopy.problem}
        </p>
      </section>

      <section aria-labelledby="free-guides-heading" className="mt-20">
        <h2 id="free-guides-heading" className="font-sans text-2xl font-semibold text-text">
          Why free guides fail
        </h2>
        {salesCopy.whyFreeGuidesFail.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </section>

      <section aria-labelledby="mechanism-heading" className="mt-20">
        <h2 id="mechanism-heading" className="font-sans text-2xl font-semibold text-text">
          How this is built
        </h2>
        <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          {salesCopy.mechanism}
        </p>
      </section>

      <section aria-labelledby="modules-heading" className="mt-20">
        <h2 id="modules-heading" className="font-sans text-2xl font-semibold text-text">
          What&apos;s in the Guide
        </h2>
        {salesCopy.whatsInTheGuide.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </section>

      <section aria-labelledby="sample-heading" className="mt-20">
        <h2 id="sample-heading" className="font-sans text-2xl font-semibold text-text">
          Free sample
        </h2>
        <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          Leave an email and get the full Huntsville City Schools district
          profile. You can also read it on the{" "}
          <Link href="/sample" className="text-action hover:underline">
            sample page
          </Link>
          .
        </p>
        <SampleOptInForm className="mt-6 max-w-md" />
      </section>

      <section aria-labelledby="who-heading" className="mt-20">
        <h2 id="who-heading" className="font-sans text-2xl font-semibold text-text">
          Who built this
        </h2>
        <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          {salesCopy.whoBuiltThis}
        </p>
      </section>

      <section aria-labelledby="objections-heading" className="mt-20">
        <h2 id="objections-heading" className="font-sans text-2xl font-semibold text-text">
          Objections
        </h2>
        <dl className="mt-6 max-w-2xl space-y-8">
          {salesCopy.objections.map((item) => (
            <div key={item.question}>
              <dt className="font-sans text-xl font-semibold text-text">{item.question}</dt>
              <dd className="mt-3 text-base font-normal leading-relaxed text-text-muted sm:text-lg">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Pricing />

      <section aria-labelledby="guarantee-heading" className="mt-20">
        <h2 id="guarantee-heading" className="font-sans text-2xl font-semibold text-text">
          Guarantee
        </h2>
        <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          30-day unconditional money-back. If you want a refund, email us
          through the{" "}
          <Link href="/contact" className="text-action hover:underline">
            contact form
          </Link>
          . You get the full amount back.
        </p>
        <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          {salesCopy.zonePromise}
        </p>
      </section>

      <section aria-labelledby="faq-heading" className="mt-20">
        <h2 id="faq-heading" className="font-sans text-2xl font-semibold text-text">
          FAQ
        </h2>
        <dl className="mt-6 max-w-2xl space-y-8">
          {salesCopy.faq.map((item) => (
            <div key={item.question}>
              <dt className="font-sans text-xl font-semibold text-text">{item.question}</dt>
              <dd className="mt-3 text-base font-normal leading-relaxed text-text-muted sm:text-lg">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="final-cta-heading" className="mt-20 border-t border-border pt-16">
        <h2 id="final-cta-heading" className="font-sans text-2xl font-semibold text-text">
          Get the Guide
        </h2>
        <div className="mt-6 max-w-sm rounded-lg border border-border bg-surface px-6 py-6">
          <p className="font-sans text-[32px] font-semibold leading-none text-text">$79</p>
          <CheckoutForm
            tierId="79"
            label={hero.cta}
            variant="brick"
            className="mt-4"
          />
          <p className="mt-4 text-sm font-normal text-text-muted">
            <Link href="#pricing" className="text-action hover:underline">
              See all three tiers
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
