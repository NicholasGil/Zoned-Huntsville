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
      getUserByEmail?: (email: string) => Promise<{
        data: { user: PurchaseAuthUser | null };
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
 * defaults `next` to `/guide`, so purchase, login, and account share this URL.
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

  const found = await findAuthUserByEmail(admin, email);
  if (!found) {
    throw new PurchaseAuthError(
      created.error?.message ??
        "Could not create or load the Auth user for this purchase email.",
      { code: created.error?.code },
    );
  }
  const user = found;

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

/**
 * Prefer Admin `getUserByEmail` so lookup does not depend on the first
 * page of `listUsers`. Paginate only when that method is missing or errors.
 */
export async function findAuthUserByEmail(
  admin: PurchaseAuthAdmin,
  email: string,
): Promise<PurchaseAuthUser | null> {
  const normalized = email.toLowerCase();

  if (admin.auth.admin.getUserByEmail) {
    const byEmail = await admin.auth.admin.getUserByEmail(email);
    if (byEmail.data.user) {
      return byEmail.data.user;
    }
    if (!byEmail.error) {
      return null;
    }
  }

  let page = 1;
  for (;;) {
    const listed = await admin.auth.admin.listUsers({ page, perPage: 200 });
    const users = listed.data.users ?? [];
    const user = users.find(
      (candidate) => (candidate.email ?? "").toLowerCase() === normalized,
    );
    if (user) {
      return user;
    }
    if (users.length < 200 || listed.error) {
      return null;
    }
    page += 1;
    if (page > 20) {
      return null;
    }
  }
}
