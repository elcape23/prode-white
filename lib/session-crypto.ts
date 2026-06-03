import { SignJWT, jwtVerify } from "jose";

export type SessionPayload = {
  sub: string; // participantId | "admin"
  role: "participant" | "admin";
  name: string;
};

function getEncodedKey() {
  const secret = process.env.SESSION_SECRET ?? "dev-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getEncodedKey());
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
