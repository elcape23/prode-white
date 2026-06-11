"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyParticipant } from "@/lib/dal";
import { createSession } from "@/lib/session";

export type UpdateNameState = { error?: string } | undefined;

/**
 * Actualiza el nombre y apellido del participante en sesión.
 * Persiste en la base y refresca la cookie de sesión (que cachea el nombre).
 */
export async function updateParticipantName(
  firstName: string,
  lastName: string
): Promise<UpdateNameState> {
  const session = await verifyParticipant();

  const nombre = firstName.trim();
  const apellido = lastName.trim();

  if (!nombre || !apellido) {
    return { error: "Ingresá nombre y apellido." };
  }

  const fullName = `${nombre} ${apellido}`;

  await prisma.participant.update({
    where: { id: session.sub },
    data: { name: fullName },
  });

  // El nombre viaja en la sesión: la regeneramos para mantenerla al día.
  await createSession({ ...session, name: fullName });

  revalidatePath("/cuenta");
  return undefined;
}
