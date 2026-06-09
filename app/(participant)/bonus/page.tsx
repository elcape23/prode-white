import { verifyParticipant } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { Header } from "@/components/layout/header";
import { flagSrc, teamNameEs, FLAG_SLUGS } from "@/lib/flags";
import { BonusForm, type Country } from "./bonus-form";

const TOURNAMENT_ID = "default-tournament";

export default async function BonusPage() {
  const session = await verifyParticipant();

  const [bonus, matches, totalMatches, myPredictions] = await Promise.all([
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header filled={myPredictions} total={totalMatches} />
      <BonusForm initial={initial} countries={countries} />
    </div>
  );
}
