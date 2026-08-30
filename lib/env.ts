import type { PricingTierId } from "@/lib/site";

type StripeEnv =
  | { kind: "missing" }
  | {
      kind: "present";
      secretKey: string;
      webhookSecret: string | null;
      publishableKey: string | null;
      priceIds: Record<PricingTierId, string | null>;
    };

type SupabaseEnv =
  | { kind: "missing" }
  | {
      kind: "present";
      url: string;
      anonKey: string;
      serviceRoleKey: string | null;
    };

export type AppEnv = {
  siteUrl: string;
  stripe: StripeEnv;
  supabase: SupabaseEnv;
  resendApiKey: string | null;
};

function readOptional(name: string): string | null {
  const value = process.env[name];
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getAppEnv(): AppEnv {
  const siteUrl = readOptional("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";
  const stripeSecret = readOptional("STRIPE_SECRET_KEY");
  const supabaseUrl = readOptional("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = readOptional("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return {
    siteUrl,
    stripe: stripeSecret
      ? {
          kind: "present",
          secretKey: stripeSecret,
          webhookSecret: readOptional("STRIPE_WEBHOOK_SECRET"),
          publishableKey: readOptional("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
          priceIds: {
            "79": readOptional("STRIPE_PRICE_ID_79"),
            "149": readOptional("STRIPE_PRICE_ID_149"),
            "349": readOptional("STRIPE_PRICE_ID_349"),
          },
        }
      : { kind: "missing" },
    supabase:
      supabaseUrl && supabaseAnonKey
        ? {
            kind: "present",
            url: supabaseUrl,
            anonKey: supabaseAnonKey,
            serviceRoleKey: readOptional("SUPABASE_SERVICE_ROLE_KEY"),
          }
        : { kind: "missing" },
    resendApiKey: readOptional("RESEND_API_KEY"),
  };
}
