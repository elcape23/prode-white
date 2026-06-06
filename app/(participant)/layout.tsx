import { BottomNavPill } from "@/components/layout/bottom-nav-pill";

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-24">
      {children}
      <BottomNavPill />
    </div>
  );
}
