import Link from "next/link";

const TILES = [
  "Nt",
  "Ts",
  "Tm",
  "At",
  "Db",
  "Nt",
  "Ts",
  "Tm",
  "At",
  "Db",
  "Nt",
  "Ts",
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <div className="mb-8 grid grid-cols-6 gap-1.5">
        {TILES.map((tile, index) => (
          <div
            key={index}
            className="flex aspect-square w-10 items-center justify-center rounded border border-emerald-600/30 bg-emerald-600/10 font-mono text-sm font-medium text-emerald-700 dark:text-emerald-400"
          >
            {tile}
          </div>
        ))}
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">ATOM</h1>
      <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
        Everything that makes your day work.
      </p>
      <p className="mt-4 max-w-md text-center text-sm text-zinc-500 dark:text-zinc-500">
        A minimal personal workspace built from the elements of your day —
        notes, tasks, and time tracking in one place.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
      >
        Open dashboard
      </Link>
    </main>
  );
}
