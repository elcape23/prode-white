import { verifyParticipant } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { logout } from "@/actions/auth";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";

export default async function CuentaPage() {
  const session = await verifyParticipant();

  const participant = await prisma.participant.findUnique({
    where: { id: session.sub },
    select: { name: true, phone: true },
  });

  const name = participant?.name ?? session.name;
  const phone = participant?.phone ?? "—";

  return (
    <div className="flex flex-1 flex-col bg-background">
      <Header name={name} />

      <main className="flex flex-1 flex-col gap-4 p-5">
        <div className="rounded-md border border-border bg-card p-5 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.1)]">
          <p className="mb-4 font-heading text-xs font-medium uppercase tracking-widest text-fg-secondary">
            Mi cuenta
          </p>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-fg-secondary">Nombre</p>
              <p className="font-heading text-base font-medium text-fg-default">{name}</p>
            </div>
            <div>
              <p className="text-xs text-fg-secondary">Teléfono</p>
              <p className="font-heading text-base font-medium text-fg-default">{phone}</p>
            </div>
          </div>
        </div>

        <form action={logout} className="mt-auto">
          <Button type="submit" variant="destructive" className="w-full">
            Cerrar sesión
          </Button>
        </form>
      </main>
    </div>
  );
}
