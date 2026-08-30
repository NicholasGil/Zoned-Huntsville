import type { ReactNode } from "react";

export const dynamic = "force-static";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return children;
}
