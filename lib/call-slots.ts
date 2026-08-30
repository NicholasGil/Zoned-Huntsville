import type { CallSlotRow } from "@/lib/database";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { utcMonthStart } from "@/lib/tiers";

export type CallSlotQuery =
  | { kind: "unavailable" }
  | { kind: "missing" }
  | { kind: "row"; slot: CallSlotRow };

export async function getCallSlot(
  month = utcMonthStart(),
): Promise<CallSlotQuery> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { kind: "unavailable" };
  }

  const { data } = await supabase
    .from("call_slots")
    .select("month, capacity, bookings, remaining")
    .eq("month", month)
    .maybeSingle();

  if (!data) {
    return { kind: "missing" };
  }

  return { kind: "row", slot: data };
}
