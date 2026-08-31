import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { GUIDE_MODULES, getGuideModule, isGuideModuleSlug } from "./guide-modules.ts";
import {
  MODULE_FILL_FACTS,
  factKey,
  isHttpUrl,
  seedFacts,
  seedFactsMatching,
} from "./seed-facts.ts";

const FILLED_SLUGS = [
  "start-here",
  "homeschool-and-cover-schools",
  "paying-for-it",
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
    "../supabase/migrations/20260831040000_seed_c014_c017_c018_facts.sql",
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

describe("C-014 C-017 C-018 module fill", () => {
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

  it("wires Start Here to five-system name, website, and zone locator facts", () => {
    const guideModule = getGuideModule("start-here");
    assert.ok(guideModule);
    const facts = seedFactsMatching(guideModule.matchesFact);
    assert.ok(facts.some((fact) => fact.entity_slug === "huntsville-city"));
    assert.ok(facts.some((fact) => fact.field === "zone_locator_url"));
    assert.equal(
      facts.every(
        (fact) =>
          fact.field === "name" ||
          fact.field === "website" ||
          fact.field === "zone_locator_url",
      ),
      true,
    );
    assert.match(modulePageSource, /ShortlistPath/);
  });

  it("seeds homeschool process facts with official source URLs", () => {
    const guideModule = getGuideModule("homeschool-and-cover-schools");
    assert.ok(guideModule);
    const facts = seedFactsMatching(guideModule.matchesFact);
    const fields = new Set(facts.map((fact) => fact.field));
    for (const field of [
      "church_school_definition",
      "church_school_enrollment",
      "private_tutor_notice",
      "private_tutor_hours",
      "attendance_register",
    ]) {
      assert.ok(fields.has(field), field);
    }
    assert.ok(
      facts.every(
        (fact) =>
          isHttpUrl(fact.source_url) &&
          fact.source_url.includes("ed.gov"),
      ),
    );
  });

  it("seeds CHOOSE Act amounts, window, redirect, income-cap removal, and SGO status", () => {
    const guideModule = getGuideModule("paying-for-it");
    assert.ok(guideModule);
    const facts = seedFactsMatching(guideModule.matchesFact);
    const byField = new Map(facts.map((fact) => [fact.field, fact]));
    assert.match(byField.get("official_portal")?.value ?? "", /classwallet.com\/alchoose/);
    assert.match(byField.get("esa_participating_school")?.value ?? "", /\$7,000/);
    assert.match(byField.get("esa_home_education")?.value ?? "", /\$2,000/);
    assert.match(byField.get("application_window_2026_27")?.value ?? "", /March 31, 2026/);
    assert.match(byField.get("income_cap_removal")?.value ?? "", /2027/);
    assert.ok(byField.get("still_active"));
    assert.ok(
      facts.every((fact) => isHttpUrl(fact.source_url)),
    );
  });

  it("keeps new seed rows in sync with the new SQL migration", () => {
    for (const fact of MODULE_FILL_FACTS) {
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
    assert.equal(historicSeed.includes("alabama-homeschool"), false);
    assert.equal(historicSeed.includes("alabama-choose-act"), false);
  });

  it("does not put leftover VERIFY-only copy in place of filled process facts", () => {
    const homeschool = getGuideModule("homeschool-and-cover-schools");
    const paying = getGuideModule("paying-for-it");
    assert.ok(homeschool);
    assert.ok(paying);
    assert.equal(
      homeschool.unverified.includes(
        "Alabama homeschool statute, cover-school list, and declaration process",
      ),
      false,
    );
    assert.equal(
      paying.unverified.includes(
        "CHOOSE Act award amounts and SGO list for the current year",
      ),
      false,
    );
    assert.ok(seedFacts.some((fact) => fact.entity_slug === "alabama-homeschool"));
    assert.ok(seedFacts.some((fact) => fact.entity_slug === "alabama-choose-act"));
  });
});
