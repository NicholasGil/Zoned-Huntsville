import Link from "next/link";
import { unlockGuideWithEmail } from "@/app/login/actions";
import { secondaryButton } from "@/components/button-styles";
import {
  GuideUnlockForm,
  GuideUnlockStatus,
  type GuideUnlockError,
} from "@/components/guide-unlock-form";
import type { Entitlement } from "@/lib/entitlement";

export function AccessGate({
  entitlement,
  need,
  returnTo = "/guide",
  unlockError = null,
}: {
  entitlement: Entitlement;
  need: "guide" | "toolkit";
  returnTo?: string;
  unlockError?: GuideUnlockError | null;
}) {
  const title =
    need === "toolkit"
      ? "This section is for the Toolkit tier."
      : "This section is for buyers of the guide.";

  const reason =
    entitlement.kind === "anonymous"
      ? "Enter the email you used at checkout and we open the guide here — no password needed."
      : need === "toolkit"
        ? "You are signed in, but this page requires a $149 or $349 purchase."
        : "You are signed in, but this page requires a paid guide purchase.";

  return (
    <section className="rounded-lg border border-border bg-surface px-6 py-8">
      <h1 className="font-sans text-3xl font-semibold text-text">{title}</h1>
      <p className="mt-4 max-w-xl text-text-muted">{reason}</p>
      {entitlement.kind === "anonymous" ? (
        <>
          <GuideUnlockForm
            action={unlockGuideWithEmail}
            inputId="guide-gate-email"
            returnTo={returnTo}
            className="mt-6 max-w-md"
          />
          <GuideUnlockStatus error={unlockError} />
          <p className="mt-6">
            <Link href="/login#magic-link" className={secondaryButton}>
              Email me a sign-in link
            </Link>
          </p>
        </>
      ) : (
        <div className="mt-6">
          <Link href="/#pricing" className={secondaryButton}>
            See pricing
          </Link>
        </div>
      )}
    </section>
  );
}
