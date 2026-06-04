"use server";

import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/dal";

export type AdminActionState = { error?: string; success?: string } | undefined;
export type ApproveResult = { pin: string } | { error: string };

// Unambiguous characters (no 0/O, 1/I/L)
const PIN_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomPin(length = 6): string {
  return Array.from(
    { length },
    () => PIN_CHARS[Math.floor(Math.random() * PIN_CHARS.length)]
  ).join("");
}

async function generateUniquePin(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const pin = randomPin();
    const exists = await prisma.participant.findFirst({
      where: { pin },
      select: { id: true },
    });
    if (!exists) return pin;
  }
  // Practically unreachable: 30^6 = ~729M combinations for ~100 participants
  return randomPin(8);
}

export async function approveRegistration(
  participantId: string
): Promise<ApproveResult> {
  await verifyAdmin();

  const pin = await generateUniquePin();

  await prisma.participant.update({
    where: { id: participantId },
    data: {
      status: "APPROVED",
      pin,
      approvedAt: new Date(),
    },
  });

  // revalidation is handled by the client after closing the dialog
  return { pin };
}

export async function deleteParticipant(
  participantId: string
): Promise<AdminActionState> {
  await verifyAdmin();

  await prisma.participant.delete({ where: { id: participantId } });

  return { success: "Participante eliminado." };
}

export async function rejectRegistration(
  participantId: string
): Promise<AdminActionState> {
  await verifyAdmin();

  await prisma.participant.update({
    where: { id: participantId },
    data: { status: "REJECTED" },
  });

  return { success: "Participante rechazado." };
}

export async function reactivateRegistration(
  participantId: string
): Promise<AdminActionState> {
  await verifyAdmin();

  await prisma.participant.update({
    where: { id: participantId },
    data: { status: "PENDING" },
  });

  return { success: "Participante reactivado." };
}
