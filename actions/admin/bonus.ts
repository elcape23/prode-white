"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/dal";
import { calculateBonusPoints, type BonusResults } from "@/lib/scoring";

const TOURNAMENT_ID = "default-tournament";

export type BonusResultsState =
  | { ok: true; updated: number }
  | { ok: false; error: string }
  | undefined;

const clean = (v: FormDataEntryValue | null): string | null => {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
};

/**
 * Guarda los resultados reales del torneo (campeón, mejor jugador, goleador y
 * mejor jugador jóven) y recalcula los puntos de TODOS los pronósticos bonus.
 * Es el equivalente de `enterMatchResult` para los partidos: sin este paso los
 * `BonusPrediction.points` quedan en null y el ranking no suma el bonus.
 */
export async function setBonusResults(
  _prev: BonusResultsState,
  formData: FormData
): Promise<BonusResultsState> {
  await verifyAdmin();

  const results: BonusResults = {
    champion: clean(formData.get("champion")),
    bestPlayer: clean(formData.get("bestPlayer")),
    topScorer: clean(formData.get("topScorer")),
    bestYoungPlayer: clean(formData.get("bestYoungPlayer")),
  };

  try {
    await prisma.tournament.update({
      where: { id: TOURNAMENT_ID },
      data: results,
    });

    const updated = await recalculateBonusPoints(results);

    revalidatePath("/admin/bonus");
    revalidatePath("/admin/pronosticos");
    revalidatePath("/ranking");
    revalidatePath("/dashboard");
    revalidatePath("/bonus");

    return { ok: true, updated };
  } catch (e) {
    console.error("setBonusResults:", e);
    return { ok: false, error: "No se pudieron guardar los resultados bonus." };
  }
}

/**
 * Recalcula `points` para cada BonusPrediction del torneo.
 * Si una categoría todavía no tiene resultado cargado, sus pronósticos quedan
 * en null (pendientes) en vez de 0, para distinguir "sin definir" de "erró".
 */
async function recalculateBonusPoints(results: BonusResults): Promise<number> {
  const predictions = await prisma.bonusPrediction.findMany({
    where: { tournamentId: TOURNAMENT_ID },
    select: { id: true, position: true, teamName: true },
  });

  const resultFor: Record<string, string | null> = {
    CHAMPION: results.champion,
    BEST_PLAYER: results.bestPlayer,
    TOP_SCORER: results.topScorer,
    BEST_YOUNG_PLAYER: results.bestYoungPlayer,
  };

  let updated = 0;
  for (const pred of predictions) {
    const points =
      resultFor[pred.position] === null || resultFor[pred.position] === undefined
        ? null
        : calculateBonusPoints(pred.position, pred.teamName, results);

    await prisma.bonusPrediction.update({
      where: { id: pred.id },
      data: { points },
    });
    updated++;
  }

  return updated;
}
