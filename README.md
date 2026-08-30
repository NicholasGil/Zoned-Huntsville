# Zoned-Huntsville

The Huntsville School Guide.

Commercial site that sells and delivers a paid digital guide to choosing a school in the Huntsville, Alabama metro.

Client: Nicholas Gil. Public hostname: huntsvilleschoolguide.com.

Stack: Next.js 16 (App Router), TypeScript, Tailwind, Stripe Checkout, Supabase (Auth magic-link, Postgres, Storage), Vercel.

Build spec lives in Google Docs as `huntsvilleschoolguidebuildspec.md`.

## What this repo is now

Section 8 of the spec: schema, RLS, Stripe purchase writes, and server-side entitlement checks. Apply `supabase/migrations` to a Supabase project before expecting access to flip after checkout.

Public pages (`/`, `/sample`, `/legal/*`) stay static. Gated pages under `/guide` and `/account` read the signed-in user and paid purchases. Without Supabase keys the entitlement check returns anonymous.

## Editorial rule

Do not invent school facts or social proof. If a number or name is not sourced, write `⟦VERIFY: description⟧`. See `CONTRIBUTING.md` and `AGENTS.md`.

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Turbopack is the default bundler for `next dev` and `next build`.

Named environment variables are listed in `.env.example`. Leave them empty to run without live Stripe or Supabase.

## Routes

| Path | Role |
| --- | --- |
| `/` | Sales page. Specified hero copy and $79 / $149 / $349 prices. |
| `/sample` | Free sample placeholder and email opt-in shell. |
| `/checkout/success` | Post-Stripe redirect shell. |
| `/login` | Supabase magic-link request. |
| `/auth/confirm` | Magic-link callback (Route Handler). |
| `/guide` | Gated module index shell. |
| `/guide/[module]` | Gated module content shell. |
| `/guide/tools` | Gated, Toolkit tier only. |
| `/account` | Signed-in purchases, entitlements, and call-slot remaining when a month row exists. |
| `/admin/stale-facts` | Admin-only facts with `verified_at` older than 90 days, plus correction reports. |
| `/legal/terms` `/legal/privacy` `/legal/refunds` `/legal/disclaimer` | Draft legal placeholders. |
| `/contact` | Contact form shell. |
| `/api/checkout` | Creates a Stripe Checkout Session when keys exist; otherwise 503. |
| `/api/webhooks/stripe` | Verifies the Stripe signature and writes purchase + entitlements on `checkout.session.completed`. |
| `/api/corrections` | Inserts a corrections row. Returns 202. |

## Out of scope here

Stripe product setup, real email, finished legal text, Vercel deploy, and domain DNS.
