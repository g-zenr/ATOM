"use client";

import { useEffect } from "react";
import { useUiStore } from "@/store/ui-store";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Applies the persisted theme from the Zustand store to <html> and keeps it in
 * sync with the OS preference while "system" is selected.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia(DARK_QUERY);

    const apply = () => {
      const isDark = theme === "dark" || (theme === "system" && media.matches);
      root.classList.toggle("dark", isDark);
      root.style.colorScheme = isDark ? "dark" : "light";
    };

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  return <>{children}</>;
}
