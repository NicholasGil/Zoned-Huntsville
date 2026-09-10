import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  hasActiveEntitlementForEmail,
  unlockGuideByPurchaseEmail,
  type GuideUnlockAdmin,
} from "./guide-unlock.ts";
import type { UnlockSessionClient } from "./checkout-unlock.ts";

function createEntitlementAdmin(rows: { email: string; refunded_at: string | null }[]) {
  return {
    from(table: string) {
      assert.equal(table, "entitlements");
      return {
        select() {
          return {
            is(_col: string, val: null) {
              return {
                eq(_col2: string, email: string) {
                  return {
                    async limit(n: number) {
                      const matches = rows.filter(
                        (row) =>
                          row.refunded_at === null &&
                          row.email.toLowerCase() === email.toLowerCase(),
                      );
                      return {
                        data: matches.slice(0, n).map((_, i) => ({ id: `ent-${i}` })),
                        error: null,
                      };
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
    auth: {
      admin: {
        createUser: async () => ({
          data: { user: { id: "user-1", email_confirmed_at: new Date().toISOString() } },
          error: null,
        }),
        updateUserById: async () => ({ data: { user: { id: "user-1" } }, error: null }),
        listUsers: async () => ({ data: { users: [] }, error: null }),
        generateLink: async () => ({
          data: { properties: { hashed_token: "hash-1" } },
          error: null,
        }),
      },
    },
  } satisfies GuideUnlockAdmin;
}

function createSupabaseClient(calls: string[]): UnlockSessionClient {
  return {
    auth: {
      verifyOtp: async () => {
        calls.push("verifyOtp");
        return { error: null };
      },
    },
    rpc: (name) => {
      calls.push(`rpc:${name}`);
    },
  };
}

describe("hasActiveEntitlementForEmail", () => {
  it("matches checkout email case-insensitively and ignores refunds", async () => {
    const admin = createEntitlementAdmin([
      { email: "buyer@example.com", refunded_at: null },
      { email: "buyer@example.com", refunded_at: new Date().toISOString() },
      { email: "other@example.com", refunded_at: null },
    ]);
    assert.equal(await hasActiveEntitlementForEmail(admin, "Buyer@Example.com"), true);
    assert.equal(await hasActiveEntitlementForEmail(admin, "nobody@example.com"), false);
  });
});

describe("unlockGuideByPurchaseEmail", () => {
  it("returns no-entitlement when nothing active matches", async () => {
    const admin = createEntitlementAdmin([]);
    const calls: string[] = [];
    const outcome = await unlockGuideByPurchaseEmail(
      admin,
      createSupabaseClient(calls),
      "buyer@example.com",
    );
    assert.deepEqual(outcome, { kind: "no-entitlement" });
    assert.deepEqual(calls, []);
  });

  it("signs in and links entitlements when a purchase exists", async () => {
    const admin = createEntitlementAdmin([
      { email: "buyer@example.com", refunded_at: null },
    ]);
    const calls: string[] = [];
    const outcome = await unlockGuideByPurchaseEmail(
      admin,
      createSupabaseClient(calls),
      "buyer@example.com",
    );
    assert.deepEqual(outcome, { kind: "signed-in" });
    assert.deepEqual(calls, ["verifyOtp", "rpc:link_my_entitlements"]);
  });
});

describe("login wiring", () => {
  const loginPageSource = readFileSync(
    new URL("../app/login/page.tsx", import.meta.url),
    "utf8",
  );
  const loginActionsSource = readFileSync(
    new URL("../app/login/actions.ts", import.meta.url),
    "utf8",
  );
  const gateSource = readFileSync(
    new URL("../components/gate.tsx", import.meta.url),
    "utf8",
  );
  const headerSource = readFileSync(
    new URL("../components/site-header.tsx", import.meta.url),
    "utf8",
  );

  it("uses email unlock as the primary login path", () => {
    assert.match(loginPageSource, /unlockGuideWithEmail/);
    assert.match(loginPageSource, /GuideUnlockForm/);
    assert.match(loginActionsSource, /unlockGuideByPurchaseEmail/);
    assert.doesNotMatch(gateSource, /Request a magic link/);
    assert.match(gateSource, /Unlock with checkout email/);
    assert.match(headerSource, /href: "\/guide"/);
  });
});
