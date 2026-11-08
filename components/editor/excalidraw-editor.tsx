"use client";

import "@excalidraw/excalidraw/index.css";

import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { loadCloudLibrary } from "@/lib/excalidraw-cloud-library";
import {
  loadExcalidrawProject,
  saveExcalidrawProject,
} from "@/lib/excalidraw-project";
import { useThemeStore } from "@/store/theme-store";

const SAVE_DELAY_MS = 500;

interface ExcalidrawEditorProps {
  projectId: string;
}

interface PendingScene {
  elements: readonly ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
}

export default function ExcalidrawEditor({
  projectId,
}: ExcalidrawEditorProps) {
  const dark = useThemeStore((state) => state.dark);
  const initialData = useMemo(
    async () => {
      const project = loadExcalidrawProject(projectId);
      const cloudLibrary = await loadCloudLibrary();

      return {
        ...project,
        files: {
          ...cloudLibrary.files,
          ...project?.files,
        },
        libraryItems: cloudLibrary.libraryItems,
      };
    },
    [projectId],
  );
  const pendingSceneRef = useRef<PendingScene | null>(null);
  const saveTimerRef = useRef<number | null>(null);

  const flushPendingSave = useCallback(() => {
    const scene = pendingSceneRef.current;

    if (!scene) return;

    saveExcalidrawProject(
      projectId,
      scene.elements,
      scene.appState,
      scene.files,
    );
    pendingSceneRef.current = null;
  }, [projectId]);

  const scheduleSave = useCallback(
    (
      elements: readonly ExcalidrawElement[],
      appState: AppState,
      files: BinaryFiles,
    ) => {
      pendingSceneRef.current = { elements, appState, files };

      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = window.setTimeout(() => {
        saveTimerRef.current = null;
        flushPendingSave();
      }, SAVE_DELAY_MS);
    },
    [flushPendingSave],
  );

  useEffect(() => {
    window.addEventListener("pagehide", flushPendingSave);

    return () => {
      window.removeEventListener("pagehide", flushPendingSave);

      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }

      flushPendingSave();
    };
  }, [flushPendingSave]);

  return (
    <div className="h-dvh w-full">
      <Excalidraw
        key={projectId}
        initialData={initialData}
        onChange={scheduleSave}
        theme={dark ? "dark" : "light"}
      />
    </div>
  );
}
