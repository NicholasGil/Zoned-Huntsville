import "server-only";

import { getAppEnv } from "@/lib/env";
import {
  getContactTo,
  sendTransactionalEmail,
  type SendEmailResult,
} from "@/lib/resend";
import { fieldLabel, huntsvilleCitySampleFacts } from "@/lib/seed-facts";
import { site } from "@/lib/site";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function siteOrigin(siteUrl: string): string {
  return siteUrl.replace(/\/+$/, "");
}

function formatUsd(amountUsd: number): string {
  if (Number.isInteger(amountUsd)) {
    return `$${amountUsd}`;
  }
  return `$${amountUsd.toFixed(2)}`;
}

export function buildSampleProfileEmail(siteUrl: string): {
  subject: string;
  text: string;
  html: string;
} {
  const facts = huntsvilleCitySampleFacts();
  const sampleUrl = `${siteOrigin(siteUrl)}/sample`;
  const subject = "Your Huntsville City Schools sample";

  const textLines = [
    "Huntsville City Schools",
    "",
    "This is the district profile you asked for. Each figure has its official source and the date it was verified.",
    "",
  ];

  for (const fact of facts) {
    textLines.push(`${fieldLabel(fact.field)}: ${fact.value}`);
    textLines.push(`Source: ${fact.source_url}`);
    textLines.push(`Verified: ${fact.verified_at}`);
    textLines.push("");
  }

  textLines.push(`You can also read this profile at ${sampleUrl}`);

  const factBlocks = facts
    .map((fact) => {
      const label = escapeHtml(fieldLabel(fact.field));
      const value = escapeHtml(fact.value);
      const source = escapeHtml(fact.source_url);
      const verified = escapeHtml(fact.verified_at);
      return `<p><strong>${label}:</strong> ${value}<br>Source: ${source}<br>Verified: ${verified}</p>`;
    })
    .join("");

  const html = `<p>Huntsville City Schools</p>
<p>This is the district profile you asked for. Each figure has its official source and the date it was verified.</p>
${factBlocks}
<p>You can also read this profile at <a href="${escapeHtml(sampleUrl)}">${escapeHtml(sampleUrl)}</a></p>`;

  return { subject, text: textLines.join("\n"), html };
}

export async function sendSampleProfileEmail(
  to: string,
): Promise<SendEmailResult> {
  const env = getAppEnv();
  const body = buildSampleProfileEmail(env.siteUrl);
  return sendTransactionalEmail({
    purpose: "sample-profile",
    to,
    subject: body.subject,
    text: body.text,
    html: body.html,
  });
}

export async function sendContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<SendEmailResult> {
  const contactTo = getContactTo();
  if (!contactTo) {
    return sendTransactionalEmail({
      purpose: "contact",
      to: "",
      subject: "Contact form message",
      text: input.message,
    });
  }

  const nameLine = input.name.length > 0 ? input.name : "not provided";
  const text = [
    `Name: ${nameLine}`,
    `Email: ${input.email}`,
    "",
    input.message,
  ].join("\n");

  const html = `<p><strong>Name:</strong> ${escapeHtml(nameLine)}<br>
<strong>Email:</strong> ${escapeHtml(input.email)}</p>
<p>${escapeHtml(input.message).replaceAll("\n", "<br>")}</p>`;

  return sendTransactionalEmail({
    purpose: "contact",
    to: contactTo,
    subject: "Contact form message",
    text,
    html,
    replyTo: input.email,
  });
}

export async function sendCorrectionPing(input: {
  reporterEmail: string | null;
  message: string;
  factId: string | null;
}): Promise<SendEmailResult> {
  const contactTo = getContactTo();
  const reporter = input.reporterEmail ?? "not provided";
  const factId = input.factId ?? "not provided";
  const text = [
    `Reporter: ${reporter}`,
    `Fact id: ${factId}`,
    "",
    input.message,
  ].join("\n");

  const html = `<p><strong>Reporter:</strong> ${escapeHtml(reporter)}<br>
<strong>Fact id:</strong> ${escapeHtml(factId)}</p>
<p>${escapeHtml(input.message).replaceAll("\n", "<br>")}</p>`;

  return sendTransactionalEmail({
    purpose: "correction",
    to: contactTo ?? "",
    subject: "Correction report",
    text,
    html,
    replyTo: input.reporterEmail ?? undefined,
  });
}

export async function sendPurchaseReceipt(input: {
  to: string;
  amountUsd: number | null;
}): Promise<SendEmailResult> {
  const amount =
    input.amountUsd === null ? null : formatUsd(input.amountUsd);
  const paid = amount
    ? `You bought ${site.name} — ${amount}.`
    : `You bought ${site.name}.`;
  const text = `${paid} Access link will arrive from sign-in.`;

  return sendTransactionalEmail({
    purpose: "purchase-receipt",
    to: input.to,
    subject: `Your ${site.name} purchase`,
    text,
    html: `<p>${escapeHtml(text)}</p>`,
  });
}
