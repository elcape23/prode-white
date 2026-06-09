import "server-only";
import prisma from "@/lib/prisma";

export type RankedParticipant = {
  id: string;
  name: string;
  total: number;
  position: number;
};

/**
 * Devuelve el ranking real de participantes aprobados, ordenado por puntos
 * totales (partidos + bonus) de mayor a menor. El desempate es determinístico
 * (nombre y luego id) para que la posición sea idéntica en todas las vistas
 * que consuman este helper (home y página de Ranking).
 */
export async function getRanking(): Promise<RankedParticipant[]> {
  const participants = await prisma.participant.findMany({
    where: { status: "APPROVED" },
    include: {
      predictions: { select: { points: true } },
      bonusPredictions: { select: { points: true } },
    },
  });

  return participants
    .map((p) => ({
      id: p.id,
      name: p.name,
      total:
        p.predictions.reduce((s, pr) => s + (pr.points ?? 0), 0) +
        p.bonusPredictions.reduce((s, bp) => s + (bp.points ?? 0), 0),
    }))
    .sort(
      (a, b) =>
        b.total - a.total ||
        a.name.localeCompare(b.name) ||
        a.id.localeCompare(b.id)
    )
    .map((p, i) => ({ ...p, position: i + 1 }));
}

/**
 * Posición y puntos reales de un participante dentro del ranking.
 * `position` es 0 si el participante no está en el ranking (no aprobado).
 */
export async function getParticipantRanking(
  participantId: string
): Promise<{ position: number; total: number }> {
  const ranked = await getRanking();
  const entry = ranked.find((p) => p.id === participantId);
  return { position: entry?.position ?? 0, total: entry?.total ?? 0 };
}
