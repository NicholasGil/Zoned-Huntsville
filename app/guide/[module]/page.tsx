import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FactList } from "@/components/fact-list";
import { AccessGate } from "@/components/gate";
import { PageShell } from "@/components/page-shell";
import { VerifyToken } from "@/components/verify-token";
import { canReadGuide, getEntitlement } from "@/lib/entitlement";
import { getPublishedFacts } from "@/lib/facts";
import { GUIDE_MODULES, getGuideModule } from "@/lib/guide-modules";
import { FIVE_SYSTEM_SLUGS, PRIVATE_SCHOOL_SLUGS, slugOrder } from "@/lib/seed-facts";

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
  const slugRanks =
    guideModule.slug === "five-systems"
      ? FIVE_SYSTEM_SLUGS
      : guideModule.slug === "private-and-parochial"
        ? PRIVATE_SCHOOL_SLUGS
        : null;
  const orderedFacts = slugRanks
    ? [...facts].sort((a, b) => {
        const bySlug = slugOrder(a.entity_slug, slugRanks) - slugOrder(b.entity_slug, slugRanks);
        return bySlug !== 0 ? bySlug : a.field.localeCompare(b.field);
      })
    : facts;

  return (
    <PageShell>
      <p className="text-sm uppercase tracking-[0.16em] text-muted">
        Module {guideModule.number}
      </p>
      <h1 className="mt-3 font-serif text-4xl text-ink">{guideModule.title}</h1>
      <p className="mt-4 max-w-xl text-muted">{guideModule.purpose}</p>
      {orderedFacts.length > 0 ? <FactList facts={orderedFacts} /> : null}
      {guideModule.unverified.length > 0 ? (
        <div className="mt-10 max-w-xl space-y-3 text-muted">
          {guideModule.unverified.map((item) => (
            <p key={item}>
              <VerifyToken>{item}</VerifyToken>
            </p>
          ))}
        </div>
      ) : null}
      <p className="mt-10">
        <Link href="/guide" className="text-brick hover:underline">
          All modules
        </Link>
      </p>
    </PageShell>
  );
}
