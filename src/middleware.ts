import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/config";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

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
  let response = NextResponse.next();
  let authed = false;

  if (hasSupabaseBrowserEnv()) {
    const session = await updateSupabaseSession(request);
    response = session.response;
    authed = Boolean(session.user);
  }

  const isProtected = pathname.startsWith("/dashboard");

  if (isProtected) {
    if (!authed) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  const isAuthPages = pathname === "/login" || pathname === "/register";
  if (isAuthPages) {
    if (authed) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/api/:path*",
  ],
};
