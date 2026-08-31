import {
  FIVE_SYSTEM_SLUGS,
  fieldLabel,
  type SeedFact,
} from "./seed-facts.ts";

export const TOOLKIT_SHIPPED = [
  "Registration Document Checklist",
  "Zone-vs-listing cross-check",
  "School comparison",
  "Sourced application windows",
] as const;

export const TOOLKIT_UNIMPLEMENTED = [
  {
    name: "Call Script Pack",
    verify: "this edition does not invent admissions questions",
  },
] as const;

const CHECKLIST_FIELD = "registration_documents";

const ZONE_FIELDS = [
  "zone_locator_url",
  "how_to_check_before_lease",
  "zone_check_instruction",
  "rezoning_status",
] as const;

const WINDOW_FIELDS = [
  "application_window_2026_27",
  "application_window_2027_28",
  "application_portal",
  "next_cycle",
  "registration_timeline",
] as const;

const WINDOW_ORDER = [
  "alabama-choose-act:application_window_2026_27",
  "alabama-choose-act:next_cycle",
  "hcs-magnets:application_portal",
  "new-century-technology:application_window_2026_27",
  "new-century-technology:application_window_2027_28",
  "madison-county:registration_timeline",
] as const;

const COMPARISON_NAME_SLUGS = [
  ...FIVE_SYSTEM_SLUGS,
  "hcs-magnets",
  "new-century-technology",
  "alabama-choose-act",
] as const;

export type DistrictChecklist = {
  slug: string;
  name: string;
  fact: SeedFact;
  items: string[];
  isVerify: boolean;
};

export type ComparisonRow = {
  slug: string;
  name: string;
  nameFact?: SeedFact;
  websiteFact?: SeedFact;
  locatorFact?: SeedFact;
  enrollmentFact?: SeedFact;
};

export type ApplicationWindow = {
  entityName: string;
  fieldLabel: string;
  fact: SeedFact;
};

export function isVerifyValue(value: string): boolean {
  return value.includes("⟦VERIFY");
}

export function splitSourcedChecklistItems(value: string): string[] {
  if (isVerifyValue(value)) {
    return [value];
  }

  const items: string[] = [];
  let current = "";
  let depth = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth = Math.max(0, depth - 1);
    }
    if (depth === 0 && value.startsWith("; ", i)) {
      const item = current.trim();
      if (item) {
        items.push(item);
      }
      current = "";
      i += 1;
      continue;
    }
    current += char;
  }
  const last = current.trim();
  if (last) {
    items.push(last);
  }
  return items.length > 0 ? items : [value];
}

export function entityName(
  facts: readonly SeedFact[],
  slug: string,
): string {
  return (
    facts.find((fact) => fact.entity_slug === slug && fact.field === "name")
      ?.value ?? slug
  );
}

export function isToolkitFact(fact: SeedFact): boolean {
  if (fact.field === "name") {
    return (COMPARISON_NAME_SLUGS as readonly string[]).includes(
      fact.entity_slug,
    );
  }
  if (fact.field === CHECKLIST_FIELD) {
    return (FIVE_SYSTEM_SLUGS as readonly string[]).includes(fact.entity_slug);
  }
  if ((ZONE_FIELDS as readonly string[]).includes(fact.field)) {
    return true;
  }
  if (
    fact.field === "website" ||
    fact.field === "enrollment_path" ||
    fact.field === "enrollment"
  ) {
    return (
      fact.entity_type === "district" &&
      (FIVE_SYSTEM_SLUGS as readonly string[]).includes(fact.entity_slug)
    );
  }
  return (WINDOW_FIELDS as readonly string[]).includes(fact.field);
}

export function registrationChecklists(
  facts: readonly SeedFact[],
): DistrictChecklist[] {
  return FIVE_SYSTEM_SLUGS.flatMap((slug) => {
    const fact = facts.find(
      (row) => row.entity_slug === slug && row.field === CHECKLIST_FIELD,
    );
    if (!fact) {
      return [];
    }
    return [
      {
        slug,
        name: entityName(facts, slug),
        fact,
        items: splitSourcedChecklistItems(fact.value),
        isVerify: isVerifyValue(fact.value),
      },
    ];
  });
}

export function comparisonRows(facts: readonly SeedFact[]): ComparisonRow[] {
  return FIVE_SYSTEM_SLUGS.map((slug) => {
    const forSlug = facts.filter((fact) => fact.entity_slug === slug);
    return {
      slug,
      name: entityName(facts, slug),
      nameFact: forSlug.find((fact) => fact.field === "name"),
      websiteFact: forSlug.find((fact) => fact.field === "website"),
      locatorFact:
        forSlug.find((fact) => fact.field === "zone_locator_url") ??
        forSlug.find((fact) => fact.field === "zone_check_instruction"),
      enrollmentFact:
        forSlug.find((fact) => fact.field === "enrollment_path") ??
        forSlug.find((fact) => fact.field === "enrollment"),
    };
  });
}

export function applicationWindows(
  facts: readonly SeedFact[],
): ApplicationWindow[] {
  const wanted = new Set<string>(WINDOW_FIELDS);
  const rows = facts
    .filter((fact) => wanted.has(fact.field))
    .map((fact) => ({
      entityName: entityName(facts, fact.entity_slug),
      fieldLabel: fieldLabel(fact.field),
      fact,
    }));
  return rows.sort((a, b) => {
    const keyA = `${a.fact.entity_slug}:${a.fact.field}`;
    const keyB = `${b.fact.entity_slug}:${b.fact.field}`;
    const rankA = WINDOW_ORDER.indexOf(keyA as (typeof WINDOW_ORDER)[number]);
    const rankB = WINDOW_ORDER.indexOf(keyB as (typeof WINDOW_ORDER)[number]);
    const safeA = rankA === -1 ? WINDOW_ORDER.length : rankA;
    const safeB = rankB === -1 ? WINDOW_ORDER.length : rankB;
    return safeA - safeB;
  });
}

export function zoneFacts<T extends SeedFact>(facts: readonly T[]): T[] {
  return facts.filter((fact) =>
    (ZONE_FIELDS as readonly string[]).includes(fact.field),
  );
}

export function officialLocatorFacts(facts: readonly SeedFact[]): SeedFact[] {
  return FIVE_SYSTEM_SLUGS.flatMap((slug) => {
    const locator = facts.find(
      (fact) => fact.entity_slug === slug && fact.field === "zone_locator_url",
    );
    if (locator) {
      return [locator];
    }
    const instruction = facts.find(
      (fact) =>
        fact.entity_slug === slug && fact.field === "zone_check_instruction",
    );
    return instruction ? [instruction] : [];
  });
}

