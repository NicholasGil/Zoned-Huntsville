import { PurchaseAuthError } from "./auth-error.ts";

export type PurchaseAuthUser = {
  id: string;
  email?: string | null;
  email_confirmed_at?: string | null;
};

export type PurchaseAuthAdmin = {
  auth: {
    admin: {
      createUser: (attributes: {
        email: string;
        email_confirm: boolean;
      }) => Promise<{
        data: { user: PurchaseAuthUser | null };
        error: { message: string; code?: string } | null;
      }>;
      updateUserById: (
        id: string,
        attributes: { email_confirm: boolean },
      ) => Promise<{
        data: { user: PurchaseAuthUser | null };
        error: { message: string } | null;
      }>;
      listUsers: (params?: { page?: number; perPage?: number }) => Promise<{
        data: { users: PurchaseAuthUser[] };
        error: { message: string } | null;
      }>;
    };
    signInWithOtp: (params: {
      email: string;
      options: {
        shouldCreateUser: boolean;
        emailRedirectTo: string;
      };
    }) => Promise<{
      error: { message: string; code?: string; status?: number } | null;
    }>;
  };
};

/**
 * Magic-link redirect that matches the Auth allowlist path.
 *
 * GoTrue accepts any path on the project Site URL host. When Site URL is a
 * different host, allowlist entries are exact (query string included). The
 * project allowlist has `/auth/confirm` with no query. `/auth/confirm` already
 * defaults `next` to `/guide`, so purchase and login share this URL.
 */
export function authConfirmRedirectTo(siteUrl: string): string {
  const origin = siteUrl.replace(/\/+$/, "");
  return `${origin}/auth/confirm`;
}

export function purchaseMagicLinkRedirectTo(siteUrl: string): string {
  return authConfirmRedirectTo(siteUrl);
}

/**
 * Create the Auth user if needed and mark the address confirmed so
 * "Confirm email" does not send a signup mail. Then send exactly one
 * magic/sign-in link via Supabase Auth `signInWithOtp` (this is what
 * actually triggers built-in Auth mail; generateLink does not send).
 */
export async function sendConfirmedPurchaseMagicLink(
  admin: PurchaseAuthAdmin,
  siteUrl: string,
  email: string,
): Promise<void> {
  await ensureConfirmedAuthUser(admin, email);

  const { error } = await admin.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: purchaseMagicLinkRedirectTo(siteUrl),
    },
  });

  if (error) {
    throw new PurchaseAuthError(error.message, {
      code: error.code,
      status: error.status,
    });
  }
}

export async function ensureConfirmedAuthUser(
  admin: PurchaseAuthAdmin,
  email: string,
): Promise<string> {
  const created = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (created.data.user) {
    return created.data.user.id;
  }

  const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const normalized = email.toLowerCase();
  const user = (listed.data.users ?? []).find(
    (candidate) => (candidate.email ?? "").toLowerCase() === normalized,
  );
  if (!user) {
    throw new PurchaseAuthError(
      created.error?.message ??
        listed.error?.message ??
        "Could not create or load the Auth user for this purchase email.",
      { code: created.error?.code },
    );
  }

  if (!user.email_confirmed_at) {
    const updated = await admin.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    });
    if (updated.error || !updated.data.user) {
      throw new PurchaseAuthError(
        updated.error?.message ?? "Could not confirm the Auth user.",
      );
    }
    return updated.data.user.id;
  }

  return user.id;
}
