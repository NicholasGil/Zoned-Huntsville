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
      ? "w-full border border-ink px-4 py-2.5 text-sm text-ink hover:bg-ink hover:text-paper"
      : variant === "brick-full"
        ? "w-full bg-brick px-4 py-2.5 text-sm text-paper hover:bg-brick-dark"
        : "bg-brick px-5 py-2.5 text-sm text-paper hover:bg-brick-dark";

  return (
    <form action="/api/checkout" method="post" className={className}>
      <input type="hidden" name="tier" value={tierId} />
      <button type="submit" className={buttonClass}>
        {label}
      </button>
    </form>
  );
}
