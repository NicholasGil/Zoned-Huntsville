import { cache } from "react";
import { mapCheckoutSession, unavailableReceipt, type CheckoutReceipt } from "@/lib/checkout-receipt";
import { getStripe } from "@/lib/stripe";

export const loadCheckoutReceipt = cache(
  async (sessionId: string | null): Promise<CheckoutReceipt> => {
    if (!sessionId) {
      return mapCheckoutSession(null);
    }

    const stripe = getStripe();
    if (!stripe) {
      return unavailableReceipt("stripe-unset");
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
      });
      return mapCheckoutSession(session);
    } catch {
      return unavailableReceipt("retrieve-failed");
    }
  },
);
