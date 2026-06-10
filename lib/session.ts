import "server-only";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/lib/session-crypto";

if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET env var is required in production");
}

export type { SessionPayload } from "@/lib/session-crypto";

export { encrypt, decrypt };

export async function createSession(
  payload: import("@/lib/session-crypto").SessionPayload,
  rememberMe = true
): Promise<void> {
  const token = await encrypt(payload);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...(rememberMe && { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }),
    path: "/",
  });
}

export async function getSession(): Promise<
  import("@/lib/session-crypto").SessionPayload | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  return decrypt(token);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
