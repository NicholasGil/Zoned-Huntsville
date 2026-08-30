import { cookies } from "next/headers";
import { flagsFromPaidTiers, type EntitlementFlags } from "@/lib/tiers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Entitlement =
  | { kind: "anonymous" }
  | ({
      kind: "signed-in";
    } & EntitlementFlags);

/**
 * Server-side access check. Reads the signed-in user from cookies, attaches
 * purchases that share that email, then derives flags from paid tiers.
 * 149 and 349 include every lower tier.
 */
export async function getEntitlement(): Promise<Entitlement> {
  await cookies();

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { kind: "anonymous" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { kind: "anonymous" };
  }

  await supabase.rpc("link_my_purchases");

  const { data: purchases } = await supabase
    .from("purchases")
    .select("tier, status")
    .eq("status", "paid");

  const flags = flagsFromPaidTiers(
    (purchases ?? []).map((row) => row.tier),
  );

  return { kind: "signed-in", ...flags };
}

export function canReadGuide(entitlement: Entitlement): boolean {
  return entitlement.kind === "signed-in" && entitlement.hasGuide;
}

export function canReadToolkit(entitlement: Entitlement): boolean {
  return entitlement.kind === "signed-in" && entitlement.hasToolkit;
}

export function canBookCall(entitlement: Entitlement): boolean {
  return entitlement.kind === "signed-in" && entitlement.hasCall;
}
