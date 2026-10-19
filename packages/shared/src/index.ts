import { z } from "zod";

export * from "./form";

// ---- Enums -----------------------------------------------------------------

export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
export const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

// ---- Notes -----------------------------------------------------------------

export const noteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  content: z.string().max(20_000).default(""),
  tags: z.array(z.string().trim().min(1).max(50)).max(10).default([]),
});
export type NoteInput = z.infer<typeof noteSchema>;

// ---- Tasks -----------------------------------------------------------------

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().max(20_000).optional(),
  status: taskStatusSchema.default("TODO"),
  priority: prioritySchema.default("MEDIUM"),
  dueDate: z.coerce.date().optional(),
});
export type TaskInput = z.infer<typeof taskSchema>;

// ---- Time entries ----------------------------------------------------------

export const timeEntryClockInSchema = z.object({
  note: z.string().max(500).optional(),
});

export const timeEntryClockOutSchema = z.object({
  id: z.string().min(1),
});

// ---- Formatting helpers ----------------------------------------------------

/** Formats seconds as m:ss or h:mm:ss — used by the routes and the UI. */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Elapsed seconds between two dates. */
export function durationSeconds(start: Date, end: Date): number {
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
}
