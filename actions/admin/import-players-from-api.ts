"use server";

import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/dal";
import { revalidatePath } from "next/cache";

export type PlayerImportResult =
  | { ok: true; count: number; teams: number }
  | { ok: false; error: string }
  | undefined;

type ApiPerson = {
  id: number;
  name?: string;
  position?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
};

type ApiTeam = {
  name?: string;
  shortName?: string;
  squad?: ApiPerson[];
};

export async function importPlayersFromApi(
  _prev: PlayerImportResult
): Promise<PlayerImportResult> {
  await verifyAdmin();

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Falta la variable FOOTBALL_DATA_API_KEY en el entorno." };
  }

  // A single call returns every participating team with its full squad,
  // so we stay well under the API's 10-requests/minute throttle.
  let data: { teams?: ApiTeam[] };
  try {
    const res = await fetch(
      "https://api.football-data.org/v4/competitions/WC/teams",
      { headers: { "X-Auth-Token": apiKey }, next: { revalidate: 0 } }
    );
    if (res.status === 401) return { ok: false, error: "API key inválida o sin permisos para el Mundial." };
    if (res.status === 404) return { ok: false, error: "El Mundial 2026 aún no está disponible en la API." };
    if (res.status === 429) return { ok: false, error: "Límite de la API alcanzado (10 req/min). Probá de nuevo en un minuto." };
    if (!res.ok) return { ok: false, error: `Error de la API: ${res.status} ${res.statusText}` };
    data = await res.json();
  } catch {
    return { ok: false, error: "No se pudo conectar con football-data.org." };
  }

  const teams: ApiTeam[] = data.teams ?? [];
  if (teams.length === 0) {
    return { ok: false, error: "La API no devolvió equipos." };
  }

  type PlayerRow = {
    externalId: number;
    name: string;
    position: string | null;
    dateOfBirth: Date | null;
    nationality: string | null;
    teamName: string;
    updatedAt: Date;
  };

  const rows: PlayerRow[] = [];
  let teamsWithSquad = 0;
  const now = new Date();

  for (const team of teams) {
    const teamName = team.name ?? team.shortName ?? "Sin equipo";
    const squad = team.squad ?? [];
    if (squad.length > 0) teamsWithSquad++;

    for (const person of squad) {
      if (!person.id || !person.name) continue;
      rows.push({
        externalId: person.id,
        name: person.name,
        position: person.position ?? null,
        dateOfBirth: person.dateOfBirth ? new Date(person.dateOfBirth) : null,
        nationality: person.nationality ?? null,
        teamName,
        updatedAt: now,
      });
    }
  }

  if (rows.length === 0) {
    return {
      ok: false,
      error: "La API devolvió equipos pero todavía sin plantillas. Las convocatorias suelen publicarse poco antes del torneo.",
    };
  }

  try {
    await prisma.$transaction([
      prisma.player.deleteMany(),
      prisma.player.createMany({ data: rows }),
    ]);
  } catch {
    return { ok: false, error: "Error al guardar los jugadores en la base de datos." };
  }

  revalidatePath("/admin/fixture");
  revalidatePath("/bonus");
  return { ok: true, count: rows.length, teams: teamsWithSquad };
}
