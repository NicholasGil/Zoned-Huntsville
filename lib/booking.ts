function readOptional(name: string): string | null {
  const value = process.env[name];
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Public Calendly (or other) link for self-serve booking when configured. */
export function getExpertCallBookingUrl(): string | null {
  return readOptional("NEXT_PUBLIC_CALENDLY_URL");
}

export function expertCallScheduleEmailCopy(email: string | null): string {
  if (email) {
    return `We will email you at ${email} to schedule your 45-minute call with an expert.`;
  }
  return "We will email you at your purchase email to schedule your 45-minute call with an expert.";
}
