import { verifyParticipant } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { flagSrc, teamNameEs, FLAG_SLUGS } from "@/lib/flags";
import { BonusForm, type Country } from "./bonus-form";
import type { PlayerOption } from "./player-combobox";
import { FEATURED_PLAYERS, FEATURED_YOUNG_PLAYERS } from "./featured-players";

const TOURNAMENT_ID = "default-tournament";

// FIFA's Best Young Player award targets players aged 21 or younger during the
// tournament. For the 2026 World Cup that means born on or after 2005-01-01.
const YOUNG_PLAYER_MIN_BIRTH_YEAR = 2005;

export default async function BonusPage() {
  const session = await verifyParticipant();

  const [bonus, matches, totalMatches, myPredictions, playerRows] = await Promise.all([
    prisma.bonusPrediction.findMany({
      where: { participantId: session.sub, tournamentId: TOURNAMENT_ID },
      select: { position: true, teamName: true },
    }),
    prisma.match.findMany({
      where: { tournamentId: TOURNAMENT_ID },
      select: { homeTeam: true, awayTeam: true },
    }),
    prisma.match.count({ where: { tournamentId: TOURNAMENT_ID } }),
    prisma.prediction.count({ where: { participantId: session.sub } }),
    prisma.player.findMany({
      orderBy: { name: "asc" },
      select: { name: true, teamName: true, dateOfBirth: true },
    }),
  ]);

  const initial = Object.fromEntries(bonus.map((b) => [b.position, b.teamName]));

  // Países participantes según el fixture importado de la API. Solo se incluyen
  // equipos que resuelven a una bandera conocida (se descartan "Por definir", etc.).
  const seen = new Set<string>();
  const countries: Country[] = [];
  for (const name of matches.flatMap((m) => [m.homeTeam, m.awayTeam])) {
    const flag = flagSrc(name);
    if (!flag) continue;
    const label = teamNameEs(name);
    if (seen.has(label)) continue;
    seen.add(label);
    countries.push({ value: label, label, flag });
  }

  // Fallback: si todavía no se importó el fixture, listamos todos los países disponibles.
  if (countries.length === 0) {
    for (const slug of FLAG_SLUGS) {
      const label = teamNameEs(slug);
      countries.push({ value: label, label, flag: `/flags/${slug}.svg` });
    }
  }

  countries.sort((a, b) => a.label.localeCompare(b.label, "es"));

  // Jugadores importados desde la API (squad de cada selección). Se deduplican
  // por nombre porque el value enviado es el nombre (compatible con BonusPrediction).
  const playerSeen = new Set<string>();
  const players: PlayerOption[] = [];
  const youngPlayers: PlayerOption[] = [];
  for (const p of playerRows) {
    if (playerSeen.has(p.name)) continue;
    playerSeen.add(p.name);
    const option: PlayerOption = {
      value: p.name,
      label: p.name,
      team: p.teamName,
      flag: flagSrc(p.teamName) ?? undefined,
    };
    players.push(option);
    if (p.dateOfBirth && p.dateOfBirth.getUTCFullYear() >= YOUNG_PLAYER_MIN_BIRTH_YEAR) {
      youngPlayers.push(option);
    }
  }

  // Si no hay datos de fecha de nacimiento, ofrecemos la lista completa.
  const youngPlayerOptions = youngPlayers.length > 0 ? youngPlayers : players;

  const featured: PlayerOption[] = FEATURED_PLAYERS.map((p) => ({
    value: p.name,
    label: p.name,
    team: p.country,
    flag: flagSrc(p.country) ?? undefined,
  }));

  const featuredYoung: PlayerOption[] = FEATURED_YOUNG_PLAYERS.map((p) => ({
    value: p.name,
    label: p.name,
    team: p.country,
    flag: flagSrc(p.country) ?? undefined,
  }));

  // searchPool: DB players + featured (para mejor jugador / goleador).
  // youngSearchPool: DB jugadores jóvenes + featured jóvenes (para mejor jugador joven).
  const searchPool: PlayerOption[] = [...players];
  for (const f of featured) {
    if (!searchPool.some((o) => o.value === f.value)) searchPool.push(f);
  }

  const youngSearchPool: PlayerOption[] = [...youngPlayerOptions];
  for (const f of featuredYoung) {
    if (!youngSearchPool.some((o) => o.value === f.value)) youngSearchPool.push(f);
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <Header filled={myPredictions} total={totalMatches} />
      <BonusForm
        initial={initial}
        countries={countries}
        players={searchPool}
        youngPlayers={youngSearchPool}
        featured={featured}
        featuredYoung={featuredYoung}
      />
    </div>
  );
}
