"use server";

import { getCallSlot, type CallSlotQuery } from "@/lib/call-slots";

export async function readCallSlot(): Promise<CallSlotQuery> {
  return getCallSlot();
}
