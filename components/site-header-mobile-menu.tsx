"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export type SiteHeaderNavLink = {
  href: string;
  label: string;
};

const menuLinkClass =
  "flex min-h-11 items-center px-4 text-sm text-text hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus";

type SiteHeaderMobileMenuProps = {
  links: readonly SiteHeaderNavLink[];
  className?: string;
};

export function SiteHeaderMobileMenu({
  links,
  className = "",
}: SiteHeaderMobileMenuProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        className="inline-flex h-11 min-h-11 w-11 min-w-11 shrink-0 items-center justify-center rounded-md text-text hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? (
            <>
              <path d="M6 6l12 12M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </>
          )}
        </svg>
      </button>
      {open ? (
        <nav
          id={menuId}
          aria-label="Primary"
          className="absolute right-0 top-full z-50 mt-1 min-w-[12rem] rounded-md border border-border bg-surface py-1 shadow-sm"
        >
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={menuLinkClass}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
