import type { Metadata } from "next";
import { LegalDraft } from "@/components/legal-draft";

export const metadata: Metadata = {
  title: "Terms",
  description: "Draft terms placeholder. Not legal advice.",
};

export default function TermsPage() {
  return <LegalDraft title="Terms" />;
}
