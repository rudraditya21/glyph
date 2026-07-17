"use client";

import gsap from "gsap";
import { Moon, Sun } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

import { useThemeStore } from "@/store/theme-store";

function getIconState(dark: boolean) {
  return {
    sun: dark
      ? { opacity: 0, rotate: 180, scale: 0 }
      : { opacity: 1, rotate: 0, scale: 1 },
    moon: dark
      ? { opacity: 1, rotate: 0, scale: 1 }
      : { opacity: 0, rotate: -180, scale: 0 },
  };
}

export default function ThemeToggle() {
  const dark = useThemeStore((s) => s.dark);
  const hydrated = useThemeStore((s) => s.hydrated);
  const setThemeMode = useThemeStore((s) => s.setThemeMode);
  const sunRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  useLayoutEffect(() => {
    if (!hydrated || isAnimatingRef.current) return;

    const iconState = getIconState(dark);

    gsap.set(sunRef.current, iconState.sun);
    gsap.set(moonRef.current, iconState.moon);
  }, [dark, hydrated]);

  function toggle() {
    if (!hydrated) return;

    const next = !dark;
    const outgoing = next ? sunRef.current : moonRef.current;
    const incoming = next ? moonRef.current : sunRef.current;

    setThemeMode(next ? "dark" : "light", next);
    isAnimatingRef.current = true;

    gsap
      .timeline()
      .to(outgoing, {
        opacity: 0,
        rotate: next ? 180 : -180,
        scale: 0,
        duration: 0.28,
        ease: "power2.in",
      })
      .fromTo(
        incoming,
        { opacity: 0, rotate: next ? -180 : 180, scale: 0 },
        {
          opacity: 1,
          rotate: 0,
          scale: 1,
          duration: 0.35,
          ease: "power3.out",
        },
        "-=0.05",
      )
      .eventCallback("onComplete", () => {
        isAnimatingRef.current = false;
      });
  }

  return (
    <div
      className="inline-flex rounded-full p-px"
      style={{
        background:
          "linear-gradient(to bottom, transparent 50%, var(--border) 50%)",
      }}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={!hydrated}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-md"
        aria-label="Toggle theme"
        aria-pressed={dark}
      >
        <div ref={sunRef} className="absolute">
          <Sun size={18} />
        </div>
        <div ref={moonRef} className="absolute">
          <Moon size={18} />
        </div>
      </button>
    </div>
  );
}
