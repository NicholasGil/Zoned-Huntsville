"use client";

import { useEffect, useState } from "react";
import { CheckoutForm } from "@/components/checkout-form";
import { hero } from "@/lib/site";

export function MobileBuyBar() {
  const [pastHeroFold, setPastHeroFold] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-fold-sentinel");
    if (!sentinel) {
      return;
    }

    const update = () => {
      if (window.scrollY < 8) {
        setPastHeroFold(false);
        return;
      }
      const top = sentinel.getBoundingClientRect().top;
      setPastHeroFold(top <= window.innerHeight);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!pastHeroFold) {
    return null;
  }

  return (
    <aside
      aria-label={hero.stickyMobileCta}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface px-4 py-3 md:hidden"
    >
      <CheckoutForm
        tierId="79"
        label={hero.stickyMobileCta}
        variant="brick"
      />
    </aside>
  );
}
