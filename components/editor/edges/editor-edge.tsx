import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from "@xyflow/react";

import { getEdgeStrokeColor, getEditorEdgeData } from "@/lib/editor-edge";
import type { EditorEdge, EditorEdgeStyleVariant } from "@/types/editor";

function getEdgeVisualStyle(styleVariant: EditorEdgeStyleVariant) {
  const stroke = getEdgeStrokeColor(styleVariant);

  switch (styleVariant) {
    case "dashed":
      return {
        stroke,
        strokeWidth: 2.2,
        strokeDasharray: "10 8",
      };
    case "muted":
      return {
        stroke,
        strokeWidth: 1.8,
        opacity: 0.72,
      };
    case "highlight":
      return {
        stroke,
        strokeWidth: 2.8,
      };
    default:
      return {
        stroke,
        strokeWidth: 2.2,
      };
  }
}

export default function EditorEdge({
  id,
  data,
  selected,
  markerStart,
  markerEnd,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps<EditorEdge>) {
  const edgeData = getEditorEdgeData(data);
  const edgeStyle = getEdgeVisualStyle(edgeData.styleVariant);

  const [edgePath, labelX, labelY] =
    edgeData.routing === "straight"
      ? getStraightPath({
          sourceX,
          sourceY,
          targetX,
          targetY,
        })
      : edgeData.routing === "bezier"
        ? getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
          })
        : getSmoothStepPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
            borderRadius: 18,
            offset: 22,
          });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
        interactionWidth={28}
        style={edgeStyle}
      />
      {edgeData.label ? (
        <EdgeLabelRenderer>
          <div
            className={`pointer-events-none absolute rounded-full border px-2.5 py-1 text-[11px] font-medium shadow-sm ${
              selected
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background/95 text-muted-foreground"
            }`}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
