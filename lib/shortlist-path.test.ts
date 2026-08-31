import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FIVE_SYSTEM_SLUGS, PRIVATE_SCHOOL_SLUGS, seedFacts } from "./seed-facts.ts";
import {
  homeschoolShortlistItems,
  optionsFromFacts,
  privateShortlistItems,
  publicLocatorShortlist,
  publicShortlistItems,
  systemsWithoutLocator,
} from "./shortlist-path.ts";

describe("start-here shortlist path", () => {
  const systems = optionsFromFacts(seedFacts, FIVE_SYSTEM_SLUGS);
  const privateSchools = optionsFromFacts(seedFacts, PRIVATE_SCHOOL_SLUGS);

  it("builds the public shortlist from sourced zone locators only", () => {
    const locators = publicLocatorShortlist(systems);
    assert.equal(locators.length, 4);
    assert.deepEqual(
      locators.map((system) => system.slug),
      [
        "huntsville-city",
        "madison-city",
        "madison-county",
        "limestone-county",
      ],
    );
    const items = publicShortlistItems(systems, {});
    assert.equal(items.length, 4);
    assert.ok(items.every((item) => item.locatorHref?.startsWith("https://")));
    assert.deepEqual(
      systemsWithoutLocator(systems).map((system) => system.slug),
      ["athens-city"],
    );
  });

  it("uses buyer-entered locator results instead of inventing school names", () => {
    const items = publicShortlistItems(systems, {
      "huntsville-city": "Buyer typed this from the official locator",
    });
    assert.match(items[0]?.label ?? "", /Buyer typed this from the official locator/);
    assert.equal(
      items.some((item) => item.label.includes("invented")),
      false,
    );
  });

  it("builds a private shortlist only from schools the buyer picked", () => {
    const items = privateShortlistItems(privateSchools, [
      "randolph",
      "westminster",
      "grace-lutheran",
    ]);
    assert.equal(items.length, 3);
    assert.deepEqual(
      items.map((item) => item.label),
      [
        "Randolph School",
        "Westminster Christian Academy",
        "Grace Lutheran School",
      ],
    );
  });

  it("outputs church-school and private-tutor process items for homeschool", () => {
    const items = homeschoolShortlistItems({
      churchSchool: "church school sourced text",
      privateTutor: "private tutor sourced text",
    });
    assert.equal(items.length, 3);
    assert.equal(items[0]?.label, "Church-school / cover-school option");
    assert.equal(items[1]?.label, "Private-tutor option");
    assert.match(items[2]?.detail ?? "", /does not publish a cover-school list/);
  });
});
