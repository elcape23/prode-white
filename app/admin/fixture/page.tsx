import Link from "next/link";
import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DeleteMatchButton } from "./delete-match-button";
import { ClearFixtureButton } from "./clear-fixture-button";
import { ImportApiButton } from "./import-api-button";
import { UpdateKnockoutButton } from "./update-knockout-button";
import { ImportPlayersButton } from "./import-players-button";
import { SyncResultsButton } from "./sync-results-button";

const TOURNAMENT_ID = "default-tournament";

function formatDate(d: Date) {
  return new Date(d).toLocaleString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

export default async function FixtureAdminPage() {
  await verifyAdmin();

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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-black text-fg-brand">Fixture</h1>
        <div className="flex gap-2 flex-wrap">
          {matches.length > 0 && <ClearFixtureButton />}
          {matches.length > 0 && <SyncResultsButton />}
          {matches.length > 0 && <UpdateKnockoutButton />}
          <ImportApiButton />
          <ImportPlayersButton />
          <Link
            href="/admin/fixture/importar"
            className={cn(buttonVariants({ variant: "outline" }), "font-bold")}
          >
            CSV
          </Link>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl text-muted-foreground">
          <p className="text-lg font-medium">Sin partidos cargados</p>
          <p className="text-sm mt-1">Importá el fixture desde un archivo CSV</p>
          <Link
            href="/admin/fixture/importar"
            className={cn(buttonVariants(), "mt-4 font-bold")}
          >
            Importar CSV
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">{matches.length} partidos cargados</p>
          {Object.entries(byRound).map(([round, roundMatches]) => (
            <div key={round}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {round}
              </h2>
              <div className="space-y-2">
                {roundMatches.map((m) => (
                  <div
                    key={m.id}
                    className="bg-card border rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">
                        {m.homeTeam} vs {m.awayTeam}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(m.scheduledAt)}
                      </p>
                    </div>
                    {m.homeScore !== null && (
                      <Badge variant="secondary" className="font-mono shrink-0">
                        {m.homeScore}–{m.awayScore}
                      </Badge>
                    )}
                    <DeleteMatchButton matchId={m.id} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
