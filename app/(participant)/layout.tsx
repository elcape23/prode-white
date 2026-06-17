import { BottomNav } from "@/components/layout/bottom-nav";
import { BonusDeadlineBanner } from "@/components/layout/bonus-deadline-banner";

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col pb-[calc(7rem+env(safe-area-inset-bottom))] pt-[120px]">
      <BonusDeadlineBanner />
      {children}
      <BottomNav />
    </div>
  );
}
