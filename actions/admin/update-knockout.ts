"use server";

import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/dal";
import { revalidatePath } from "next/cache";

const TOURNAMENT_ID = "default-tournament";

const STAGE_LABELS: Record<string, string> = {
  ROUND_OF_16:    "Octavos de Final",
  QUARTER_FINALS: "Cuartos de Final",
  SEMI_FINALS:    "Semifinales",
  THIRD_PLACE:    "Tercer Puesto",
  FINAL:          "Final",
};

/** Etiqueta de ronda para las fases de eliminación. Las etiquetas que la API
 *  devuelve tal cual (LAST_32, LAST_16, …) se conservan, tal como hace la
 *  importación general del fixture. */
function roundLabel(stage: string): string {
  return STAGE_LABELS[stage] ?? stage;
}

export type UpdateKnockoutResult =
  | { ok: true; updated: number }
  | { ok: false; error: string }
  | undefined;

/** Actualiza sólo los partidos de eliminación (llaves) desde football-data.org.
 *  A diferencia de la importación completa, no toca la fase de grupos: sirve
 *  para rellenar los equipos y horarios de cada ronda a medida que se definen,
 *  sin sobrescribir el resto del fixture. No modifica los resultados cargados. */
export async function updateKnockoutFromApi(
  _prev: UpdateKnockoutResult
): Promise<UpdateKnockoutResult> {
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
    if (res.status === 401) return { ok: false, error: "API key inválida o sin permisos para el Mundial." };
    if (res.status === 404) return { ok: false, error: "El Mundial 2026 aún no está disponible en la API." };
    if (!res.ok) return { ok: false, error: `Error de la API: ${res.status} ${res.statusText}` };
    data = await res.json();
  } catch {
    return { ok: false, error: "No se pudo conectar con football-data.org." };
  }

  const allMatches: any[] = data.matches ?? [];
  // Sólo fases de eliminación: descartamos la fase de grupos.
  const koMatches = allMatches.filter((m) => m.stage && m.stage !== "GROUP_STAGE");
  if (koMatches.length === 0) {
    return { ok: false, error: "La API todavía no tiene partidos de eliminación." };
  }

  let updated = 0;
  for (const m of koMatches) {
    const externalId: number = m.id;
    const homeTeam: string = m.homeTeam?.name ?? "Por definir";
    const awayTeam: string = m.awayTeam?.name ?? "Por definir";
    const scheduledAt = new Date(m.utcDate);
    const round = roundLabel(m.stage);

    // No incluimos homeScore/awayScore: los resultados se cargan por separado.
    await prisma.match.upsert({
      where: { externalId },
      update: { round, homeTeam, awayTeam, scheduledAt },
      create: { tournamentId: TOURNAMENT_ID, externalId, round, homeTeam, awayTeam, scheduledAt },
    });
    updated++;
  }

  revalidatePath("/admin/fixture");
  revalidatePath("/fixture");
  revalidatePath("/pronosticos");
  return { ok: true, updated };
}
