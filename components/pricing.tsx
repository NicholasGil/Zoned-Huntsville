import { CallSlotsRemaining } from "@/components/call-slots-remaining";
import { CheckoutForm } from "@/components/checkout-form";
import { edition, hero, pricingTiers } from "@/lib/site";

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="scroll-mt-8 mt-20">
      <h2 id="pricing-heading" className="font-sans text-2xl font-semibold text-text">
        Pricing
      </h2>
      <p className="mt-2 text-sm text-text-muted">
        {edition} edition. Listed prices only. No crossed-out &quot;regular&quot;
        prices.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {pricingTiers.map((tier) => {
          const isTarget = tier.prominence === "target";
          const label =
            tier.id === "79" ? hero.cta : `Continue to checkout — $${tier.amountUsd}`;

          return (
            <article
              key={tier.id}
              className={
                isTarget
                  ? "rounded-lg border-2 border-action bg-surface-raised px-5 py-6"
                  : "rounded-lg border border-border bg-surface px-5 py-6"
              }
            >
              {isTarget ? (
                <p className="text-xs uppercase tracking-[0.16em] text-action">
                  Recommended
                </p>
              ) : null}
              <p className="mt-2 font-sans text-2xl font-semibold text-text">{tier.name}</p>
              <p className="mt-2 font-sans text-4xl font-semibold text-text">${tier.amountUsd}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-text-muted">
                {tier.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {tier.id === "349" ? <CallSlotsRemaining /> : null}
              <CheckoutForm
                tierId={tier.id}
                label={label}
                variant={isTarget ? "brick-full" : "ink"}
                className="mt-6"
              />
              {tier.id === "79" ? (
                <p className="mt-3 text-xs text-text-muted">{hero.guarantee}</p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
