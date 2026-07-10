import { Node, Edge, NodeProps } from "@xyflow/react";
import type { ComponentType } from "react";

export type EditorNode = Node<{ label: string; icon?: string }>;
export type EditorEdge = Edge<{ label?: string }>;

export interface EditorNodeDefinition {
  type: string;
  label: string;
  name: string;
  category: string;
  icon?: string;
  component: ComponentType<NodeProps>;
}
