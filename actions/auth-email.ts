"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

export async function registerWithEmail(
  email: string,
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
  const name = normalizedEmail.split("@")[0];

  const participant = await prisma.participant.create({
    data: {
      name,
      email: normalizedEmail,
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
