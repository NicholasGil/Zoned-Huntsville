import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const query = await searchParams;
  const sessionId =
    typeof query.session_id === "string" ? query.session_id : null;

  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Checkout redirect</h1>
      <p className="mt-4 max-w-xl text-muted">
        Stripe sends buyers here after payment. Access is granted only after the
        webhook writes the purchase. Sign in with the checkout email if the
        guide is still locked.
      </p>
      {sessionId ? (
        <p className="mt-4 break-all font-mono text-sm text-muted">
          session_id={sessionId}
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">No session_id was supplied.</p>
      )}
      <p className="mt-8">
        <Link href="/account" className="text-brick hover:underline">
          Account
        </Link>
      </p>
    </PageShell>
  );
}
