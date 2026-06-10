import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/session";

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session) {
    redirect("/onboarding");
  }
  return session;
});

export const verifyAdmin = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }
  return session;
});

export const verifyParticipant = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session || session.role !== "participant") {
    redirect("/onboarding");
  }
  return session;
});
