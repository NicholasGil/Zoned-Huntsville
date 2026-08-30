import { hero, pricingTiers } from "@/lib/site";
import { VerifyToken } from "@/components/verify-token";

export function Pricing() {
  return (
    <section aria-labelledby="pricing-heading" className="mt-20">
      <h2 id="pricing-heading" className="font-serif text-2xl text-ink">
        Pricing
      </h2>
      <p className="mt-2 text-sm text-muted">
        Listed prices only. No crossed-out &quot;regular&quot; prices.
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
                  ? "border-2 border-brick bg-paper-raised px-5 py-6 md:-translate-y-2"
                  : "border border-rule bg-paper px-5 py-6"
              }
            >
              {isTarget ? (
                <p className="text-xs uppercase tracking-[0.16em] text-brick">
                  Target tier
                </p>
              ) : null}
              <p className="mt-2 font-serif text-4xl text-ink">${tier.amountUsd}</p>
              <p className="mt-3 text-sm text-muted">
                <VerifyToken>
                  {`what is included at $${tier.amountUsd}`}
                </VerifyToken>
              </p>
              <form action="/api/checkout" method="post" className="mt-6">
                <input type="hidden" name="tier" value={tier.id} />
                <button
                  type="submit"
                  className={
                    isTarget
                      ? "w-full bg-brick px-4 py-2.5 text-sm text-paper hover:bg-brick-dark"
                      : "w-full border border-ink px-4 py-2.5 text-sm text-ink hover:bg-ink hover:text-paper"
                  }
                >
                  {label}
                </button>
              </form>
              {tier.id === "79" ? (
                <p className="mt-3 text-xs text-muted">{hero.guarantee}</p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
