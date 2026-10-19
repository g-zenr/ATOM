"use server";

import { refresh } from "next/cache";
import { parseFormData, taskSchema, taskStatusSchema } from "@atom/shared";
import { createTask, requireUser, setTaskStatus } from "@/lib/dal";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Creates a task from the tasks page form. */
export async function createTaskAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseFormData(taskSchema, formData);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Could not save that task";
    return { ok: false, error: message };
  }

  const user = await requireUser();
  await createTask(user.id, parsed.data);

  refresh();
  return { ok: true };
}

/** Moves a task between statuses. Ownership enforced inside the DAL. */
export async function setTaskStatusAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const status = taskStatusSchema.safeParse(formData.get("status"));
  if (!id || !status.success) return;

  const user = await requireUser();
  await setTaskStatus(user.id, id, status.data);
  refresh();
}
