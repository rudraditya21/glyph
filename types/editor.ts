import { Edge, Node, NodeProps } from "@xyflow/react";
import type { ComponentType, CSSProperties } from "react";

export interface EditorNodeData extends Record<string, unknown> {
  label: string;
  icon?: string;
}

export type EditorEdgeRouting = "bezier" | "orthogonal" | "straight";
export type EditorEdgeStyleVariant = "solid" | "dashed" | "muted" | "highlight";
export type EditorEdgeMarkerKind = "none" | "arrow" | "arrowClosed";

export interface EditorEdgeData extends Record<string, unknown> {
  label: string;
  routing: EditorEdgeRouting;
  styleVariant: EditorEdgeStyleVariant;
  markerStartKind: EditorEdgeMarkerKind;
  markerEndKind: EditorEdgeMarkerKind;
}

export type EditorNode = Node<EditorNodeData>;
export type EditorEdge = Edge<EditorEdgeData, "editorEdge">;

export interface EditorNodeDefinition {
  type: string;
  label: string;
  name: string;
  category: string;
  icon?: string;
  hiddenInCatalog?: boolean;
  component: ComponentType<NodeProps<EditorNode>>;
  initialData?: Partial<EditorNodeData>;
  initialNode?: Omit<
    Partial<EditorNode>,
    "id" | "type" | "position" | "data" | "selected" | "dragging"
  > & {
    style?: CSSProperties;
  };
}
