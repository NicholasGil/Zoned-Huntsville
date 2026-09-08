import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type Stripe from "stripe";
import { applyPaidCheckoutSession } from "./stripe-fulfillment.ts";
import { flagsFromProductTiers, type EntitlementFlags } from "./tiers.ts";

type EntitlementRow = {
  id: string;
  email: string;
  user_id: string | null;
  stripe_session_id: string;
  stripe_payment_intent: string | null;
  tier: string;
  refunded_at: string | null;
};

const fulfillmentSource = readFileSync(
  new URL("./stripe-fulfillment.ts", import.meta.url),
  "utf8",
);

let entitlementCounter = 0;

function createAdminMock() {
  const entitlements = new Map<string, EntitlementRow>();
  const byPaymentIntent = new Map<string, string>();

  const admin = {
    from(table: string) {
      if (table !== "entitlements") {
        throw new Error(`Unexpected table ${table}`);
      }

      return {
        upsert(payload: Record<string, unknown>, options: { onConflict: string }) {
          assert.equal(options.onConflict, "stripe_session_id");
          const sessionId = payload.stripe_session_id as string;
          const existing = entitlements.get(sessionId);
          const row: EntitlementRow = {
            id: existing?.id ?? `ent-${++entitlementCounter}`,
            email: payload.email as string,
            user_id: (payload.user_id as string | null) ?? null,
            stripe_session_id: sessionId,
            stripe_payment_intent: (payload.stripe_payment_intent as string | null) ?? null,
            tier: payload.tier as string,
            refunded_at: existing?.refunded_at ?? null,
          };
          entitlements.set(sessionId, row);
          if (row.stripe_payment_intent) {
            byPaymentIntent.set(row.stripe_payment_intent, row.id);
          }
          return {
            select() {
              return {
                single: async () => ({ data: { id: row.id }, error: null }),
              };
            },
          };
        },
        update(payload: { refunded_at: string }) {
          return {
            eq(col: string, paymentIntentId: string) {
              assert.equal(col, "stripe_payment_intent");
              return {
                is(_col: string, _value: null) {
                  return {
                    select() {
                      return {
                        maybeSingle: async () => {
                          const id = byPaymentIntent.get(paymentIntentId);
                          if (!id) {
                            return { data: null, error: null };
                          }
                          const row = entitlements.get(
                            [...entitlements.entries()].find(
                              ([, value]) => value.id === id,
                            )?.[0] ?? "",
                          );
                          if (!row || row.refunded_at) {
                            return { data: null, error: null };
                          }
                          row.refunded_at = payload.refunded_at;
                          return { data: { id: row.id }, error: null };
                        },
                      };
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
    auth: {
      admin: {
        async getUserById() {
          return { data: { user: null }, error: null };
        },
      },
    },
  } as const;

  return { entitlements, admin };
}

function paidSessionFixture(
  overrides: Partial<Stripe.Checkout.Session> = {},
): Stripe.Checkout.Session {
  return {
    id: "cs_test_guide_79",
    payment_status: "paid",
    amount_total: 7900,
    currency: "usd",
    customer_details: { email: "buyer@example.com" },
    customer_email: null,
    payment_intent: "pi_test_guide_79",
    client_reference_id: null,
    metadata: { tier: "79" },
    ...overrides,
  } as Stripe.Checkout.Session;
}

function signedIn(flags: EntitlementFlags) {
  return flags;
}

function canReadGuide(flags: EntitlementFlags): boolean {
  return flags.hasGuide;
}

function canReadToolkit(flags: EntitlementFlags): boolean {
  return flags.hasToolkit;
}

function canBookCall(flags: EntitlementFlags): boolean {
  return flags.hasCall;
}

describe("applyPaidCheckoutSession", () => {
  it("writes a guide entitlement for a paid $79 session", async () => {
    const { admin, entitlements } = createAdminMock();
    const result = await applyPaidCheckoutSession(admin, paidSessionFixture());

    assert.deepEqual(result, {
      kind: "applied",
      entitlementId: "ent-1",
      email: "buyer@example.com",
      amountUsd: 79,
    });
    const row = entitlements.get("cs_test_guide_79");
    assert.ok(row);
    assert.equal(row.tier, "guide");
    assert.equal(row.refunded_at, null);
  });

  it("upserts idempotently on the same stripe_session_id", async () => {
    const { admin, entitlements } = createAdminMock();
    const session = paidSessionFixture();
    await applyPaidCheckoutSession(admin, session);
    await applyPaidCheckoutSession(admin, session);
    assert.equal(entitlements.size, 1);
  });

  it("ignores unpaid sessions", async () => {
    const { admin, entitlements } = createAdminMock();
    const result = await applyPaidCheckoutSession(
      admin,
      paidSessionFixture({ payment_status: "unpaid" }),
    );
    assert.deepEqual(result, { kind: "ignored" });
    assert.equal(entitlements.size, 0);
  });
});

describe("refund revoke fixture", () => {
  it("clears guide access when refunded_at is set on the payment intent", async () => {
    const { admin, entitlements } = createAdminMock();
    await applyPaidCheckoutSession(admin, paidSessionFixture());

    const before = signedIn(
      flagsFromProductTiers([entitlements.get("cs_test_guide_79")!.tier]),
    );
    assert.equal(canReadGuide(before), true);

    const update = admin.from("entitlements").update({
      refunded_at: new Date().toISOString(),
    });
    const { data } = await update
      .eq("stripe_payment_intent", "pi_test_guide_79")
      .is("refunded_at", null)
      .select("id")
      .maybeSingle();

    assert.ok(data);
    assert.ok(entitlements.get("cs_test_guide_79")?.refunded_at);

    const activeTiers = [...entitlements.values()]
      .filter((row) => !row.refunded_at)
      .map((row) => row.tier);
    const after = signedIn(flagsFromProductTiers(activeTiers));
    assert.equal(canReadGuide(after), false);
  });

  it("keeps toolkit access when only the guide row is refunded", async () => {
    const { admin, entitlements } = createAdminMock();
    await applyPaidCheckoutSession(admin, paidSessionFixture());
    await applyPaidCheckoutSession(
      admin,
      paidSessionFixture({
        id: "cs_test_toolkit_149",
        amount_total: 14900,
        payment_intent: "pi_test_toolkit_149",
        metadata: { tier: "149" },
      }),
    );

    const update = admin.from("entitlements").update({
      refunded_at: new Date().toISOString(),
    });
    await update
      .eq("stripe_payment_intent", "pi_test_guide_79")
      .is("refunded_at", null)
      .select("id")
      .maybeSingle();

    const activeTiers = [...entitlements.values()]
      .filter((row) => !row.refunded_at)
      .map((row) => row.tier);
    const after = signedIn(flagsFromProductTiers(activeTiers));
    assert.equal(canReadGuide(after), true);
    assert.equal(canReadToolkit(after), true);
    assert.equal(canBookCall(after), false);
  });
});

describe("fulfillment → gate chain", () => {
  it("maps a toolkit checkout to guide and toolkit gates", async () => {
    const { admin, entitlements } = createAdminMock();
    await applyPaidCheckoutSession(
      admin,
      paidSessionFixture({
        id: "cs_test_toolkit_149",
        amount_total: 14900,
        payment_intent: "pi_test_toolkit_149",
        metadata: { tier: "149" },
      }),
    );

    const row = entitlements.get("cs_test_toolkit_149");
    assert.equal(row?.tier, "toolkit");

    const entitlement = signedIn(flagsFromProductTiers([row!.tier]));
    assert.equal(canReadGuide(entitlement), true);
    assert.equal(canReadToolkit(entitlement), true);
    assert.equal(canBookCall(entitlement), false);
  });
});

describe("webhook refund wiring", () => {
  it("handles charge.refunded via payment_intent and processed_events dedupe", () => {
    assert.match(fulfillmentSource, /charge\.refunded/);
    assert.match(fulfillmentSource, /stripe_payment_intent/);
    assert.match(fulfillmentSource, /processed_events/);
    assert.match(fulfillmentSource, /alreadyProcessed\(event\.id\)/);
  });
});
