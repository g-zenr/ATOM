import { Suspense } from "react";
import { connection } from "next/server";
import { listNotes, requireUser } from "@/lib/dal";
import { createNoteAction, deleteNoteAction } from "../actions/notes";
import { Pagination } from "../components/pagination";

const PAGE_SIZE = 20;

export default async function NotesPage(props: PageProps<"/notes">) {
  const searchParams = await props.searchParams;
  const rawQuery = searchParams.query;
  const query = typeof rawQuery === "string" ? rawQuery : "";
  const rawPage = searchParams.page;
  const page =
    typeof rawPage === "string" && Number.parseInt(rawPage, 10) > 0
      ? Number.parseInt(rawPage, 10)
      : 1;

  const submitNote = async (formData: FormData): Promise<void> => {
    "use server";
    await createNoteAction(formData);
  };

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Capture and revisit information.
      </p>

      {/* GET form: works without JS, keeps the search in the URL. */}
      <form action="/notes" method="get" className="mt-6 flex gap-2">
        <label htmlFor="note-search" className="sr-only">
          Search notes
        </label>
        <input
          id="note-search"
          name="query"
          defaultValue={query}
          placeholder="Search notes…"
          className="flex-1 rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
        />
        <button
          type="submit"
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-600 transition-colors hover:border-emerald-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          Search
        </button>
      </form>

      <form
        action={submitNote}
        className="mt-4 flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="note-title" className="text-xs text-zinc-500">
            Title
          </label>
          <input
            id="note-title"
            name="title"
            required
            maxLength={200}
            className="rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="note-content" className="text-xs text-zinc-500">
            Body
          </label>
          <textarea
            id="note-content"
            name="content"
            rows={3}
            className="rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
          />
        </div>
        <button
          type="submit"
          className="self-start rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Add note
        </button>
      </form>

      <Suspense key={`${query}:${page}`} fallback={<NotesSkeleton />}>
        <NoteResults query={query} page={page} />
      </Suspense>
    </main>
  );
}

async function NoteResults({ query, page }: { query: string; page: number }) {
  await connection();
  const user = await requireUser();
  const { notes, totalPages } = await listNotes(user.id, {
    query,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <>
      <ul className="mt-8 space-y-3">
        {notes.map((note) => (
          <li
            key={note.id}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-medium">{note.title}</h2>
              <form action={deleteNoteAction}>
                <input type="hidden" name="id" value={note.id} />
                <button
                  type="submit"
                  className="text-xs text-zinc-400 transition-colors hover:text-red-500"
                >
                  Delete
                </button>
              </form>
            </div>
            {note.content && (
              <p className="mt-1 text-sm whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">
                {note.content}
              </p>
            )}
            <p className="mt-2 text-xs text-zinc-400">
              Updated {note.updatedAt.toLocaleString()}
            </p>
          </li>
        ))}
        {notes.length === 0 && (
          <li className="text-sm text-zinc-500">
            {query
              ? `No notes match “${query}”.`
              : "No notes yet — add your first one above."}
          </li>
        )}
      </ul>
      <Pagination
        basePath="/notes"
        page={Math.min(page, totalPages)}
        totalPages={totalPages}
      />
    </>
  );
}

function NotesSkeleton() {
  return (
    <ul className="mt-8 space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <li
          key={index}
          className="h-20 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
        />
      ))}
    </ul>
  );
}
