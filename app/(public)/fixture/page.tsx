import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

const TOURNAMENT_ID = "default-tournament";

function formatDate(d: Date) {
  return new Date(d).toLocaleString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export const dynamic = "force-dynamic";

export default async function FixturePage() {
  const matches = await prisma.match.findMany({
    where: { tournamentId: TOURNAMENT_ID },
    orderBy: { scheduledAt: "asc" },
  });

  const byRound = matches.reduce<Record<string, typeof matches>>((acc, m) => {
    (acc[m.round] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-fg-brand uppercase">Fixture</h1>
        <p className="text-sm text-muted-foreground">Mundial 2026</p>
      </div>

      {matches.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          El fixture aún no fue cargado.
        </p>
      ) : (
        Object.entries(byRound).map(([round, roundMatches]) => (
          <div key={round}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">
              {round}
            </h2>
            <div className="space-y-2">
              {roundMatches.map((m) => {
                const hasResult = m.homeScore !== null;
                const now = new Date();
                const isUpcoming = new Date(m.scheduledAt) > now;

                return (
                  <div
                    key={m.id}
                    className="bg-card border rounded-xl px-4 py-3"
                  >
                    {/* Date */}
                    <p className="text-xs text-muted-foreground mb-2 capitalize">
                      {formatDate(m.scheduledAt)}
                    </p>

                    {/* Match row */}
                    <div className="flex items-center gap-2">
                      <span className="flex-1 text-right font-bold text-sm">{m.homeTeam}</span>

                      {hasResult ? (
                        <span className="font-black text-lg text-fg-brand min-w-[3rem] text-center">
                          {m.homeScore}–{m.awayScore}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50 font-mono text-sm min-w-[3rem] text-center">
                          vs
                        </span>
                      )}

                      <span className="flex-1 text-left font-bold text-sm">{m.awayTeam}</span>
                    </div>

                    {/* Status badge */}
                    <div className="flex justify-center mt-2">
                      {hasResult ? (
                        <Badge variant="secondary" className="text-xs">Finalizado</Badge>
                      ) : isUpcoming ? (
                        <Badge variant="outline" className="text-xs text-fg-success border-success/40">
                          Próximo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-fg-warning border-fg-warning/40">
                          En juego
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
