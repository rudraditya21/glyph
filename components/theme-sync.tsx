"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { ThemeMode, useThemeStore } from "@/store/theme-store";

const THEME_STORAGE_KEY = "theme";
const SYSTEM_THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getStoredThemeMode(): ThemeMode {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return "system";
}

function resolveDark(mode: ThemeMode) {
  if (mode === "system") {
    return window.matchMedia(SYSTEM_THEME_MEDIA_QUERY).matches;
  }

  return mode === "dark";
}

function applyTheme(dark: boolean, animate: boolean) {
  const html = document.documentElement;

  if (animate) {
    html.setAttribute("data-theme-transition", "");
    void html.offsetHeight;
  }

  html.classList.toggle("dark", dark);

  if (animate) {
    window.setTimeout(() => {
      html.removeAttribute("data-theme-transition");
    }, 420);
  }
}

export default function ThemeSync() {
  const mode = useThemeStore((state) => state.mode);
  const dark = useThemeStore((state) => state.dark);
  const hydrated = useThemeStore((state) => state.hydrated);
  const hydrateTheme = useThemeStore((state) => state.hydrateTheme);
  const setResolvedDark = useThemeStore((state) => state.setResolvedDark);

  const previousDarkRef = useRef<boolean | null>(null);

  useLayoutEffect(() => {
    const initialMode = getStoredThemeMode();
    hydrateTheme(initialMode, resolveDark(initialMode));
  }, [hydrateTheme]);

  useEffect(() => {
    if (!hydrated) return;

    const shouldAnimate =
      previousDarkRef.current !== null && previousDarkRef.current !== dark;

    applyTheme(dark, shouldAnimate);

    if (mode === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    }

    previousDarkRef.current = dark;
  }, [dark, hydrated, mode]);

  useEffect(() => {
    if (!hydrated || mode !== "system") return;

    const mediaQuery = window.matchMedia(SYSTEM_THEME_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setResolvedDark(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [hydrated, mode, setResolvedDark]);

  return null;
}
