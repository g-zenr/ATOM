import { connection } from "next/server";
import { refresh } from "next/cache";
import { requireUser } from "@/lib/dal";
import {
  clockIn as clockInFor,
  clockOut as clockOutFor,
  getTimeOverview,
} from "@/lib/dal";
import { timeEntryClockInSchema } from "@atom/shared";

export default async function TimePage() {
  await connection();
  const user = await requireUser();
  const { entries, openEntry } = await getTimeOverview(user.id);

  async function clockIn(formData: FormData) {
    "use server";
    const parsed = timeEntryClockInSchema.safeParse({
      note: formData.get("note") || undefined,
    });
    if (!parsed.success) return;

    const owner = await requireUser();
    await clockInFor(owner.id, parsed.data.note);
    refresh();
  }

  async function clockOut(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;

    const owner = await requireUser();
    await clockOutFor(owner.id, id);
    refresh();
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Time</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Clock in and out of work sessions.
      </p>

      <div className="mt-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        {openEntry ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Clocked in
              </span>{" "}
              since {openEntry.start.toLocaleString()}
              {openEntry.note ? ` — ${openEntry.note}` : ""}
            </p>
            <form action={clockOut}>
              <input type="hidden" name="id" value={openEntry.id} />
              <button
                type="submit"
                className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Clock out
              </button>
            </form>
          </div>
        ) : (
          <form action={clockIn} className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 flex-col gap-1">
              <label htmlFor="session-note" className="sr-only">
                Session note
              </label>
              <input
                id="session-note"
                name="note"
                placeholder="Session note (optional)"
                maxLength={500}
                className="flex-1 rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Clock in
            </button>
          </form>
        )}
      </div>

      <h2 className="mt-10 text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Recent entries
      </h2>
      <ul className="mt-3 space-y-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800"
          >
            <span className="text-zinc-500">
              {entry.date.toISOString().slice(0, 10)}
              {entry.note ? ` — ${entry.note}` : ""}
            </span>
            <span className="font-mono">
              {entry.durationFormatted ?? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  open
                </span>
              )}
            </span>
          </li>
        ))}
        {entries.length === 0 && !openEntry && (
          <li className="text-sm text-zinc-500">No time entries yet.</li>
        )}
      </ul>
    </main>
  );
}
