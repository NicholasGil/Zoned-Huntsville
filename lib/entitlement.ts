import { cookies } from "next/headers";
import { flagsFromProductTiers, type EntitlementFlags } from "@/lib/tiers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Entitlement =
  | { kind: "anonymous" }
  | ({
      kind: "signed-in";
    } & EntitlementFlags);

/**
 * auth.uid() → email → entitlement rows → tier flags.
 * toolkit and call include every lower tier.
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

  await supabase.rpc("link_my_entitlements");

  const { data: rows } = await supabase
    .from("entitlements")
    .select("tier, refunded_at")
    .is("refunded_at", null);

  const flags = flagsFromProductTiers((rows ?? []).map((row) => row.tier));
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

export function isAdminUser(user: { app_metadata?: unknown }): boolean {
  const meta = user.app_metadata;
  if (typeof meta !== "object" || meta === null || !("is_admin" in meta)) {
    return false;
  }
  return meta.is_admin === true;
}
