import { create } from "zustand";

interface ThemeState {
  dark: boolean;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  dark: false,
  setDark: (dark) => set({ dark }),
}));
