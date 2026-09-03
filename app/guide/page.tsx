import type { Metadata } from "next";
import Link from "next/link";
import {
  focusRing,
  primaryButton,
  quietLink,
} from "@/components/button-styles";
import { AccessGate } from "@/components/gate";
import { PageShell } from "@/components/page-shell";
import { canReadGuide, getEntitlement } from "@/lib/entitlement";
import { FIRST_PATH } from "@/lib/first-path";
import { GUIDE_MODULES } from "@/lib/guide-modules";
import { edition } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your guide",
};

const stepCard = `block rounded-lg border border-border bg-surface px-5 py-4 hover:border-action ${focusRing}`;

export default async function GuideIndexPage() {
  const entitlement = await getEntitlement();

  if (!canReadGuide(entitlement)) {
    return (
      <PageShell>
        <AccessGate entitlement={entitlement} need="guide" />
      </PageShell>
    );
  }

  const [firstStep, ...laterSteps] = FIRST_PATH;

  return (
    <PageShell>
      <p className="text-xs uppercase tracking-[0.16em] text-action">
        Your guide · {edition} edition
      </p>
      <h1 className="mt-2 max-w-2xl font-sans text-[32px] font-semibold leading-tight text-text sm:text-4xl">
        Start here: build your shortlist in the next 10 minutes.
      </h1>
      <p className="mt-4 max-w-xl text-text-muted">{firstStep.outcome}</p>
      <p className="mt-3 max-w-xl text-sm text-text-muted">
        Nothing to download and nothing to wait for in your inbox. Your answers
        stay in this browser tab.
      </p>
      <div className="mt-6">
        <Link href={`/guide/${firstStep.slug}`} className={primaryButton}>
          Start the 10-minute shortlist
        </Link>
      </div>

      <section aria-labelledby="then-heading" className="mt-12 max-w-xl">
        <h2 id="then-heading" className="font-sans text-xl font-semibold text-text">
          Then, with your shortlist in hand
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Two short reads. Both are built from each system&apos;s own published
          pages, linked and dated.
        </p>
        <ol className="mt-4 space-y-3">
          {laterSteps.map((step) => (
            <li key={step.slug}>
              <Link href={`/guide/${step.slug}`} className={stepCard}>
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold text-text">{step.label}</span>
                  <span className="shrink-0 text-xs text-text-muted">{step.minutes}</span>
                </span>
                <span className="mt-1 block text-sm text-text-muted">{step.outcome}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="all-modules-heading"
        className="mt-14 max-w-xl border-t border-border pt-10"
      >
        <h2
          id="all-modules-heading"
          className="font-sans text-xl font-semibold text-text"
        >
          All eight modules
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Every fact carries a source link and the date we checked it. Where a
          detail is still unconfirmed, the page says so rather than guessing.
        </p>
        <ol className="mt-4 divide-y divide-border">
          {GUIDE_MODULES.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/guide/${entry.slug}`}
                className={`flex min-h-11 items-baseline gap-3 py-3 hover:text-action ${focusRing}`}
              >
                <span className="w-5 shrink-0 text-sm text-text-muted">{entry.number}.</span>
                <span>
                  <span className="block font-semibold text-text">{entry.title}</span>
                  <span className="mt-0.5 block text-sm text-text-muted">{entry.purpose}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex flex-wrap gap-x-6">
          <Link href="/guide/tools" className={quietLink}>
            Toolkit
          </Link>
          <Link href="/account" className={quietLink}>
            Account
          </Link>
        </p>
      </section>
    </PageShell>
  );
}
