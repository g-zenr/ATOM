import { NextResponse, type NextRequest } from "next/server";
import { apiToken } from "@/lib/env";
import { getAuth } from "@/lib/auth/server";

// ---------------------------------------------------------------------------
// ATOM proxy (Next.js 16 — "middleware" was renamed to "proxy").
//
// Three jobs, in one place:
//   1. /api/*  — bearer-token gate (n8n, Discord bot, future mobile) + rate limit
//   2. pages   — Neon Auth session check, redirect to /auth/sign-in
//   3. /api/auth/* + /api/health stay open (Managed Auth handler + probes)
// ---------------------------------------------------------------------------

const PUBLIC_API_PREFIXES = ["/api/auth", "/api/health"];

// Simple in-memory fixed window. Per-instance on Cloud Run — strong enough for
// a single-user API; move to a shared store if that changes.
const RATE_LIMIT_MAX = 120;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function rateLimited(request: NextRequest): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    if (rateBuckets.size > 10_000) rateBuckets.clear();
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  bucket.count += 1;
  if (bucket.count > RATE_LIMIT_MAX) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }
  return null;
}

function apiTokenOk(request: NextRequest): boolean {
  const token = apiToken();
  if (!token) return true; // not configured (local dev)

  const authorization = request.headers.get("authorization") ?? "";
  const provided = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : (request.headers.get("x-api-key") ?? "");
  return provided === token;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    if (PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return NextResponse.next();
    }
    const limited = rateLimited(request);
    if (limited) return limited;
    if (!apiTokenOk(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Page protection: redirects unauthenticated browsers to the sign-in page.
  const authMiddleware = getAuth().middleware({ loginUrl: "/auth/sign-in" });
  const response = await authMiddleware(request);
  return response ?? NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    // Explicitly protected pages — everything else (landing, /auth/*) is public.
    "/dashboard/:path*",
    "/notes/:path*",
    "/tasks/:path*",
    "/time/:path*",
  ],
};
