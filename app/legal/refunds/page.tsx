import type { Metadata } from "next";
import { LegalDraft } from "@/components/legal-draft";

export const metadata: Metadata = {
  title: "Refunds",
  description: "Draft refund placeholder. Not legal advice.",
};

export default function RefundsPage() {
  return <LegalDraft title="Refunds" />;
}
