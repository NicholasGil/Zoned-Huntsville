import type { ReactNode } from "react";
import { PageShell } from "@/components/page-shell";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <article className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.16em] text-muted">Legal</p>
        <h1 className="mt-3 font-serif text-4xl text-ink">{title}</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted">{children}</div>
      </article>
    </PageShell>
  );
}
