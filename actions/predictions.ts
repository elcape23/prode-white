"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { verifyParticipant } from "@/lib/dal";

const LOCK_MINUTES = 30;
const TOURNAMENT_ID = "default-tournament";

export type PredictionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function savePrediction(
  matchId: string,
  homeScore: number,
  awayScore: number
): Promise<PredictionResult> {
  const session = await verifyParticipant();

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { scheduledAt: true },
  });
  if (!match) return { ok: false, error: "Partido no encontrado." };

  const lockTime = new Date(match.scheduledAt.getTime() - LOCK_MINUTES * 60 * 1000);
  if (new Date() >= lockTime) {
    return { ok: false, error: "El partido ya está bloqueado para pronósticos." };
  }

  await prisma.prediction.upsert({
    where: { participantId_matchId: { participantId: session.sub, matchId } },
    update: { homeScore, awayScore },
    create: { participantId: session.sub, matchId, homeScore, awayScore },
  });

  revalidatePath("/pronosticos");
  revalidatePath("/dashboard");
  return { ok: true };
}

export type BonusState =
  | { ok: true }
  | { ok: false; error: string }
  | undefined;

export async function saveBonusPredictions(
  _prev: BonusState,
  formData: FormData
): Promise<BonusState> {
  const session = await verifyParticipant();

  const firstRoundMatch = await prisma.match.findFirst({
    where: { tournamentId: TOURNAMENT_ID },
    orderBy: { scheduledAt: "asc" },
    select: { round: true },
  });

  const secondMatchdayStart = firstRoundMatch
    ? await prisma.match.findFirst({
        where: { tournamentId: TOURNAMENT_ID, round: { not: firstRoundMatch.round } },
        orderBy: { scheduledAt: "asc" },
        select: { scheduledAt: true },
      })
    : null;

  if (secondMatchdayStart && new Date() >= secondMatchdayStart.scheduledAt) {
    return { ok: false, error: "La segunda fecha ya comenzó. Los pronósticos bonus están cerrados." };
  }

  const positions = [
    "CHAMPION",
    "BEST_PLAYER",
    "TOP_SCORER",
    "BEST_YOUNG_PLAYER",
  ] as const;

  try {
    for (const position of positions) {
      const teamName = (formData.get(position) as string)?.trim();
      if (!teamName) continue;

      await prisma.bonusPrediction.upsert({
        where: { participantId_tournamentId_position: { participantId: session.sub, tournamentId: TOURNAMENT_ID, position } },
        update: { teamName },
        create: { participantId: session.sub, tournamentId: TOURNAMENT_ID, position, teamName },
      });
    }
  } catch (e) {
    const code = e instanceof Prisma.PrismaClientKnownRequestError ? e.code : "UNKNOWN";
    console.error(`saveBonusPredictions [${code}]:`, e);
    return { ok: false, error: "Error al guardar los pronósticos. Intentá de nuevo." };
  }

  revalidatePath("/bonus");
  revalidatePath("/dashboard");
  return { ok: true };
}
