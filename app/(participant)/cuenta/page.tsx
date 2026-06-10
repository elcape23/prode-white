import { verifyParticipant } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { logout } from "@/actions/auth";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { PencilLine } from "lucide-react";

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

      <main className="flex flex-1 flex-col gap-4 p-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.1)]">
          <p className="mb-5 font-heading text-lg font-semibold text-fg-default">
            Mi Cuenta
          </p>

          <div className="flex flex-col divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <p className="text-sm text-fg-default">
                <span className="font-semibold">Nombre:</span>{" "}
                <span className="text-fg-secondary">{firstName}</span>
              </p>
              <button
                aria-label="Editar nombre"
                className="text-fg-secondary transition-colors hover:text-fg-brand"
              >
                <PencilLine className="size-4" />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <p className="text-sm text-fg-default">
                <span className="font-semibold">Apellido:</span>{" "}
                <span className="text-fg-secondary">{lastName}</span>
              </p>
              <button
                aria-label="Editar apellido"
                className="text-fg-secondary transition-colors hover:text-fg-brand"
              >
                <PencilLine className="size-4" />
              </button>
            </div>

            <div className="py-3">
              <p className="text-sm text-fg-default">
                <span className="font-semibold">Celular:</span>{" "}
                <span className="text-fg-secondary">{phone}</span>
              </p>
            </div>

            <div className="py-3">
              <p className="text-sm text-fg-default">
                <span className="font-semibold">Email:</span>{" "}
                <span className="text-fg-secondary">{email}</span>
              </p>
            </div>

            <div className="py-3">
              <p className="text-sm text-fg-default">
                <span className="font-semibold">Contraseña:</span>{" "}
                <span className="text-fg-secondary tracking-widest">
                  {hasPassword ? "••••••••••••••" : "—"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <form action={logout} className="mt-auto">
          <Button type="submit" variant="destructive" className="w-full rounded-full">
            Cerrar Sesión
          </Button>
        </form>
      </main>
    </div>
  );
}
