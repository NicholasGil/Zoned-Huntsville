import { NextResponse } from "next/server";

type CorrectionReport = {
  page: string;
  note: string;
  reporterEmail: string | null;
};

function parseCorrection(body: unknown): CorrectionReport | null {
  if (typeof body !== "object" || body === null) {
    return null;
  }

  const page = "page" in body ? body.page : null;
  const note = "note" in body ? body.note : null;
  const reporterEmail = "reporterEmail" in body ? body.reporterEmail : null;

  if (typeof page !== "string" || page.trim().length === 0) {
    return null;
  }
  if (typeof note !== "string" || note.trim().length === 0) {
    return null;
  }
  if (reporterEmail !== null && typeof reporterEmail !== "string") {
    return null;
  }

  return {
    page: page.trim(),
    note: note.trim(),
    reporterEmail: reporterEmail && reporterEmail.trim().length > 0 ? reporterEmail.trim() : null,
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

  return NextResponse.json(
    {
      accepted: true,
      persistence: "stub",
      page: report.page,
    },
    { status: 202 },
  );
}
