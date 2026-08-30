import { PageShell } from "@/components/page-shell";

export function LegalDraft({ title }: { title: string }) {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.16em] text-muted">Legal</p>
        <h1 className="mt-3 font-serif text-4xl text-ink">{title}</h1>
        <p className="mt-6 text-muted">
          This page is a draft placeholder. It is not legal advice. Do not publish
          invented policy text here.
        </p>
      </article>
    </PageShell>
  );
}
