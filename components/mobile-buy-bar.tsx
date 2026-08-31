import { CheckoutForm } from "@/components/checkout-form";
import { hero } from "@/lib/site";

export function MobileBuyBar() {
  return (
    <aside
      aria-label={hero.cta}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface px-4 py-3 md:hidden"
    >
      <CheckoutForm tierId="79" label={hero.cta} variant="brick" />
    </aside>
  );
}
