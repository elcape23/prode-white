"use server";

import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/dal";
import { revalidatePath } from "next/cache";

const TOURNAMENT_ID = "default-tournament";

const STAGE_LABELS: Record<string, string> = {
  GROUP_STAGE:    "Grupos",
  ROUND_OF_16:   "Octavos de Final",
  QUARTER_FINALS: "Cuartos de Final",
  SEMI_FINALS:   "Semifinales",
  THIRD_PLACE:   "Tercer Puesto",
  FINAL:         "Final",
};

function roundLabel(stage: string, group?: string): string {
  const base = STAGE_LABELS[stage] ?? stage;
  if (stage === "GROUP_STAGE" && group) {
    return `${base} – ${group.replace("GROUP_", "Grupo ")}`;
  }
  return base;
}

export type ApiImportResult =
  | { ok: true; count: number }
  | { ok: false; error: string }
  | undefined;

export async function importFromApi(
  _prev: ApiImportResult
): Promise<ApiImportResult> {
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

  const matches: any[] = data.matches ?? [];
  if (matches.length === 0) {
    return { ok: false, error: "La API no devolvió partidos." };
  }

  let count = 0;
  for (const m of matches) {
    const externalId: number = m.id;
    const homeTeam: string = m.homeTeam?.name ?? "Por definir";
    const awayTeam: string = m.awayTeam?.name ?? "Por definir";
    const scheduledAt = new Date(m.utcDate);
    const round = roundLabel(m.stage, m.group);

    await prisma.match.upsert({
      where: { externalId },
      update: { round, homeTeam, awayTeam, scheduledAt },
      create: { tournamentId: TOURNAMENT_ID, externalId, round, homeTeam, awayTeam, scheduledAt },
    });
    count++;
  }

  // Keep firstMatchAt pointing to the earliest match
  const earliest = await prisma.match.findFirst({
    where: { tournamentId: TOURNAMENT_ID },
    orderBy: { scheduledAt: "asc" },
    select: { scheduledAt: true },
  });
  if (earliest) {
    await prisma.tournament.update({
      where: { id: TOURNAMENT_ID },
      data: { firstMatchAt: earliest.scheduledAt },
    });
  }

  revalidatePath("/admin/fixture");
  revalidatePath("/fixture");
  return { ok: true, count };
}
