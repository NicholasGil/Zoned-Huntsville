import { checkoutOffer } from "@/lib/checkout-offer";
import type { PricingTierId } from "@/lib/site";

export function CheckoutForm({
  tierId,
  label,
  variant,
  className,
}: {
  tierId: PricingTierId;
  label?: string;
  variant: "brick" | "ink" | "brick-full";
  className?: string;
}) {
  const offer = checkoutOffer(tierId);
  const buttonLabel = label ?? offer.payCta;
  const restatementId = `checkout-restate-${tierId}`;
  const showRestatement = label === undefined;

  const buttonClass =
    variant === "ink"
      ? "w-full border border-ink px-4 py-2.5 text-sm text-ink hover:bg-ink hover:text-paper"
      : variant === "brick-full"
        ? "w-full bg-brick px-4 py-2.5 text-sm text-paper hover:bg-brick-dark"
        : "bg-brick px-5 py-2.5 text-sm text-paper hover:bg-brick-dark";

  return (
    <form action="/api/checkout" method="post" className={className}>
      <input type="hidden" name="tier" value={tierId} />
      {showRestatement ? (
        <p id={restatementId} className="mb-3 text-sm text-muted">
          {offer.productName}
          <span className="mx-2 text-rule">·</span>
          {offer.tierLabel}
          <span className="mx-2 text-rule">·</span>
          ${offer.amountUsd}
        </p>
      ) : null}
      <button
        type="submit"
        className={buttonClass}
        aria-describedby={showRestatement ? restatementId : undefined}
      >
        {buttonLabel}
      </button>
    </form>
  );
}
