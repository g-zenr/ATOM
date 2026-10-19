import { PrismaClient } from "@prisma/client";

// Serverless-safe singleton: one client per warm instance, reused across requests.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Generated types, enums, and the Prisma namespace.
export * from "@prisma/client";

/**
 * Single-user MVP helper: returns the workspace owner, creating a default one
 * on first use. Replace with Neon Auth (@neondatabase/auth) when ATOM gets
 * real multi-user sign-in — see the neon-auth skill.
 */
export async function getCurrentUser() {
  const existing = await prisma.user.findFirst();
  if (existing) return existing;
  return prisma.user.create({
    data: { email: "me@atom.local", name: "Me" },
  });
}
