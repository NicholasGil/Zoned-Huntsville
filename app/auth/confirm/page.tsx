import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthHashConfirm } from "@/components/auth-hash-confirm";
import {
  disposeAuthConfirm,
  planAuthConfirm,
  resolveConfirmNext,
} from "@/lib/auth-confirm";
import { peekStoredAuthNext } from "@/lib/auth-next-cookie";
import { getAppEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Opening your guide",
  robots: { index: false, follow: false },
};

function firstQueryValue(value: string | string[] | undefined): string | null {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }
  return null;
}

export default async function AuthConfirmPage({
  searchParams,
}: PageProps<"/auth/confirm">) {
  const query = await searchParams;
  const env = getAppEnv();
  const storedNext = await peekStoredAuthNext();
  const plan = planAuthConfirm({
    code: firstQueryValue(query.code),
    tokenHash: firstQueryValue(query.token_hash),
    token: firstQueryValue(query.token),
    type: firstQueryValue(query.type),
    next: resolveConfirmNext(firstQueryValue(query.next), storedNext),
  });
  const disposition = disposeAuthConfirm(plan, env.supabase.kind === "present");

  if (disposition.kind === "not-configured") {
    redirect("/login?error=not-configured");
  }

  if (disposition.kind === "client-hash") {
    return <AuthHashConfirm next={disposition.next} />;
  }

  const exchange = new URL("/auth/confirm/exchange", env.siteUrl);
  if (disposition.plan.kind === "pkce") {
    exchange.searchParams.set("code", disposition.plan.code);
  } else {
    exchange.searchParams.set("token_hash", disposition.plan.tokenHash);
    exchange.searchParams.set("type", disposition.plan.type);
  }
  exchange.searchParams.set("next", disposition.plan.next);
  redirect(`${exchange.pathname}${exchange.search}`);
}
