"use server";

import { refresh } from "next/cache";
import { noteSchema, parseFormData } from "@atom/shared";
import { createNote, deleteNote, requireUser } from "@/lib/dal";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Creates a note. Used by the notes page form and the quick-capture FAB. */
export async function createNoteAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseFormData(noteSchema, formData);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Could not save that note";
    return { ok: false, error: message };
  }

  const user = await requireUser();
  await createNote(user.id, parsed.data);

  refresh();
  return { ok: true };
}

/** Deletes a note. Ownership enforced inside the DAL. */
export async function deleteNoteAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const user = await requireUser();
  await deleteNote(user.id, id);
  refresh();
}
