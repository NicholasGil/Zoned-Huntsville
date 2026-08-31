import { Suspense } from "react";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { CheckoutNotice } from "@/components/checkout-notice";
import { MobileBuyBar } from "@/components/mobile-buy-bar";
import { Pricing } from "@/components/pricing";
import { SampleOptInForm } from "@/components/sample-opt-in-form";
import { salesCopy } from "@/lib/sales";
import { edition, hero, namedSources, officialPortals } from "@/lib/site";

function GuideBuyCard({
  showGuarantee,
  showTiersLink,
}: {
  showGuarantee?: boolean;
  showTiersLink?: boolean;
}) {
  return (
    <div className="max-w-sm rounded-lg border border-border bg-surface px-4 py-4 sm:px-6 sm:py-6">
      <div className="flex items-center gap-4">
        <p className="font-sans text-[32px] font-semibold leading-none text-text">$79</p>
        <CheckoutForm
          tierId="79"
          label={hero.cta}
          variant="brick"
          className="min-w-0 flex-1"
        />
      </div>
      {showGuarantee ? (
        <p className="mt-2 text-xs font-normal leading-snug text-text-muted sm:mt-3 sm:text-sm">
          {salesCopy.heroRiskReversal}
        </p>
      ) : null}
      {showTiersLink ? (
        <p className="mt-4 text-sm font-normal text-text-muted">
          <Link href="#pricing" className="text-action hover:underline">
            See all three tiers
          </Link>
        </p>
      ) : null}
    </div>
  );
}

export function SalesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-4 pb-28 sm:pt-16 sm:pb-24 max-md:pb-28">
      <Suspense fallback={null}>
        <CheckoutNotice />
      </Suspense>
      <section aria-labelledby="hero-heading">
        <p className="text-sm text-text-muted">
          {edition} edition · five systems · Huntsville metro
        </p>
        <h1
          id="hero-heading"
          className="mt-3 max-w-3xl font-sans text-[32px] font-semibold leading-tight text-text sm:mt-5 sm:text-[48px]"
        >
          {hero.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:mt-6 sm:text-lg">
          {hero.subhead}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-snug text-text-muted">
          Sourced from the{" "}
          <a
            href={namedSources.alsdeReportCard.href}
            className="text-action hover:underline"
          >
            ALSDE report card
          </a>
          {" "}and{" "}
          <a href={namedSources.nces.href} className="text-action hover:underline">
            {namedSources.nces.label}
          </a>
          . Linked. Not a star rating.
        </p>
        <div className="mt-4 sm:mt-8">
          <GuideBuyCard showGuarantee />
        </div>
      </section>

      <section aria-labelledby="problem-heading" className="mt-16 sm:mt-20">
        <h2 id="problem-heading" className="font-sans text-2xl font-semibold text-text">
          The problem
        </h2>
        <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          {salesCopy.problem}
        </p>
        <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          {salesCopy.problemDetail}
        </p>
      </section>

      <section aria-labelledby="mechanism-heading" className="mt-16 sm:mt-20">
        <h2 id="mechanism-heading" className="font-sans text-2xl font-semibold text-text">
          How this is built
        </h2>
        <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          {salesCopy.mechanism}
        </p>
        {salesCopy.whyFreeGuidesFail.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg"
          >
            {paragraph}
          </p>
        ))}
        <ul className="mt-4 max-w-2xl space-y-1 text-sm leading-snug text-text-muted">
          {officialPortals.map((portal) => (
            <li key={portal.href}>
              <a href={portal.href} className="text-action hover:underline">
                {portal.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          {salesCopy.whoBuiltThis}
        </p>
      </section>

      <section aria-labelledby="offer-heading" className="mt-16 sm:mt-20">
        <h2 id="offer-heading" className="font-sans text-2xl font-semibold text-text">
          What you get
        </h2>
        {salesCopy.whatsInTheGuide.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg"
          >
            {paragraph}
          </p>
        ))}
        <ul className="mt-6 max-w-2xl space-y-4">
          {salesCopy.offerStack.map((item) => (
            <li key={item.name}>
              <p className="font-sans text-lg font-semibold text-text">{item.name}</p>
              <p className="mt-1 text-base font-normal leading-relaxed text-text-muted">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-text-muted sm:text-lg">
          Preview first: the Huntsville City Schools profile is free on the{" "}
          <Link href="/sample" className="text-action hover:underline">
            sample page
          </Link>
          .
        </p>
        <SampleOptInForm className="mt-6 max-w-md" />
      </section>

      <Pricing />

      <section aria-labelledby="guarantee-heading" className="mt-16 sm:mt-20">
        <h2 id="guarantee-heading" className="font-sans text-2xl font-semibold text-text">
          Risk reversal
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
        <div className="mt-6">
          <GuideBuyCard showGuarantee />
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="mt-16 sm:mt-20">
        <h2 id="faq-heading" className="font-sans text-2xl font-semibold text-text">
          FAQ
        </h2>
        <dl className="mt-6 max-w-2xl space-y-8">
          {[...salesCopy.objections, ...salesCopy.faq].map((item) => (
            <div key={item.question}>
              <dt className="font-sans text-xl font-semibold text-text">{item.question}</dt>
              <dd className="mt-3 text-base font-normal leading-relaxed text-text-muted sm:text-lg">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="final-cta-heading" className="mt-16 border-t border-border pt-16 sm:mt-20">
        <h2 id="final-cta-heading" className="font-sans text-2xl font-semibold text-text">
          Get the Guide
        </h2>
        <div className="mt-6">
          <GuideBuyCard showGuarantee showTiersLink />
        </div>
      </section>
      <MobileBuyBar />
    </div>
  );
}
