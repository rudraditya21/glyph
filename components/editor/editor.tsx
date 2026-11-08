"use client";

import dynamic from "next/dynamic";

const ExcalidrawEditor = dynamic(() => import("./excalidraw-editor"), {
  ssr: false,
  loading: () => <div className="h-dvh w-full bg-background" />,
});

export default function Editor() {
  return <ExcalidrawEditor />;
}
