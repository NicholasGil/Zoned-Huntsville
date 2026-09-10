import { GUIDE_MODULES } from "@/lib/guide-modules";
import { edition } from "@/lib/site";

const fiveSystemsModule = GUIDE_MODULES.find((module) => module.slug === "five-systems");

const systemLabels = [
  "Huntsville City",
  "Madison City",
  "Madison County",
  "Athens City",
  "Limestone County",
] as const;

export function HeroPhonePreview() {
  const moduleTitle = fiveSystemsModule?.title ?? "The Five Systems";

  return (
    <div
      className="mx-auto mt-5 w-full max-w-[15.5rem] sm:mt-10 sm:max-w-[17.5rem]"
      aria-hidden="true"
    >
      <div className="rounded-[2rem] border-[3px] border-text bg-text p-2 shadow-[0_18px_40px_-12px_rgba(20,23,28,0.35)]">
        <div className="overflow-hidden rounded-[1.6rem] bg-page">
          <div className="flex items-center justify-center gap-1.5 bg-surface px-4 py-2.5">
            <span className="h-1 w-8 rounded-full bg-border" />
          </div>
          <div className="border-b border-border bg-surface px-4 pb-3 pt-1 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-action">
              Your guide · {edition} edition
            </p>
            <p className="mt-1 font-sans text-sm font-semibold leading-snug text-text">
              {moduleTitle}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-text-muted">
              Zone locators and district contacts — each linked and dated.
            </p>
          </div>
          <ul className="space-y-0 divide-y divide-border bg-surface text-left">
            {systemLabels.map((label) => (
              <li
                key={label}
                className="flex items-center justify-between gap-2 px-4 py-2.5"
              >
                <span className="text-[11px] font-semibold text-text">{label}</span>
                <span className="shrink-0 text-[10px] font-semibold text-action">
                  Zone locator →
                </span>
              </li>
            ))}
          </ul>
          <div className="bg-surface-raised px-4 py-2 text-center">
            <span className="text-[10px] text-text-muted">Zones and Addresses · Module 3</span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-text-muted sm:mt-3 sm:text-xs">
        Preview of guide layout — sourced facts on each screen.
      </p>
    </div>
  );
}
