"use server";

import { consumeStoredAuthNext } from "@/lib/auth-next-cookie";

export async function clearStoredAuthNext() {
  await consumeStoredAuthNext();
}
