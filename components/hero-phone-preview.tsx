import Image from "next/image";

const SAMPLE_SCREENSHOT = "/proof/sample-guide-hero.png";

export function HeroPhonePreview() {
  return (
    <div
      className="mx-auto mt-5 w-full max-w-[15.5rem] overflow-hidden sm:mt-8 sm:max-w-[17.5rem]"
      aria-hidden="true"
    >
      <div className="rounded-[2rem] border-[3px] border-text bg-text p-2 shadow-[0_18px_40px_-12px_rgba(20,23,28,0.35)]">
        <div className="overflow-hidden rounded-[1.6rem] bg-page">
          <div className="flex items-center justify-center gap-1.5 bg-surface px-4 py-2.5">
            <span className="h-1 w-8 rounded-full bg-border" />
          </div>
          <div className="relative aspect-[9/16] w-full max-w-full overflow-hidden bg-surface">
            <Image
              src={SAMPLE_SCREENSHOT}
              alt=""
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 248px, 280px"
              priority
            />
          </div>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-text-muted sm:mt-3 sm:text-xs">
        Screenshot from the free sample page — real guide UI.
      </p>
    </div>
  );
}
