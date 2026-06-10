"use server";

import prisma from "@/lib/prisma";
import { verifyParticipant } from "@/lib/dal";

export async function requestAccess(): Promise<{ ok: boolean; error?: string }> {
  const session = await verifyParticipant();

  const participant = await prisma.participant.findUnique({
    where: { id: session.sub },
    select: { status: true, accessRequestedAt: true },
  });

  if (!participant) return { ok: false, error: "Participante no encontrado." };
  if (participant.status === "APPROVED") return { ok: false, error: "Tu acceso ya fue aprobado." };
  if (participant.accessRequestedAt) return { ok: true }; // idempotent

  await prisma.participant.update({
    where: { id: session.sub },
    data: { accessRequestedAt: new Date() },
  });

  return { ok: true };
}
