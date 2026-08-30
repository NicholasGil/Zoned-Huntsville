import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ensureConfirmedAuthUser,
  purchaseMagicLinkRedirectTo,
  sendConfirmedPurchaseMagicLink,
  type PurchaseAuthAdmin,
  type PurchaseAuthUser,
} from "./purchase-auth.ts";

function createAdminMock(options: {
  existing?: PurchaseAuthUser | null;
  createError?: { message: string; code?: string };
  updateError?: { message: string };
  otpError?: { message: string };
}): {
  admin: PurchaseAuthAdmin;
  calls: string[];
} {
  const calls: string[] = [];
  const admin: PurchaseAuthAdmin = {
    auth: {
      admin: {
        async createUser(attributes) {
          calls.push(
            `createUser:${attributes.email}:confirm=${attributes.email_confirm}`,
          );
          if (options.existing) {
            return {
              data: { user: null },
              error: options.createError ?? {
                message: "already registered",
                code: "email_exists",
              },
            };
          }
          return {
            data: {
              user: { id: "new-user", email_confirmed_at: "2026-08-30T00:00:00Z" },
            },
            error: null,
          };
        },
        async updateUserById(id, attributes) {
          calls.push(`updateUserById:${id}:confirm=${attributes.email_confirm}`);
          if (options.updateError) {
            return { data: { user: null }, error: options.updateError };
          }
          return {
            data: { user: { id, email_confirmed_at: "2026-08-30T00:00:00Z" } },
            error: null,
          };
        },
        async generateLink(params) {
          calls.push(`generateLink:${params.type}:${params.email}`);
          return {
            data: { user: options.existing ?? null },
            error: options.existing ? null : { message: "missing user" },
          };
        },
      },
      async signInWithOtp(params) {
        calls.push(
          `signInWithOtp:${params.email}:create=${params.options.shouldCreateUser}:${params.options.emailRedirectTo}`,
        );
        return { error: options.otpError ?? null };
      },
    },
  };
  return { admin, calls };
}

describe("purchaseMagicLinkRedirectTo", () => {
  it("includes next=/guide and strips a trailing slash", () => {
    assert.equal(
      purchaseMagicLinkRedirectTo("https://huntsvilleschoolguide.vercel.app/"),
      "https://huntsvilleschoolguide.vercel.app/auth/confirm?next=/guide",
    );
  });
});

describe("ensureConfirmedAuthUser", () => {
  it("creates a pre-confirmed user so signup mail is not sent", async () => {
    const { admin, calls } = createAdminMock({});
    const id = await ensureConfirmedAuthUser(admin, "buyer@example.com");
    assert.equal(id, "new-user");
    assert.deepEqual(calls, ["createUser:buyer@example.com:confirm=true"]);
  });

  it("confirms an existing unconfirmed user instead of sending signup mail", async () => {
    const { admin, calls } = createAdminMock({
      existing: { id: "old-user", email_confirmed_at: null },
    });
    const id = await ensureConfirmedAuthUser(admin, "buyer@example.com");
    assert.equal(id, "old-user");
    assert.deepEqual(calls, [
      "createUser:buyer@example.com:confirm=true",
      "generateLink:magiclink:buyer@example.com",
      "updateUserById:old-user:confirm=true",
    ]);
  });
});

describe("sendConfirmedPurchaseMagicLink", () => {
  it("sends exactly one magic link after confirming the user", async () => {
    const { admin, calls } = createAdminMock({});
    await sendConfirmedPurchaseMagicLink(
      admin,
      "https://huntsvilleschoolguide.vercel.app",
      "buyer@example.com",
    );

    const otpCalls = calls.filter((call) => call.startsWith("signInWithOtp:"));
    assert.equal(otpCalls.length, 1);
    assert.equal(
      otpCalls[0],
      "signInWithOtp:buyer@example.com:create=false:https://huntsvilleschoolguide.vercel.app/auth/confirm?next=/guide",
    );
    assert.equal(calls[0], "createUser:buyer@example.com:confirm=true");
  });

  it("does not send the link if confirmation fails", async () => {
    const { admin, calls } = createAdminMock({
      existing: { id: "old-user", email_confirmed_at: null },
      updateError: { message: "update failed" },
    });

    await assert.rejects(
      () =>
        sendConfirmedPurchaseMagicLink(
          admin,
          "https://example.com",
          "buyer@example.com",
        ),
      /update failed/,
    );
    assert.equal(
      calls.some((call) => call.startsWith("signInWithOtp:")),
      false,
    );
  });
});
