import { connection } from "next/server";
import { getDashboardStats, requireUser } from "@/lib/dal";

export default async function DashboardPage() {
  await connection();
  const user = await requireUser();
  const stats = await getDashboardStats(user.id);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Your workspace at a glance.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Notes" value={stats.noteCount} />
        <StatCard label="Todo" value={stats.todoCount} />
        <StatCard label="In Progress" value={stats.inProgressCount} />
        <StatCard label="Done" value={stats.doneCount} />
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Time tracking
        </h2>
        <div className="mt-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          {stats.openEntry ? (
            <p className="text-sm">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Clocked in
              </span>{" "}
              since {stats.openEntry.start.toLocaleString()}
            </p>
          ) : (
            <p className="text-sm text-zinc-500">Not clocked in.</p>
          )}
          {stats.recentEntries.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-zinc-500">
              {stats.recentEntries.map((entry) => (
                <li key={entry.id}>
                  {entry.date.toISOString().slice(0, 10)} —{" "}
                  {entry.duration != null
                    ? `${Math.round(entry.duration / 60)} min`
                    : "open session"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-zinc-500">{label}</div>
    </div>
  );
}
