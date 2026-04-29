import { NextResponse, type NextRequest } from "next/server";
import { readSessionPayload, SESSION_COOKIE_NAME } from "@/lib/auth/session";

/** Simple in-memory rate limit (resets per deploy; replace with Redis in prod). */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 200;
const hits = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const stamp = hits.get(ip) ?? [];
  const fresh = stamp.filter((t) => now - t < WINDOW_MS);
  fresh.push(now);
  hits.set(ip, fresh);
  return fresh.length <= MAX_PER_WINDOW;
}

export async function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";

  if (!rateLimit(ip)) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith("/dashboard");

  if (isProtected) {
    const tok = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const sess = await readSessionPayload(tok);
    if (!sess?.userId) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  const isAuthPages = pathname === "/login" || pathname === "/register";
  if (isAuthPages) {
    const tok = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const sess = await readSessionPayload(tok);
    if (sess?.userId) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/api/:path*",
  ],
};
