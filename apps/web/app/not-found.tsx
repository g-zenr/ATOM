import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-zinc-400">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        This element doesn&rsquo;t exist
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        The page you&rsquo;re looking for isn&rsquo;t part of this workspace.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
      >
        Back to ATOM
      </Link>
    </main>
  );
}
