"use server";

import { parseEmail } from "@/lib/email";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SampleState =
  | { kind: "idle" }
  | { kind: "invalid-email" }
  | { kind: "received" };

export async function submitSampleOptIn(
  _previous: SampleState,
  formData: FormData,
): Promise<SampleState> {
  const parsed = parseEmail(formData.get("email"));
  if (parsed.kind === "invalid") {
    return { kind: "invalid-email" };
  }

  const row = { email: parsed.email, source: "sample" };
  const admin = createSupabaseAdminClient();
  const writer = admin ?? (await createSupabaseServerClient());
  if (writer) {
    const { error } = await writer.from("leads").insert(row);
    if (error && error.code !== "23505") {
      return { kind: "received" };
    }
  }

  return { kind: "received" };
}
