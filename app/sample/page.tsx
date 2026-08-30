import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SampleOptInForm } from "@/components/sample-opt-in-form";
import { VerifyToken } from "@/components/verify-token";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Free sample",
  description:
    "A free sample of The Huntsville School Guide. Email delivery is not wired in this scaffold.",
};

export default function SamplePage() {
  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Free sample</h1>
      <p className="mt-4 max-w-xl text-muted">
        This is a placeholder for the free sample. The excerpt itself is not
        written yet.
      </p>
      <p className="mt-3 text-muted">
        <VerifyToken>sample excerpt and which facts it may include</VerifyToken>
      </p>
      <SampleOptInForm />
    </PageShell>
  );
}
