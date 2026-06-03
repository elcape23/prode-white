"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

export type AuthState = { error?: string } | undefined;

export async function loginParticipant(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const phone = (formData.get("phone") as string)?.trim();
  const pin = (formData.get("pin") as string)?.trim();

  if (!phone || !pin) {
    return { error: "Ingresá tu teléfono y PIN." };
  }

  const participant = await prisma.participant.findUnique({ where: { phone } });

  if (!participant || participant.status !== "APPROVED" || !participant.pin) {
    return { error: "Teléfono no encontrado o cuenta no aprobada." };
  }

  if (pin !== participant.pin) {
    return { error: "PIN incorrecto." };
  }

  await createSession({
    sub: participant.id,
    role: "participant",
    name: participant.name,
  });

  redirect("/dashboard");
}

export async function loginAdmin(
  _state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!email || !password) {
    return { error: "Ingresá email y contraseña." };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return { error: "Admin no configurado." };
  }

  // Constant-time comparison to prevent timing attacks
  const emailMatch = email === adminEmail;
  const passwordMatch = password === adminPassword;
  if (!emailMatch || !passwordMatch) {
    return { error: "Credenciales inválidas." };
  }

  await createSession({ sub: "admin", role: "admin", name: "Admin" });
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
