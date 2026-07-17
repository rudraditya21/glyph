import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  dark: boolean;
  hydrated: boolean;
  hydrateTheme: (mode: ThemeMode, dark: boolean) => void;
  setThemeMode: (mode: ThemeMode, dark: boolean) => void;
  setResolvedDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "system",
  dark: false,
  hydrated: false,
  hydrateTheme: (mode, dark) => set({ mode, dark, hydrated: true }),
  setThemeMode: (mode, dark) => set({ mode, dark, hydrated: true }),
  setResolvedDark: (dark) => set((state) => ({ ...state, dark })),
}));
