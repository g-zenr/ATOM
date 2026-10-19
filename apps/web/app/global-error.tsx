"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <h1 className="text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm text-zinc-500">
          {error.digest
            ? `Reference: ${error.digest}`
            : "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
