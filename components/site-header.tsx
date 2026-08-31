import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "/sample", label: "Sample" },
  { href: "/guide", label: "Guide" },
  { href: "/account", label: "Account" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="font-sans text-lg tracking-tight text-text">
          {site.name}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-text">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
