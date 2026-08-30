"use client";

import { useEffect, useState } from "react";
import { AuthConfirmStatus } from "@/components/auth-confirm-status";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function readHashParams(): URLSearchParams {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  const raw = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  return new URLSearchParams(raw);
}

export function AuthHashConfirm({ next }: { next: string }) {
  const [message, setMessage] = useState("Opening your guide…");

  useEffect(() => {
    let cancelled = false;

    async function finish(): Promise<void> {
      const hash = readHashParams();
      if (hash.get("error")) {
        window.location.replace("/login?error=auth");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        window.location.replace("/login?error=not-configured");
        return;
      }

      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          if (!cancelled) {
            window.location.replace("/login?error=auth");
          }
          return;
        }
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          if (!cancelled) {
            window.location.replace("/login?error=auth");
          }
          return;
        }
      }

      await supabase.rpc("link_my_entitlements");
      if (!cancelled) {
        window.location.replace(next);
      }
    }

    void finish().catch(() => {
      if (!cancelled) {
        setMessage("The sign-in link could not create a session.");
        window.location.replace("/login?error=auth");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [next]);

  return <AuthConfirmStatus>{message}</AuthConfirmStatus>;
}
