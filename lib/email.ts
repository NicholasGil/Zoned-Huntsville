export type EmailParse =
  | { kind: "ok"; email: string }
  | { kind: "invalid" };

export function parseEmail(value: unknown): EmailParse {
  if (typeof value !== "string") {
    return { kind: "invalid" };
  }

  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { kind: "invalid" };
  }

  return { kind: "ok", email };
}
