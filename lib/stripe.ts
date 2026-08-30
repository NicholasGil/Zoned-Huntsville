import Stripe from "stripe";
import { getAppEnv } from "@/lib/env";

export function getStripe(): Stripe | null {
  const env = getAppEnv();
  if (env.stripe.kind === "missing") {
    return null;
  }

  return new Stripe(env.stripe.secretKey);
}
