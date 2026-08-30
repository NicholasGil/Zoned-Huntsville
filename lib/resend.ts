import "server-only";

import { Resend } from "resend";
import { getAppEnv } from "@/lib/env";
import { site } from "@/lib/site";

export type SendEmailResult =
  | { kind: "sent"; id: string }
  | {
      kind: "skipped";
      reason: "missing-api-key" | "missing-from" | "missing-to";
    }
  | { kind: "failed"; message: string };

export type SendEmailInput = {
  purpose: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

const FROM_NAME = `Nicholas / ${site.name}`;

function formatFrom(address: string): string {
  if (address.includes("<")) {
    return address;
  }
  return `${FROM_NAME} <${address}>`;
}

function logResult(
  result: SendEmailResult,
  purpose: string,
): SendEmailResult {
  if (result.kind === "sent") {
    console.info({ event: "email.sent", purpose, id: result.id });
    return result;
  }
  if (result.kind === "skipped") {
    console.info({ event: "email.skipped", purpose, reason: result.reason });
    return result;
  }
  console.info({ event: "email.failed", purpose, message: result.message });
  return result;
}

export async function sendTransactionalEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const env = getAppEnv();
  const to = input.to.trim();

  if (!env.resendApiKey) {
    return logResult({ kind: "skipped", reason: "missing-api-key" }, input.purpose);
  }
  if (!env.emailFrom) {
    return logResult({ kind: "skipped", reason: "missing-from" }, input.purpose);
  }
  if (to.length === 0) {
    return logResult({ kind: "skipped", reason: "missing-to" }, input.purpose);
  }

  try {
    const resend = new Resend(env.resendApiKey);
    const { data, error } = await resend.emails.send({
      from: formatFrom(env.emailFrom),
      to,
      subject: input.subject,
      text: input.text,
      ...(input.html ? { html: input.html } : {}),
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    });

    if (error) {
      return logResult(
        { kind: "failed", message: error.message },
        input.purpose,
      );
    }

    return logResult({ kind: "sent", id: data?.id ?? "" }, input.purpose);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown send error";
    return logResult({ kind: "failed", message }, input.purpose);
  }
}

export function getContactTo(): string | null {
  return getAppEnv().contactTo;
}
