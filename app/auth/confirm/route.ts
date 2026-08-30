import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAppEnv } from "@/lib/env";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/guide";
  }
  return value;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const env = getAppEnv();
  const next = safeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");

  if (env.supabase.kind === "missing") {
    return NextResponse.redirect(new URL("/login?error=not-configured", env.siteUrl));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth", env.siteUrl));
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(new URL("/login?error=not-configured", env.siteUrl));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth", env.siteUrl));
  }

  return NextResponse.redirect(new URL(next, env.siteUrl));
}
