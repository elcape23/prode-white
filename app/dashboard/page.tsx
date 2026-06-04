import { verifyParticipant } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await verifyParticipant();

  // Get participant with points
  const participant = await prisma.participant.findUnique({
    where: { id: session.sub },
    include: {
      predictions: { select: { points: true }, where: { points: { not: null } } },
      bonusPredictions: { select: { points: true }, where: { points: { not: null } } },
    },
  });

  const matchPoints = participant?.predictions.reduce((s, p) => s + (p.points ?? 0), 0) ?? 0;
  const bonusPoints = participant?.bonusPredictions.reduce((s, p) => s + (p.points ?? 0), 0) ?? 0;
  const total = matchPoints + bonusPoints;

  // Get ranking position
  const allApproved = await prisma.participant.findMany({
    where: { status: "APPROVED" },
    include: {
      predictions: { select: { points: true } },
      bonusPredictions: { select: { points: true } },
    },
  });

  const ranked = allApproved
    .map((p) => ({
      id: p.id,
      total: p.predictions.reduce((s, pr) => s + (pr.points ?? 0), 0) +
             p.bonusPredictions.reduce((s, bp) => s + (bp.points ?? 0), 0),
    }))
    .sort((a, b) => b.total - a.total);

  const position = ranked.findIndex((p) => p.id === session.sub) + 1;

  // Prediction completion
  const totalMatches = await prisma.match.count({ where: { tournamentId: "default-tournament" } });
  const myPredictions = await prisma.prediction.count({ where: { participantId: session.sub } });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-fill-brand px-4 py-3 flex items-center justify-between text-white">
        <div>
          <p className="text-xs text-white/60">Hola,</p>
          <p className="font-bold">{session.name}</p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10">
            Salir
          </Button>
        </form>
      </header>

      <main className="flex-1 bg-muted rounded-t-3xl p-4 mt-2 space-y-4">
        {/* Score card */}
        <div className="bg-surface-raised border rounded-xl p-5 text-center">
          {position > 0 ? (
            <>
              <p className="text-xs text-fg-tertiary uppercase tracking-widest">Tu posición</p>
              <p className="text-5xl font-black mt-1 text-fg-brand">{position}°</p>
              <p className="text-3xl font-black text-fg-accent mt-2">{total} pts</p>
              <div className="flex justify-center gap-4 mt-3 text-xs text-fg-tertiary">
                <span>Partidos: {matchPoints} pts</span>
                <span>Bonus: {bonusPoints} pts</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-fg-tertiary">Puntos</p>
              <p className="text-5xl font-black mt-1 text-fg-default">{total}</p>
            </>
          )}
        </div>

        {/* Progress */}
        {totalMatches > 0 && (
          <div className="bg-card border rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium">Pronósticos cargados</span>
            <span className={`font-black text-sm ${myPredictions === totalMatches ? "text-success" : "text-warning"}`}>
              {myPredictions}/{totalMatches}
            </span>
          </div>
        )}

        {/* Nav grid */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/pronosticos"
            className="bg-fill-brand text-white rounded-xl p-4 flex flex-col gap-1">
            <span className="text-2xl">⚽</span>
            <span className="font-bold text-sm">Pronósticos</span>
            <span className="text-xs text-white/60">Cargá tus predicciones</span>
          </Link>
          <Link href="/bonus"
            className="bg-destructive text-white rounded-xl p-4 flex flex-col gap-1">
            <span className="text-2xl">🏆</span>
            <span className="font-bold text-sm">Bonus</span>
            <span className="text-xs text-white/60">Campeón y finalistas</span>
          </Link>
          <Link href="/ranking"
            className="border-2 border-primary rounded-xl p-4 flex flex-col gap-1 col-span-2">
            <span className="text-2xl">📊</span>
            <span className="font-bold text-sm text-fg-brand">Ranking General</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
