import { NextResponse } from "next/server";
import {
  disposeAuthConfirm,
  establishConfirmSession,
  planAuthConfirm,
} from "@/lib/auth-confirm";
import { getAppEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const env = getAppEnv();
  const plan = planAuthConfirm({
    code: searchParams.get("code"),
    tokenHash: searchParams.get("token_hash"),
    token: searchParams.get("token"),
    type: searchParams.get("type"),
    next: searchParams.get("next"),
  });
  const disposition = disposeAuthConfirm(plan, env.supabase.kind === "present");

  if (disposition.kind === "not-configured") {
    return NextResponse.redirect(new URL("/login?error=not-configured", env.siteUrl));
  }

  if (disposition.kind === "client-hash") {
    const confirmUrl = new URL("/auth/confirm", env.siteUrl);
    confirmUrl.searchParams.set("next", disposition.next);
    return NextResponse.redirect(confirmUrl);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/login?error=not-configured", env.siteUrl));
  }

  const result = await establishConfirmSession(supabase, disposition.plan);
  if (!result.ok) {
    return NextResponse.redirect(new URL("/login?error=auth", env.siteUrl));
  }

  return NextResponse.redirect(new URL(disposition.plan.next, env.siteUrl));
}
