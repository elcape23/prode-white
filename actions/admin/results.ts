"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/dal";
import { calculateMatchPoints } from "@/lib/scoring";

export async function enterMatchResult(
  matchId: string,
  homeScore: number,
  awayScore: number
): Promise<void> {
  await verifyAdmin();

  await prisma.match.update({
    where: { id: matchId },
    data: { homeScore, awayScore, resultEnteredAt: new Date() },
  });

  // Recalculate points for all predictions on this match
  const predictions = await prisma.prediction.findMany({ where: { matchId } });

  for (const pred of predictions) {
    const points = calculateMatchPoints(
      { homeScore, awayScore },
      { homeScore: pred.homeScore, awayScore: pred.awayScore }
    );
    await prisma.prediction.update({ where: { id: pred.id }, data: { points } });
  }

  revalidatePath("/admin/resultados");
  revalidatePath("/ranking");
  revalidatePath("/fixture");
  revalidatePath("/dashboard");
}
