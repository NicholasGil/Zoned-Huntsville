import { isHttpUrl, type SeedFact } from "./seed-facts.ts";

export type PathChoice = "public" | "private" | "homeschool";

export type ShortlistOption = {
  slug: string;
  name: string;
  website?: string;
  websiteHref?: string;
  zoneLocatorUrl?: string;
};

export type ShortlistItem = {
  label: string;
  detail?: string;
  href?: string;
  locatorHref?: string;
};

export function optionFromFacts(
  facts: readonly SeedFact[],
  slug: string,
): ShortlistOption {
  const forSlug = facts.filter((fact) => fact.entity_slug === slug);
  const name = forSlug.find((fact) => fact.field === "name")?.value ?? slug;
  const websiteFact = forSlug.find((fact) => fact.field === "website");
  const zoneFact = forSlug.find((fact) => fact.field === "zone_locator_url");
  return {
    slug,
    name,
    website: websiteFact?.value,
    websiteHref: websiteFact
      ? isHttpUrl(websiteFact.value)
        ? websiteFact.value
        : websiteFact.source_url
      : undefined,
    zoneLocatorUrl:
      zoneFact && isHttpUrl(zoneFact.value) ? zoneFact.value : undefined,
  };
}

export function optionsFromFacts(
  facts: readonly SeedFact[],
  slugs: readonly string[],
): ShortlistOption[] {
  return slugs.map((slug) => optionFromFacts(facts, slug));
}

export function publicLocatorShortlist(
  systems: readonly ShortlistOption[],
): ShortlistOption[] {
  return systems.filter((system) => Boolean(system.zoneLocatorUrl));
}

export function systemsWithoutLocator(
  systems: readonly ShortlistOption[],
): ShortlistOption[] {
  return systems.filter((system) => !system.zoneLocatorUrl);
}

export function publicShortlistItems(
  systems: readonly ShortlistOption[],
  locatorSchools: Readonly<Record<string, string>>,
): ShortlistItem[] {
  return publicLocatorShortlist(systems).map((system) => {
    const lookedUp = locatorSchools[system.slug]?.trim();
    return {
      label: lookedUp
        ? `${lookedUp} (zoned lookup via ${system.name})`
        : system.name,
      detail: system.website,
      href: system.websiteHref,
      locatorHref: system.zoneLocatorUrl,
    };
  });
}

export function privateShortlistItems(
  schools: readonly ShortlistOption[],
  pickedSlugs: readonly string[],
): ShortlistItem[] {
  return pickedSlugs
    .map((slug) => schools.find((school) => school.slug === slug))
    .filter((school): school is ShortlistOption => Boolean(school))
    .map((school) => ({
      label: school.name,
      detail: school.website,
      href: school.websiteHref,
    }));
}

export function homeschoolShortlistItems(options: {
  churchSchool: string;
  privateTutor: string;
}): ShortlistItem[] {
  return [
    { label: "Church-school / cover-school option", detail: options.churchSchool },
    { label: "Private-tutor option", detail: options.privateTutor },
    {
      label: "Named Huntsville-area cover-school list",
      detail:
        "This edition does not publish a cover-school list for Huntsville.",
    },
  ];
}
