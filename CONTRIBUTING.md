# Contributing

The Huntsville School Guide sells sourced facts to families choosing a school in the Huntsville, Alabama metro. Wrong data is a product defect.

## Do not invent

- No invented school names, phones, tuition, deadlines, or enrollment figures.
- Missing facts use the token `⟦VERIFY: description⟧`.
- No testimonials, star ratings, customer counts, fake urgency, or countdown timers.
- No promised outcomes ("get your child into X").
- A buyer-facing fact ships with a source URL and an as-of date, or it does not ship.

## Stack

Next.js 16 App Router, TypeScript, Tailwind, Stripe Checkout, Supabase, Vercel. Do not add a Pages Router tree or `middleware.ts`.

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

`next build` is the gate for this repo. `npm test` covers the post-purchase confirm handler (PKCE `code`, `token_hash`+`type`, and hash-token mails) and the single magic-link send path. Stripe and Supabase keys are optional for the scaffold; route handlers return 503 until they are set.
