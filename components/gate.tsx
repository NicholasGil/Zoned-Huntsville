import Link from "next/link";
import type { Entitlement } from "@/lib/entitlement";

export function AccessGate({
  entitlement,
  need,
}: {
  entitlement: Entitlement;
  need: "guide" | "toolkit";
}) {
  const title =
    need === "toolkit"
      ? "This section is for the Toolkit tier."
      : "This section is for buyers of the guide.";

  const reason =
    entitlement.kind === "anonymous"
      ? "The entitlement check ran on the server and found no signed-in purchase record. Purchase storage is not wired in this scaffold."
      : need === "toolkit"
        ? "You are signed in, but this page requires the Toolkit tier."
        : "You are signed in, but this page requires a guide purchase.";

  return (
    <section className="border border-rule bg-paper-raised px-6 py-8">
      <h1 className="font-serif text-3xl text-ink">{title}</h1>
      <p className="mt-4 max-w-xl text-muted">{reason}</p>
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link href="/login" className="text-brick hover:underline">
          Request a magic link
        </Link>
        <Link href="/" className="text-brick hover:underline">
          See pricing
        </Link>
      </div>
    </section>
  );
}
