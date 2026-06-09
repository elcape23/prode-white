import { verifyParticipant } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { PronosticosClient } from "./pronosticos-client";
import { Header } from "@/components/layout/header";
import { teamNameEs } from "@/lib/flags";

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

  // `matches` ya viene ordenado por fecha ascendente.
  const toRow = (m: (typeof matches)[number]) => {
    const pred = predMap.get(m.id);
    return {
      matchId: m.id,
      homeTeam: teamNameEs(m.homeTeam),
      awayTeam: teamNameEs(m.awayTeam),
      scheduledAt: m.scheduledAt,
      initialHome: pred?.homeScore ?? null,
      initialAway: pred?.awayScore ?? null,
    };
  };

  // Un partido es de fase de grupos si su ronda menciona "grupo".
  const isGroupStage = (round: string) => /grupo/i.test(round);
  // Quita el prefijo "Grupos – " / "Grupos - " y deja solo "Grupo A".
  const groupLabel = (round: string) =>
    round.replace(/^\s*grupos\s*[–-]\s*/i, "").trim() || round;

  const groupMatches = matches.filter((m) => isGroupStage(m.round));
  const koMatches = matches.filter((m) => !isGroupStage(m.round));

  // Grupos de 4 equipos: cada jornada ("Partido N") tiene 2 encuentros por
  // grupo (equipo 1 vs 2 y equipo 3 vs 4). Ordenados por fecha, los partidos
  // 1-2 del grupo son la jornada 1, los 3-4 la jornada 2, etc.
  // Estructura: matchday -> grupo -> filas.
  const MATCHES_PER_MATCHDAY = 2;
  const byMatchday = new Map<number, Map<string, ReturnType<typeof toRow>[]>>();
  const seenPerGroup = new Map<string, number>();
  for (const m of groupMatches) {
    const label = groupLabel(m.round);
    const pos = seenPerGroup.get(label) ?? 0; // posición 0-indexada dentro del grupo
    seenPerGroup.set(label, pos + 1);
    const md = Math.floor(pos / MATCHES_PER_MATCHDAY) + 1;
    if (!byMatchday.has(md)) byMatchday.set(md, new Map());
    const groupsOfMd = byMatchday.get(md)!;
    if (!groupsOfMd.has(label)) groupsOfMd.set(label, []);
    groupsOfMd.get(label)!.push(toRow(m));
  }

  const matchdaySections = [...byMatchday.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([md, groupsOfMd]) => ({
      kind: "matchday" as const,
      title: `Partido ${md}`,
      groups: [...groupsOfMd.entries()]
        .sort((a, b) => a[0].localeCompare(b[0], "es"))
        .map(([label, rows]) => ({ groupLabel: label, matches: rows })),
    }));

  // Rondas de eliminación: cada ronda es su propia sección (orden por fecha).
  const byKoRound = new Map<string, ReturnType<typeof toRow>[]>();
  for (const m of koMatches) {
    if (!byKoRound.has(m.round)) byKoRound.set(m.round, []);
    byKoRound.get(m.round)!.push(toRow(m));
  }
  // Nombres de display para rondas de eliminación que llegan en crudo de la API.
  const ROUND_DISPLAY: Record<string, string> = {
    LAST_32: "16vos",
    LAST_16: "8vos",
  };
  const koSections = [...byKoRound.entries()].map(([round, rows]) => ({
    kind: "round" as const,
    title: ROUND_DISPLAY[round] ?? round,
    matches: rows,
  }));

  const sections = [...matchdaySections, ...koSections];

  const total = matches.length;
  const filled = myPredictions.length;

  return (
    <div className="flex flex-1 flex-col items-center bg-background">
      <Header filled={filled} total={total} />

      {/* Contenido */}
      {matches.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          El fixture aún no fue cargado por el admin.
        </p>
      ) : (
        <PronosticosClient sections={sections} />
      )}
    </div>
  );
}
