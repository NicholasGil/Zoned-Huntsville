import { Suspense } from "react";
import { CheckoutNotice } from "@/components/checkout-notice";
import { Pricing } from "@/components/pricing";
import { hero, site } from "@/lib/site";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-24">
      <Suspense fallback={null}>
        <CheckoutNotice />
      </Suspense>
      <p className="text-sm uppercase tracking-[0.18em] text-muted">{site.name}</p>
      <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {hero.headline}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{hero.subhead}</p>
      <Pricing />
      <p className="mt-14 max-w-2xl text-sm leading-relaxed text-muted">{hero.credibility}</p>
    </div>
  );
}
