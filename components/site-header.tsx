import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "/sample", label: "Sample" },
  { href: "/guide", label: "Guide" },
  { href: "/account", label: "Account" },
  { href: "/contact", label: "Contact" },
] as const;

const navLinkClass =
  "inline-flex h-11 min-h-11 min-w-11 w-full items-center justify-center px-1 text-sm text-text-muted hover:text-text";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl flex-col px-4 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-2">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center font-sans text-base tracking-tight text-text sm:text-lg"
        >
          {site.name}
        </Link>
        <nav
          aria-label="Primary"
          className="grid w-full grid-cols-4 sm:w-[22rem] sm:shrink-0"
        >
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
