import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const MEDALS = ["🥇", "🥈", "🥉"];
const PRIZES = ["$350.000", "$100.000", "$30.000"];

export default async function RankingPage() {
  const participants = await prisma.participant.findMany({
    where: { status: "APPROVED" },
    include: {
      predictions: { select: { points: true } },
      bonusPredictions: { select: { points: true } },
    },
  });

  const ranked = participants
    .map((p) => ({
      id: p.id,
      name: p.name,
      matchPoints: p.predictions.reduce((s, pr) => s + (pr.points ?? 0), 0),
      bonusPoints: p.bonusPredictions.reduce((s, bp) => s + (bp.points ?? 0), 0),
      total: 0,
    }))
    .map((p) => ({ ...p, total: p.matchPoints + p.bonusPoints }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-navy)] uppercase">Ranking</h1>
        <p className="text-sm text-muted-foreground">{ranked.length} participantes</p>
      </div>

      {/* Top 3 prizes */}
      {ranked.length >= 1 && (
        <div className="grid grid-cols-3 gap-2">
          {PRIZES.map((prize, i) => (
            <div key={i} className="bg-[var(--color-navy)] text-white rounded-xl p-3 text-center">
              <p className="text-xl">{MEDALS[i]}</p>
              <p className="text-xs text-white/60 mt-1">{i + 1}° puesto</p>
              <p className="font-black text-[var(--color-gold)] text-sm">{prize}</p>
            </div>
          ))}
        </div>
      )}

      {ranked.length === 0 ? (
        <p className="text-center text-muted-foreground py-12 text-sm">
          Todavía no hay participantes aprobados.
        </p>
      ) : (
        <div className="space-y-2">
          {ranked.map((p, i) => {
            const pos = i + 1;
            const isTop3 = pos <= 3;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white ${isTop3 ? "border-[var(--color-gold)]/40 shadow-sm" : ""}`}
              >
                <span className={`text-lg w-8 text-center ${isTop3 ? "" : "text-muted-foreground font-mono text-sm"}`}>
                  {isTop3 ? MEDALS[i] : pos}
                </span>
                <span className="flex-1 font-bold text-sm truncate">{p.name}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span title="Partidos">{p.matchPoints} pts</span>
                  {p.bonusPoints > 0 && (
                    <Badge variant="secondary" className="text-xs">+{p.bonusPoints} bonus</Badge>
                  )}
                </div>
                <span className="font-black text-[var(--color-navy)] text-lg w-12 text-right">
                  {p.total}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
