import { MarkerType } from "@xyflow/react";
import type { EdgeMarkerType } from "@xyflow/system";

import type {
  EditorEdgeData,
  EditorEdgeMarkerKind,
  EditorEdgeStyleVariant,
} from "@/types/editor";

export const DEFAULT_EDGE_DATA: EditorEdgeData = {
  label: "",
  routing: "orthogonal",
  styleVariant: "solid",
  markerStartKind: "none",
  markerEndKind: "arrowClosed",
};

export function getEditorEdgeData(
  data?: Partial<EditorEdgeData> | null,
): EditorEdgeData {
  return {
    ...DEFAULT_EDGE_DATA,
    ...data,
  };
}

export function getEdgeStrokeColor(styleVariant: EditorEdgeStyleVariant) {
  switch (styleVariant) {
    case "muted":
      return "var(--muted-foreground)";
    case "highlight":
      return "var(--primary)";
    default:
      return "var(--foreground)";
  }
}

export function buildEdgeMarker(
  markerKind: EditorEdgeMarkerKind,
  styleVariant: EditorEdgeStyleVariant,
): EdgeMarkerType | undefined {
  if (markerKind === "none") {
    return undefined;
  }

  return {
    type: markerKind === "arrow" ? MarkerType.Arrow : MarkerType.ArrowClosed,
    color: getEdgeStrokeColor(styleVariant),
    width: 18,
    height: 18,
  };
}

export function buildEdgeMarkers(data: EditorEdgeData) {
  return {
    markerStart: buildEdgeMarker(data.markerStartKind, data.styleVariant),
    markerEnd: buildEdgeMarker(data.markerEndKind, data.styleVariant),
  };
}
