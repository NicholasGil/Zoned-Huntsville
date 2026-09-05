import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutReceiptView } from "@/components/checkout-receipt";
import { PageShell } from "@/components/page-shell";
import { PurchasePixel } from "@/components/purchase-pixel";
import { planCheckoutAccess } from "@/lib/checkout-unlock";
import { getSignedInAdminState } from "@/lib/facts";
import { loadCheckoutReceipt } from "@/lib/load-checkout-receipt";

export const dynamic = "force-dynamic";

function firstQueryValue(value: string | string[] | undefined): string | null {
  return typeof value === "string" ? value : null;
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/checkout/success">): Promise<Metadata> {
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

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const query = await searchParams;
  const sessionId = firstQueryValue(query.session_id);
  const receipt = await loadCheckoutReceipt(sessionId);
  const identity = await getSignedInAdminState();
  const access = planCheckoutAccess({
    receipt,
    sessionId,
    signedInEmail: identity.email,
    unlockParam: firstQueryValue(query.unlock),
  });

  if (access.kind === "unlock") {
    redirect(access.href);
  }

  return (
    <PageShell>
      <PurchasePixel receipt={receipt} sessionId={sessionId} />
      <CheckoutReceiptView receipt={receipt} access={access} />
    </PageShell>
  );
}
