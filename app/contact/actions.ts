"use server";

import { parseEmail } from "@/lib/email";

export type ContactState =
  | { kind: "idle" }
  | { kind: "invalid-email" }
  | { kind: "missing-message" }
  | { kind: "received" };

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = parseEmail(formData.get("email"));
  if (parsed.kind === "invalid") {
    return { kind: "invalid-email" };
  }

  const message = String(formData.get("message") ?? "").trim();
  if (message.length === 0) {
    return { kind: "missing-message" };
  }

  return { kind: "received" };
}
