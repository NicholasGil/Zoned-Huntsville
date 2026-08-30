import type { Metadata } from "next";
import { LegalDraft } from "@/components/legal-draft";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Draft disclaimer placeholder. Not legal advice.",
};

export default function DisclaimerPage() {
  return <LegalDraft title="Disclaimer" />;
}
