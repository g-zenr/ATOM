"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await authClient.signOut();
    router.push("/auth/sign-in");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-500 transition-colors hover:border-emerald-500 hover:text-zinc-900 disabled:opacity-60 dark:border-zinc-700 dark:hover:text-zinc-100"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
