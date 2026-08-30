import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  disposeAuthConfirm,
  establishConfirmSession,
  planAuthConfirm,
  type ConfirmSupabase,
} from "./auth-confirm.ts";

function isLoginAuthError(path: string): boolean {
  return path.includes("/login") && path.includes("error=auth");
}

describe("planAuthConfirm", () => {
  it("uses PKCE when code is present", () => {
    const plan = planAuthConfirm({
      code: "pkce-code",
      next: "/guide",
    });
    assert.deepEqual(plan, {
      kind: "pkce",
      code: "pkce-code",
      next: "/guide",
    });
  });

  it("uses verifyOtp for token_hash+type without code", () => {
    const plan = planAuthConfirm({
      tokenHash: "signup-hash",
      type: "signup",
      next: "/guide",
    });
    assert.deepEqual(plan, {
      kind: "otp",
      tokenHash: "signup-hash",
      type: "signup",
      next: "/guide",
    });
  });

  it("accepts token as an alias for token_hash", () => {
    const plan = planAuthConfirm({
      token: "magic-token",
      type: "magiclink",
    });
    assert.equal(plan.kind, "otp");
    if (plan.kind === "otp") {
      assert.equal(plan.tokenHash, "magic-token");
      assert.equal(plan.type, "magiclink");
    }
  });

  it("defaults type to email when token_hash is present alone", () => {
    const plan = planAuthConfirm({ tokenHash: "only-hash" });
    assert.deepEqual(plan, {
      kind: "otp",
      tokenHash: "only-hash",
      type: "email",
      next: "/guide",
    });
  });

  it("treats a bare confirm URL as hash-fragment, not an auth error", () => {
    const plan = planAuthConfirm({ next: "/guide" });
    assert.deepEqual(plan, { kind: "hash-fragment", next: "/guide" });
    const disposition = disposeAuthConfirm(plan, true);
    assert.deepEqual(disposition, { kind: "client-hash", next: "/guide" });
    assert.equal(disposition.kind === "client-hash", true);
  });

  it("rejects open-redirect next values", () => {
    assert.equal(planAuthConfirm({ next: "https://evil.example" }).next, "/guide");
    assert.equal(planAuthConfirm({ next: "//evil.example" }).next, "/guide");
  });
});

describe("disposeAuthConfirm", () => {
  it("does not map token_hash/type to /login?error=auth", () => {
    const plan = planAuthConfirm({
      tokenHash: "th",
      type: "signup",
      next: "/guide",
    });
    const disposition = disposeAuthConfirm(plan, true);
    assert.equal(disposition.kind, "exchange");
    if (disposition.kind === "exchange") {
      assert.equal(disposition.plan.kind, "otp");
      assert.equal(isLoginAuthError(disposition.plan.next), false);
    }
  });

  it("does not map implicit hash mails to /login?error=auth", () => {
    const disposition = disposeAuthConfirm(
      planAuthConfirm({ next: "/guide" }),
      true,
    );
    assert.equal(disposition.kind, "client-hash");
  });
});

describe("establishConfirmSession", () => {
  it("verifies token_hash OTP, links entitlements, and skips PKCE", async () => {
    const calls: string[] = [];
    const supabase: ConfirmSupabase = {
      auth: {
        async exchangeCodeForSession() {
          calls.push("exchange");
          return { error: null };
        },
        async verifyOtp(params) {
          calls.push(`otp:${params.type}:${params.token_hash}`);
          return { error: null };
        },
      },
      async rpc(name) {
        calls.push(`rpc:${name}`);
      },
    };

    const result = await establishConfirmSession(supabase, {
      kind: "otp",
      tokenHash: "signup-hash",
      type: "signup",
      next: "/guide",
    });

    assert.deepEqual(result, { ok: true });
    assert.deepEqual(calls, ["otp:signup:signup-hash", "rpc:link_my_entitlements"]);
  });

  it("exchanges a PKCE code for the returning-buyer mail", async () => {
    const calls: string[] = [];
    const supabase: ConfirmSupabase = {
      auth: {
        async exchangeCodeForSession(code) {
          calls.push(`exchange:${code}`);
          return { error: null };
        },
        async verifyOtp() {
          calls.push("otp");
          return { error: null };
        },
      },
      async rpc(name) {
        calls.push(`rpc:${name}`);
      },
    };

    const result = await establishConfirmSession(supabase, {
      kind: "pkce",
      code: "pkce-code",
      next: "/guide",
    });

    assert.deepEqual(result, { ok: true });
    assert.deepEqual(calls, ["exchange:pkce-code", "rpc:link_my_entitlements"]);
  });

  it("does not link entitlements when OTP verification fails", async () => {
    const supabase: ConfirmSupabase = {
      auth: {
        async exchangeCodeForSession() {
          return { error: null };
        },
        async verifyOtp() {
          return { error: { message: "invalid" } };
        },
      },
      async rpc() {
        throw new Error("rpc should not run");
      },
    };

    const result = await establishConfirmSession(supabase, {
      kind: "otp",
      tokenHash: "bad",
      type: "email",
      next: "/guide",
    });

    assert.deepEqual(result, { ok: false, reason: "invalid" });
  });
});
