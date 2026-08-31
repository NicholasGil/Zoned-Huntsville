import type { EntitlementRow } from "@/lib/database";
import { mapLastPayment, type LastPaymentView } from "@/lib/checkout-receipt";
import { getStripe } from "@/lib/stripe";

export async function loadLastPayment(
  rows: readonly EntitlementRow[],
): Promise<LastPaymentView> {
  const latest = rows[0] ?? null;
  if (!latest) {
    return mapLastPayment({ entitlement: null, session: null });
  }

  const stripe = getStripe();
  if (!stripe || !latest.stripe_session_id) {
    return mapLastPayment({
      entitlement: {
        tier: latest.tier,
        purchased_at: latest.purchased_at,
      },
      session: null,
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(latest.stripe_session_id, {
      expand: ["line_items"],
    });
    return mapLastPayment({
      entitlement: {
        tier: latest.tier,
        purchased_at: latest.purchased_at,
      },
      session,
    });
  } catch {
    return mapLastPayment({
      entitlement: {
        tier: latest.tier,
        purchased_at: latest.purchased_at,
      },
      session: null,
    });
  }
}
