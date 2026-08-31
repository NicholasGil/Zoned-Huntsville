import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { salesCopy } from "./sales.ts";
import {
  edition,
  hero,
  officialPortals,
  pricingTiers,
} from "./site.ts";

const mobileBuyBarSource = readFileSync(
  new URL("../components/mobile-buy-bar.tsx", import.meta.url),
  "utf8",
);

const FALSE_CATALOG = "Every district, every magnet, every private school";
const MISSING_WORKSHEETS = [
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

describe("homepage offer honesty", () => {
  it("does not sell a full catalog the product does not have", () => {
    const text = homepageOfferText();
    assert.equal(text.includes(FALSE_CATALOG), false);
    const guide = pricingTiers.find((tier) => tier.id === "79");
    assert.ok(guide);
    assert.equal(
      guide.includes.some((line) =>
        line.includes("all districts, all schools, all programs"),
      ),
      false,
    );
  });

  it("does not itemize missing worksheets", () => {
    const text = homepageOfferText();
    for (const name of MISSING_WORKSHEETS) {
      assert.equal(text.includes(name), false, name);
    }
  });

  it("names the 2026–27 edition on the Guide tier", () => {
    assert.equal(edition, "2026–27");
    const guide = pricingTiers.find((tier) => tier.id === "79");
    assert.ok(guide?.includes.some((line) => line.includes("2026–27")));
    assert.equal(hero.subhead.includes("2026–27"), true);
  });

  it("keeps the first-screen buy as the $79 CheckoutForm on small viewports", () => {
    assert.equal(hero.cta, "Get the Guide — $79");
    assert.match(mobileBuyBarSource, /tierId="79"/);
    assert.match(mobileBuyBarSource, /label=\{hero\.cta\}/);
    assert.match(mobileBuyBarSource, /variant="brick"/);
    assert.match(mobileBuyBarSource, /md:hidden/);
    assert.equal(mobileBuyBarSource.includes("hamburger"), false);
  });

  it("uses the spec §4.3 official portal URLs", () => {
    assert.deepEqual(
      officialPortals.map((portal) => portal.href),
      [
        "https://www.alabamaachieves.org/reports-data/",
        "https://statereportcard.alsde.edu",
        "https://reportcard.alsde.edu/SelectSchool.aspx",
        "https://nces.ed.gov/ccd/districtsearch/",
      ],
    );
  });
});
