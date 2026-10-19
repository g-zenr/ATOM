import { connection } from "next/server";
import { prisma } from "@atom/db";

// Open (no token) — used by Cloud Run health checks and uptime probes.
export async function GET() {
  await connection();
  let db: "up" | "down" = "down";
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = "up";
  } catch {
    db = "down";
  }
  return Response.json({ ok: db === "up", db });
}
