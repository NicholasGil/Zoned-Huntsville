import "server-only";

import { cookies } from "next/headers";
import { safeNextPath } from "@/lib/auth-confirm";

export const AUTH_NEXT_COOKIE = "zh_auth_next";

const AUTH_NEXT_MAX_AGE_SECONDS = 60 * 60;

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: AUTH_NEXT_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function setStoredAuthNext(path: string): Promise<void> {
  const next = safeNextPath(path);
  const store = await cookies();
  store.set(AUTH_NEXT_COOKIE, next, cookieOptions());
}

export async function peekStoredAuthNext(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(AUTH_NEXT_COOKIE)?.value;
  if (!value) {
    return null;
  }
  return safeNextPath(value);
}

export async function consumeStoredAuthNext(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(AUTH_NEXT_COOKIE)?.value ?? null;
  store.delete(AUTH_NEXT_COOKIE);
  if (!value) {
    return null;
  }
  return safeNextPath(value);
}
