"use server";

import { redirect } from "next/navigation";
import { parseEmail } from "@/lib/email";
import { getAppEnv } from "@/lib/env";
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
      emailRedirectTo: `${env.siteUrl}/auth/confirm`,
    },
  });

  if (error) {
    redirect("/login?error=send-failed");
  }

  redirect("/login?status=sent");
}
