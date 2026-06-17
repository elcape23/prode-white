import prisma from "@/lib/prisma";

// Los pronósticos bonus quedan abiertos hasta que arranca la SEGUNDA FECHA
// (jornada 2). El campo `round` identifica al grupo ("Grupos – Grupo A"), no a
// la fecha: cada grupo juega MATCHES_PER_MATCHDAY partidos por jornada.
// Recorriendo los partidos por fecha contamos la posición dentro de cada grupo;
// el primero que cae en la jornada >= 2 es el inicio de la segunda fecha.
const MATCHES_PER_MATCHDAY = 2;
const isGroupStage = (round: string) => /grupo/i.test(round);
const groupLabel = (round: string) =>
  round.replace(/^\s*grupos\s*[–-]\s*/i, "").trim() || round;

const TZ = "America/Argentina/Buenos_Aires";

/**
 * Momento en el que se cierran los pronósticos bonus: el inicio de la segunda
 * fecha. Devuelve `null` si todavía no hay fixture suficiente para determinarlo.
 */
export async function getBonusDeadline(tournamentId: string): Promise<Date | null> {
  const allMatches = await prisma.match.findMany({
    where: { tournamentId },
    orderBy: { scheduledAt: "asc" },
    select: { round: true, scheduledAt: true },
  });

  const seenPerGroup = new Map<string, number>();
  for (const m of allMatches) {
    if (!isGroupStage(m.round)) continue;
    const label = groupLabel(m.round);
    const pos = seenPerGroup.get(label) ?? 0; // posición 0-indexada dentro del grupo
    seenPerGroup.set(label, pos + 1);
    if (Math.floor(pos / MATCHES_PER_MATCHDAY) + 1 >= 2) {
      return m.scheduledAt;
    }
  }
  return null;
}

/** Día calendario (YYYY-MM-DD) en horario de Argentina. */
function dayKey(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TZ,
  }).format(d);
}

/**
 * `true` si hoy (en horario de Argentina) es el último día para elegir los
 * puntos bonus. Como el cierre suele caer temprano en la mañana del día de la
 * segunda fecha, el "último día útil" es la jornada anterior: mostramos el aviso
 * desde el día previo al cierre y hasta el instante en que se bloquea.
 */
export function isLastDayToChooseBonus(deadline: Date | null, now = new Date()): boolean {
  if (!deadline) return false;
  if (now >= deadline) return false; // ya cerrado

  // Día calendario anterior al cierre (Argentina no observa DST, así que
  // restar 24 h cae siempre en la jornada previa).
  const dayBefore = new Date(deadline.getTime() - 24 * 60 * 60 * 1000);
  // dayKey devuelve YYYY-MM-DD, comparable lexicográficamente.
  return dayKey(now) >= dayKey(dayBefore);
}
