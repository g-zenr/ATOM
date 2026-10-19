import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Prev/next pagination driven by the ?page= search param.
 * `basePath` carries the active filters so they survive paging.
 */
export function Pagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const url = new URL(basePath, "http://local");
    url.searchParams.set("page", String(target));
    return `${url.pathname}${url.search}`;
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-between text-sm"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          className="rounded-full border border-zinc-300 px-4 py-1.5 text-zinc-600 transition-colors hover:border-emerald-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          ← Previous
        </Link>
      ) : (
        <span />
      )}

      <span className="text-zinc-500">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          className={cn(
            "rounded-full border border-zinc-300 px-4 py-1.5 text-zinc-600 transition-colors hover:border-emerald-500",
            "dark:border-zinc-700 dark:text-zinc-400",
          )}
        >
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
