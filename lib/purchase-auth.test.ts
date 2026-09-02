import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PurchaseAuthError } from "./auth-error.ts";
import {
  authConfirmRedirectTo,
  ensureConfirmedAuthUser,
  findAuthUserByEmail,
  purchaseMagicLinkRedirectTo,
  sendConfirmedPurchaseMagicLink,
  type PurchaseAuthAdmin,
  type PurchaseAuthUser,
} from "./purchase-auth.ts";

function createAdminMock(options: {
  existing?: PurchaseAuthUser | null;
  createError?: { message: string; code?: string };
  updateError?: { message: string };
  otpError?: { message: string; code?: string; status?: number };
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
              user: {
                id: "new-user",
                email: attributes.email,
                email_confirmed_at: "2026-08-30T00:00:00Z",
              },
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
        async listUsers() {
          calls.push("listUsers");
          return {
            data: { users: options.existing ? [options.existing] : [] },
            error: options.existing ? null : { message: "missing user" },
          };
        },
        async getUserByEmail(email) {
          calls.push(`getUserByEmail:${email}`);
          if (
            options.existing &&
            (options.existing.email ?? "").toLowerCase() === email.toLowerCase()
          ) {
            return { data: { user: options.existing }, error: null };
          }
          return { data: { user: null }, error: null };
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
  it("uses the allowlisted /auth/confirm path and strips a trailing slash", () => {
    assert.equal(
      purchaseMagicLinkRedirectTo("https://huntsvilleschoolguide.vercel.app/"),
      "https://huntsvilleschoolguide.vercel.app/auth/confirm",
    );
    assert.equal(
      authConfirmRedirectTo("https://huntsvilleschoolguide.vercel.app/"),
      "https://huntsvilleschoolguide.vercel.app/auth/confirm",
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

  it("confirms an existing unconfirmed user without generateLink side effects", async () => {
    const { admin, calls } = createAdminMock({
      existing: {
        id: "old-user",
        email: "buyer@example.com",
        email_confirmed_at: null,
      },
    });
    const id = await ensureConfirmedAuthUser(admin, "buyer@example.com");
    assert.equal(id, "old-user");
    assert.deepEqual(calls, [
      "createUser:buyer@example.com:confirm=true",
      "getUserByEmail:buyer@example.com",
      "updateUserById:old-user:confirm=true",
    ]);
    assert.equal(
      calls.some((call) => call === "listUsers"),
      false,
    );
    assert.equal(
      calls.some((call) => call.startsWith("generateLink:")),
      false,
    );
  });
});

describe("findAuthUserByEmail", () => {
  it("uses getUserByEmail instead of scanning the first listUsers page", async () => {
    const { admin, calls } = createAdminMock({
      existing: {
        id: "page-two-user",
        email: "buyer@example.com",
        email_confirmed_at: "2026-08-30T00:00:00Z",
      },
    });
    const user = await findAuthUserByEmail(admin, "buyer@example.com");
    assert.equal(user?.id, "page-two-user");
    assert.deepEqual(calls, ["getUserByEmail:buyer@example.com"]);
  });

  it("paginates listUsers when getUserByEmail is unavailable", async () => {
    const later: PurchaseAuthUser = {
      id: "later-user",
      email: "buyer@example.com",
      email_confirmed_at: "2026-08-30T00:00:00Z",
    };
    const filler = Array.from({ length: 200 }, (_, index) => ({
      id: `other-${index}`,
      email: `other-${index}@example.com`,
    }));
    const calls: string[] = [];
    const admin: PurchaseAuthAdmin = {
      auth: {
        admin: {
          async createUser() {
            return { data: { user: null }, error: { message: "unused" } };
          },
          async updateUserById() {
            return { data: { user: null }, error: { message: "unused" } };
          },
          async listUsers(params) {
            const page = params?.page ?? 1;
            calls.push(`listUsers:${page}`);
            if (page === 1) {
              return { data: { users: filler }, error: null };
            }
            return { data: { users: [later] }, error: null };
          },
        },
        async signInWithOtp() {
          return { error: null };
        },
      },
    };

    const user = await findAuthUserByEmail(admin, "buyer@example.com");
    assert.equal(user?.id, "later-user");
    assert.deepEqual(calls, ["listUsers:1", "listUsers:2"]);
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
      "signInWithOtp:buyer@example.com:create=false:https://huntsvilleschoolguide.vercel.app/auth/confirm",
    );
    assert.equal(calls[0], "createUser:buyer@example.com:confirm=true");
  });

  it("does not send the link if confirmation fails", async () => {
    const { admin, calls } = createAdminMock({
      existing: {
        id: "old-user",
        email: "buyer@example.com",
        email_confirmed_at: null,
      },
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

  it("throws the OTP error message and code when Auth refuses to send", async () => {
    const { admin } = createAdminMock({
      otpError: {
        message: "email rate limit exceeded",
        code: "over_email_send_rate_limit",
        status: 429,
      },
    });

    await assert.rejects(
      () =>
        sendConfirmedPurchaseMagicLink(
          admin,
          "https://huntsvilleschoolguide.vercel.app",
          "buyer@example.com",
        ),
      (error: unknown) => {
        assert.ok(error instanceof PurchaseAuthError);
        assert.equal(error.message, "email rate limit exceeded");
        assert.equal(error.code, "over_email_send_rate_limit");
        assert.equal(error.status, 429);
        return true;
      },
    );
  });
});
