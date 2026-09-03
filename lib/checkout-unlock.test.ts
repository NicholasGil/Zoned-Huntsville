import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { mapCheckoutSession, unavailableReceipt } from "./checkout-receipt.ts";
import {
  isCheckoutUnlockFresh,
  planCheckoutAccess,
  sameEmail,
  signInBrowserAsCheckoutEmail,
  successHref,
  UNLOCK_MAX_AGE_SECONDS,
  unlockHref,
  unlockMarkerId,
  type UnlockAuthAdmin,
  type UnlockSessionClient,
} from "./checkout-unlock.ts";

const unlockRouteSource = readFileSync(
  new URL("../app/checkout/success/unlock/route.ts", import.meta.url),
  "utf8",
);
const successPageSource = readFileSync(
  new URL("../app/checkout/success/page.tsx", import.meta.url),
  "utf8",
);
const accountActionSource = readFileSync(
  new URL("../app/account/actions.ts", import.meta.url),
  "utf8",
);

const paidGuide = mapCheckoutSession({
  payment_status: "paid",
  amount_total: 7900,
  currency: "usd",
  customer_details: { email: "Buyer@Example.com" },
  metadata: { tier: "79" },
});

describe("planCheckoutAccess", () => {
  it("is ready when this browser is already signed in as the checkout email", () => {
    const access = planCheckoutAccess({
      receipt: paidGuide,
      sessionId: "cs_test_1",
      signedInEmail: "buyer@example.com",
      unlockParam: null,
    });
    assert.deepEqual(access, { kind: "ready", email: "Buyer@Example.com" });
  });

  it("sends a signed-out return browser through unlock, not to email", () => {
    const access = planCheckoutAccess({
      receipt: paidGuide,
      sessionId: "cs_test_1",
      signedInEmail: null,
      unlockParam: null,
    });
    assert.deepEqual(access, {
      kind: "unlock",
      href: "/checkout/success/unlock?session_id=cs_test_1",
    });
  });

  it("re-signs in when a different account is signed in", () => {
    const access = planCheckoutAccess({
      receipt: paidGuide,
      sessionId: "cs_test_1",
      signedInEmail: "someone-else@example.com",
      unlockParam: null,
    });
    assert.equal(access.kind, "unlock");
  });

  it("never loops: after an unlock attempt it falls back to sign-in", () => {
    for (const unlockParam of ["ok", "failed"]) {
      const access = planCheckoutAccess({
        receipt: paidGuide,
        sessionId: "cs_test_1",
        signedInEmail: null,
        unlockParam,
      });
      assert.deepEqual(access, { kind: "needs-sign-in" });
    }
  });

  it("falls back to sign-in when checkout returned no email", () => {
    const receipt = mapCheckoutSession({
      payment_status: "paid",
      amount_total: 7900,
      currency: "usd",
      metadata: { tier: "79" },
    });
    const access = planCheckoutAccess({
      receipt,
      sessionId: "cs_test_1",
      signedInEmail: null,
      unlockParam: null,
    });
    assert.deepEqual(access, { kind: "needs-sign-in" });
  });

  it("does nothing for an unpaid or missing session", () => {
    for (const receipt of [
      unavailableReceipt("not-paid"),
      unavailableReceipt("missing-session"),
      unavailableReceipt("retrieve-failed"),
    ]) {
      const access = planCheckoutAccess({
        receipt,
        sessionId: "cs_test_1",
        signedInEmail: null,
        unlockParam: null,
      });
      assert.deepEqual(access, { kind: "none" });
    }
  });
});

describe("unlock helpers", () => {
  it("compares emails case-insensitively and never matches empty", () => {
    assert.equal(sameEmail("A@b.com", " a@B.COM "), true);
    assert.equal(sameEmail(null, "a@b.com"), false);
    assert.equal(sameEmail("a@b.com", ""), false);
  });

  it("builds encoded redirect targets", () => {
    assert.equal(unlockHref("cs_test_a b"), "/checkout/success/unlock?session_id=cs_test_a+b");
    assert.equal(successHref("cs_1", "ok"), "/checkout/success?session_id=cs_1&unlock=ok");
    assert.equal(successHref("cs_1", "failed"), "/checkout/success?session_id=cs_1&unlock=failed");
  });

  it("only unlocks from a paid session created within the window", () => {
    const now = 1_800_000_000;
    assert.equal(isCheckoutUnlockFresh({ created: now - 60, payment_status: "paid" }, now), true);
    assert.equal(
      isCheckoutUnlockFresh({ created: now - UNLOCK_MAX_AGE_SECONDS - 1, payment_status: "paid" }, now),
      false,
    );
    assert.equal(isCheckoutUnlockFresh({ created: now - 60, payment_status: "unpaid" }, now), false);
    assert.equal(isCheckoutUnlockFresh({ payment_status: "paid" }, now), false);
  });
});

describe("signInBrowserAsCheckoutEmail", () => {
  function mocks(options: {
    generateError?: boolean;
    magiclinkError?: boolean;
    emailError?: boolean;
  }) {
    const calls: string[] = [];
    const admin: UnlockAuthAdmin = {
      auth: {
        admin: {
          async generateLink(params) {
            calls.push(`generateLink:${params.type}:${params.email}`);
            if (options.generateError) {
              return { data: { properties: null }, error: { message: "nope" } };
            }
            return { data: { properties: { hashed_token: "hash-1" } }, error: null };
          },
        },
      },
    };
    const supabase: UnlockSessionClient = {
      auth: {
        async verifyOtp(params) {
          calls.push(`verifyOtp:${params.type}:${params.token_hash}`);
          if (params.type === "magiclink" && options.magiclinkError) {
            return { error: { message: "bad type" } };
          }
          if (params.type === "email" && options.emailError) {
            return { error: { message: "bad hash" } };
          }
          return { error: null };
        },
      },
      rpc(name) {
        calls.push(`rpc:${name}`);
        return Promise.resolve();
      },
    };
    return { admin, supabase, calls };
  }

  it("mints a token hash and consumes it in the browser session without mail", async () => {
    const { admin, supabase, calls } = mocks({});
    const outcome = await signInBrowserAsCheckoutEmail(admin, supabase, "buyer@example.com");
    assert.deepEqual(outcome, { kind: "signed-in" });
    assert.deepEqual(calls, [
      "generateLink:magiclink:buyer@example.com",
      "verifyOtp:magiclink:hash-1",
      "rpc:link_my_entitlements",
    ]);
  });

  it("retries with the generic email type before giving up", async () => {
    const { admin, supabase, calls } = mocks({ magiclinkError: true });
    const outcome = await signInBrowserAsCheckoutEmail(admin, supabase, "buyer@example.com");
    assert.deepEqual(outcome, { kind: "signed-in" });
    assert.ok(calls.includes("verifyOtp:email:hash-1"));
  });

  it("reports failures instead of throwing", async () => {
    const a = mocks({ generateError: true });
    assert.deepEqual(
      await signInBrowserAsCheckoutEmail(a.admin, a.supabase, "b@example.com"),
      { kind: "failed", reason: "generate-link" },
    );
    const b = mocks({ magiclinkError: true, emailError: true });
    assert.deepEqual(
      await signInBrowserAsCheckoutEmail(b.admin, b.supabase, "b@example.com"),
      { kind: "failed", reason: "verify" },
    );
    assert.equal(b.calls.includes("rpc:link_my_entitlements"), false);
  });
});

describe("post-pay path wiring", () => {
  it("unlock route never sends mail and reuses the webhook entitlement write", () => {
    assert.doesNotMatch(unlockRouteSource, /signInWithOtp|sendPurchaseMagicLink|sendConfirmedPurchaseMagicLink|resend/i);
    assert.match(unlockRouteSource, /applyPaidCheckoutSession\(admin, session\)/);
    assert.match(unlockRouteSource, /isCheckoutUnlockFresh\(session\)/);
    assert.match(unlockRouteSource, /signInBrowserAsCheckoutEmail\(/);
  });

  it("unlock is one-shot per Checkout Session", () => {
    assert.equal(unlockMarkerId("cs_1"), "checkout-unlock:cs_1");
    assert.match(unlockRouteSource, /reason: "already-used"/);
    const check = unlockRouteSource.indexOf('.eq("event_id", marker)');
    const signIn = unlockRouteSource.indexOf("signInBrowserAsCheckoutEmail(admin, supabase, email)");
    const mark = unlockRouteSource.indexOf('.insert({ event_id: marker })');
    assert.ok(check >= 0 && check < signIn && signIn < mark);
  });

  it("success page redirects through unlock instead of asking for email", () => {
    assert.match(successPageSource, /planCheckoutAccess\(/);
    assert.match(successPageSource, /redirect\(access\.href\)/);
  });

  it("account sign-in links land in /guide, not back on /account", () => {
    assert.doesNotMatch(accountActionSource, /setStoredAuthNext/);
  });
});
