"use server";

import { redirect } from "next/navigation";
import { loginSendFailedPath, logAuthSendError, redactEmail } from "@/lib/auth-error";
import { parseEmail } from "@/lib/email";
import { getAppEnv } from "@/lib/env";
import {
  guideUnlockErrorHref,
  readGuideUnlockReturnTo,
  unlockGuideByPurchaseEmail,
  type GuideUnlockAdmin,
} from "@/lib/guide-unlock";
import { authConfirmRedirectTo } from "@/lib/purchase-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function unlockGuideWithEmail(formData: FormData) {
  const returnTo = readGuideUnlockReturnTo(formData.get("return_to"));
  const parsed = parseEmail(formData.get("email"));
  if (parsed.kind === "invalid") {
    redirect(guideUnlockErrorHref(returnTo, "invalid-email"));
  }

  const env = getAppEnv();
  if (env.supabase.kind === "missing") {
    redirect(guideUnlockErrorHref(returnTo, "not-configured"));
  }

  const admin = createSupabaseAdminClient();
  const supabase = await createSupabaseServerClient();
  if (!admin || !supabase) {
    redirect(guideUnlockErrorHref(returnTo, "not-configured"));
  }

  let outcome;
  try {
    outcome = await unlockGuideByPurchaseEmail(
      admin as unknown as GuideUnlockAdmin,
      supabase,
      parsed.email,
    );
  } catch (error) {
    logAuthSendError(
      "guide.unlock.lookup_failed",
      { email: redactEmail(parsed.email) },
      error,
    );
    redirect(guideUnlockErrorHref(returnTo, "unlock-failed"));
  }

  if (outcome.kind === "signed-in") {
    redirect("/guide");
  }
  if (outcome.kind === "no-entitlement") {
    redirect(guideUnlockErrorHref(returnTo, "no-purchase"));
  }
  if (outcome.kind === "auth-user-failed" || outcome.kind === "sign-in-failed") {
    const reason =
      outcome.kind === "sign-in-failed" ? outcome.reason : "auth-user";
    logAuthSendError(
      "guide.unlock.sign_in_failed",
      { email: redactEmail(parsed.email), reason },
      new Error(reason),
    );
    redirect(guideUnlockErrorHref(returnTo, "unlock-failed"));
  }

  redirect(guideUnlockErrorHref(returnTo, "unlock-failed"));
}

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
