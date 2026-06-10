"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

export async function registerWithEmail(
  email: string,
  name: string,
  phone: string,
  password: string
): Promise<{ error: string } | undefined> {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.participant.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return { error: "Ese email ya está registrado." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const participant = await prisma.participant.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim() || null,
      passwordHash,
      status: "PENDING",
    },
  });

  await createSession({
    sub: participant.id,
    role: "participant",
    name: participant.name,
  });

  redirect("/dashboard");
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ error: string } | undefined> {
  const normalizedEmail = email.trim().toLowerCase();

  const participant = await prisma.participant.findUnique({
    where: { email: normalizedEmail },
  });
  if (!participant || !participant.passwordHash) {
    return { error: "Email o contraseña incorrectos." };
  }

  const valid = await bcrypt.compare(password, participant.passwordHash);
  if (!valid) {
    return { error: "Email o contraseña incorrectos." };
  }

  await createSession({
    sub: participant.id,
    role: "participant",
    name: participant.name,
  });

  redirect("/dashboard");
}
