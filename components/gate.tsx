import Link from "next/link";
import { primaryButton, secondaryButton } from "@/components/button-styles";
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
      ? "The server found no signed-in session. Request a magic link, then open the guide again."
      : need === "toolkit"
        ? "You are signed in, but this page requires a $149 or $349 purchase."
        : "You are signed in, but this page requires a paid guide purchase.";

  return (
    <section className="rounded-lg border border-border bg-surface px-6 py-8">
      <h1 className="font-sans text-3xl font-semibold text-text">{title}</h1>
      <p className="mt-4 max-w-xl text-text-muted">{reason}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link href="/login" className={primaryButton}>
          Request a magic link
        </Link>
        <Link href="/#pricing" className={secondaryButton}>
          See pricing
        </Link>
      </div>
    </section>
  );
}
