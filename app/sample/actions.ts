"use server";

import { parseEmail } from "@/lib/email";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendSampleProfileEmail } from "@/lib/transactional-mail";

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
    await writer.from("leads").insert(row);
  }

  await sendSampleProfileEmail(parsed.email);
  return { kind: "received" };
}
