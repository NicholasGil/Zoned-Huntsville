export const EMAIL_OTP_TYPES = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
] as const;

export type EmailOtpType = (typeof EMAIL_OTP_TYPES)[number];

export type AuthConfirmPlan =
  | { kind: "pkce"; code: string; next: string }
  | { kind: "otp"; tokenHash: string; type: EmailOtpType; next: string }
  | { kind: "hash-fragment"; next: string };

export type ConfirmSupabase = {
  auth: {
    exchangeCodeForSession: (
      code: string,
    ) => PromiseLike<{ error: { message: string } | null }>;
    verifyOtp: (params: {
      type: EmailOtpType;
      token_hash: string;
    }) => PromiseLike<{ error: { message: string } | null }>;
  };
  rpc: (name: "link_my_entitlements") => unknown;
};

function emptyToNull(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/guide";
  }
  return value;
}

export function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value !== null && (EMAIL_OTP_TYPES as readonly string[]).includes(value);
}

/**
 * Decide how /auth/confirm should establish a session.
 *
 * Purchase magic links are sent from the Stripe webhook (no browser PKCE
 * cookie). Those mails use token_hash+type or implicit hash tokens. A missing
 * `code` is therefore a valid first-mail shape, not an auth error.
 */
export function planAuthConfirm(input: {
  code?: string | null;
  tokenHash?: string | null;
  token?: string | null;
  type?: string | null;
  next?: string | null;
}): AuthConfirmPlan {
  const next = safeNextPath(input.next ?? null);
  const code = emptyToNull(input.code);
  if (code) {
    return { kind: "pkce", code, next };
  }

  const tokenHash = emptyToNull(input.tokenHash) ?? emptyToNull(input.token);
  if (tokenHash) {
    const rawType = emptyToNull(input.type);
    const type = isEmailOtpType(rawType) ? rawType : "email";
    return { kind: "otp", tokenHash, type, next };
  }

  return { kind: "hash-fragment", next };
}

export type ConfirmRouteDisposition =
  | { kind: "not-configured" }
  | { kind: "client-hash"; next: string }
  | {
      kind: "exchange";
      plan: Extract<AuthConfirmPlan, { kind: "pkce" | "otp" }>;
    };

/**
 * First-mail links without `code` are not an auth error. token_hash is
 * verified on the server; implicit hash tokens stay on /auth/confirm so
 * a client page can read the fragment.
 */
export function disposeAuthConfirm(
  plan: AuthConfirmPlan,
  supabaseConfigured: boolean,
): ConfirmRouteDisposition {
  if (!supabaseConfigured) {
    return { kind: "not-configured" };
  }
  if (plan.kind === "hash-fragment") {
    return { kind: "client-hash", next: plan.next };
  }
  return { kind: "exchange", plan };
}

export async function establishConfirmSession(
  supabase: ConfirmSupabase,
  plan: Extract<AuthConfirmPlan, { kind: "pkce" | "otp" }>,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (plan.kind === "pkce") {
    const { error } = await supabase.auth.exchangeCodeForSession(plan.code);
    if (error) {
      return { ok: false, reason: error.message };
    }
  } else {
    const { error } = await supabase.auth.verifyOtp({
      type: plan.type,
      token_hash: plan.tokenHash,
    });
    if (error) {
      return { ok: false, reason: error.message };
    }
  }

  await supabase.rpc("link_my_entitlements");
  return { ok: true };
}
