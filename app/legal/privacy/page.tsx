import type { Metadata } from "next";
import { LegalDraft } from "@/components/legal-draft";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Draft privacy placeholder. Not legal advice.",
};

export default function PrivacyPage() {
  return <LegalDraft title="Privacy" />;
}
