import { SPONSORS_DISPLAY } from "@/lib/sponsor-codes";

export function SponsorStrip() {
  return (
    <div className="bg-[var(--color-navy)] text-white/70 text-xs py-1.5 overflow-hidden">
      <div className="flex gap-8 whitespace-nowrap px-4 flex-wrap justify-center">
        {SPONSORS_DISPLAY.map((name) => (
          <span key={name} className="font-medium tracking-wide">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
