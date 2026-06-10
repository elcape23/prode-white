import { verifyParticipant } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { logout } from "@/actions/auth";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { PencilEdit02Icon } from "hugeicons-react";

export default async function CuentaPage() {
  const session = await verifyParticipant();

  const participant = await prisma.participant.findUnique({
    where: { id: session.sub },
    select: { name: true, phone: true, email: true, passwordHash: true },
  });

  const fullName = participant?.name ?? session.name;
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "—";
  const lastName = nameParts.slice(1).join(" ") || "—";
  const phone = participant?.phone ?? "—";
  const email = participant?.email ?? "—";
  const hasPassword = !!participant?.passwordHash;

  return (
    <div className="flex flex-1 flex-col bg-background">
      <Header name={fullName} />

      <main className="flex flex-1 flex-col p-5">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0px_4px_6px_0px_rgba(0,0,0,0.15)]">
          {/* Encabezado de la tarjeta */}
          <div className="flex items-center bg-muted px-3 py-3">
            <p className="text-sm font-semibold text-fg-default">Mi Cuenta</p>
          </div>

          {/* Cuerpo */}
          <div className="flex flex-col bg-card py-3">
            <div className="flex items-center gap-1 px-3 py-2">
              <p className="text-[13px] font-medium leading-4 text-fg-default">
                Nombre:
              </p>
              <p className="flex-1 text-[13px] leading-4 text-fg-secondary">
                {firstName}
              </p>
              <button
                aria-label="Editar nombre"
                className="text-fg-secondary transition-colors hover:text-fg-brand"
              >
                <PencilEdit02Icon className="size-5" />
              </button>
            </div>

            <div className="flex items-center gap-1 px-3 py-2">
              <p className="text-[13px] font-medium leading-4 text-fg-default">
                Apellido:
              </p>
              <p className="flex-1 text-[13px] leading-4 text-fg-secondary">
                {lastName}
              </p>
              <button
                aria-label="Editar apellido"
                className="text-fg-secondary transition-colors hover:text-fg-brand"
              >
                <PencilEdit02Icon className="size-5" />
              </button>
            </div>

            <div className="flex items-center gap-1 px-3 py-2">
              <p className="text-[13px] font-medium leading-4 text-fg-default">
                Celular:
              </p>
              <p className="flex-1 text-[13px] leading-4 text-fg-secondary">
                {phone}
              </p>
            </div>

            <div className="flex items-center gap-1 px-3 py-2">
              <p className="text-[13px] font-medium leading-4 text-fg-default">
                Email:
              </p>
              <p className="flex-1 text-[13px] leading-4 text-fg-secondary">
                {email}
              </p>
            </div>

            <div className="flex items-center gap-1 px-3 py-2">
              <p className="text-[13px] font-medium leading-4 text-fg-default">
                Contraseña:
              </p>
              <p className="flex-1 text-[13px] leading-4 tracking-widest text-fg-secondary">
                {hasPassword ? "••••••••••••••" : "—"}
              </p>
            </div>
          </div>
        </div>

        <form action={logout} className="mt-auto pt-5">
          <Button type="submit" variant="destructive" className="w-full rounded-full">
            Cerrar Sesión
          </Button>
        </form>
      </main>
    </div>
  );
}
