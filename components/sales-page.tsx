import { Suspense } from "react";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { CheckoutNotice } from "@/components/checkout-notice";
import { MobileBuyBar } from "@/components/mobile-buy-bar";
import { Pricing } from "@/components/pricing";
import { SampleOptInForm } from "@/components/sample-opt-in-form";
import { salesCopy } from "@/lib/sales";
import { HeroPhonePreview } from "@/components/hero-phone-preview";
import { edition, hero, officialPortals } from "@/lib/site";

function HeroProofBeatsBelowFold() {
  return (
    <ul
      className="mt-6 w-full max-w-xl space-y-2 text-left text-[13px] leading-snug text-text-muted sm:mt-8 sm:space-y-2.5 sm:text-base sm:leading-relaxed"
      aria-label="More reasons families use this guide"
    >
      {hero.proofBeatsBelowFold.map((beat) => (
        <li key={beat} className="flex gap-2.5">
          <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-action"
            aria-hidden="true"
          />
          <span>{beat}</span>
        </li>
      ))}
    </ul>
  );
}

export function SalesPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl overflow-x-clip px-4 pb-28 pt-1 sm:px-6 sm:pt-10 sm:pb-24 max-md:pb-28">
      <Suspense fallback={null}>
        <CheckoutNotice />
      </Suspense>
      <section
        id="hero-fold"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full min-w-0 max-w-2xl flex-col items-center text-center"
      >
        <p className="text-[10px] leading-tight text-text-muted max-md:tracking-tight sm:text-sm">
          {edition} edition · five systems · Huntsville metro
        </p>
        <h1
          id="hero-heading"
          className="mt-1 font-sans text-[1.375rem] font-bold leading-[1.12] tracking-tight text-text max-md:max-w-[18rem] sm:mt-4 sm:max-w-none sm:text-[44px] sm:leading-[1.06] lg:text-[48px]"
        >
          {hero.headline}
        </h1>
        <p
          className="mt-1 w-full max-w-xl text-balance text-[13px] font-medium leading-snug text-text-muted sm:mt-4 sm:text-lg sm:leading-snug"
        >
          {hero.proofLineAboveFold}
        </p>
        <p
          className="mt-1 w-full max-w-xl text-balance text-[11px] leading-snug text-text-muted sm:mt-3 sm:text-sm sm:leading-relaxed"
        >
          {hero.mechanismFold}
        </p>
        <div
          id="hero-buy-cluster"
          className="order-2 mt-2 flex w-full max-w-sm flex-col items-center gap-1 md:order-4 sm:mt-7 sm:gap-3"
        >
          <CheckoutForm
            tierId="79"
            label={hero.cta}
            variant="pill"
            className="w-full"
          />
          <p
            className="text-center text-[10px] leading-snug text-text-muted sm:text-xs"
            aria-label="Purchase guarantees"
          >
            {hero.foldGuaranteeChips.join(" · ")}
          </p>
        </div>
        <p className="order-3 mt-1 max-w-sm text-center md:order-5 sm:mt-4">
          <Link
            href="/sample"
            id="hero-sample-demo-link"
            className="text-[12px] font-medium text-action underline-offset-4 hover:underline sm:text-sm"
          >
            {hero.sampleDemoCue}
          </Link>
        </p>
        <HeroPhonePreview className="order-4 mt-2 max-md:max-w-[8.25rem] md:order-3 sm:mt-8" />
        <div id="hero-fold-sentinel" className="order-5 h-px w-full md:order-6" aria-hidden="true" />
      </section>
      <div className="mx-auto mt-4 w-full max-w-2xl max-md:mt-3 sm:mt-6">
        <HeroProofBeatsBelowFold />
      </div>

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

      <section
        id="whats-inside"
        aria-labelledby="offer-heading"
        className="mt-16 scroll-mt-14 sm:mt-20"
      >
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
          Preview first: the free address→zone decision demo (Huntsville City
          Schools) is on the{" "}
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
      </section>

      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="mt-16 scroll-mt-14 sm:mt-20"
      >
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

      <MobileBuyBar />
    </div>
  );
}
