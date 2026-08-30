export type PurchaseAuthUser = {
  id: string;
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
      generateLink: (params: {
        type: "magiclink";
        email: string;
      }) => Promise<{
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
    }) => Promise<{ error: { message: string } | null }>;
  };
};

export function purchaseMagicLinkRedirectTo(siteUrl: string): string {
  const origin = siteUrl.replace(/\/+$/, "");
  return `${origin}/auth/confirm?next=/guide`;
}

/**
 * Create the Auth user if needed and mark the address confirmed so
 * "Confirm email" does not send a signup mail. Then send exactly one
 * magic/sign-in link via Supabase Auth (works when Resend is unset).
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
    throw new Error(error.message);
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

  const existing = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  const user = existing.data.user;
  if (!user) {
    throw new Error(
      created.error?.message ??
        existing.error?.message ??
        "Could not create or load the Auth user for this purchase email.",
    );
  }

  if (!user.email_confirmed_at) {
    const updated = await admin.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    });
    if (updated.error || !updated.data.user) {
      throw new Error(
        updated.error?.message ?? "Could not confirm the Auth user.",
      );
    }
    return updated.data.user.id;
  }

  return user.id;
}
