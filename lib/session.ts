import "server-only";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/lib/session-crypto";

export type { SessionPayload } from "@/lib/session-crypto";

export { encrypt, decrypt };

export async function createSession(
  payload: import("@/lib/session-crypto").SessionPayload
): Promise<void> {
  const token = await encrypt(payload);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
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
