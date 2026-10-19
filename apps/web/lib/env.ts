import { z } from "zod";

/**
 * Validated server environment. Parsed lazily and cached, so importing this
 * module (e.g. from a Server Component) never throws at module scope.
 */

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_URL_UNPOOLED: z.string().url(),
  ATOM_API_TOKEN: z.string().min(8).optional(),
  DISCORD_TOKEN: z.string().min(8).optional(),
  // Neon Auth (Managed Better Auth) — branch URL comes from the Neon CLI;
  // the cookie secret is app config (generate: openssl rand -base64 32).
  NEON_AUTH_BASE_URL: z.string().url().optional(),
  NEON_AUTH_COOKIE_SECRET: z.string().min(32).optional(),
});

/** Empty strings in .env files mean "unset" for optional secrets. */
function normalizeEnv(source: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const normalized: NodeJS.ProcessEnv = { ...source };
  for (const key of ["ATOM_API_TOKEN", "DISCORD_TOKEN"] as const) {
    if (normalized[key] === "") {
      delete normalized[key];
    }
  }
  return normalized;
}

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | null = null;

export function env(): ServerEnv {
  if (cached) return cached;

  const result = envSchema.safeParse(normalizeEnv(process.env));
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid server environment — ${details}`);
  }

  cached = result.data;
  return cached;
}

/** API token guarding /api/* (webhooks, n8n, mobile). Undefined = gate off. */
export function apiToken(): string | undefined {
  const parsed = z.string().min(8).safeParse(process.env.ATOM_API_TOKEN);
  return parsed.success ? parsed.data : undefined;
}
