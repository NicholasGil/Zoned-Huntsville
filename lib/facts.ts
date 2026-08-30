import type { CorrectionRow, FactRow, ProfileRow, PurchaseRow } from "@/lib/database";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export function isSecondaryFact(fact: Pick<FactRow, "verification_method">): boolean {
  return fact.verification_method === "secondary";
}

export async function getSignedInProfile(): Promise<ProfileRow | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, email, created_at, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}

export async function getOwnPurchases(): Promise<PurchaseRow[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("purchases")
    .select(
      "id, user_id, email, stripe_checkout_session_id, stripe_payment_intent_id, tier, status, created_at",
    )
    .order("created_at", { ascending: false });

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
      "id, subject, subject_key, label, value, source_url, verified_at, verification_method, created_at, updated_at",
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
    .select(
      "id, page_path, fact_id, reporter_email, message, created_at, emailed_at",
    )
    .order("created_at", { ascending: false });

  return data ?? [];
}
