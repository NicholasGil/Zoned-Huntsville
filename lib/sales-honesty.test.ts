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
const accountPageSource = readFileSync(
  new URL("../app/account/page.tsx", import.meta.url),
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
    hero.proofLineAboveFold,
    ...hero.proofBeatsBelowFold,
    ...hero.proofBeats,
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
    assert.equal(hero.cta, "I want the details — $79");
    assert.equal(hero.stickyMobileCta, "Get the School Guide — $79");
    assert.match(mobileBuyBarSource, /tierId="79"/);
    assert.match(mobileBuyBarSource, /label=\{hero\.stickyMobileCta\}/);
    assert.match(mobileBuyBarSource, /variant="brick"/);
    assert.match(mobileBuyBarSource, /md:hidden/);
    assert.equal(mobileBuyBarSource.includes("hamburger"), false);
    assert.match(mobileBuyBarSource, /pastHeroFold/);
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

  it("describes the $349 call with an expert, not by founder name", () => {
    const call349 = pricingTiers.find((tier) => tier.id === "349");
    assert.ok(call349);
    assert.match(
      call349.includes.join("\n"),
      /One 45-minute video call with an expert\./,
    );
    assert.match(
      salesCopy.offerStack[2].detail,
      /one 45-minute video call with an expert\. Four slots each month\./,
    );
    const toolkitFaq = salesCopy.faq.find((item) =>
      item.question.includes("Toolkit"),
    );
    assert.ok(toolkitFaq);
    assert.match(
      toolkitFaq.answer,
      /\$349 tier adds one 45-minute video call with an expert\./,
    );
    const cappedFaq = salesCopy.faq.find((item) =>
      item.question.includes("call capped"),
    );
    assert.ok(cappedFaq);
    assert.match(
      cappedFaq.answer,
      /one 45-minute video call with an expert/,
    );
    assert.equal(
      homepageOfferText().includes("video call with Nicholas"),
      false,
    );
    assert.match(salesCopy.whoBuiltThis, /Nicholas Gil/);
  });
});

describe("first-screen buy", () => {
  it("puts yes-question headline, marketing proof line, and $79 pill CTA in the hero (no refund below button)", () => {
    const heroSource = heroSectionSource();
    assert.match(heroSource, /hero\.headline/);
    assert.match(heroSource, /hero\.proofLineAboveFold/);
    assert.equal(
      heroSource.includes("hero.proofBeats.map"),
      false,
      "hero should not render the full proof-beats list above the fold",
    );
    assert.match(heroSource, /HeroProofBeatsBelowFold/);
    assert.match(heroSource, /variant="pill"/);
    assert.match(heroSource, /tierId="79"/);
    assert.match(heroSource, /HeroPhonePreview/);
    assert.match(salesPageSource, /\$79/);
    assert.match(salesPageSource, /hero\.cta/);
    assert.equal(heroSource.includes("hero.guarantee"), false);
    assert.equal(heroSource.includes("salesCopy.heroRiskReversal"), false);
    assert.equal(heroSource.toLowerCase().includes("zone promise"), false);
    assert.equal(heroSource.toLowerCase().includes("refund"), false);
    assert.match(salesCopy.heroRiskReversal, /30-day refund/);
    assert.match(salesCopy.heroRiskReversal, /Zone Promise/);
    assert.equal(
      hero.headline,
      "Want the zone details before you sign?",
    );
    assert.equal(
      hero.proofLineAboveFold,
      "The address decides the district — not the city name on the listing.",
    );
  });

  it("defers the mobile sticky buy bar until after the hero fold", () => {
    assert.match(mobileBuyBarSource, /"use client"/);
    assert.match(salesPageSource, /id="hero-fold-sentinel"/);
    assert.match(mobileBuyBarSource, /if \(!pastHeroFold\)/);
    assert.match(mobileBuyBarSource, /window\.scrollY < 8/);
  });

  it("limits mid-page $79 clones to hero plus pricing", () => {
    assert.equal(salesPageSource.includes("GuideBuyCard"), false);
    const heroTier79 = (salesPageSource.match(/tierId="79"/g) ?? []).length;
    assert.equal(heroTier79, 1, "hero should be the only $79 form on the sales page");
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
  it("does not render a header buy CTA at any breakpoint", () => {
    assert.equal(headerSource.includes("HeaderBuyButton"), false);
    assert.equal(headerSource.includes("header-buy-button"), false);
    assert.equal(headerSource.includes("Buy · $79"), false);
    assert.equal(headerSource.includes("CheckoutForm"), false);
  });

  it("keeps one combined sticky header bar with hamburger (no header buy)", () => {
    assert.match(headerSource, /sticky top-0/);
    assert.equal(headerSource.includes("flex-col"), false);
    assert.match(headerSource, /truncate/);
    assert.match(headerSource, /SiteHeaderMobileMenu/);
    assert.match(headerSource, /md:hidden/);
  });

  it("hides inline nav below md and exposes links in the mobile menu", () => {
    assert.match(headerSource, /href: "\/sample"/);
    assert.match(headerSource, /href: "\/account"/);
    assert.match(headerSource, /href: "\/contact"/);
    assert.equal(headerSource.includes('href: "/guide"'), false);
    assert.match(headerSource, /hidden min-w-0 flex-1 items-center justify-center gap-0 md:flex/);
    assert.match(headerSource, /mobileMenuLinks/);
    assert.match(headerSource, /SiteHeaderMobileMenu[\s\S]*className="md:hidden"/);
    assert.equal(
      headerSource.includes("pageLinks.map") &&
        headerSource.includes('className="hidden min-w-0 flex-1'),
      true,
      "page links must render only inside md+ nav, not on the mobile bar",
    );
    const mobileMenuSource = readFileSync(
      new URL("../components/site-header-mobile-menu.tsx", import.meta.url),
      "utf8",
    );
    assert.match(mobileMenuSource, /aria-expanded/);
    assert.match(mobileMenuSource, /aria-controls/);
    assert.match(mobileMenuSource, /min-h-11/);
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
    assert.match(checkoutOfferSource, /checkoutSessionMetadata\(tierId, attribution\)/);
    assert.match(checkoutOfferSource, /mode: "payment"/);
    assert.equal(
      pricingTiers.map((tier) => tier.amountUsd).join(","),
      "79,149,349",
    );
    assert.match(webhookSource, /stripe\.webhooks\.constructEvent/);
  });

  it("documents the full-price upgrade path on FAQ and account", () => {
    const upgradeFaq = salesCopy.faq.find((item) =>
      item.question.includes("upgrade"),
    );
    assert.ok(upgradeFaq);
    assert.match(upgradeFaq.answer, /no pay-the-difference/i);
    assert.match(upgradeFaq.answer, /\$149/);
    assert.match(upgradeFaq.answer, /\$349/);
    assert.match(upgradeFaq.answer, /Access stacks/i);
    assert.match(accountPageSource, /salesCopy\.upgradePath\.headline/);
    assert.match(accountPageSource, /salesCopy\.upgradePath\.summary/);
    assert.match(accountPageSource, /salesCopy\.upgradePath\.pricingHref/);
  });
});
