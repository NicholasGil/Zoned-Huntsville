import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatLoginSendFailedCopy,
  loginSendFailedPath,
  readAuthErrorFields,
  redactEmail,
  toPublicAuthError,
} from "./auth-error.ts";

describe("redactEmail", () => {
  it("keeps domain and a one-character local hint", () => {
    assert.equal(redactEmail("Buyer.Name@example.com"), "b***@example.com");
  });
});

describe("toPublicAuthError", () => {
  it("keeps rate-limit and redirect Auth messages", () => {
    assert.deepEqual(
      toPublicAuthError({
        message: "email rate limit exceeded",
        code: "over_email_send_rate_limit",
        status: 429,
      }),
      {
        message: "email rate limit exceeded",
        code: "over_email_send_rate_limit",
        status: 429,
      },
    );
    assert.equal(
      toPublicAuthError({
        message: "redirect_uri is not in the project's allow list",
        code: "validation_failed",
        status: 400,
      }).message.includes("redirect_uri"),
      true,
    );
  });

  it("drops secrets and stack-like values", () => {
    const hidden = toPublicAuthError({
      message: "apikey service_role eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload",
      code: "weird",
    });
    assert.equal(hidden.message, "");
    assert.equal(hidden.code, "weird");
  });
});

describe("formatLoginSendFailedCopy", () => {
  it("shows the Auth message and code instead of generic-only copy", () => {
    assert.equal(
      formatLoginSendFailedCopy({
        message: "email rate limit exceeded",
        code: "over_email_send_rate_limit",
      }),
      "Supabase did not send the link. email rate limit exceeded (over_email_send_rate_limit)",
    );
  });

  it("falls back to the settings hint when no public message exists", () => {
    assert.equal(
      formatLoginSendFailedCopy({ message: "" }),
      "Supabase did not send the link. Check the project auth settings.",
    );
  });
});

describe("loginSendFailedPath", () => {
  it("puts message and code on the send-failed query", () => {
    const path = loginSendFailedPath({
      message: "Email not confirmed",
      code: "email_not_confirmed",
      status: 400,
    });
    const url = new URL(path, "https://huntsvilleschoolguide.vercel.app");
    assert.equal(url.pathname, "/login");
    assert.equal(url.searchParams.get("error"), "send-failed");
    assert.equal(url.searchParams.get("auth_message"), "Email not confirmed");
    assert.equal(url.searchParams.get("auth_code"), "email_not_confirmed");
    assert.equal(url.searchParams.get("auth_status"), "400");
  });
});

describe("readAuthErrorFields", () => {
  it("reads message and code from a thrown Auth-shaped error", () => {
    const error = Object.assign(new Error("redirect not allowed"), {
      code: "unexpected_failure",
      status: 422,
    });
    assert.deepEqual(readAuthErrorFields(error), {
      message: "redirect not allowed",
      code: "unexpected_failure",
      status: 422,
    });
  });
});
