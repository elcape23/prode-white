import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { getSession } from "@/lib/session";

// El ranking usa el mismo shell que las pantallas de participante
// (Header fijo + BottomNav), tal como muestra el Figma (node 252:22281).
export default async function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col bg-background pb-28 pt-[120px]">
      <Header name={session?.name} />
      <main className="flex-1 p-5">{children}</main>
      <BottomNav />
    </div>
  );
}
