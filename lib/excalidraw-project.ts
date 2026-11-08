import { serializeAsJSON } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type {
  AppState,
  BinaryFiles,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";

const GLYPH_PROJECT_VERSION = 1;
const STORAGE_KEY_PREFIX = "glyph:project:";

interface GlyphProjectDocument {
  version: typeof GLYPH_PROJECT_VERSION;
  scene: ExcalidrawInitialDataState;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isGlyphProjectDocument(value: unknown): value is GlyphProjectDocument {
  if (!isRecord(value) || value.version !== GLYPH_PROJECT_VERSION) {
    return false;
  }

  const scene = value.scene;

  return (
    isRecord(scene) &&
    Array.isArray(scene.elements) &&
    isRecord(scene.appState) &&
    isRecord(scene.files)
  );
}

function getStorageKey(projectId: string) {
  return `${STORAGE_KEY_PREFIX}${projectId}`;
}

export function loadExcalidrawProject(
  projectId: string,
): ExcalidrawInitialDataState | null {
  try {
    const storedProject = window.localStorage.getItem(getStorageKey(projectId));

    if (!storedProject) return null;

    const project: unknown = JSON.parse(storedProject);

    return isGlyphProjectDocument(project) ? project.scene : null;
  } catch {
    return null;
  }
}

export function saveExcalidrawProject(
  projectId: string,
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  files: BinaryFiles,
) {
  try {
    const scene = JSON.parse(
      serializeAsJSON(elements, appState, files, "local"),
    ) as ExcalidrawInitialDataState;
    const project: GlyphProjectDocument = {
      version: GLYPH_PROJECT_VERSION,
      scene,
    };

    window.localStorage.setItem(getStorageKey(projectId), JSON.stringify(project));
  } catch (error) {
    console.error("Failed to save Excalidraw project", error);
  }
}
