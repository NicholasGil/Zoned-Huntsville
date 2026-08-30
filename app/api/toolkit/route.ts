import { NextResponse } from "next/server";
import { canReadToolkit, getEntitlement } from "@/lib/entitlement";

export async function GET() {
  const entitlement = await getEntitlement();

  if (entitlement.kind === "anonymous") {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  if (!canReadToolkit(entitlement)) {
    return NextResponse.json(
      { error: "This download requires the toolkit or call tier." },
      { status: 403 },
    );
  }

  return NextResponse.json({
    ok: true,
    need: "toolkit",
    hasToolkit: entitlement.hasToolkit,
  });
}
