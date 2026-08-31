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
const salesPageSource = readFileSync(
  new URL("../components/sales-page.tsx", import.meta.url),
  "utf8",
);
const headerSource = readFileSync(
  new URL("../components/site-header.tsx", import.meta.url),
  "utf8",
);
const guideIndexSource = readFileSync(
  new URL("../app/guide/page.tsx", import.meta.url),
  "utf8",
);
const checkoutOfferSource = readFileSync(
  new URL("./checkout-offer.ts", import.meta.url),
  "utf8",
);
const webhookSource = readFileSync(
  new URL("../app/api/webhooks/stripe/route.ts", import.meta.url),
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
const FAKE_PROOF = [
  "testimonial",
  "testimonials",
  "5-star",
  "families served",
  "customers love",
  "as seen in",
] as const;

function homepageOfferText(): string {
  return [
    hero.headline,
    hero.subhead,
    hero.credibility,
    hero.guarantee,
    salesCopy.heroRiskReversal,
    salesCopy.problem,
    salesCopy.problemDetail,
    salesCopy.zonePromise,
    salesCopy.whoBuiltThis,
    ...salesCopy.whyFreeGuidesFail,
    ...pricingTiers.flatMap((tier) => [tier.name, ...tier.includes]),
    salesCopy.mechanism,
    ...salesCopy.whatsInTheGuide,
    ...salesCopy.offerStack.flatMap((item) => [item.name, item.detail]),
    ...salesCopy.objections.flatMap((item) => [item.question, item.answer]),
    ...salesCopy.faq.flatMap((item) => [item.question, item.answer]),
  ].join("\n");
}

function heroSectionSource(): string {
  const start = salesPageSource.indexOf('aria-labelledby="hero-heading"');
  const problem = salesPageSource.indexOf('aria-labelledby="problem-heading"');
  assert.ok(start >= 0);
  assert.ok(problem > start);
  return salesPageSource.slice(start, problem);
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
    assert.match(text, /Toolkit access/);
    assert.match(salesCopy.objections[4].answer, /not a five-worksheet pack/);
    assert.match(
      salesCopy.offerStack[1].detail,
      /on-page printable checklists/,
    );
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

  it("does not invent tuition figures on the sales page", () => {
    const text = homepageOfferText();
    assert.equal(/\$\d{1,3},\d{3}/.test(text), false);
    assert.equal(/\b\$\d{3,}\b/.test(text.replaceAll("$79", "").replaceAll("$149", "").replaceAll("$349", "")), false);
    assert.equal(text.includes("skip tuition"), true);
  });

  it("does not invent testimonials or social proof", () => {
    const text = homepageOfferText().toLowerCase();
    for (const phrase of FAKE_PROOF) {
      assert.equal(text.includes(phrase), false, phrase);
    }
    assert.equal(salesPageSource.toLowerCase().includes("testimonial"), false);
  });
});

describe("first-screen buy", () => {
  it("puts outcome headline, $79, buy CTA, and guarantee in the hero", () => {
    const heroSource = heroSectionSource();
    assert.match(heroSource, /hero\.headline/);
    assert.match(heroSource, /<GuideBuyCard showGuarantee \/>/);
    assert.match(salesPageSource, /\$79/);
    assert.match(salesPageSource, /tierId="79"/);
    assert.match(salesPageSource, /hero\.cta/);
    assert.match(salesPageSource, /salesCopy\.heroRiskReversal/);
    assert.match(salesCopy.heroRiskReversal, /30-day refund/);
    assert.match(salesCopy.heroRiskReversal, /Zone Promise/);
    assert.match(hero.headline, /before you sign/i);
  });

  it("repeats the $79 buy after offer, risk reversal, and close", () => {
    const buyCards = salesPageSource.match(/<GuideBuyCard/g) ?? [];
    assert.ok(buyCards.length >= 3, `expected 3+ in-page $79 cards, got ${buyCards.length}`);
    const order = [
      'aria-labelledby="hero-heading"',
      'aria-labelledby="problem-heading"',
      'aria-labelledby="mechanism-heading"',
      'aria-labelledby="offer-heading"',
      "<Pricing />",
      'aria-labelledby="guarantee-heading"',
      'aria-labelledby="faq-heading"',
      'aria-labelledby="final-cta-heading"',
    ];
    let last = -1;
    for (const marker of order) {
      const index = salesPageSource.indexOf(marker);
      assert.ok(index > last, marker);
      last = index;
    }
  });

  it("keeps a real /sample preview path", () => {
    assert.match(salesPageSource, /href="\/sample"/);
    assert.match(salesPageSource, /SampleOptInForm/);
  });
});

describe("mobile header tap targets", () => {
  it("keeps the existing four destinations and equal 44px targets", () => {
    assert.match(headerSource, /href: "\/sample"/);
    assert.match(headerSource, /href: "\/guide"/);
    assert.match(headerSource, /href: "\/account"/);
    assert.match(headerSource, /href: "\/contact"/);
    assert.equal(headerSource.includes("hamburger"), false);
    assert.match(headerSource, /grid-cols-4/);
    assert.match(headerSource, /h-11/);
    assert.match(headerSource, /min-h-11/);
    assert.match(headerSource, /min-w-11/);
    const destinations = headerSource.match(/href: "\/[^"]+"/g) ?? [];
    assert.deepEqual(destinations, [
      'href: "/sample"',
      'href: "/guide"',
      'href: "/account"',
      'href: "/contact"',
    ]);
  });
});

describe("held product rails", () => {
  it("still gates unpaid /guide", () => {
    assert.match(guideIndexSource, /AccessGate/);
    assert.match(guideIndexSource, /canReadGuide/);
    assert.equal(guideIndexSource.includes("canReadGuide(entitlement)"), true);
  });

  it("does not change Stripe amounts, metadata.tier, or webhook", () => {
    assert.match(checkoutOfferSource, /unit_amount: offer\.unitAmountCents/);
    assert.match(checkoutOfferSource, /metadata: \{ tier: tierId \}/);
    assert.match(checkoutOfferSource, /mode: "payment"/);
    assert.equal(
      pricingTiers.map((tier) => tier.amountUsd).join(","),
      "79,149,349",
    );
    assert.match(webhookSource, /stripe\.webhooks\.constructEvent/);
  });
});
