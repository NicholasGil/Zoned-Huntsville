import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { primaryButton, quietLink } from "@/components/button-styles";
import { FactList } from "@/components/fact-list";
import { AccessGate } from "@/components/gate";
import { LeaseCheck } from "@/components/lease-check";
import { PageShell } from "@/components/page-shell";
import { ShortlistPath } from "@/components/shortlist-path";
import { VerifyToken } from "@/components/verify-token";
import { canReadGuide, getEntitlement } from "@/lib/entitlement";
import { getPublishedFacts } from "@/lib/facts";
import { firstPathStep, nextFirstPathStep } from "@/lib/first-path";
import { GUIDE_MODULES, getGuideModule } from "@/lib/guide-modules";
import {
  FIVE_SYSTEM_PROFILE_FIELDS,
  FIVE_SYSTEM_SLUGS,
  HCS_MAGNET_SLUGS,
  PRIVATE_SCHOOL_SLUGS,
  seedFacts,
  slugOrder,
} from "@/lib/seed-facts";
import { optionsFromFacts } from "@/lib/shortlist-path";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_MODULES.map((entry) => ({ module: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/guide/[module]">): Promise<Metadata> {
  const { module: moduleSlug } = await params;
  const guideModule = getGuideModule(moduleSlug);
  return { title: guideModule ? guideModule.title : "Guide module" };
}

export default async function GuideModulePage({
  params,
}: PageProps<"/guide/[module]">) {
  const { module: moduleSlug } = await params;
  const guideModule = getGuideModule(moduleSlug);
  if (!guideModule) {
    notFound();
  }

  const entitlement = await getEntitlement();

  if (!canReadGuide(entitlement)) {
    return (
      <PageShell>
        <AccessGate entitlement={entitlement} need="guide" />
      </PageShell>
    );
  }

  const facts = await getPublishedFacts(guideModule.matchesFact);
  const magnetOrder = ["hcs-magnets", ...HCS_MAGNET_SLUGS, "ascte"] as const;
  const slugRanks =
    guideModule.slug === "five-systems" ||
    guideModule.slug === "start-here" ||
    guideModule.slug === "zones-and-addresses" ||
    guideModule.slug === "registration-mechanics"
      ? FIVE_SYSTEM_SLUGS
      : guideModule.slug === "private-and-parochial"
        ? PRIVATE_SCHOOL_SLUGS
        : guideModule.slug === "magnets-and-specialty"
          ? magnetOrder
          : null;
  const orderedFacts = slugRanks
    ? [...facts].sort((a, b) => {
        const bySlug = slugOrder(a.entity_slug, slugRanks) - slugOrder(b.entity_slug, slugRanks);
        if (bySlug !== 0) {
          return bySlug;
        }
        const byField =
          slugOrder(a.field, FIVE_SYSTEM_PROFILE_FIELDS) -
          slugOrder(b.field, FIVE_SYSTEM_PROFILE_FIELDS);
        return byField !== 0 ? byField : a.field.localeCompare(b.field);
      })
    : facts;

  const isStartHere = guideModule.slug === "start-here";
  const pathStep = firstPathStep(guideModule.slug);
  const nextStep = nextFirstPathStep(guideModule.slug);

  const shortlist = isStartHere ? (
    <ShortlistPath
      systems={optionsFromFacts(seedFacts, FIVE_SYSTEM_SLUGS)}
      privateSchools={optionsFromFacts(seedFacts, PRIVATE_SCHOOL_SLUGS)}
      churchSchool={
        seedFacts.find(
          (fact) =>
            fact.entity_slug === "alabama-homeschool" &&
            fact.field === "church_school_definition",
        )?.value ?? ""
      }
      privateTutor={
        seedFacts.find(
          (fact) =>
            fact.entity_slug === "alabama-homeschool" &&
            fact.field === "private_tutor_hours",
        )?.value ?? ""
      }
    />
  ) : null;

  const factList =
    orderedFacts.length > 0 ? <FactList facts={orderedFacts} /> : null;

  return (
    <PageShell>
      <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
        {pathStep
          ? `Module ${guideModule.number} · ${pathStep.minutes}`
          : `Module ${guideModule.number} of ${GUIDE_MODULES.length}`}
      </p>
      <h1 className="mt-2 max-w-2xl font-sans text-[32px] font-semibold leading-tight text-text sm:text-4xl">
        {guideModule.title}
      </h1>
      <p className="mt-4 max-w-xl text-text-muted">
        {pathStep ? pathStep.outcome : guideModule.purpose}
      </p>
      {guideModule.slug === "zones-and-addresses" ? (
        <LeaseCheck facts={orderedFacts} />
      ) : null}
      {isStartHere ? (
        <>
          {shortlist}
          {factList ? (
            <section aria-labelledby="sources-heading" className="mt-12 max-w-xl">
              <h2
                id="sources-heading"
                className="font-sans text-xl font-semibold text-text"
              >
                The sourced facts behind this shortlist
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                Each system&apos;s name, website, and zone locator, with the
                official page it came from and the date we checked it.
              </p>
              {factList}
            </section>
          ) : null}
        </>
      ) : (
        factList
      )}
      {guideModule.unverified.length > 0 ? (
        <section
          aria-labelledby="unverified-heading"
          className="mt-12 max-w-xl border-t border-border pt-6"
        >
          <h2
            id="unverified-heading"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted"
          >
            Not yet confirmed in this edition
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-text-muted">
            {guideModule.unverified.map((item) => (
              <li key={item}>
                <VerifyToken>{item}</VerifyToken>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <nav
        aria-label="Continue reading"
        className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
      >
        {nextStep ? (
          <Link href={`/guide/${nextStep.slug}`} className={primaryButton}>
            Next: {nextStep.label}
          </Link>
        ) : pathStep ? (
          <Link href="/guide" className={primaryButton}>
            Back to your guide
          </Link>
        ) : null}
        <Link href="/guide" className={quietLink}>
          All modules
        </Link>
      </nav>
    </PageShell>
  );
}
