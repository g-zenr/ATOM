import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { env } from "@/lib/env";

/**
 * The Neon CLI writes the single source-of-truth .env at the monorepo root.
 * next.config.ts runs in an isolated context, so its process.env mutations do
 * not reach the server runtime — this runs inside the actual Node.js server
 * process, where loadEnvConfig does.
 *
 * In Docker/Cloud Run there is no local .env: this is a no-op and the real
 * environment variables injected by the platform are used instead.
 */
function findRepoRoot(start: string): string {
  let dir = start;
  for (let depth = 0; depth < 6; depth += 1) {
    const marker = path.join(dir, "neon.ts");
    const envFile = path.join(dir, ".env");
    if (existsSync(marker) && existsSync(envFile)) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return start;
}

export function registerNode() {
  loadEnvConfig(findRepoRoot(process.cwd()));

  // Surface missing/invalid variables once at startup instead of at first use.
  try {
    env();
  } catch (error) {
    console.warn(`[atom] ${(error as Error).message}`);
  }
}
