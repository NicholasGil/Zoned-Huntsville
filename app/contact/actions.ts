"use server";

import { parseEmail } from "@/lib/email";
import { sendContactMessage } from "@/lib/transactional-mail";

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

  const name = String(formData.get("name") ?? "").trim();
  await sendContactMessage({
    name,
    email: parsed.email,
    message,
  });

  return { kind: "received" };
}
