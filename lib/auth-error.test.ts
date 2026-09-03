import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  formatLoginSendFailedCopy,
  formatLoginSendFailedDetail,
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
  it("explains a rate limit in plain language", () => {
    const copy = formatLoginSendFailedCopy({
      message: "email rate limit exceeded",
      code: "over_email_send_rate_limit",
    });
    assert.match(copy, /a moment ago/);
    assert.doesNotMatch(copy, /supabase|webhook|otp|rate limit/i);
  });

  it("falls back to a plain retry line for unknown failures", () => {
    const copy = formatLoginSendFailedCopy({ message: "" });
    assert.match(copy, /couldn't send the link/);
    assert.doesNotMatch(copy, /supabase|auth settings/i);
  });

  it("keeps the raw Auth message and code available for support", () => {
    assert.equal(
      formatLoginSendFailedDetail({
        message: "email rate limit exceeded",
        code: "over_email_send_rate_limit",
      }),
      "email rate limit exceeded (over_email_send_rate_limit)",
    );
    assert.equal(formatLoginSendFailedDetail({ message: "" }), null);
    assert.equal(formatLoginSendFailedDetail({ message: "", code: "weird" }), "(weird)");
  });
});

describe("Send link form copy", () => {
  const formSource = readFileSync(
    new URL("../components/send-link-form.tsx", import.meta.url),
    "utf8",
  );
  const loginSource = readFileSync(
    new URL("../app/login/page.tsx", import.meta.url),
    "utf8",
  );
  const accountSource = readFileSync(
    new URL("../app/account/page.tsx", import.meta.url),
    "utf8",
  );

  it("has one obvious 44px Send link button on the civic action token", () => {
    assert.match(formSource, /SEND_LINK_LABEL = "Send link"/);
    assert.match(formSource, /min-h-11[^"]*bg-action/);
    assert.doesNotMatch(formSource, /font-serif|text-brick|bg-brick|text-ink\b|border-rule|bg-paper/);
  });

  it("login and account both use the shared form", () => {
    assert.match(loginSource, /<SendLinkForm/);
    assert.match(accountSource, /<SendLinkForm/);
    assert.doesNotMatch(loginSource, /<form|<button/);
    assert.doesNotMatch(accountSource, /Email me a sign-in link|Supabase (is not configured|did not send)/);
  });

  it("keeps buyer copy free of plumbing and does not claim Toolkit or Call", () => {
    for (const source of [formSource, loginSource]) {
      assert.doesNotMatch(source, /webhook|supabase|magic-link callback|\/auth\/confirm|token/i);
      assert.doesNotMatch(source, /toolkit|\bcall\b/i);
    }
    assert.match(formSource, /Link sent/);
    assert.match(formSource, /Check your inbox/);
    assert.match(formSource, /didn't work\. It may have expired/);
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
