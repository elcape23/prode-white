"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyParticipant } from "@/lib/dal";

/**
 * Marca que el participante ya vio el modal de bienvenida, para que no
 * vuelva a aparecer en futuras visitas al dashboard.
 */
export async function markWelcomeSeen(): Promise<{ ok: boolean }> {
  const session = await verifyParticipant();

  await prisma.participant.update({
    where: { id: session.sub },
    data: { hasSeenWelcome: true },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}
