"use server";

import prisma from "@/lib/prisma";
import { verifyParticipant } from "@/lib/dal";
import { teamNameEs } from "@/lib/flags";

const TOURNAMENT_ID = "default-tournament";

export type PredictionEntry = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: Date;
  home: number | null;
  away: number | null;
  points: number | null;
  round: string;
};

export async function getParticipantPredictions(
  participantId: string
): Promise<PredictionEntry[]> {
  await verifyParticipant();

  const [matches, predictions] = await Promise.all([
    prisma.match.findMany({
      where: { tournamentId: TOURNAMENT_ID },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.prediction.findMany({
      where: { participantId },
      select: { matchId: true, homeScore: true, awayScore: true, points: true },
    }),
  ]);

  const predMap = new Map(predictions.map((p) => [p.matchId, p]));

  return matches.map((m) => {
    const pred = predMap.get(m.id);
    return {
      matchId: m.id,
      homeTeam: teamNameEs(m.homeTeam),
      awayTeam: teamNameEs(m.awayTeam),
      scheduledAt: m.scheduledAt,
      home: pred?.homeScore ?? null,
      away: pred?.awayScore ?? null,
      points: pred?.points ?? null,
      round: m.round,
    };
  });
}
