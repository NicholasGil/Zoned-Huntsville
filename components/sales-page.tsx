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

export function SalesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-28 pt-3 sm:px-6 sm:pt-10 sm:pb-24 max-md:pb-28">
      <Suspense fallback={null}>
        <CheckoutNotice />
      </Suspense>
      <section
        aria-labelledby="hero-heading"
        className="mx-auto flex max-w-2xl flex-col items-center text-center"
      >
        <p className="text-xs text-text-muted sm:text-sm">
          {edition} edition · five systems · Huntsville metro
        </p>
        <h1
          id="hero-heading"
          className="mt-2 font-sans text-[26px] font-semibold leading-[1.15] text-text sm:mt-4 sm:text-[40px] sm:leading-tight"
        >
          {hero.headline}
        </h1>
        <ul
          className="mt-4 w-full max-w-xl space-y-2 text-left text-[13px] leading-snug text-text-muted sm:mt-6 sm:space-y-2.5 sm:text-base sm:leading-relaxed"
          aria-label="Why this guide"
        >
          {hero.proofBeats.map((beat) => (
            <li key={beat} className="flex gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-action"
                aria-hidden="true"
              />
              <span>{beat}</span>
            </li>
          ))}
        </ul>
        <CheckoutForm
          tierId="79"
          label={hero.cta}
          variant="pill"
          className="mt-5 w-full max-w-sm sm:mt-8 [&_button]:text-base"
        />
        <p className="mt-2 max-w-sm text-[11px] font-normal leading-snug text-text-muted sm:mt-3 sm:text-sm">
          {salesCopy.heroRiskReversal}
        </p>
        <HeroPhonePreview />
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

      <section
        aria-labelledby="final-cta-heading"
        className="mt-16 border-t border-border pt-16 sm:mt-20"
      >
        <h2 id="final-cta-heading" className="font-sans text-2xl font-semibold text-text">
          Ready when you are
        </h2>
        <p className="mt-4 max-w-2xl text-base text-text-muted sm:text-lg">
          The hero button and pricing below both post the same $79 checkout — pick
          whichever screen you&apos;re on.
        </p>
        <p className="mt-4">
          <Link href="#pricing" className="text-action font-semibold hover:underline">
            See pricing and tiers →
          </Link>
        </p>
      </section>
      <MobileBuyBar />
    </div>
  );
}
