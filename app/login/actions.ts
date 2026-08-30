"use server";

import { redirect } from "next/navigation";
import { loginSendFailedPath, logAuthSendError, redactEmail } from "@/lib/auth-error";
import { parseEmail } from "@/lib/email";
import { getAppEnv } from "@/lib/env";
import { authConfirmRedirectTo } from "@/lib/purchase-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requestMagicLink(formData: FormData) {
  const parsed = parseEmail(formData.get("email"));
  if (parsed.kind === "invalid") {
    redirect("/login?error=invalid-email");
  }

  const env = getAppEnv();
  if (env.supabase.kind === "missing") {
    redirect("/login?error=not-configured");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/login?error=not-configured");
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.email,
    options: {
      emailRedirectTo: authConfirmRedirectTo(env.siteUrl),
    },
  });

  if (error) {
    logAuthSendError(
      "auth.magic_link_failed",
      { source: "login", email: redactEmail(parsed.email) },
      error,
    );
    redirect(loginSendFailedPath(error));
  }

  redirect("/login?status=sent");
}
