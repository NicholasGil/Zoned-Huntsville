# ADR 001: One-time tier upgrades at full catalog price

## Status

Accepted — 2026-09-08

## Context

The Huntsville School Guide sells three one-time Stripe Checkout tiers:

| Price | Product tier | Access |
| --- | --- | --- |
| $79 | `guide` | Guide |
| $149 | `toolkit` | Guide + Toolkit |
| $349 | `call` | Guide + Toolkit + one call |

Buyers may purchase a lower tier first and later want a higher tier. Stripe Checkout today always charges the full catalog `unit_amount` from `lib/checkout-offer.ts`. There is no delta or prorated line item.

Entitlements are stored as one Postgres row per paid Checkout Session (`stripe_session_id` unique). Runtime access OR-combines flags from every non-refunded row (`lib/entitlement.ts`, `lib/tiers.ts`).

## Decision

1. **No delta checkout** until a future ADR explicitly adds it.
2. **Upgrade path:** buyer selects the higher tier on the homepage pricing cards and pays the **full listed price** ($149 or $349).
3. **Access stacking:** higher product tiers include lower-tier flags; multiple active purchases combine; effective access is the union of all non-refunded entitlements (equivalent to “highest entitlement wins” for guide/toolkit/call gates).
4. **Buyer-facing disclosure:** homepage FAQ (`lib/sales.ts`) and `/account` state the full-price rule. No invented upgrade discounts.

## Consequences

- A buyer who paid $79 and later buys Toolkit pays $149 at checkout, not $70.
- Refunding one purchase revokes only that row’s tier contribution; other active rows still grant access.
- Implementing pay-the-difference checkout later requires new pricing logic, Stripe line items, tests, and a superseding ADR.

## References

- `lib/checkout-offer.ts` — full-price `unit_amount`
- `lib/stripe-fulfillment.ts` — webhook write path
- `lib/tiers.ts` — `flagsFromProductTiers`
- `docs/runbooks/stripe-test-mode-dry-run.md` — test-mode verification
