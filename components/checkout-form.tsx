import type { PricingTierId } from "@/lib/site";

export function CheckoutForm({
  tierId,
  label,
  variant,
  className,
}: {
  tierId: PricingTierId;
  label: string;
  variant: "brick" | "ink" | "brick-full";
  className?: string;
}) {
  const buttonClass =
    variant === "ink"
      ? "w-full border border-text px-4 py-2.5 text-sm text-text hover:bg-text hover:text-surface"
      : variant === "brick-full"
        ? "w-full bg-action px-4 py-2.5 text-sm text-text-on-action hover:bg-action-hover"
        : "bg-action px-5 py-2.5 text-sm text-text-on-action hover:bg-action-hover";

  return (
    <form action="/api/checkout" method="post" className={className}>
      <input type="hidden" name="tier" value={tierId} />
      <button type="submit" className={buttonClass}>
        {label}
      </button>
    </form>
  );
}
