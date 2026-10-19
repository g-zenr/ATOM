import { createNeonAuth } from "@neondatabase/auth/next/server";

type NeonAuthServer = ReturnType<typeof createNeonAuth>;

let instance: NeonAuthServer | null = null;

/**
 * Lazy singleton for Neon Auth (Managed Better Auth).
 *
 * Construction reads NEON_AUTH_BASE_URL / NEON_AUTH_COOKIE_SECRET, which are
 * only present at runtime (loaded by apps/web/instrumentation.ts). Keeping
 * this module import side-effect-free lets `next build` collect page data
 * without those variables.
 */
export function getAuth(): NeonAuthServer {
  if (!instance) {
    instance = createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!,
      cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
    });
  }
  return instance;
}
