import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getEnv } from "@/lib/env";

export const SESSION_COOKIE_NAME = "elumen_session";

function getKey(): Uint8Array {
  const secret = getEnv().AUTH_SECRET;
  return new TextEncoder().encode(secret.padEnd(32, "x").slice(0, 32));
}

export type SessionPayload = {
  userId: string;
};

export async function readSessionPayload(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    const userId =
      typeof payload.userId === "string" ? payload.userId : null;
    if (!userId) return null;
    return { userId };
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey());

  const jar = await cookies();
  jar.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE_NAME);
}

/** Use in Route Handlers and Server Components. */
export async function readSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return readSessionPayload(jar.get(SESSION_COOKIE_NAME)?.value);
}
