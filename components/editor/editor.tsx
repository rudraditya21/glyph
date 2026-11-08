"use client";

import dynamic from "next/dynamic";

const ExcalidrawEditor = dynamic(() => import("./excalidraw-editor"), {
  ssr: false,
  loading: () => <div className="h-dvh w-full bg-background" />,
});

interface EditorProps {
  projectId: string;
}

export default function Editor({ projectId }: EditorProps) {
  return <ExcalidrawEditor projectId={projectId} />;
}
