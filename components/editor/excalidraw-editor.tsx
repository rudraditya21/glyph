"use client";

import "@excalidraw/excalidraw/index.css";

import { Excalidraw } from "@excalidraw/excalidraw";

import { useThemeStore } from "@/store/theme-store";

export default function ExcalidrawEditor() {
  const dark = useThemeStore((state) => state.dark);

  return (
    <div className="h-dvh w-full">
      <Excalidraw theme={dark ? "dark" : "light"} />
    </div>
  );
}
