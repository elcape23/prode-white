import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { flagSrc, teamNameEs, FLAG_SLUGS } from "@/lib/flags";
import {
  FEATURED_PLAYERS,
  FEATURED_YOUNG_PLAYERS,
} from "@/app/(participant)/bonus/featured-players";
import { BonusResultsForm } from "./bonus-results-form";

const TOURNAMENT_ID = "default-tournament";
const YOUNG_PLAYER_MIN_BIRTH_YEAR = 2005;

export default async function AdminBonusPage() {
  await verifyAdmin();

  const [tournament, matches, playerRows, bonusPredictions] = await Promise.all([
    prisma.tournament.findUnique({
      where: { id: TOURNAMENT_ID },
      select: {
        champion: true,
        bestPlayer: true,
        topScorer: true,
        bestYoungPlayer: true,
      },
    }),
    prisma.match.findMany({
      where: { tournamentId: TOURNAMENT_ID },
      select: { homeTeam: true, awayTeam: true },
    }),
    prisma.player.findMany({
      orderBy: { name: "asc" },
      select: { name: true, dateOfBirth: true },
    }),
    prisma.bonusPrediction.findMany({
      where: {
        tournamentId: TOURNAMENT_ID,
        participant: { status: "APPROVED" },
      },
      select: { position: true, points: true },
    }),
  ]);

  // Países: mismo criterio que la página de participantes, para que el valor
  // guardado coincida exactamente con el `teamName` de los pronósticos.
  const seen = new Set<string>();
  const countries: string[] = [];
  for (const name of matches.flatMap((m) => [m.homeTeam, m.awayTeam])) {
    if (!flagSrc(name)) continue;
    const label = teamNameEs(name);
    if (seen.has(label)) continue;
    seen.add(label);
    countries.push(label);
  }
  if (countries.length === 0) {
    for (const slug of FLAG_SLUGS) countries.push(teamNameEs(slug));
  }
  countries.sort((a, b) => a.localeCompare(b, "es"));

  const playerSeen = new Set<string>();
  const players: string[] = [];
  const youngPlayers: string[] = [];
  for (const p of playerRows) {
    if (playerSeen.has(p.name)) continue;
    playerSeen.add(p.name);
    players.push(p.name);
    if (
      p.dateOfBirth &&
      p.dateOfBirth.getUTCFullYear() >= YOUNG_PLAYER_MIN_BIRTH_YEAR
    ) {
      youngPlayers.push(p.name);
    }
  }
  for (const f of FEATURED_PLAYERS) {
    if (!players.includes(f.name)) players.push(f.name);
  }
  for (const f of FEATURED_YOUNG_PLAYERS) {
    if (!youngPlayers.includes(f.name)) youngPlayers.push(f.name);
  }
  players.sort((a, b) => a.localeCompare(b, "es"));
  youngPlayers.sort((a, b) => a.localeCompare(b, "es"));

  const scored = bonusPredictions.filter((b) => b.points !== null).length;
  const awarded = bonusPredictions.reduce((s, b) => s + (b.points ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-fg-brand">Bonus</h1>
        <p className="text-sm text-muted-foreground">
          {scored}/{bonusPredictions.length} pronósticos puntuados · {awarded} pts
          otorgados
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        Cargá los resultados reales del torneo. Al guardar se recalculan los
        puntos de todos los pronósticos bonus (campeón 15, mejor jugador 10,
        goleador 10, mejor jugador jóven 5). Las categorías vacías quedan
        pendientes y no suman ni restan.
      </p>

      <BonusResultsForm
        initial={{
          champion: tournament?.champion ?? "",
          bestPlayer: tournament?.bestPlayer ?? "",
          topScorer: tournament?.topScorer ?? "",
          bestYoungPlayer: tournament?.bestYoungPlayer ?? "",
        }}
        countries={countries}
        players={players}
        youngPlayers={youngPlayers}
      />
    </div>
  );
}
