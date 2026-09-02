import { NextResponse } from "next/server";
import {
  disposeAuthConfirm,
  establishConfirmSession,
  planAuthConfirm,
  resolveConfirmNext,
} from "@/lib/auth-confirm";
import { consumeStoredAuthNext, peekStoredAuthNext } from "@/lib/auth-next-cookie";
import { getAppEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const env = getAppEnv();
  const storedNext = await peekStoredAuthNext();
  const plan = planAuthConfirm({
    code: searchParams.get("code"),
    tokenHash: searchParams.get("token_hash"),
    token: searchParams.get("token"),
    type: searchParams.get("type"),
    next: resolveConfirmNext(searchParams.get("next"), storedNext),
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

  await consumeStoredAuthNext();
  return NextResponse.redirect(new URL(disposition.plan.next, env.siteUrl));
}
