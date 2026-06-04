import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GENERAL_PRICE, SPONSOR_PRICE } from "@/lib/sponsor-codes";

export default async function AdminDashboard() {
  await verifyAdmin();

  const [total, pending, approved, rejected] = await Promise.all([
    prisma.participant.count(),
    prisma.participant.count({ where: { status: "PENDING" } }),
    prisma.participant.count({ where: { status: "APPROVED" } }),
    prisma.participant.count({ where: { status: "REJECTED" } }),
  ]);

  const approvedParticipants = await prisma.participant.findMany({
    where: { status: "APPROVED" },
    select: { pricePaid: true },
  });
  const revenue = approvedParticipants.reduce((sum, p) => sum + p.pricePaid, 0);

  const stats = [
    { label: "Total inscriptos", value: total, color: "text-foreground" },
    { label: "Pendientes", value: pending, color: "text-warning" },
    { label: "Aprobados", value: approved, color: "text-success" },
    { label: "Rechazados", value: rejected, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-fg-brand">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recaudación estimada</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-black text-accent">
            ${revenue.toLocaleString("es-AR")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Solo participantes aprobados ({approved})
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
