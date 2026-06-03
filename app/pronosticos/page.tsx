import { verifyParticipant } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { PredictionCard } from "./prediction-card";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const TOURNAMENT_ID = "default-tournament";

export default async function PronosticosPage() {
  const session = await verifyParticipant();

  const [matches, myPredictions] = await Promise.all([
    prisma.match.findMany({
      where: { tournamentId: TOURNAMENT_ID },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.prediction.findMany({
      where: { participantId: session.sub },
      select: { matchId: true, homeScore: true, awayScore: true },
    }),
  ]);

  const predMap = new Map(myPredictions.map((p) => [p.matchId, p]));

  const byRound = matches.reduce<Record<string, typeof matches>>((acc, m) => {
    (acc[m.round] ??= []).push(m);
    return acc;
  }, {});

  const total = matches.length;
  const filled = myPredictions.length;

  return (
    <div className="min-h-screen bg-[var(--color-navy)] flex flex-col">
      <header className="px-4 py-3 flex items-center justify-between text-white">
        <div>
          <p className="text-xs text-white/60">Pronósticos</p>
          <p className="font-bold">{session.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-white/70">{filled}/{total} cargados</p>
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10">
              Salir
            </Button>
          </form>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 rounded-t-3xl p-4 space-y-6 overflow-y-auto mt-2">
        {matches.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            El fixture aún no fue cargado por el admin.
          </p>
        ) : (
          Object.entries(byRound).map(([round, roundMatches]) => (
            <div key={round}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                {round}
              </h2>
              <div className="space-y-2">
                {roundMatches.map((m) => {
                  const pred = predMap.get(m.id);
                  return (
                    <PredictionCard
                      key={m.id}
                      matchId={m.id}
                      homeTeam={m.homeTeam}
                      awayTeam={m.awayTeam}
                      scheduledAt={m.scheduledAt}
                      initialHome={pred?.homeScore ?? null}
                      initialAway={pred?.awayScore ?? null}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
