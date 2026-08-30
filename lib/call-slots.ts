import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CallSlotQuery =
  | { kind: "unavailable" }
  | { kind: "row"; capacity: number; bookings: number; remaining: number };

export async function getCallSlot(): Promise<CallSlotQuery> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { kind: "unavailable" };
  }

  const { data, error } = await supabase.rpc("call_month_usage");
  if (error || !data) {
    return { kind: "unavailable" };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) {
    return { kind: "unavailable" };
  }

  return {
    kind: "row",
    capacity: row.capacity,
    bookings: row.bookings,
    remaining: row.remaining,
  };
}
