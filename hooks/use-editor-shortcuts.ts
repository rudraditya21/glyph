"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/editor-store";

export function useEditorShortcuts() {
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const copy = useEditorStore((s) => s.copySelected);
  const paste = useEditorStore((s) => s.paste);
  const remove = useEditorStore((s) => s.deleteSelected);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      const modifier = event.metaKey || event.ctrlKey;

      if (modifier && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo();
        return;
      }
      if (modifier && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
        return;
      }
      if (modifier && event.key.toLowerCase() === "c") {
        copy();
        return;
      }
      if (modifier && event.key.toLowerCase() === "v") {
        event.preventDefault();
        paste();
        return;
      }
      if (event.key === "Delete" || event.key == "Backspace") {
        remove();
        return;
      }
    };
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [undo, redo, copy, paste, remove]);
}
