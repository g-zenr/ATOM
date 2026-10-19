"use client";

import { useUiStore, type Theme } from "@/store/ui-store";

const CYCLE: Theme[] = ["system", "light", "dark"];

const GLYPH: Record<Theme, string> = {
  system: "◐",
  light: "☀",
  dark: "☾",
};

/** Cycles system → light → dark. Preference is persisted by the UI store. */
export function ThemeToggle() {
  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);

  const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={`Theme: ${theme} — switch to ${next}`}
      aria-label={`Theme: ${theme}. Switch to ${next}`}
      className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-500 transition-colors hover:border-emerald-500 hover:text-zinc-900 dark:border-zinc-700 dark:hover:text-zinc-100"
    >
      <span aria-hidden className="mr-1">
        {GLYPH[theme]}
      </span>
      {theme}
    </button>
  );
}
