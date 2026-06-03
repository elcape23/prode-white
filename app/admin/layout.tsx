import Link from "next/link";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[var(--color-navy)] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
            W
          </div>
          <span className="font-bold text-sm">PRODE WHITE · Admin</span>
        </div>
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
          >
            Salir
          </Button>
        </form>
      </header>

      <nav className="bg-white border-b px-4 py-2 flex gap-1 overflow-x-auto text-sm">
        {[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/registraciones", label: "Inscripciones" },
          { href: "/admin/fixture", label: "Fixture" },
          { href: "/admin/resultados", label: "Resultados" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-3 py-1.5 rounded-md whitespace-nowrap font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
