import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { GUIDE_MODULES, getGuideModule } from "./guide-modules.ts";
import {
  LEFTOVER_S2_FACTS,
  PRIVATE_SCHOOL_SLUGS,
  factKey,
  isHttpUrl,
  seedFacts,
  seedFactsMatching,
} from "./seed-facts.ts";

const FILLED_SLUGS = ["five-systems", "private-and-parochial"] as const;

const modulePageSource = readFileSync(
  new URL("../app/guide/[module]/page.tsx", import.meta.url),
  "utf8",
);
const guideIndexSource = readFileSync(
  new URL("../app/guide/page.tsx", import.meta.url),
  "utf8",
);
const privacySource = readFileSync(
  new URL("../app/legal/privacy/page.tsx", import.meta.url),
  "utf8",
);
const termsSource = readFileSync(
  new URL("../app/legal/terms/page.tsx", import.meta.url),
  "utf8",
);
const fillMigration = readFileSync(
  new URL(
    "../supabase/migrations/20260831121500_seed_c021_c022_c011_facts.sql",
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
const stripeSource = readFileSync(
  new URL("./env.ts", import.meta.url),
  "utf8",
);
const headerSource = readFileSync(
  new URL("../components/site-header.tsx", import.meta.url),
  "utf8",
);

const PRIVATE_TUITION_DOLLARS = /\$[\d,]+/;

describe("C-021 C-022 C-011 leftover VERIFY", () => {
  it("returns published facts for five-systems and private-and-parochial", () => {
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

  it("still gates /guide and /guide/[module] behind AccessGate", () => {
    assert.match(guideIndexSource, /AccessGate/);
    assert.match(guideIndexSource, /canReadGuide/);
    assert.match(modulePageSource, /AccessGate/);
    assert.match(modulePageSource, /canReadGuide/);
    assert.match(modulePageSource, /need="guide"/);
    assert.equal(guideIndexSource.includes("canReadGuide(entitlement)"), true);
    assert.equal(modulePageSource.includes("canReadGuide(entitlement)"), true);
  });

  it("sources Madison City superintendent, address, and non-resident text; keeps mailing and phone exceptions as VERIFY", () => {
    const guideModule = getGuideModule("five-systems");
    assert.ok(guideModule);
    const facts = seedFactsMatching(guideModule.matchesFact);
    const superintendent = facts.find(
      (fact) =>
        fact.entity_slug === "madison-city" && fact.field === "superintendent",
    );
    assert.ok(superintendent);
    assert.equal(superintendent.value, "Eric Terrell");
    assert.equal(
      superintendent.source_url,
      "https://www.madisoncity.k12.al.us/superintendents-message",
    );
    assert.ok(isHttpUrl(superintendent.source_url));
    const address = facts.find(
      (fact) => fact.entity_slug === "madison-city" && fact.field === "address",
    );
    assert.ok(address);
    assert.match(address.value, /211 Celtic Drive/);
    assert.match(address.value, /Title IX Coordinator address/);
    assert.match(address.source_url, /district-title-ix-information/);
    const nonResident = facts.find(
      (fact) =>
        fact.entity_slug === "madison-city" &&
        fact.field === "non_resident_path",
    );
    assert.ok(nonResident);
    assert.match(nonResident.value, /reside within Madison City School Zone/);
    assert.match(nonResident.value, /VERIFY: confirm zero exceptions by phone/);
    assert.equal(
      facts.some(
        (fact) =>
          fact.entity_slug === "madison-city" &&
          fact.field === "mailing_address",
      ),
      false,
    );
    assert.ok(
      guideModule.unverified.some((item) =>
        item.includes("Madison City mailing address"),
      ),
    );
    assert.ok(
      guideModule.unverified.some((item) =>
        item.includes("confirm zero Madison City non-resident exceptions"),
      ),
    );
  });

  it("sources Limestone County superintendent from lcsk12.org and does not re-seed the zone map", () => {
    const guideModule = getGuideModule("five-systems");
    assert.ok(guideModule);
    const facts = seedFactsMatching(guideModule.matchesFact);
    const superintendent = facts.find(
      (fact) =>
        fact.entity_slug === "limestone-county" &&
        fact.field === "superintendent",
    );
    assert.ok(superintendent);
    assert.equal(superintendent.value, "Randy Shearouse");
    assert.equal(superintendent.source_url, "https://www.lcsk12.org/staff");
    const leftoverZone = LEFTOVER_S2_FACTS.filter(
      (fact) =>
        fact.entity_slug === "limestone-county" &&
        fact.field === "zone_locator_url",
    );
    assert.equal(leftoverZone.length, 0);
    assert.ok(
      facts.some(
        (fact) =>
          fact.entity_slug === "limestone-county" &&
          fact.field === "zone_locator_url" &&
          fact.source_url.includes("lcsk12.org/page/school-zone-map"),
      ),
    );
    assert.equal(
      guideModule.unverified.some((item) =>
        item.includes("Limestone County superintendent"),
      ),
      false,
    );
  });

  it("keeps Holy Spirit with a real official URL and drops the fake prospectus source", () => {
    const holy = seedFacts.filter(
      (fact) => fact.entity_slug === "holy-spirit-regional",
    );
    assert.ok(holy.length > 0);
    for (const fact of holy) {
      assert.ok(isHttpUrl(fact.source_url), factKey(fact));
      assert.match(fact.source_url, /hstigers\.org/);
      assert.equal(fact.source_url.includes("VERIFY"), false, factKey(fact));
      assert.equal(fact.verification_method, "official_page", factKey(fact));
    }
    assert.ok(holy.some((fact) => fact.field === "website"));
    assert.ok(holy.some((fact) => fact.field === "admissions_process"));
    assert.match(historicSeed, /⟦VERIFY: Holy Spirit Regional diocesan prospectus URL⟧/);
    assert.match(fillMigration, /hstigers\.org/);
  });

  it("seeds official admissions notes for the seven named schools and keeps missing open dates as VERIFY", () => {
    const guideModule = getGuideModule("private-and-parochial");
    assert.ok(guideModule);
    const facts = seedFactsMatching(guideModule.matchesFact);
    for (const slug of PRIVATE_SCHOOL_SLUGS) {
      assert.ok(
        facts.some(
          (fact) => fact.entity_slug === slug && fact.field === "admissions_process",
        ),
        slug,
      );
      assert.ok(
        facts.some(
          (fact) =>
            fact.entity_slug === slug && fact.field === "tuition_publication",
        ),
        `${slug} tuition_publication`,
      );
    }
    const westminsterOpen = facts.find(
      (fact) =>
        fact.entity_slug === "westminster" && fact.field === "next_cycle",
    );
    assert.ok(westminsterOpen);
    assert.match(westminsterOpen.value, /November 16/);
    assert.ok(
      facts.some(
        (fact) =>
          fact.entity_slug === "randolph" &&
          fact.field === "admissions_process" &&
          fact.value.includes("VERIFY"),
      ),
    );
    assert.ok(
      guideModule.unverified.some((item) =>
        item.includes("applications-open dates"),
      ),
    );
    assert.equal(
      guideModule.unverified.includes(
        "published tuition for each private school that releases a figure",
      ),
      false,
    );
  });

  it("does not publish private-school tuition figures or add Lincoln/Madison Academy", () => {
    const guideModule = getGuideModule("private-and-parochial");
    assert.ok(guideModule);
    const facts = seedFactsMatching(guideModule.matchesFact);
    for (const fact of facts.filter((item) => item.field === "tuition_publication")) {
      assert.equal(PRIVATE_TUITION_DOLLARS.test(fact.value), false, factKey(fact));
      assert.match(fact.value, /does not publish a tuition figure/);
    }
    const catalog = seedFacts
      .filter((fact) =>
        (PRIVATE_SCHOOL_SLUGS as readonly string[]).includes(fact.entity_slug),
      )
      .map((fact) => fact.value)
      .join("\n");
    assert.equal(catalog.includes("Lincoln Academy"), false);
    assert.equal(catalog.includes("Madison Academy"), false);
    assert.equal(
      GUIDE_MODULES.some((module) => /Lincoln Academy|Madison Academy/.test(module.purpose)),
      false,
    );
    assert.deepEqual([...PRIVATE_SCHOOL_SLUGS], [
      "randolph",
      "westminster",
      "whitesburg-christian",
      "st-john-the-baptist-madison",
      "holy-spirit-regional",
      "grace-lutheran",
      "providence-classical",
    ]);
  });

  it("keeps the CAN-SPAM mailbox as VERIFY and describes retention without a fake day count", () => {
    assert.match(privacySource, /physical mailbox for CAN-SPAM/);
    assert.match(termsSource, /physical mailbox for CAN-SPAM/);
    assert.equal(privacySource.includes("P.O. Box"), false);
    assert.equal(termsSource.includes("P.O. Box"), false);
    assert.match(privacySource, /Entitlement rows stay/);
    assert.match(privacySource, /leads\s+table/);
    assert.equal(
      privacySource.includes("retention schedule for leads and entitlements"),
      false,
    );
    assert.equal(/\d+\s+days/.test(privacySource), false);
  });

  it("does not touch Stripe, hover, or hamburger", () => {
    assert.match(stripeSource, /STRIPE_SECRET_KEY/);
    assert.equal(headerSource.includes("hamburger"), false);
    assert.equal(modulePageSource.includes("hamburger"), false);
  });

  it("keeps new seed rows in sync with the new SQL migration", () => {
    for (const fact of LEFTOVER_S2_FACTS) {
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
    assert.match(
      historicSeed,
      /⟦VERIFY: Holy Spirit Regional diocesan prospectus URL⟧/,
    );
    assert.equal(historicSeed.includes("hstigers.org"), false);
    assert.equal(historicSeed.includes("Eric Terrell"), false);
    assert.equal(historicSeed.includes("Randy Shearouse"), false);
    assert.ok(
      seedFacts.some(
        (fact) =>
          fact.entity_slug === "holy-spirit-regional" &&
          fact.source_url.includes("hstigers.org"),
      ),
    );
  });
});
