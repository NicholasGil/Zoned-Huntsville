import Image from "next/image";

const SAMPLE_SCREENSHOT = "/proof/sample-guide-hero.png";

export function HeroPhonePreview({ className }: { className?: string }) {
  return (
    <div
      className={`mx-auto w-full max-w-[10.5rem] overflow-hidden sm:max-w-[17.5rem] ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="rounded-[1.6rem] border-2 border-text bg-text p-1.5 shadow-[0_12px_28px_-10px_rgba(20,23,28,0.35)] max-md:rounded-[1.35rem] sm:rounded-[2rem] sm:border-[3px] sm:p-2 sm:shadow-[0_18px_40px_-12px_rgba(20,23,28,0.35)]">
        <div className="overflow-hidden rounded-[1.25rem] bg-page sm:rounded-[1.6rem]">
          <div className="flex items-center justify-center gap-1.5 bg-surface px-3 py-1.5 max-md:py-1 sm:px-4 sm:py-2.5">
            <span className="h-1 w-6 rounded-full bg-border sm:w-8" />
          </div>
          <div className="relative aspect-[9/16] w-full max-h-[7.25rem] max-w-full overflow-hidden bg-surface max-md:max-h-[7.25rem] sm:max-h-none">
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
      <p className="mt-2 hidden text-center text-[10px] text-text-muted sm:mt-3 sm:block sm:text-xs">
        Screenshot from the free zone-check demo — real product UI.
      </p>
    </div>
  );
}
