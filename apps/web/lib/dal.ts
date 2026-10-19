import "server-only";

import { redirect } from "next/navigation";
import { prisma, type TaskStatus } from "@atom/db";
import { getAuth } from "./auth/server";
import {
  durationSeconds,
  formatDuration,
  type NoteInput,
  type TaskInput,
} from "@atom/shared";

/**
 * Server-only Data Access Layer (Next.js data-security guide).
 *
 * Every database read/write in ATOM goes through this file. Each function
 * takes an explicit `userId` — there is no unscoped query anywhere in the
 * app. Two entry points resolve that user:
 *
 *   requireUser()   — browser context: the Neon Auth session user
 *   getOwnerUser()  — token context: the workspace owner (n8n / API clients)
 */

export async function requireUser() {
  const { data: session } = await getAuth().getSession();
  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  // 1. Known identity — return the linked workspace user.
  const existing = await prisma.user.findUnique({
    where: { authUserId: session.user.id },
  });
  if (existing) return existing;

  // 2. Same email as a pre-auth row (e.g. the seeded demo user) — adopt it.
  const byEmail = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: {
        authUserId: session.user.id,
        name: session.user.name ?? byEmail.name ?? undefined,
      },
    });
  }

  // 3. Brand-new identity — create the workspace user.
  return prisma.user.create({
    data: {
      authUserId: session.user.id,
      email: session.user.email,
      name: session.user.name ?? undefined,
    },
  });
}

export async function getOwnerUser() {
  const owner = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!owner) {
    throw new Error("No workspace user yet — sign in through the app once.");
  }
  return owner;
}

// ---- Notes -----------------------------------------------------------------

export async function listNotes(
  userId: string,
  options: { query?: string; page?: number; pageSize?: number } = {},
) {
  const { query = "", page = 1, pageSize = 20 } = options;

  const where = {
    userId,
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { content: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, notes] = await Promise.all([
    prisma.note.count({ where }),
    prisma.note.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    notes,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function createNote(userId: string, input: NoteInput) {
  return prisma.note.create({
    data: {
      title: input.title,
      content: input.content,
      tags: input.tags,
      userId,
    },
  });
}

export async function deleteNote(userId: string, id: string) {
  const { count } = await prisma.note.deleteMany({ where: { id, userId } });
  return count > 0;
}

// ---- Tasks -----------------------------------------------------------------

export async function listTasks(
  userId: string,
  options: {
    query?: string;
    status?: TaskStatus;
    page?: number;
    pageSize?: number;
  } = {},
) {
  const { query = "", status, page = 1, pageSize = 20 } = options;

  const where = {
    userId,
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { description: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
  };

  const [total, tasks] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    tasks,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function createTask(userId: string, input: TaskInput) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate,
      userId,
    },
  });
}

export async function setTaskStatus(
  userId: string,
  id: string,
  status: TaskStatus,
) {
  const { count } = await prisma.task.updateMany({
    where: { id, userId },
    data: { status },
  });
  return count > 0;
}

// ---- Time tracking -----------------------------------------------------------

export async function getTimeOverview(userId: string) {
  const [entries, openEntry] = await Promise.all([
    prisma.timeEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 30,
    }),
    prisma.timeEntry.findFirst({
      where: { userId, end: null },
      orderBy: { start: "desc" },
    }),
  ]);

  return {
    entries: entries.map((entry) => ({
      ...entry,
      durationFormatted:
        entry.duration != null ? formatDuration(entry.duration) : null,
    })),
    openEntry,
  };
}

export async function clockIn(userId: string, note?: string) {
  const alreadyOpen = await prisma.timeEntry.findFirst({
    where: { userId, end: null },
  });
  if (alreadyOpen) return { conflict: true as const, entry: alreadyOpen };

  const now = new Date();
  const entry = await prisma.timeEntry.create({
    data: { start: now, date: now, note, userId },
  });
  return { conflict: false as const, entry };
}

export async function clockOut(userId: string, id: string) {
  const entry = await prisma.timeEntry.findFirst({
    where: { id, userId, end: null },
  });
  if (!entry) return null;

  const end = new Date();
  return prisma.timeEntry.update({
    where: { id: entry.id },
    data: { end, duration: durationSeconds(entry.start, end) },
  });
}

// ---- Dashboard ----------------------------------------------------------------

export async function getDashboardStats(userId: string) {
  const [noteCount, taskCounts, recentEntries] = await Promise.all([
    prisma.note.count({ where: { userId } }),
    prisma.task.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),
    prisma.timeEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  return {
    noteCount,
    todoCount: taskCounts.find((t) => t.status === "TODO")?._count ?? 0,
    inProgressCount:
      taskCounts.find((t) => t.status === "IN_PROGRESS")?._count ?? 0,
    doneCount: taskCounts.find((t) => t.status === "DONE")?._count ?? 0,
    recentEntries,
    openEntry: recentEntries.find((entry) => entry.end === null) ?? null,
  };
}
