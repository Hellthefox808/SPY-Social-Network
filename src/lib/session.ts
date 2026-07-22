import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { logger } from "./logger";

const getSecretKey = (): string => {
  if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    throw new Error("CRITICAL SECURITY ERROR: SESSION_SECRET environment variable is missing in production.");
  }
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }
  // Dev-only fallback: generate a random key per process start using Web Crypto API.
  // This invalidates all sessions after each server restart, which is acceptable in dev.
  // Compatible with both Node.js and Edge Runtime.
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const devFallback = Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  logger.warn("Dev session secret fallback in use — set SESSION_SECRET env var for persistent sessions", {});
  return devFallback;
};

const secretKey = getSecretKey();
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
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
