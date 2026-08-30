import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { salesCopy } from "@/lib/sales";

export const metadata: Metadata = {
  title: "Refunds",
  description: "30-day unconditional refund and the Zone Promise.",
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refunds">
      <p>
        30-day unconditional money-back. If you want a refund, email us through
        the{" "}
        <Link href="/contact" className="text-brick hover:underline">
          contact form
        </Link>
        . You get a full refund.
      </p>
      <p>{salesCopy.zonePromise}</p>
      <p>
        There is no form to fill beyond that email. We do not keep a percentage.
        We do not ask you to return a file.
      </p>
    </LegalPage>
  );
}
