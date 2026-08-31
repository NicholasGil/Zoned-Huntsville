import type { Metadata } from "next";
import { CheckoutReceiptView } from "@/components/checkout-receipt";
import { PageShell } from "@/components/page-shell";
import { loadCheckoutReceipt } from "@/lib/load-checkout-receipt";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Purchase confirmation",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const query = await searchParams;
  const sessionId =
    typeof query.session_id === "string" ? query.session_id : null;
  const receipt = await loadCheckoutReceipt(sessionId);

  return (
    <PageShell>
      <CheckoutReceiptView receipt={receipt} sessionId={sessionId} />
    </PageShell>
  );
}
