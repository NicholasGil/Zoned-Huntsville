import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAppEnv } from "@/lib/env";

export async function createSupabaseServerClient() {
  const env = getAppEnv();
  if (env.supabase.kind === "missing") {
    return null;
  }

  const cookieStore = await cookies();
  const { url, anonKey } = env.supabase;

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll is also called from Server Components, where cookies are read-only.
        }
      },
    },
  });
}
