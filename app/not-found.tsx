import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export default function NotFound() {
  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Page not found</h1>
      <p className="mt-4 text-muted">That URL is not part of this site.</p>
      <p className="mt-6">
        <Link href="/" className="text-brick hover:underline">
          Back to the guide
        </Link>
      </p>
    </PageShell>
  );
}
