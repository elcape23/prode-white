import { SignJWT, jwtVerify } from "jose";

export type SessionPayload = {
  sub: string; // participantId | "admin"
  role: "participant" | "admin";
  name: string;
};

const SECRET_KEY = process.env.SESSION_SECRET;
if (!SECRET_KEY && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET env var is required in production");
}
const encodedKey = new TextEncoder().encode(SECRET_KEY ?? "dev-secret-change-me");

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
