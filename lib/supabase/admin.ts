import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.ts";
import { getAppEnv } from "../env.ts";

export function createSupabaseAdminClient() {
  const env = getAppEnv();
  if (env.supabase.kind === "missing" || !env.supabase.serviceRoleKey) {
    return null;
  }

  return createClient<Database>(env.supabase.url, env.supabase.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
