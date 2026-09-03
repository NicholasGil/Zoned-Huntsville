import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  FIRST_PATH,
  FIRST_PATH_SLUGS,
  firstPathModules,
  firstPathStep,
  isFirstPathSlug,
  nextFirstPathStep,
} from "./first-path.ts";
import { GUIDE_MODULES, getGuideModule } from "./guide-modules.ts";
import { seedFactsMatching } from "./seed-facts.ts";

const guideIndexSource = readFileSync(
  new URL("../app/guide/page.tsx", import.meta.url),
  "utf8",
);
const modulePageSource = readFileSync(
  new URL("../app/guide/[module]/page.tsx", import.meta.url),
  "utf8",
);
const pathComponentSources = [
  "../components/shortlist-path.tsx",
  "../components/fact-list.tsx",
  "../components/sourced-fact.tsx",
  "../components/lease-check.tsx",
  "../components/gate.tsx",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

const LEGACY_TOKENS = /font-serif|text-ink|text-brick|border-rule|bg-paper/;

describe("first 15 minutes after purchase", () => {
  it("walks Start Here, then Five Systems, then Zones", () => {
    assert.deepEqual([...FIRST_PATH_SLUGS], [
      "start-here",
      "five-systems",
      "zones-and-addresses",
    ]);
    assert.deepEqual(
      FIRST_PATH.map((step) => step.slug),
      [...FIRST_PATH_SLUGS],
    );
    assert.equal(nextFirstPathStep("start-here")?.slug, "five-systems");
    assert.equal(nextFirstPathStep("five-systems")?.slug, "zones-and-addresses");
    assert.equal(nextFirstPathStep("zones-and-addresses"), null);
    assert.equal(nextFirstPathStep("paying-for-it"), null);
    assert.equal(isFirstPathSlug("magnets-and-specialty"), false);
    assert.equal(firstPathStep("registration-mechanics"), null);
  });

  it("only routes to modules that already ship sourced facts", () => {
    const modules = firstPathModules();
    assert.equal(modules.length, 3);
    for (const guideModule of modules) {
      const facts = seedFactsMatching(guideModule.matchesFact);
      assert.ok(facts.length > 0, guideModule.slug);
      for (const fact of facts) {
        assert.ok(fact.source_url.length > 0);
        assert.ok(fact.verified_at.length > 0);
      }
      // A step is real content, not a VERIFY-only stub.
      assert.ok(facts.length > guideModule.unverified.length, guideModule.slug);
    }
  });

  it("keeps the heavier VERIFY leftovers off the first path", () => {
    const onPath = new Set<string>(FIRST_PATH_SLUGS);
    const offPath = GUIDE_MODULES.filter((entry) => !onPath.has(entry.slug));
    assert.deepEqual(
      offPath.map((entry) => entry.slug),
      [
        "magnets-and-specialty",
        "private-and-parochial",
        "homeschool-and-cover-schools",
        "paying-for-it",
        "registration-mechanics",
      ],
    );
    const maxOnPath = Math.max(
      ...firstPathModules().map((entry) => entry.unverified.length),
    );
    for (const slug of ["magnets-and-specialty", "registration-mechanics"]) {
      const guideModule = getGuideModule(slug);
      assert.ok(guideModule);
      assert.ok(guideModule.unverified.length > maxOnPath, slug);
    }
  });

  it("does not invent facts in the path copy", () => {
    for (const step of FIRST_PATH) {
      assert.equal(/\$\d/.test(step.outcome), false, step.slug);
      assert.equal(/\(\d{3}\)/.test(step.outcome), false, step.slug);
      assert.equal(step.outcome.includes("VERIFY"), false, step.slug);
    }
  });

  it("lands /guide on one primary 44px click into Start Here, with all modules below", () => {
    assert.match(guideIndexSource, /FIRST_PATH/);
    assert.match(guideIndexSource, /primaryButton/);
    assert.match(guideIndexSource, /Start the 10-minute shortlist/);
    const primaryIndex = guideIndexSource.indexOf("Start the 10-minute shortlist");
    const allModulesIndex = guideIndexSource.indexOf("All eight modules");
    assert.ok(primaryIndex > 0);
    assert.ok(allModulesIndex > primaryIndex);
    assert.match(guideIndexSource, /GUIDE_MODULES\.map/);
    assert.match(guideIndexSource, /href="\/guide\/tools"/);
    assert.equal(guideIndexSource.includes("Remaining holes stay marked"), false);
    assert.equal(guideIndexSource.includes("check your email"), false);
  });

  it("still gates unpaid /guide and /guide/[module]", () => {
    assert.match(guideIndexSource, /AccessGate/);
    assert.equal(guideIndexSource.includes("canReadGuide(entitlement)"), true);
    assert.match(modulePageSource, /AccessGate/);
    assert.match(modulePageSource, /need="guide"/);
    assert.equal(modulePageSource.includes("canReadGuide(entitlement)"), true);
  });

  it("chains Next links along the path and puts the shortlist tool before its sources", () => {
    assert.match(modulePageSource, /nextFirstPathStep/);
    assert.match(modulePageSource, /Next: \{nextStep\.label\}/);
    assert.match(modulePageSource, /ShortlistPath/);
    assert.match(modulePageSource, /LeaseCheck/);
    const shortlistIndex = modulePageSource.indexOf("{shortlist}");
    const sourcesIndex = modulePageSource.indexOf(
      "The sourced facts behind this shortlist",
    );
    assert.ok(shortlistIndex > 0);
    assert.ok(sourcesIndex > shortlistIndex);
  });

  it("ships civic tokens on the reading path, not leftover serif/brick", () => {
    assert.equal(LEGACY_TOKENS.test(guideIndexSource), false);
    assert.equal(LEGACY_TOKENS.test(modulePageSource), false);
    for (const source of pathComponentSources) {
      assert.equal(LEGACY_TOKENS.test(source), false);
    }
    const buttonStyles = readFileSync(
      new URL("../components/button-styles.ts", import.meta.url),
      "utf8",
    );
    assert.match(buttonStyles, /primaryButton = `inline-flex min-h-11/);
    assert.match(buttonStyles, /bg-action/);
  });
});
