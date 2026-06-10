import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "./delete-button";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "outline",
  APPROVED: "default",
  REJECTED: "destructive",
};

export default async function CuentasPage() {
  await verifyAdmin();

  const accounts = await prisma.participant.findMany({
    where: { email: { not: null } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-fg-brand">Cuentas registradas</h1>
        <Badge variant="outline">{accounts.length} cuentas</Badge>
      </div>

      {accounts.length === 0 ? (
        <p className="text-center text-muted-foreground py-12 text-sm">
          No hay cuentas registradas todavía.
        </p>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <div key={account.id} className="border rounded-xl p-4 bg-card space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{account.name}</p>
                  <p className="text-sm text-muted-foreground">{account.email}</p>
                  {account.phone && (
                    <p className="text-sm text-muted-foreground">{account.phone}</p>
                  )}
                </div>
                <Badge variant={STATUS_VARIANT[account.status]}>
                  {STATUS_LABEL[account.status]}
                </Badge>
              </div>

              <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                <span className="text-muted-foreground">Registrado</span>
                <span>{new Date(account.createdAt).toLocaleDateString("es-AR")}</span>

                {account.pin && (
                  <>
                    <span className="text-muted-foreground">PIN</span>
                    <span className="font-mono font-black tracking-widest text-fg-brand">
                      {account.pin}
                    </span>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <DeleteButton participantId={account.id} participantName={account.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
