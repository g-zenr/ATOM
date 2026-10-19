import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { listTasks, requireUser } from "@/lib/dal";
import { createTaskAction, setTaskStatusAction } from "../actions/tasks";
import { prioritySchema, taskStatusSchema } from "@atom/shared";
import { Pagination } from "../components/pagination";

const PAGE_SIZE = 20;

const STATUS_LABELS: Record<string, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const STATUSES = taskStatusSchema.options;

export default async function TasksPage(props: PageProps<"/tasks">) {
  const searchParams = await props.searchParams;
  const rawQuery = searchParams.query;
  const query = typeof rawQuery === "string" ? rawQuery : "";
  const statusFilter = taskStatusSchema.safeParse(searchParams.status);
  const rawPage = searchParams.page;
  const page =
    typeof rawPage === "string" && Number.parseInt(rawPage, 10) > 0
      ? Number.parseInt(rawPage, 10)
      : 1;

  const submitTask = async (formData: FormData): Promise<void> => {
    "use server";
    await createTaskAction(formData);
  };

  const baseParams = new URLSearchParams();
  if (query) baseParams.set("query", query);
  const tabHref = (status?: string) => {
    const params = new URLSearchParams(baseParams);
    if (status) params.set("status", status);
    const qs = params.toString();
    return qs ? `/tasks?${qs}` : "/tasks";
  };

  const tabs = [
    { label: "All", href: tabHref() },
    ...STATUSES.map((status) => ({
      label: STATUS_LABELS[status],
      href: tabHref(status),
    })),
  ];

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
      <p className="mt-1 text-sm text-zinc-500">
        A GitHub Issues–inspired workflow: todo → in progress → done.
      </p>

      <form action="/tasks" method="get" className="mt-6 flex gap-2">
        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>
        <input
          id="task-search"
          name="query"
          defaultValue={query}
          placeholder="Search tasks…"
          className="flex-1 rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
        />
        <button
          type="submit"
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-600 transition-colors hover:border-emerald-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          Search
        </button>
      </form>

      <nav className="mt-4 flex gap-2" aria-label="Filter by status">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-500 transition-colors hover:border-emerald-500 dark:border-zinc-700"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <form
        action={submitTask}
        className="mt-4 flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="task-title" className="text-xs text-zinc-500">
              Title
            </label>
            <input
              id="task-title"
              name="title"
              required
              maxLength={200}
              className="rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="task-priority" className="text-xs text-zinc-500">
              Priority
            </label>
            <select
              id="task-priority"
              name="priority"
              defaultValue="MEDIUM"
              className="rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
            >
              {prioritySchema.options.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="task-status" className="text-xs text-zinc-500">
              Status
            </label>
            <select
              id="task-status"
              name="status"
              defaultValue="TODO"
              className="rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="task-description" className="text-xs text-zinc-500">
            Description
          </label>
          <textarea
            id="task-description"
            name="description"
            rows={2}
            className="rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700"
          />
        </div>
        <button
          type="submit"
          className="self-start rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Add task
        </button>
      </form>

      <Suspense
        key={`${query}:${statusFilter.success ? statusFilter.data : ""}:${page}`}
        fallback={<TasksSkeleton />}
      >
        <TaskResults
          query={query}
          status={statusFilter.success ? statusFilter.data : undefined}
          page={page}
        />
      </Suspense>
    </main>
  );
}

async function TaskResults({
  query,
  status,
  page,
}: {
  query: string;
  status?: (typeof STATUSES)[number];
  page: number;
}) {
  await connection();
  const user = await requireUser();
  const { tasks, totalPages } = await listTasks(user.id, {
    query,
    status,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <>
      <ul className="mt-8 space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800"
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-medium">{task.title}</h2>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-500 dark:bg-zinc-800">
                  {task.priority}
                </span>
              </div>
              {task.description && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {STATUSES.map((option) => (
                <form key={option} action={setTaskStatusAction}>
                  <input type="hidden" name="id" value={task.id} />
                  <input type="hidden" name="status" value={option} />
                  <button
                    type="submit"
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      task.status === option
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-zinc-300 text-zinc-500 hover:border-emerald-500 dark:border-zinc-700"
                    }`}
                  >
                    {STATUS_LABELS[option]}
                  </button>
                </form>
              ))}
            </div>
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="text-sm text-zinc-500">
            {query
              ? `No tasks match “${query}”.`
              : "No tasks yet — add your first one above."}
          </li>
        )}
      </ul>
      <Pagination
        basePath="/tasks"
        page={Math.min(page, totalPages)}
        totalPages={totalPages}
      />
    </>
  );
}

function TasksSkeleton() {
  return (
    <ul className="mt-8 space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <li
          key={index}
          className="h-16 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
        />
      ))}
    </ul>
  );
}
