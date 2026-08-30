export type AuthErrorFields = {
  message: string;
  code?: string;
  status?: number;
};

const SECRETISH =
  /service[_-]?role|anon[_-]?key|secret|password|bearer\s|authorization|eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]+/i;

export class PurchaseAuthError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, options?: { code?: string; status?: number }) {
    super(message);
    this.name = "PurchaseAuthError";
    this.code = options?.code;
    this.status = options?.status;
  }
}

export function redactEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf("@");
  if (at <= 0 || at === trimmed.length - 1) {
    return "(redacted)";
  }
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const hint = local.slice(0, 1);
  return `${hint}***@${domain}`;
}

export function readAuthErrorFields(error: unknown): AuthErrorFields {
  if (error instanceof PurchaseAuthError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
    };
  }
  if (error instanceof Error) {
    const extra = error as Error & { code?: unknown; status?: unknown };
    return {
      message: extra.message,
      code: typeof extra.code === "string" ? extra.code : undefined,
      status: typeof extra.status === "number" ? extra.status : undefined,
    };
  }
  if (error && typeof error === "object") {
    const extra = error as {
      message?: unknown;
      code?: unknown;
      status?: unknown;
    };
    return {
      message:
        typeof extra.message === "string" && extra.message.trim().length > 0
          ? extra.message
          : "unknown send error",
      code: typeof extra.code === "string" ? extra.code : undefined,
      status: typeof extra.status === "number" ? extra.status : undefined,
    };
  }
  return { message: "unknown send error" };
}

export function toPublicAuthError(error: {
  message?: string;
  code?: string;
  status?: number;
}): AuthErrorFields {
  const raw = (error.message ?? "").replace(/\s+/g, " ").trim();
  const message =
    raw.length === 0 || SECRETISH.test(raw) ? "" : raw.slice(0, 180);
  const code =
    error.code && /^[a-z0-9_:-]{1,80}$/i.test(error.code)
      ? error.code
      : undefined;
  const status =
    typeof error.status === "number" && error.status >= 400 && error.status < 600
      ? error.status
      : undefined;
  return { message, code, status };
}

export function formatLoginSendFailedCopy(detail: AuthErrorFields): string {
  if (detail.message.length > 0) {
    const code = detail.code ? ` (${detail.code})` : "";
    return `Supabase did not send the link. ${detail.message}${code}`;
  }
  return "Supabase did not send the link. Check the project auth settings.";
}

export function loginSendFailedPath(error: {
  message?: string;
  code?: string;
  status?: number;
}): string {
  const detail = toPublicAuthError(error);
  const params = new URLSearchParams();
  params.set("error", "send-failed");
  if (detail.message) {
    params.set("auth_message", detail.message);
  }
  if (detail.code) {
    params.set("auth_code", detail.code);
  }
  if (detail.status != null) {
    params.set("auth_status", String(detail.status));
  }
  return `/login?${params.toString()}`;
}

export function logAuthSendError(
  event: string,
  extra: Record<string, unknown>,
  error: unknown,
): void {
  const fields = readAuthErrorFields(error);
  console.error({
    event,
    ...extra,
    message: fields.message,
    code: fields.code ?? null,
    status: fields.status ?? null,
  });
}
