import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { GUIDE_MODULES, getGuideModule, isGuideModuleSlug } from "./guide-modules.ts";
import {
  HCS_MAGNET_SLUGS,
  ZONE_MAGNET_REG_FACTS,
  factKey,
  isHttpUrl,
  seedFacts,
  seedFactsMatching,
} from "./seed-facts.ts";

const FILLED_SLUGS = [
  "zones-and-addresses",
  "magnets-and-specialty",
  "registration-mechanics",
] as const;

const modulePageSource = readFileSync(
  new URL("../app/guide/[module]/page.tsx", import.meta.url),
  "utf8",
);
const guideIndexSource = readFileSync(
  new URL("../app/guide/page.tsx", import.meta.url),
  "utf8",
);
const fillMigration = readFileSync(
  new URL(
    "../supabase/migrations/20260831053000_seed_c015_c016_c019_facts.sql",
    import.meta.url,
  ),
  "utf8",
);
const historicSeed = readFileSync(
  new URL(
    "../supabase/migrations/20260830120100_seed_sourced_facts.sql",
    import.meta.url,
  ),
  "utf8",
);

describe("C-015 C-016 C-019 module fill", () => {
  it("returns published facts for the three filled modules", () => {
    for (const slug of FILLED_SLUGS) {
      const guideModule = getGuideModule(slug);
      assert.ok(guideModule, slug);
      const facts = seedFactsMatching(guideModule.matchesFact);
      assert.ok(facts.length > 0, `${slug} should have published facts`);
      for (const fact of facts) {
        assert.ok(fact.source_url.length > 0, factKey(fact));
        assert.ok(fact.verified_at.length > 0, factKey(fact));
      }
    }
  });

  it("keeps unknown slugs off the module list so the page 404s", () => {
    assert.equal(getGuideModule("not-a-module"), null);
    assert.equal(isGuideModuleSlug("not-a-module"), false);
    assert.equal(GUIDE_MODULES.some((module) => module.slug === "not-a-module"), false);
  });

  it("still gates /guide and /guide/[module] behind AccessGate", () => {
    assert.match(guideIndexSource, /AccessGate/);
    assert.match(guideIndexSource, /canReadGuide/);
    assert.match(modulePageSource, /AccessGate/);
    assert.match(modulePageSource, /canReadGuide/);
    assert.match(modulePageSource, /need="guide"/);
  });

  it("does not un-gate /guide", () => {
    assert.equal(guideIndexSource.includes("canReadGuide(entitlement)"), true);
    assert.equal(modulePageSource.includes("canReadGuide(entitlement)"), true);
  });

  it("teaches a lease check and adds the Limestone official zone map", () => {
    const guideModule = getGuideModule("zones-and-addresses");
    assert.ok(guideModule);
    const facts = seedFactsMatching(guideModule.matchesFact);
    assert.ok(facts.some((fact) => fact.entity_slug === "limestone-county" && fact.field === "zone_locator_url"));
    assert.ok(
      facts.some(
        (fact) =>
          fact.entity_slug === "athens-city" &&
          fact.field === "zone_check_instruction" &&
          fact.value.includes("(256) 233-6600"),
      ),
    );
    assert.ok(facts.some((fact) => fact.field === "how_to_check_before_lease"));
    assert.ok(
      facts.some(
        (fact) =>
          fact.entity_slug === "madison-city" &&
          fact.field === "rezoning_status" &&
          fact.source_url.includes("vision-mission"),
      ),
    );
    assert.equal(
      facts.some(
        (fact) =>
          fact.entity_slug === "athens-city" && fact.field === "zone_locator_url",
      ),
      false,
    );
    assert.match(modulePageSource, /LeaseCheck/);
    assert.equal(
      guideModule.unverified.includes(
        "Athens City and Limestone County official zone locators",
      ),
      false,
    );
  });

  it("adds the seven HCS magnets beside ASCTE and marks New Century 2026–27 as secondary", () => {
    const guideModule = getGuideModule("magnets-and-specialty");
    assert.ok(guideModule);
    const facts = seedFactsMatching(guideModule.matchesFact);
    assert.ok(facts.some((fact) => fact.entity_slug === "ascte"));
    for (const slug of HCS_MAGNET_SLUGS) {
      assert.ok(
        facts.some((fact) => fact.entity_slug === slug && fact.field === "name"),
        slug,
      );
    }
    const ncthsSeats = facts.find(
      (fact) =>
        fact.entity_slug === "new-century-technology" &&
        fact.field === "seats_2026_27",
    );
    assert.ok(ncthsSeats);
    assert.equal(ncthsSeats.verification_method, "secondary");
    assert.match(ncthsSeats.source_url, /axios.com/);
    assert.match(ncthsSeats.value, /135/);
    const office = facts.find(
      (fact) =>
        fact.entity_slug === "hcs-magnets" && fact.field === "magnet_office_phone",
    );
    assert.ok(office);
    assert.match(office.value, /256-924-1113/);
    assert.equal(office.verification_method, "official_page");
    const nextWindow = facts.find(
      (fact) =>
        fact.entity_slug === "new-century-technology" &&
        fact.field === "application_window_2027_28",
    );
    assert.ok(nextWindow);
    assert.match(nextWindow.value, /VERIFY/);
  });

  it("adds per-district registration documents and keeps rolling Madison County dates as VERIFY", () => {
    const guideModule = getGuideModule("registration-mechanics");
    assert.ok(guideModule);
    const facts = seedFactsMatching(guideModule.matchesFact);
    assert.ok(
      facts.some(
        (fact) =>
          fact.entity_slug === "madison-city" &&
          fact.field === "registration_documents" &&
          fact.value.includes("Birth certificate"),
      ),
    );
    assert.ok(
      facts.some(
        (fact) =>
          fact.entity_slug === "madison-county" &&
          fact.field === "registration_documents",
      ),
    );
    const mcssDates = facts.find(
      (fact) =>
        fact.entity_slug === "madison-county" &&
        fact.field === "registration_timeline",
    );
    assert.ok(mcssDates);
    assert.match(mcssDates.value, /VERIFY/);
    assert.ok(
      facts.some(
        (fact) =>
          fact.entity_slug === "athens-city" &&
          fact.field === "registration_documents" &&
          fact.value.includes("Alabama immunization"),
      ),
    );
    assert.ok(
      facts.some(
        (fact) =>
          fact.entity_slug === "athens-city" &&
          fact.field === "non_resident_policy" &&
          fact.value.includes("$1,200"),
      ),
    );
    assert.equal(
      guideModule.unverified.includes(
        "registration windows and document checklists for each district",
      ),
      false,
    );
  });

  it("keeps new seed rows in sync with the new SQL migration", () => {
    for (const fact of ZONE_MAGNET_REG_FACTS) {
      assert.ok(
        fillMigration.includes(`'${fact.entity_slug}'`),
        fact.entity_slug,
      );
      assert.ok(fillMigration.includes(`'${fact.field}'`), fact.field);
      assert.ok(fillMigration.includes(fact.source_url), fact.source_url);
    }
    assert.match(fillMigration, /on conflict \(entity_type, entity_slug, field\)/);
  });

  it("does not rewrite the historic sourced-facts seed", () => {
    assert.match(historicSeed, /Huntsville City Schools/);
    assert.equal(historicSeed.includes("hcs-magnets"), false);
    assert.equal(historicSeed.includes("new-century-technology"), false);
    assert.equal(historicSeed.includes("lcsk12.org/page/school-zone-map"), false);
    assert.ok(seedFacts.some((fact) => fact.entity_slug === "hcs-magnets"));
  });
});
