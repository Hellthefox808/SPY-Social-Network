import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { logger } from "./logger";

function getEncodedKey(): Uint8Array {
  const secretKey = process.env.SESSION_SECRET || "dev_super_secret_key_change_in_production_123456789";
  if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET && typeof window === "undefined" && process.env.NEXT_PHASE !== "phase-production-build") {
    logger.warn("SESSION_SECRET env var is missing in production environment. Using default fallback key.", {});
  }
  return new TextEncoder().encode(secretKey);
}

export async function encrypt(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getEncodedKey());
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ userId, expiresAt });
  
  const cookieStore = await cookies();
  cookieStore.set("sg_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("sg_session");
}

export async function getSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("sg_session")?.value;
  if (!cookie) return null;
  return await decrypt(cookie);
}
