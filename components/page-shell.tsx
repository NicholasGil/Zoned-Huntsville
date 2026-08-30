import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14 sm:py-20">{children}</div>
  );
}
