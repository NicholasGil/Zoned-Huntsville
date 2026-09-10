import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, it } from "node:test";
import {
  expertCallScheduleEmailCopy,
  getExpertCallBookingUrl,
} from "./booking.ts";

const bookExpertCallSource = readFileSync(
  new URL("../components/book-expert-call.tsx", import.meta.url),
  "utf8",
);

const ORIGINAL_CALENDLY = process.env.NEXT_PUBLIC_CALENDLY_URL;

afterEach(() => {
  if (ORIGINAL_CALENDLY === undefined) {
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
  } else {
    process.env.NEXT_PUBLIC_CALENDLY_URL = ORIGINAL_CALENDLY;
  }
});

describe("getExpertCallBookingUrl", () => {
  it("returns null when unset", () => {
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
    assert.equal(getExpertCallBookingUrl(), null);
  });

  it("returns trimmed URL when set", () => {
    process.env.NEXT_PUBLIC_CALENDLY_URL = "  https://calendly.com/example/expert  ";
    assert.equal(getExpertCallBookingUrl(), "https://calendly.com/example/expert");
  });
});

describe("expertCallScheduleEmailCopy", () => {
  it("names the email when provided", () => {
    assert.match(
      expertCallScheduleEmailCopy("buyer@example.com"),
      /buyer@example\.com/,
    );
    assert.match(expertCallScheduleEmailCopy("buyer@example.com"), /expert/);
  });

  it("uses purchase-email fallback when email is unknown", () => {
    assert.match(expertCallScheduleEmailCopy(null), /purchase email/);
  });
});

describe("BookExpertCall honesty", () => {
  it("renders self-serve book CTA only when URL is set", () => {
    assert.match(bookExpertCallSource, /getExpertCallBookingUrl\(\)/);
    assert.match(bookExpertCallSource, /Book your 45-minute expert call/);
    assert.match(bookExpertCallSource, /rel="noopener noreferrer"/);
  });

  it("shows email-to-schedule copy when URL branch is absent", () => {
    assert.match(bookExpertCallSource, /expertCallScheduleEmailCopy/);
  });

  it("never names Nicholas in booking UI", () => {
    assert.doesNotMatch(bookExpertCallSource, /Nicholas/i);
  });
});
