import { BottomNav } from "@/components/layout/bottom-nav";

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-28 pt-[120px]">
      {children}
      <BottomNav />
    </div>
  );
}
