# Zoned-Huntsville

The Huntsville School Guide.

Commercial site that sells and delivers a paid digital guide to choosing a school in the Huntsville, Alabama metro.

Client: Nicholas Gil. Public hostname: huntsvilleschoolguide.com.

Stack: Next.js 16 (App Router), TypeScript, Tailwind, Stripe Checkout, Supabase (Auth magic-link, Postgres, Storage), Vercel.

Build spec lives in Google Docs as `huntsvilleschoolguidebuildspec.md`.

## What this repo is now

Section 8 of the spec: `entitlements`, `processed_events`, `facts`, `corrections`, and `leads`, plus RLS and the Stripe write path. Apply `supabase/migrations` before expecting access to flip after checkout.

Section 9: Resend for transactional mail (sample profile, contact, correction ping, optional receipt). Kit owns the marketing sequence in `content/email-sequence.md`.

Public pages (`/`, `/sample`, `/legal/*`) stay static. Gated pages resolve `auth.uid()` → email → entitlement row → tier. Without Supabase keys the check returns anonymous.

## Editorial rule

Do not invent school facts or social proof. If a number or name is not sourced, write `⟦VERIFY: description⟧`. See `CONTRIBUTING.md` and `AGENTS.md`.

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Turbopack is the default bundler for `next dev` and `next build`. `npm test` covers the post-purchase confirm handler and the single magic-link send path.

Named environment variables are listed in `.env.example`. Leave them empty to run without live Stripe, Supabase, or Resend.

`RESEND_API_KEY`, `EMAIL_FROM`, and `CONTACT_TO` are server-only. Do not put them behind `NEXT_PUBLIC_`. Missing keys skip outbound mail. Sample and contact forms still return success. The Stripe webhook still returns 2xx.

The five-email marketing sequence lives in `content/email-sequence.md` for later paste into Kit / ConvertKit. Do not send that sequence until a physical mailbox exists and Kit is connected. This app must not implement marketing unsubscribe. Kit owns that.

## Routes

| Path | Role |
| --- | --- |
| `/` | Sales page. Specified hero copy and $79 / $149 / $349 prices. |
| `/sample` | Huntsville City Schools profile and email opt-in. Opt-in writes a lead and attempts Resend delivery of that profile. |
| `/checkout/success` | Post-Stripe redirect shell. |
| `/login` | Supabase magic-link request. |
| `/auth/confirm` | Auth callback page. Query `code` or `token_hash`+`type` go to `/auth/confirm/exchange` (sets the session, runs `link_my_entitlements`, redirects to `next` or `/guide`). Implicit hash tokens are finished on this page so `/login?error=auth` is not the outcome of a valid first mail. |
| `/guide` | Gated module index shell. |
| `/guide/[module]` | Gated module content shell. |
| `/guide/tools` | Gated, Toolkit tier only. |
| `/account` | Signed-in entitlements, a purchase-email magic-link form, and call remaining from paid `call` rows this month. |
| `/admin/stale-facts` | Admin-only facts with `verified_at` older than 90 days, plus correction reports. |
| `/legal/terms` `/legal/privacy` `/legal/refunds` `/legal/disclaimer` | Draft legal placeholders. |
| `/contact` | Contact form. Forwards to `CONTACT_TO` when Resend is configured. |
| `/api/checkout` | Creates a Stripe Checkout Session when keys exist; otherwise 503. |
| `/api/webhooks/stripe` | Verifies the Stripe signature, dedupes on `event.id`, inserts an entitlements row, confirms the Auth user so signup mail is not sent, then sends one magic link to `/auth/confirm` (bare path; confirm defaults `next` to `/guide`). After the 2xx, may also send a plain purchase receipt. |
| `/api/corrections` | Inserts a corrections row. Returns 202. Pings `CONTACT_TO` when Resend is configured. |
| `/api/toolkit` | Toolkit download gate. 401 anonymous, 403 without toolkit/call, 200 when entitled. |

## Out of scope here

Stripe product setup, Kit connection, a physical mailbox, Vercel deploy, and domain DNS.
