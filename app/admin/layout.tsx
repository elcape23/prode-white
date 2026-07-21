import Link from "next/link";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-surface-raised border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-fill-brand flex items-center justify-center text-xs font-bold text-white">
            W
          </div>
          <span className="font-bold text-sm text-fg-default">PRODE WHITE · Admin</span>
        </div>
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-fg-secondary hover:text-fg-default text-xs"
          >
            Salir
          </Button>
        </form>
      </header>

      <nav className="bg-card border-b px-4 py-2 flex gap-1 overflow-x-auto text-sm">
        {[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/registraciones", label: "Inscripciones" },
          { href: "/admin/cuentas", label: "Cuentas" },
          { href: "/admin/fixture", label: "Fixture" },
          { href: "/admin/resultados", label: "Resultados" },
          { href: "/admin/bonus", label: "Bonus" },
          { href: "/admin/pronosticos", label: "Pronósticos" },
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
