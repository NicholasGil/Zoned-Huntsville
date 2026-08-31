import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { canReadToolkit } from "./entitlement.ts";
import { salesCopy } from "./sales.ts";
import { FIVE_SYSTEM_SLUGS, seedFacts } from "./seed-facts.ts";
import { hero, pricingTiers } from "./site.ts";
import {
  applicationWindows,
  comparisonRows,
  isToolkitFact,
  officialLocatorFacts,
  registrationChecklists,
  splitSourcedChecklistItems,
  TOOLKIT_SHIPPED,
  TOOLKIT_UNIMPLEMENTED,
  toolkitIsGatedFor,
} from "./toolkit.ts";

const toolsPageSource = readFileSync(
  new URL("../app/guide/tools/page.tsx", import.meta.url),
  "utf8",
);
const worksheetsSource = readFileSync(
  new URL("../components/toolkit-worksheets.tsx", import.meta.url),
  "utf8",
);
const siteSource = readFileSync(new URL("./site.ts", import.meta.url), "utf8");
const salesSource = readFileSync(new URL("./sales.ts", import.meta.url), "utf8");

const UNCLAIMED_ON_SALES = [
  "School Comparison Worksheet",
  "Deadline Calendar",
  "Registration Document Checklist",
  "Call Script Pack",
  "Zone-vs-Listing",
] as const;

function homepageOfferText(): string {
  return [
    hero.headline,
    hero.subhead,
    hero.credibility,
    ...pricingTiers.flatMap((tier) => [tier.name, ...tier.includes]),
    salesCopy.mechanism,
    ...salesCopy.whatsInTheGuide,
    ...salesCopy.objections.flatMap((item) => [item.question, item.answer]),
    ...salesCopy.faq.flatMap((item) => [item.question, item.answer]),
  ].join("\n");
}

describe("C-020 toolkit", () => {
  const facts = seedFacts.filter(isToolkitFact);

  it("still gates /guide/tools behind AccessGate need=toolkit", () => {
    assert.match(toolsPageSource, /AccessGate/);
    assert.match(toolsPageSource, /canReadToolkit/);
    assert.match(toolsPageSource, /need="toolkit"/);
    assert.equal(toolsPageSource.includes("canReadToolkit(entitlement)"), true);
    assert.equal(toolkitIsGatedFor({ kind: "anonymous" }), true);
    assert.equal(
      toolkitIsGatedFor({
        kind: "signed-in",
        hasGuide: true,
        hasToolkit: false,
        hasCall: false,
      }),
      true,
    );
    assert.equal(
      canReadToolkit({
        kind: "signed-in",
        hasGuide: true,
        hasToolkit: false,
        hasCall: false,
      }),
      false,
    );
    assert.equal(
      canReadToolkit({
        kind: "signed-in",
        hasGuide: true,
        hasToolkit: true,
        hasCall: false,
      }),
      true,
    );
    assert.equal(
      canReadToolkit({
        kind: "signed-in",
        hasGuide: true,
        hasToolkit: true,
        hasCall: true,
      }),
      true,
    );
  });

  it("does not un-gate /guide or /guide/tools", () => {
    const guideIndexSource = readFileSync(
      new URL("../app/guide/page.tsx", import.meta.url),
      "utf8",
    );
    assert.equal(guideIndexSource.includes("canReadGuide(entitlement)"), true);
    assert.equal(toolsPageSource.includes("canReadToolkit(entitlement)"), true);
    assert.equal(toolsPageSource.includes("canReadGuide(entitlement)"), false);
  });

  it("entitled page source ships the sourced checklists and drops the empty stub", () => {
    assert.match(toolsPageSource, /ToolkitWorksheets/);
    assert.equal(
      toolsPageSource.includes(
        "The downloadable worksheets are not implemented in this build.",
      ),
      false,
    );
    for (const heading of TOOLKIT_SHIPPED) {
      assert.equal(worksheetsSource.includes(heading), true, heading);
    }
    assert.match(worksheetsSource, /LeaseCheck/);
    assert.match(worksheetsSource, /Call Script Pack is not implemented/);
  });

  it("renders per-district registration lists from sourced facts only", () => {
    const checklists = registrationChecklists(facts);
    assert.deepEqual(
      checklists.map((row) => row.slug),
      [...FIVE_SYSTEM_SLUGS],
    );
    const bySlug = new Map(checklists.map((row) => [row.slug, row]));

    const huntsville = bySlug.get("huntsville-city");
    assert.ok(huntsville);
    assert.equal(huntsville.isVerify, true);
    assert.match(huntsville.fact.value, /VERIFY/);

    const limestone = bySlug.get("limestone-county");
    assert.ok(limestone);
    assert.equal(limestone.isVerify, true);
    assert.match(limestone.fact.value, /VERIFY/);

    const madisonCity = bySlug.get("madison-city");
    assert.ok(madisonCity);
    assert.equal(madisonCity.isVerify, false);
    assert.equal(madisonCity.items.includes("Birth certificate"), true);
    for (const item of madisonCity.items) {
      assert.equal(madisonCity.fact.value.includes(item), true, item);
    }

    const madisonCounty = bySlug.get("madison-county");
    assert.ok(madisonCounty);
    assert.equal(madisonCounty.isVerify, false);
    assert.match(madisonCounty.fact.value, /Huntsville Utilities/);

    const athens = bySlug.get("athens-city");
    assert.ok(athens);
    assert.equal(athens.isVerify, false);
    assert.match(athens.fact.value, /Alabama immunization/);
  });

  it("does not invent checklist items when splitting sourced text", () => {
    const sourced =
      "Birth certificate; photo ID (keep; do not invent); proof of residency";
    assert.deepEqual(splitSourcedChecklistItems(sourced), [
      "Birth certificate",
      "photo ID (keep; do not invent)",
      "proof of residency",
    ]);
    assert.deepEqual(splitSourcedChecklistItems("⟦VERIFY: missing list⟧"), [
      "⟦VERIFY: missing list⟧",
    ]);
  });

  it("lists official locators and keeps Athens as the published call instruction", () => {
    const locators = officialLocatorFacts(facts);
    assert.equal(locators.length, 5);
    assert.ok(
      locators.some(
        (fact) =>
          fact.entity_slug === "huntsville-city" &&
          fact.value.includes("maps.huntsvilleal.gov/myschools"),
      ),
    );
    assert.ok(
      locators.some(
        (fact) =>
          fact.entity_slug === "madison-city" &&
          fact.value.includes("arcgis.com"),
      ),
    );
    assert.ok(
      locators.some(
        (fact) =>
          fact.entity_slug === "madison-county" &&
          fact.field === "zone_locator_url",
      ),
    );
    assert.ok(
      locators.some(
        (fact) =>
          fact.entity_slug === "limestone-county" &&
          fact.value.includes("school-zone-map"),
      ),
    );
    const athens = locators.find((fact) => fact.entity_slug === "athens-city");
    assert.ok(athens);
    assert.equal(athens.field, "zone_check_instruction");
    assert.match(athens.value, /\(256\) 233-6600/);
    assert.equal(
      locators.some(
        (fact) =>
          fact.entity_slug === "athens-city" &&
          fact.field === "zone_locator_url",
      ),
      false,
    );
  });

  it("builds a comparison table from sourced name, website, locator, and enrollment path only", () => {
    const rows = comparisonRows(facts);
    assert.equal(rows.length, 5);
    for (const row of rows) {
      assert.ok(row.nameFact, row.slug);
      assert.ok(row.websiteFact, row.slug);
      assert.ok(row.locatorFact, row.slug);
      assert.ok(row.enrollmentFact, row.slug);
      assert.equal(
        row.enrollmentFact.field === "enrollment_path" ||
          row.enrollmentFact.field === "enrollment",
        true,
        row.slug,
      );
    }
    const athens = rows.find((row) => row.slug === "athens-city");
    assert.equal(athens?.locatorFact?.field, "zone_check_instruction");
    assert.equal(
      worksheetsSource.includes("ranking") ||
        worksheetsSource.includes("score"),
      true,
    );
    assert.equal(worksheetsSource.includes("tuition"), true);
    assert.match(
      worksheetsSource,
      /does not invent scores, tuition, or/,
    );
  });

  it("lists only sourced application windows and keeps the fall 2026 magnet window as VERIFY", () => {
    const windows = applicationWindows(facts);
    const choose = windows.find(
      (row) =>
        row.fact.entity_slug === "alabama-choose-act" &&
        row.fact.field === "application_window_2026_27",
    );
    assert.ok(choose);
    assert.match(choose.fact.value, /March 31, 2026/);
    assert.equal(choose.fact.verification_method, "official_page");

    const ncths = windows.find(
      (row) =>
        row.fact.entity_slug === "new-century-technology" &&
        row.fact.field === "application_window_2026_27",
    );
    assert.ok(ncths);
    assert.equal(ncths.fact.verification_method, "secondary");

    const fall2026 = windows.find(
      (row) =>
        row.fact.entity_slug === "new-century-technology" &&
        row.fact.field === "application_window_2027_28",
    );
    assert.ok(fall2026);
    assert.match(fall2026.fact.value, /VERIFY/);
    assert.match(fall2026.fact.value, /fall 2026/);

    assert.equal(
      windows.some((row) => /invented/i.test(row.fact.value)),
      false,
    );
  });

  it("omits a Call Script Pack and does not invent admissions questions", () => {
    assert.equal(TOOLKIT_UNIMPLEMENTED[0]?.name, "Call Script Pack");
    assert.match(
      TOOLKIT_UNIMPLEMENTED[0]?.verify ?? "",
      /does not invent admissions questions/,
    );
    assert.equal(worksheetsSource.includes("what to ask admissions"), false);
    assert.equal(worksheetsSource.includes("Ask the registrar"), false);
  });

  it("does not name unimplemented worksheets on the sales page", () => {
    const text = homepageOfferText();
    for (const name of UNCLAIMED_ON_SALES) {
      assert.equal(text.includes(name), false, name);
    }
    const toolkitTier = pricingTiers.find((tier) => tier.id === "149");
    assert.ok(toolkitTier);
    assert.deepEqual(toolkitTier.includes, [
      "Everything in the Guide.",
      "Toolkit access.",
    ]);
    assert.equal(siteSource.includes("Deadline Calendar"), false);
    assert.equal(salesSource.includes("Call Script Pack"), false);
    assert.equal(salesSource.includes("Registration Document Checklist"), false);
  });
});
