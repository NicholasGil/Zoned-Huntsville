import Link from "next/link";
import { HeaderBuyButton } from "@/components/header-buy-button";
import { site } from "@/lib/site";

const pageLinks = [
  { href: "/sample", label: "Sample" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Account" },
] as const;

const sectionLinks = [
  { href: "/#offer-heading", label: "What's inside" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq-heading", label: "FAQ" },
] as const;

const navLinkClass =
  "inline-flex h-11 min-h-11 shrink-0 items-center justify-center px-1 text-xs text-text-muted hover:text-text sm:px-2 sm:text-sm";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-11 min-h-11 max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex min-h-11 min-w-0 max-w-[42%] shrink items-center truncate font-sans text-sm font-semibold tracking-tight text-text sm:max-w-[14rem] sm:text-base"
        >
          {site.name}
        </Link>
        <nav
          aria-label="Primary"
          className="flex min-w-0 flex-1 items-center justify-center gap-0 sm:gap-0.5"
        >
          {pageLinks.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </Link>
          ))}
          {sectionLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${navLinkClass} hidden lg:inline-flex`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <HeaderBuyButton />
      </div>
    </header>
  );
}
