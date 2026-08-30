import { Suspense } from "react";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { CheckoutNotice } from "@/components/checkout-notice";
import { Pricing } from "@/components/pricing";
import { SampleOptInForm } from "@/components/sample-opt-in-form";
import { GUIDE_MODULES } from "@/lib/guide-modules";
import { salesCopy } from "@/lib/sales";
import { hero, site } from "@/lib/site";

export function SalesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-24">
      <Suspense fallback={null}>
        <CheckoutNotice />
      </Suspense>
      <section aria-labelledby="hero-heading">
        <p className="text-sm uppercase tracking-[0.18em] text-muted">{site.name}</p>
        <h1
          id="hero-heading"
          className="mt-5 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-5xl"
        >
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{hero.subhead}</p>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">{hero.credibility}</p>
        <div className="mt-8">
          <p className="font-serif text-3xl text-ink">$79</p>
          <CheckoutForm
            tierId="79"
            label={hero.cta}
            variant="brick"
            className="mt-4"
          />
          <p className="mt-3 text-sm text-muted">{hero.guarantee}</p>
        </div>
      </section>

      <section aria-labelledby="problem-heading" className="mt-20">
        <h2 id="problem-heading" className="font-serif text-2xl text-ink">
          The problem
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">{salesCopy.problem}</p>
      </section>

      <section aria-labelledby="free-guides-heading" className="mt-20">
        <h2 id="free-guides-heading" className="font-serif text-2xl text-ink">
          Why free guides fail
        </h2>
        {salesCopy.whyFreeGuidesFail.map((paragraph) => (
          <p key={paragraph} className="mt-4 max-w-2xl leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
      </section>

      <section aria-labelledby="mechanism-heading" className="mt-20">
        <h2 id="mechanism-heading" className="font-serif text-2xl text-ink">
          How this is built
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">{salesCopy.mechanism}</p>
      </section>

      <section aria-labelledby="modules-heading" className="mt-20">
        <h2 id="modules-heading" className="font-serif text-2xl text-ink">
          Eight modules
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-4 pl-6 text-muted">
          {GUIDE_MODULES.map((module) => (
            <li key={module.slug}>
              <span className="text-ink">{module.title}</span>
              <span className="mt-1 block text-sm">{module.purpose}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="sample-heading" className="mt-20">
        <h2 id="sample-heading" className="font-serif text-2xl text-ink">
          Free sample
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          Leave an email and get the full Huntsville City Schools district
          profile. You can also read it on the{" "}
          <Link href="/sample" className="text-brick hover:underline">
            sample page
          </Link>
          .
        </p>
        <SampleOptInForm className="mt-6 max-w-md" />
      </section>

      <section aria-labelledby="who-heading" className="mt-20">
        <h2 id="who-heading" className="font-serif text-2xl text-ink">
          Who built this
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">{salesCopy.whoBuiltThis}</p>
      </section>

      <section aria-labelledby="objections-heading" className="mt-20">
        <h2 id="objections-heading" className="font-serif text-2xl text-ink">
          Objections
        </h2>
        <dl className="mt-6 max-w-2xl space-y-8">
          {salesCopy.objections.map((item) => (
            <div key={item.question}>
              <dt className="font-serif text-xl text-ink">{item.question}</dt>
              <dd className="mt-3 leading-relaxed text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Pricing />

      <section aria-labelledby="guarantee-heading" className="mt-20">
        <h2 id="guarantee-heading" className="font-serif text-2xl text-ink">
          Guarantee
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          30-day unconditional money-back. If you want a refund, email us
          through the{" "}
          <Link href="/contact" className="text-brick hover:underline">
            contact form
          </Link>
          . You get the full amount back.
        </p>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          {salesCopy.zonePromise}
        </p>
      </section>

      <section aria-labelledby="faq-heading" className="mt-20">
        <h2 id="faq-heading" className="font-serif text-2xl text-ink">
          FAQ
        </h2>
        <dl className="mt-6 max-w-2xl space-y-8">
          {salesCopy.faq.map((item) => (
            <div key={item.question}>
              <dt className="font-serif text-xl text-ink">{item.question}</dt>
              <dd className="mt-3 leading-relaxed text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="final-cta-heading" className="mt-20 border-t border-rule pt-16">
        <h2 id="final-cta-heading" className="font-serif text-2xl text-ink">
          Get the Guide
        </h2>
        <p className="mt-4 font-serif text-3xl text-ink">$79</p>
        <CheckoutForm
          tierId="79"
          label={hero.cta}
          variant="brick"
          className="mt-4"
        />
        <p className="mt-4 text-sm text-muted">
          <Link href="#pricing" className="text-brick hover:underline">
            See all three tiers
          </Link>
        </p>
      </section>
    </div>
  );
}
