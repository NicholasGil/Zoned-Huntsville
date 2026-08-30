"use server";

import { parseEmail } from "@/lib/email";

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

  return { kind: "received" };
}
