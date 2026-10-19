"use client";

import { useEffect, useRef, useState } from "react";
import { createNoteAction } from "@/app/actions/notes";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/store/ui-store";

/**
 * Floating quick-capture composer. Open/closed state lives in the UI store so
 * it can also be triggered from elsewhere in the shell. Saves through the
 * createNoteAction Server Action — no API token ever reaches the browser.
 */
export function QuickCapture() {
  const open = useUiStore((state) => state.quickCaptureOpen);
  const setOpen = useUiStore((state) => state.setQuickCaptureOpen);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) titleRef.current?.focus();
  }, [open]);

  async function onSubmit(formData: FormData): Promise<void> {
    setPending(true);
    setError(null);
    const result = await createNoteAction(formData);
    setPending(false);

    if (result.ok) {
      setOpen(false);
    } else {
      setError(result.error);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-emerald-700"
      >
        + Quick note
      </button>
    );
  }

  return (
    <form
      action={onSubmit}
      className="fixed right-6 bottom-6 w-80 space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
    >
      <input
        ref={titleRef}
        id="quick-note-title"
        name="title"
        aria-label="Quick note title"
        placeholder="Quick note…"
        required
        maxLength={200}
        className="w-full rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
      />
      <textarea
        id="quick-note-content"
        name="content"
        aria-label="Quick note details"
        placeholder="Details (optional)"
        rows={3}
        className="w-full rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
      />
      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700",
            pending && "opacity-60",
          )}
        >
          {pending ? "Saving…" : "Save note"}
        </button>
      </div>
    </form>
  );
}
