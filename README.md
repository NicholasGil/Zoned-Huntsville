# Zoned-Huntsville

The Huntsville School Guide.

Commercial site that sells and delivers a paid digital guide to choosing a school in the Huntsville, Alabama metro.

Client: Nicholas Gil. Public hostname: huntsvilleschoolguide.com.

Stack: Next.js 16 (App Router), TypeScript, Tailwind, Stripe Checkout, Supabase (Auth magic-link, Postgres, Storage), Vercel.

Build spec lives in Google Docs as `huntsvilleschoolguidebuildspec.md`.

## What this repo is now

Section 7 of the spec: app shell and stack only. Routes exist. Purchase records, schema, legal copy, seed data, and live Stripe products do not.

Public pages (`/`, `/sample`, `/legal/*`) are statically rendered with metadata. Gated pages under `/guide` and `/account` are dynamic server components and call an entitlement stub that currently returns anonymous.

## Editorial rule

Do not invent school facts or social proof. If a number or name is not sourced, write `⟦VERIFY: description⟧`. See `CONTRIBUTING.md` and `AGENTS.md`.

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Turbopack is the default bundler for `next dev` and `next build`.

Named environment variables are listed in `.env.example`. Leave them empty to run the stubs.

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
| `/account` | Purchase record shell. |
| `/legal/terms` `/legal/privacy` `/legal/refunds` `/legal/disclaimer` | Draft legal placeholders. |
| `/contact` | Contact form shell. |
| `/api/checkout` | Creates a Stripe Checkout Session when keys exist; otherwise 503. |
| `/api/webhooks/stripe` | Stripe webhook receiver stub. |
| `/api/corrections` | Error-report receiver stub. |

## Out of scope here

Supabase schema and migrations, Stripe product setup, real email, finished legal text, seed data, Vercel deploy, and domain DNS.
