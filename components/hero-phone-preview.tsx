import Image from "next/image";

const SAMPLE_SCREENSHOT = "/proof/sample-guide-hero.png";

export function HeroPhonePreview({ className }: { className?: string }) {
  return (
    <div
      className={`mx-auto w-full max-w-[10.5rem] overflow-hidden sm:max-w-[17.5rem] ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="rounded-[2rem] border-[3px] border-text bg-text p-2 shadow-[0_18px_40px_-12px_rgba(20,23,28,0.35)]">
        <div className="overflow-hidden rounded-[1.6rem] bg-page">
          <div className="flex items-center justify-center gap-1.5 bg-surface px-4 py-2.5">
            <span className="h-1 w-8 rounded-full bg-border" />
          </div>
          <div className="relative aspect-[9/16] w-full max-h-[11.5rem] max-w-full overflow-hidden bg-surface max-md:max-h-[9.75rem] sm:max-h-none">
            <Image
              src={SAMPLE_SCREENSHOT}
              alt=""
              fill
              className="object-cover object-[center_72%] max-md:object-[center_78%] sm:object-top"
              sizes="(max-width: 640px) 248px, 280px"
              priority
            />
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-text-muted sm:mt-3 sm:text-xs">
        Screenshot from the free zone-check demo — real product UI.
      </p>
    </div>
  );
}
