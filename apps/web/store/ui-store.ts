"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface UiState {
  /** Theme preference; "system" follows prefers-color-scheme. */
  theme: Theme;
  setTheme: (theme: Theme) => void;
  /** Quick-capture composer visibility (shared by the nav button and FAB). */
  quickCaptureOpen: boolean;
  setQuickCaptureOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
      quickCaptureOpen: false,
      setQuickCaptureOpen: (quickCaptureOpen) => set({ quickCaptureOpen }),
    }),
    {
      name: "atom-ui",
      storage: createJSONStorage(() => localStorage),
      // Only persist the preference; composer state is per-session.
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
