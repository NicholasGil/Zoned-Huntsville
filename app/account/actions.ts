"use server";

import { redirect } from "next/navigation";
import { consumeStoredAuthNext } from "@/lib/auth-next-cookie";
import { parseEmail } from "@/lib/email";
import { getAppEnv } from "@/lib/env";
import { authConfirmRedirectTo } from "@/lib/purchase-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requestPurchaseEmailLink(formData: FormData) {
  const parsed = parseEmail(formData.get("email"));
  if (parsed.kind === "invalid") {
    redirect("/account?error=invalid-email");
  }

  const env = getAppEnv();
  if (env.supabase.kind === "missing") {
    redirect("/account?error=not-configured");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/account?error=not-configured");
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.email,
    options: {
      emailRedirectTo: authConfirmRedirectTo(env.siteUrl),
    },
  });

  if (error) {
    redirect("/account?error=send-failed");
  }

  // The link must land in /guide (the /auth/confirm default), so clear any
  // older stored destination instead of pointing the buyer back here.
  await consumeStoredAuthNext();
  redirect("/account?status=link-sent");
}
