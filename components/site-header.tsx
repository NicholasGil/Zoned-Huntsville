import Link from "next/link";
import {
  SiteHeaderMobileMenu,
  type SiteHeaderNavLink,
} from "@/components/site-header-mobile-menu";
import { site } from "@/lib/site";

const pageLinks = [
  { href: "/guide", label: "Guide" },
  { href: "/sample", label: "Sample" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Account" },
] as const;

const sectionLinks = [
  { href: "/#offer-heading", label: "What's inside" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq-heading", label: "FAQ" },
] as const;

const mobileMenuLinks: SiteHeaderNavLink[] = [
  ...pageLinks,
  ...sectionLinks,
];

const navLinkClass =
  "inline-flex h-11 min-h-11 shrink-0 items-center justify-center px-1 text-xs text-text-muted hover:text-text sm:px-2 sm:text-sm";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-11 min-h-11 max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="inline-flex min-h-11 min-w-0 flex-1 items-center truncate font-sans text-sm font-semibold tracking-tight text-text md:max-w-[14rem] md:flex-none md:text-base"
        >
          {site.name}
        </Link>
        <nav
          aria-label="Primary"
          className="hidden min-w-0 flex-1 items-center justify-center gap-0 md:flex sm:gap-0.5"
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
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <SiteHeaderMobileMenu
            links={mobileMenuLinks}
            className="md:hidden"
          />
        </div>
      </div>
    </header>
  );
}
