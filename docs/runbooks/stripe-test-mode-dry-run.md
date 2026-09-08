# Stripe test-mode dry run

Verify checkout → webhook → entitlement → guide gate → refund revoke **without live charges**.

Use Stripe **test mode** keys only (`sk_test_…`, `whsec_…` from the test webhook endpoint). Never run this runbook with live keys.

## Prerequisites

1. `.env.local` with test keys:
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Supabase URL, anon key, service role key (migrations applied)
   - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
2. Local app: `npm run dev`
3. Stripe CLI forwarding (separate terminal):

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET` and restart `npm run dev` if you changed it.

4. Fixture tests (no network): `npm test` — includes `lib/stripe-fulfillment.test.ts` and `lib/tiers.test.ts`.

## Dry-run steps

### 1. Checkout (test card)

1. Open [http://localhost:3000/#pricing](http://localhost:3000/#pricing).
2. Submit checkout for the tier under test (start with **$79 Guide**).
3. On Stripe Checkout (test mode), pay with card `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.
4. Confirm redirect to `/thank-you?session_id=cs_test_…`.

**Expect:** Stripe Dashboard → Payments shows a **test** payment for $79.00 USD.

### 2. Webhook → entitlement row

**Expect (Stripe CLI terminal):** `checkout.session.completed` forwarded, HTTP 200 from `/api/webhooks/stripe`.

**Expect (Supabase):** one row in `entitlements` with:

- `email` = checkout email (lowercased)
- `tier` = `guide` (metadata `tier: "79"`)
- `stripe_session_id` = session id from thank-you URL
- `refunded_at` IS NULL

**Expect (app):** `/thank-you` shows paid receipt; **Open the guide** works (unlock route or magic link).

### 3. Entitlement → guide gate

1. Complete sign-in as the checkout email (thank-you unlock or `/login` magic link).
2. Open `/guide`.

**Expect:** module index loads (not `AccessGate` for guide).

3. Open `/guide/tools`.

**Expect:** `AccessGate` with toolkit requirement (403-equivalent UI) — $79 alone does not include Toolkit.

Repeat steps 1–3 for **$149** or **$349** test checkouts to confirm toolkit/call gates.

### 4. Upgrade path (full price, access stacks)

1. With an active $79 entitlement, checkout again at **$149** from `/#pricing`.
2. Pay **$149** in full (not a delta).

**Expect:** second `entitlements` row; `/guide/tools` accessible after sign-in; `/account` lists both tiers as active.

See ADR `docs/adr/001-one-time-tier-upgrades.md` and `/account` for buyer-facing wording.

### 5. Refund → revoke

1. In Stripe Dashboard (**test mode**), open the Payment for the tier to revoke → **Refund**.
2. Wait for `charge.refunded` webhook (CLI shows forward + 200).

**Expect (Supabase):** matching `entitlements` row has `refunded_at` set.

**Expect (app):** signed-in user loses access for that tier’s flags only. Refunding the $79 row after a separate $149 row remains leaves Toolkit access intact.

### 6. Idempotency check

Replay the same `checkout.session.completed` event id (Stripe CLI `stripe events resend evt_…`).

**Expect:** webhook 200, `processed_events` unchanged count, no duplicate entitlement row.

## Automated fixture coverage

| Step | Test file |
| --- | --- |
| Paid session → entitlement write | `lib/stripe-fulfillment.test.ts` |
| Tier flags OR-merge → gates | `lib/tiers.test.ts` |
| Receipt tier mapping | `lib/checkout-receipt.test.ts` |
| Thank-you unlock calls fulfillment | `lib/checkout-unlock.test.ts` |

## Out of scope

- Tax, Customer Portal, failed-payment recovery, and live-mode charges.
- Marketing email (Kit) and Resend receipt optional paths.
