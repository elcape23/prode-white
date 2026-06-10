import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { teamNameEs, teamNameShort } from "@/lib/flags";

const TOURNAMENT_ID = "default-tournament";

export default async function PronosticosAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ronda?: string }>;
}) {
  await verifyAdmin();

  const { ronda: selectedRound } = await searchParams;

  const [participants, allMatches, predictions] = await Promise.all([
    prisma.participant.findMany({
      where: { status: "APPROVED" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.match.findMany({
      where: { tournamentId: TOURNAMENT_ID },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.prediction.findMany({
      where: {
        participant: { status: "APPROVED" },
        match: { tournamentId: TOURNAMENT_ID },
      },
      select: {
        participantId: true,
        matchId: true,
        homeScore: true,
        awayScore: true,
        points: true,
      },
    }),
  ]);

  const rounds = [...new Set(allMatches.map((m) => m.round))];

  const matches = selectedRound
    ? allMatches.filter((m) => m.round === selectedRound)
    : allMatches;

  const predMap = new Map<string, Map<string, (typeof predictions)[number]>>();
  for (const pred of predictions) {
    if (!predMap.has(pred.participantId)) {
      predMap.set(pred.participantId, new Map());
    }
    predMap.get(pred.participantId)!.set(pred.matchId, pred);
  }

  const totalPoints = new Map<string, number>();
  for (const pred of predictions) {
    if (pred.points !== null) {
      totalPoints.set(
        pred.participantId,
        (totalPoints.get(pred.participantId) ?? 0) + pred.points,
      );
    }
  }

  const sortedParticipants = [...participants].sort(
    (a, b) => (totalPoints.get(b.id) ?? 0) - (totalPoints.get(a.id) ?? 0),
  );

  const filledCount = predictions.filter(
    (p) => matches.some((m) => m.id === p.matchId),
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-fg-brand">Pronósticos</h1>
        <p className="text-sm text-muted-foreground">
          {participants.length} participantes · {filledCount} pronósticos
        </p>
      </div>

      {rounds.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/admin/pronosticos"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              !selectedRound
                ? "bg-fill-brand text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Todas
          </Link>
          {rounds.map((round) => (
            <Link
              key={round}
              href={`/admin/pronosticos?ronda=${encodeURIComponent(round)}`}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedRound === round
                  ? "bg-fill-brand text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {round}
            </Link>
          ))}
        </div>
      )}

      {participants.length === 0 ? (
        <p className="text-center text-muted-foreground py-12 text-sm">
          No hay participantes aprobados aún.
        </p>
      ) : matches.length === 0 ? (
        <p className="text-center text-muted-foreground py-12 text-sm">
          No hay partidos. Importá el fixture primero.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="text-sm min-w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold sticky left-0 bg-muted/40 z-10 min-w-[160px]">
                  Participante
                </th>
                {matches.map((m) => (
                  <th
                    key={m.id}
                    className="px-3 py-2 font-medium text-center min-w-[88px]"
                  >
                    <span className="block text-xs text-muted-foreground leading-tight">
                      {teamNameShort(teamNameEs(m.homeTeam))}
                    </span>
                    <span className="block text-[10px] text-muted-foreground/60 leading-tight">
                      vs
                    </span>
                    <span className="block text-xs text-muted-foreground leading-tight">
                      {teamNameShort(teamNameEs(m.awayTeam))}
                    </span>
                    {m.homeScore !== null && (
                      <span className="block text-xs font-bold text-fg-success mt-0.5">
                        {m.homeScore}–{m.awayScore}
                      </span>
                    )}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold text-right sticky right-0 bg-muted/40 z-10 min-w-[56px]">
                  Pts
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedParticipants.map((p, i) => {
                const preds = predMap.get(p.id);
                const total = totalPoints.get(p.id) ?? 0;
                return (
                  <tr
                    key={p.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-4 py-3 font-medium sticky left-0 bg-card group-hover:bg-muted/30 z-10 transition-colors">
                      <span className="text-xs text-muted-foreground mr-1.5 font-mono tabular-nums">
                        #{i + 1}
                      </span>
                      {p.name}
                    </td>
                    {matches.map((m) => {
                      const pred = preds?.get(m.id);
                      return (
                        <td key={m.id} className="px-3 py-3 text-center">
                          {pred ? (
                            <span className="flex flex-col items-center gap-0.5">
                              <span className="font-mono font-bold text-xs tabular-nums">
                                {pred.homeScore}–{pred.awayScore}
                              </span>
                              {pred.points !== null && (
                                <span
                                  className={`text-[10px] font-bold leading-tight ${
                                    pred.points > 0
                                      ? "text-fg-success"
                                      : "text-muted-foreground/50"
                                  }`}
                                >
                                  {pred.points}p
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30 text-xs">
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-right sticky right-0 bg-card group-hover:bg-muted/30 z-10 transition-colors">
                      {total > 0 ? (
                        <span className="font-black text-fg-brand">{total}</span>
                      ) : (
                        <span className="text-muted-foreground/50 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
