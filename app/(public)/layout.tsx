import Link from "next/link";
import { SponsorStrip } from "@/components/layout/sponsor-strip";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SponsorStrip />
      <header className="bg-[var(--color-navy)] text-white shadow-md">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              W
            </div>
            <span className="font-bold tracking-wide text-sm">PRODE WHITE</span>
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/ranking" className="hover:text-white/80 transition-colors">
              Ranking
            </Link>
            <Link href="/login" className="hover:text-white/80 transition-colors">
              Ingresar
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">{children}</main>

      <footer className="bg-[var(--color-navy)] text-white/50 text-xs text-center py-3">
        Prode White · Las White F.C.
      </footer>
    </div>
  );
}
