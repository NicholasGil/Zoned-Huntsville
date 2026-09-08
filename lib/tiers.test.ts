import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  flagsForProductTier,
  flagsFromProductTiers,
  productTierFromPrice,
  type EntitlementFlags,
} from "./tiers.ts";

function canReadGuide(flags: EntitlementFlags): boolean {
  return flags.hasGuide;
}

function canReadToolkit(flags: EntitlementFlags): boolean {
  return flags.hasToolkit;
}

function canBookCall(flags: EntitlementFlags): boolean {
  return flags.hasCall;
}

describe("productTierFromPrice", () => {
  it("maps catalog prices to entitlement tiers", () => {
    assert.equal(productTierFromPrice("79"), "guide");
    assert.equal(productTierFromPrice("149"), "toolkit");
    assert.equal(productTierFromPrice("349"), "call");
  });
});

describe("flagsForProductTier", () => {
  it("includes lower-tier access in higher tiers", () => {
    assert.deepEqual(flagsForProductTier("guide"), {
      hasGuide: true,
      hasToolkit: false,
      hasCall: false,
    });
    assert.deepEqual(flagsForProductTier("toolkit"), {
      hasGuide: true,
      hasToolkit: true,
      hasCall: false,
    });
    assert.deepEqual(flagsForProductTier("call"), {
      hasGuide: true,
      hasToolkit: true,
      hasCall: true,
    });
  });
});

describe("flagsFromProductTiers — access stacks", () => {
  it("OR-combines multiple active purchases", () => {
    assert.deepEqual(flagsFromProductTiers(["guide"]), {
      hasGuide: true,
      hasToolkit: false,
      hasCall: false,
    });
    assert.deepEqual(flagsFromProductTiers(["guide", "toolkit"]), {
      hasGuide: true,
      hasToolkit: true,
      hasCall: false,
    });
    assert.deepEqual(flagsFromProductTiers(["guide", "call"]), {
      hasGuide: true,
      hasToolkit: true,
      hasCall: true,
    });
  });

  it("treats a single call row as full access", () => {
    assert.deepEqual(flagsFromProductTiers(["call"]), {
      hasGuide: true,
      hasToolkit: true,
      hasCall: true,
    });
  });
});

describe("guide gates from stacked flags", () => {
  it("opens guide after $79 purchase", () => {
    const flags = flagsFromProductTiers(["guide"]);
    assert.equal(canReadGuide(flags), true);
    assert.equal(canReadToolkit(flags), false);
    assert.equal(canBookCall(flags), false);
  });

  it("opens toolkit after $149 or stacked guide+toolkit", () => {
    assert.equal(canReadToolkit(flagsFromProductTiers(["toolkit"])), true);
    assert.equal(canReadToolkit(flagsFromProductTiers(["guide", "toolkit"])), true);
  });

  it("opens call booking only with call tier", () => {
    const flags = flagsFromProductTiers(["call"]);
    assert.equal(canBookCall(flags), true);
    assert.equal(canReadToolkit(flags), true);
  });
});
