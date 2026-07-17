import { Edge, Node, NodeProps } from "@xyflow/react";
import type { ComponentType,CSSProperties } from "react";

export interface EditorNodeData extends Record<string, unknown> {
  label: string;
  icon?: string;
  description?: string;
  layoutVariant?: "frame" | "group" | "section";
  accentColor?: string;
}

export type EditorNode = Node<EditorNodeData>;
export type EditorEdge = Edge<{ label?: string }>;

export interface EditorNodeDefinition {
  type: string;
  label: string;
  name: string;
  category: string;
  icon?: string;
  component: ComponentType<NodeProps<EditorNode>>;
  initialData?: Partial<EditorNodeData>;
  initialNode?: Omit<
    Partial<EditorNode>,
    "id" | "type" | "position" | "data" | "selected" | "dragging"
  > & {
    style?: CSSProperties;
  };
}
