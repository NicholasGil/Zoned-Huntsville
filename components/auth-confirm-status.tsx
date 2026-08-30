import { PageShell } from "@/components/page-shell";

export function AuthConfirmStatus({ children }: { children: string }) {
  return (
    <PageShell>
      <p className="max-w-xl text-muted" aria-live="polite">
        {children}
      </p>
    </PageShell>
  );
}
