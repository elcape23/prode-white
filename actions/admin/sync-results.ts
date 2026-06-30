"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/dal";
import { calculateMatchPoints } from "@/lib/scoring";

export type SyncResult =
  | { ok: true; updated: number }
  | { ok: false; error: string }
  | undefined;

export async function syncResultsFromApi(_prev: SyncResult): Promise<SyncResult> {
  await verifyAdmin();

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Falta la variable FOOTBALL_DATA_API_KEY en el entorno." };
  }

  let data: any;
  try {
    const res = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches",
      { headers: { "X-Auth-Token": apiKey }, next: { revalidate: 0 } }
    );
    if (!res.ok) return { ok: false, error: `Error de la API: ${res.status} ${res.statusText}` };
    data = await res.json();
  } catch {
    return { ok: false, error: "No se pudo conectar con football-data.org." };
  }

  const finished: any[] = (data.matches ?? []).filter(
    (m: any) => m.status === "FINISHED" && m.score?.fullTime?.home !== null
  );

  let updated = 0;

  for (const m of finished) {
    const dbMatch = await prisma.match.findUnique({
      where: { externalId: m.id },
      select: { id: true, homeScore: true, awayScore: true },
    });
    if (!dbMatch) continue;

    // Ignore penalty shootouts: the result is the score after 120 minutes.
    // football-data.org adds shootout goals into `fullTime`, so subtract the
    // `penalties` totals (null for matches not decided on penalties).
    const homeScore: number = m.score.fullTime.home - (m.score.penalties?.home ?? 0);
    const awayScore: number = m.score.fullTime.away - (m.score.penalties?.away ?? 0);

    // Skip if score didn't change
    if (dbMatch.homeScore === homeScore && dbMatch.awayScore === awayScore) continue;

    // Update match result
    await prisma.match.update({
      where: { id: dbMatch.id },
      data: { homeScore, awayScore, resultEnteredAt: new Date() },
    });

    // Recalculate points for every prediction on this match
    const predictions = await prisma.prediction.findMany({
      where: { matchId: dbMatch.id },
    });

    for (const pred of predictions) {
      const points = calculateMatchPoints(
        { homeScore, awayScore },
        { homeScore: pred.homeScore, awayScore: pred.awayScore }
      );
      await prisma.prediction.update({
        where: { id: pred.id },
        data: { points },
      });
    }

    updated++;
  }

  revalidatePath("/admin/fixture");
  revalidatePath("/admin/resultados");
  revalidatePath("/ranking");
  revalidatePath("/fixture");

  return { ok: true, updated };
}
