import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { parseAttributionRecord } from "@/lib/attribution";
import { BookExpertCall } from "@/components/book-expert-call";
import { CheckoutReceiptView } from "@/components/checkout-receipt";
import { PageShell } from "@/components/page-shell";
import { PurchasePixel } from "@/components/purchase-pixel";
import { planCheckoutAccess } from "@/lib/checkout-unlock";
import { getEntitlement } from "@/lib/entitlement";
import { getSignedInAdminState } from "@/lib/facts";
import { loadCheckoutReceipt } from "@/lib/load-checkout-receipt";

export const dynamic = "force-dynamic";

function firstQueryValue(value: string | string[] | undefined): string | null {
  return typeof value === "string" ? value : null;
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/thank-you">): Promise<Metadata> {
  const query = await searchParams;
  const receipt = await loadCheckoutReceipt(firstQueryValue(query.session_id));
  return {
    title:
      receipt.kind === "confirmed"
        ? "Thank you — order confirmed"
        : "Order not confirmed",
    robots: { index: false, follow: false },
  };
}

export default async function ThankYouPage({
  searchParams,
}: PageProps<"/thank-you">) {
  const query = await searchParams;
  const sessionId = firstQueryValue(query.session_id);
  const receipt = await loadCheckoutReceipt(sessionId);
  const identity = await getSignedInAdminState();
  const entitlement = await getEntitlement();
  const access = planCheckoutAccess({
    receipt,
    sessionId,
    signedInEmail: identity.email,
    unlockParam: firstQueryValue(query.unlock),
    attribution: parseAttributionRecord(query),
  });

  if (access.kind === "unlock") {
    redirect(access.href);
  }

  const showExpertCallNextSteps =
    receipt.kind === "confirmed" &&
    (receipt.tier === "call" ||
      (entitlement.kind === "signed-in" && entitlement.hasCall));

  const scheduleEmail =
    receipt.kind === "confirmed"
      ? receipt.email ??
        (access.kind === "ready" ? access.email : identity.email)
      : identity.email;

  return (
    <PageShell>
      <PurchasePixel receipt={receipt} sessionId={sessionId} />
      <CheckoutReceiptView receipt={receipt} access={access} />
      {showExpertCallNextSteps ? (
        <BookExpertCall email={scheduleEmail} className="mt-10" />
      ) : null}
    </PageShell>
  );
}
