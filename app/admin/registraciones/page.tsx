import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApproveDialog } from "./approve-dialog";
import { RejectButton } from "./reject-button";
import { DeleteButton } from "./delete-button";
import { ReactivateButton } from "./reactivate-button";

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

export default async function RegistracionesPage() {
  await verifyAdmin();

  const participants = await prisma.participant.findMany({
    include: { sponsorCode: true },
    orderBy: { createdAt: "desc" },
  });

  const byStatus = {
    PENDING: participants.filter((p) => p.status === "PENDING"),
    APPROVED: participants.filter((p) => p.status === "APPROVED"),
    REJECTED: participants.filter((p) => p.status === "REJECTED"),
  };

  const sponsorStats = await prisma.sponsorCode.findMany({
    include: {
      _count: {
        select: {
          participants: { where: { status: { in: ["APPROVED", "PENDING"] } } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-fg-brand">Inscripciones</h1>
        <Badge variant="outline" className="text-fg-warning border-fg-warning/40">
          {byStatus.PENDING.length} pendientes
        </Badge>
      </div>

      {/* Sponsor quota summary */}
      {sponsorStats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {sponsorStats.map((sc) => (
            <div key={sc.id} className="border rounded-lg p-3 text-sm">
              <p className="font-medium text-xs text-muted-foreground truncate">{sc.sponsorName}</p>
              <p className="font-bold mt-0.5">
                {sc._count.participants}/{sc.maxUses}{" "}
                <span className="font-normal text-muted-foreground text-xs">cupos</span>
              </p>
            </div>
          ))}
        </div>
      )}

      <Tabs defaultValue="PENDING">
        <TabsList className="w-full">
          <TabsTrigger value="PENDING" className="flex-1">
            Pendientes ({byStatus.PENDING.length})
          </TabsTrigger>
          <TabsTrigger value="APPROVED" className="flex-1">
            Aprobados ({byStatus.APPROVED.length})
          </TabsTrigger>
          <TabsTrigger value="REJECTED" className="flex-1">
            Rechazados ({byStatus.REJECTED.length})
          </TabsTrigger>
        </TabsList>

        {(["PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
          <TabsContent key={status} value={status} className="mt-4 space-y-3">
            {byStatus[status].length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Sin inscripciones {STATUS_LABEL[status].toLowerCase()}s
              </p>
            ) : (
              byStatus[status].map((p) => (
                <div
                  key={p.id}
                  className="border rounded-xl p-4 bg-card space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">{p.name}</p>
                      <p className="text-sm text-muted-foreground">{p.phone}</p>
                    </div>
                    <Badge variant={STATUS_VARIANT[p.status]}>
                      {STATUS_LABEL[p.status]}
                    </Badge>
                  </div>

                  <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className="text-muted-foreground">Pago ref.</span>
                    <span className="truncate">{p.paymentReference ?? "—"}</span>

                    <span className="text-muted-foreground">Monto</span>
                    <span className="font-medium">${(p.pricePaid ?? 0).toLocaleString("es-AR")}</span>

                    {p.sponsorCode && (
                      <>
                        <span className="text-muted-foreground">Sponsor</span>
                        <span className="text-fg-success text-xs font-medium">
                          {p.sponsorCode.sponsorName} ({p.sponsorCode.code})
                        </span>
                      </>
                    )}

                    <span className="text-muted-foreground">Fecha</span>
                    <span>{new Date(p.createdAt).toLocaleDateString("es-AR")}</span>

                    {p.pin && (
                      <>
                        <span className="text-muted-foreground">PIN</span>
                        <span className="font-mono font-black tracking-widest text-fg-brand">
                          {p.pin}
                        </span>
                      </>
                    )}
                  </div>

                  {status === "PENDING" && (
                    <div className="flex gap-2 pt-1">
                      <ApproveDialog
                        participantId={p.id}
                        participantName={p.name}
                        participantPhone={p.phone ?? null}
                      />
                      <RejectButton participantId={p.id} />
                    </div>
                  )}
                  {status === "APPROVED" && (
                    <div className="flex justify-end pt-1">
                      <DeleteButton participantId={p.id} participantName={p.name} />
                    </div>
                  )}
                  {status === "REJECTED" && (
                    <div className="flex justify-end pt-1">
                      <ReactivateButton participantId={p.id} />
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
