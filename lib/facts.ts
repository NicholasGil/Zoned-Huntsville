import type { CorrectionRow, EntitlementRow, FactRow } from "@/lib/database";
import { isAdminUser } from "@/lib/entitlement";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export function isSecondaryFact(
  fact: Pick<FactRow, "verification_method">,
): boolean {
  return fact.verification_method === "secondary";
}

export async function getSignedInAdminState(): Promise<{
  email: string | null;
  isAdmin: boolean;
}> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { email: null, isAdmin: false };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { email: null, isAdmin: false };
  }

  return {
    email: user.email ?? null,
    isAdmin: isAdminUser(user),
  };
}

export async function getOwnEntitlements(): Promise<EntitlementRow[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("entitlements")
    .select(
      "id, user_id, email, tier, stripe_session_id, stripe_payment_intent, purchased_at, refunded_at",
    )
    .order("purchased_at", { ascending: false });

  return data ?? [];
}

export async function getStaleFacts(): Promise<FactRow[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("stale_facts")
    .select(
      "id, entity_type, entity_slug, field, value, source_url, verified_at, verification_method, notes",
    )
    .order("verified_at", { ascending: true });

  return data ?? [];
}

export async function getAdminCorrections(): Promise<CorrectionRow[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("corrections")
    .select("id, fact_id, reporter_email, message, created_at, resolved_at")
    .order("created_at", { ascending: false });

  return data ?? [];
}
