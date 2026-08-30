# Product rules

This is a paid school guide. Agents and humans ship sourced facts only.

- Never invent a school name, phone, tuition, deadline, enrollment number, address map, or district rule. If a fact is missing, write `⟦VERIFY: description⟧`.
- Never invent social proof: no testimonials, star ratings, customer counts, fake urgency, or countdown timers.
- Never promise outcomes such as placement in a named school.
- Every buyer-facing fact needs a source URL and an as-of date. This scaffold should have almost none.
- App Router only. No `pages/`, no `getServerSideProps`, no `getStaticProps`, no `middleware.ts`. Request interception, if added later, is `proxy.ts` with `export function proxy` on the Node.js runtime.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
