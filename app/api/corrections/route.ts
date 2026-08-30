import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAppEnv } from "@/lib/env";

type CorrectionReport = {
  page: string;
  note: string;
  reporterEmail: string | null;
  factId: string | null;
};

function parseCorrection(body: unknown): CorrectionReport | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const page = "page" in body ? body.page : null;
  const note = "note" in body ? body.note : null;
  const reporterEmail = "reporterEmail" in body ? body.reporterEmail : null;
  const factId = "factId" in body ? body.factId : null;

  if (typeof page !== "string" || page.trim().length === 0) {
    return null;
  }
  if (typeof note !== "string" || note.trim().length === 0) {
    return null;
  }
  if (reporterEmail !== null && typeof reporterEmail !== "string") {
    return null;
  }
  if (factId !== null && typeof factId !== "string") {
    return null;
  }

  return {
    page: page.trim(),
    note: note.trim(),
    reporterEmail: reporterEmail && reporterEmail.trim().length > 0 ? reporterEmail.trim() : null,
    factId: factId && factId.trim().length > 0 ? factId.trim() : null,
  };
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const report = parseCorrection(body);

  if (!report) {
    return NextResponse.json(
      { error: "Send JSON with page and note." },
      { status: 400 },
    );
  }

  const env = getAppEnv();
  if (env.supabase.kind === "missing") {
    return NextResponse.json(
      { accepted: true, persistence: "unavailable", page: report.page },
      { status: 202 },
    );
  }

  const row = {
    page_path: report.page,
    message: report.note,
    reporter_email: report.reporterEmail,
    fact_id: report.factId,
  };

  const admin = createSupabaseAdminClient();
  const writer = admin ?? (await createSupabaseServerClient());
  if (!writer) {
    return NextResponse.json(
      { accepted: true, persistence: "unavailable", page: report.page },
      { status: 202 },
    );
  }

  const { error } = await writer.from("corrections").insert(row);
  if (error) {
    return NextResponse.json(
      { accepted: true, persistence: "error", page: report.page },
      { status: 202 },
    );
  }

  return NextResponse.json(
    {
      accepted: true,
      persistence: "stored",
      page: report.page,
    },
    { status: 202 },
  );
}
