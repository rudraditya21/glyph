"use client";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type OnReconnect,
  reconnectEdge,
} from "@xyflow/react";
import { create } from "zustand";

import { nodeRegistry } from "@/components/editor/nodes/registry";
import {
  buildEdgeMarkers,
  DEFAULT_EDGE_DATA,
  getEditorEdgeData,
} from "@/lib/editor-edge";
import type {
  EditorEdge,
  EditorEdgeData,
  EditorEdgeMarkerKind,
  EditorEdgeRouting,
  EditorEdgeStyleVariant,
  EditorNode,
} from "@/types/editor";

interface EditorClipboard {
  nodes: EditorNode[];
  edges: EditorEdge[];
}

interface EditorSnapshot {
  nodes: EditorNode[];
  edges: EditorEdge[];
}

interface EditorState {
  nodes: EditorNode[];
  edges: EditorEdge[];

  selectedNodeIds: string[];
  selectedEdgeIds: string[];

  clipboard: EditorClipboard | null;

  history: EditorSnapshot[];
  future: EditorSnapshot[];

  sidebarOpen: boolean;

  addNode: (type: string) => void;
  deleteNode: (id: string) => void;
  updateNodeLabel: (id: string, label: string) => void;
  updateSelectedEdgeLabel: (label: string) => void;
  updateSelectedEdgeRouting: (routing: EditorEdgeRouting) => void;
  updateSelectedEdgeStyleVariant: (
    styleVariant: EditorEdgeStyleVariant,
  ) => void;
  updateSelectedEdgeMarker: (
    side: "start" | "end",
    markerKind: EditorEdgeMarkerKind,
  ) => void;

  onNodesChange(changes: NodeChange<EditorNode>[]): void;
  onEdgesChange(changes: EdgeChange<EditorEdge>[]): void;
  onConnect(connection: Connection): void;
  onReconnect: OnReconnect<EditorEdge>;

  undo(): void;
  redo(): void;

  copySelected(): void;
  paste(): void;

  deleteSelected(): void;

  selectNodes(ids: string[]): void;
  selectEdges(ids: string[]): void;

  toggleSidebar(): void;

  saveHistory(): void;
}

const pushHistory = (history: EditorSnapshot[], snapshot: EditorSnapshot) => [
  ...history.slice(-50),
  snapshot,
];

const createSnapshot = (
  nodes: EditorNode[],
  edges: EditorEdge[],
): EditorSnapshot => ({
  nodes: structuredClone(nodes),
  edges: structuredClone(edges),
});

const applySelectedEdgeDataChange = (
  state: EditorState,
  mutate: (data: EditorEdgeData) => EditorEdgeData,
) => {
  if (state.selectedEdgeIds.length === 0) {
    return null;
  }

  const selectedEdgeIds = new Set(state.selectedEdgeIds);
  const edges = state.edges.map((edge) => {
    if (!selectedEdgeIds.has(edge.id)) {
      return edge;
    }

    const data = mutate(getEditorEdgeData(edge.data));

    return {
      ...edge,
      data,
      ...buildEdgeMarkers(data),
    };
  });

  return {
    history: pushHistory(
      state.history,
      createSnapshot(state.nodes, state.edges),
    ),
    future: [],
    edges,
  };
};

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: [],
  edges: [],

  selectedNodeIds: [],
  selectedEdgeIds: [],
  clipboard: null,

  history: [],
  future: [],

  sidebarOpen: false,

  addNode: (type) => {
    const state = get();
    const definition = nodeRegistry.find((node) => node.type === type);
    if (!definition) return;
    const newNode: EditorNode = {
      id: crypto.randomUUID(),
      type: definition.type,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: {
        label: definition.label,
        icon: definition.icon,
        ...definition.initialData,
      },
      ...definition.initialNode,
    };
    set({
      history: pushHistory(
        state.history,
        createSnapshot(state.nodes, state.edges),
      ),
      future: [],
      nodes: [...state.nodes, newNode],
    });
  },

  deleteNode: (id) => {
    const state = get();
    set({
      history: pushHistory(
        state.history,
        createSnapshot(state.nodes, state.edges),
      ),
      future: [],
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id,
      ),
      selectedEdgeIds: [],
    });
  },

  updateNodeLabel: (id, label) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label,
              },
            }
          : node,
      ),
    })),

  updateSelectedEdgeLabel: (label) =>
    set((state) => ({
      edges: state.edges.map((edge) =>
        state.selectedEdgeIds.includes(edge.id)
          ? {
              ...edge,
              data: {
                ...getEditorEdgeData(edge.data),
                label,
              },
            }
          : edge,
      ),
    })),

  updateSelectedEdgeRouting: (routing) =>
    set(
      (state) =>
        applySelectedEdgeDataChange(state, (data) => ({ ...data, routing })) ??
        state,
    ),

  updateSelectedEdgeStyleVariant: (styleVariant) =>
    set(
      (state) =>
        applySelectedEdgeDataChange(state, (data) => ({
          ...data,
          styleVariant,
        })) ?? state,
    ),

  updateSelectedEdgeMarker: (side, markerKind) =>
    set(
      (state) =>
        applySelectedEdgeDataChange(state, (data) => ({
          ...data,
          markerStartKind: side === "start" ? markerKind : data.markerStartKind,
          markerEndKind: side === "end" ? markerKind : data.markerEndKind,
        })) ?? state,
    ),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) => {
    const state = get();
    const data = getEditorEdgeData(DEFAULT_EDGE_DATA);
    set({
      history: pushHistory(
        state.history,
        createSnapshot(state.nodes, state.edges),
      ),
      future: [],
      edges: addEdge(
        {
          ...connection,
          type: "editorEdge",
          data,
          reconnectable: true,
          ...buildEdgeMarkers(data),
        },
        state.edges,
      ) as EditorEdge[],
    });
  },

  onReconnect: (oldEdge, newConnection) => {
    const state = get();
    set({
      history: pushHistory(
        state.history,
        createSnapshot(state.nodes, state.edges),
      ),
      future: [],
      edges: reconnectEdge(oldEdge, newConnection, state.edges) as EditorEdge[],
    });
  },

  undo: () => {
    const state = get();
    const previous = state.history[state.history.length - 1];
    if (!previous) return;
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      history: state.history.slice(0, -1),
      future: [createSnapshot(state.nodes, state.edges), ...state.future],
      selectedEdgeIds: [],
    });
  },

  redo: () => {
    const state = get();
    const next = state.future[0];
    if (!next) return;
    set({
      nodes: next.nodes,
      edges: next.edges,
      future: state.future.slice(1),
      history: pushHistory(
        state.history,
        createSnapshot(state.nodes, state.edges),
      ),
      selectedEdgeIds: [],
    });
  },

  copySelected: () => {
    const state = get();
    const selectedNodes = state.nodes.filter((node) =>
      state.selectedNodeIds.includes(node.id),
    );
    if (selectedNodes.length === 0) return;
    const selectedEdges = state.edges.filter(
      (edge) =>
        state.selectedNodeIds.includes(edge.source) &&
        state.selectedNodeIds.includes(edge.target),
    );
    set({
      clipboard: {
        nodes: structuredClone(selectedNodes),
        edges: structuredClone(selectedEdges),
      },
    });
  },

  paste: () => {
    const state = get();
    if (!state.clipboard) return;
    const nodeMap = new Map<string, string>();
    const newNodes = state.clipboard.nodes.map((node) => {
      const newId = crypto.randomUUID();
      nodeMap.set(node.id, newId);
      return {
        ...structuredClone(node),
        id: newId,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
      };
    });
    const newEdges = state.clipboard.edges.map((edge) => ({
      ...structuredClone(edge),
      id: crypto.randomUUID(),
      source: nodeMap.get(edge.source)!,
      target: nodeMap.get(edge.target)!,
    }));
    set({
      history: pushHistory(
        state.history,
        createSnapshot(state.nodes, state.edges),
      ),
      future: [],
      nodes: [...state.nodes, ...newNodes],
      edges: [...state.edges, ...newEdges],
      selectedNodeIds: newNodes.map((node) => node.id),
      selectedEdgeIds: [],
    });
  },

  deleteSelected: () => {
    const state = get();
    if (
      state.selectedNodeIds.length === 0 &&
      state.selectedEdgeIds.length === 0
    )
      return;
    set({
      history: pushHistory(
        state.history,
        createSnapshot(state.nodes, state.edges),
      ),
      future: [],
      nodes: state.nodes.filter(
        (node) => !state.selectedNodeIds.includes(node.id),
      ),
      edges: state.edges.filter(
        (edge) =>
          !state.selectedEdgeIds.includes(edge.id) &&
          !state.selectedNodeIds.includes(edge.source) &&
          !state.selectedNodeIds.includes(edge.target),
      ),
      selectedNodeIds: [],
      selectedEdgeIds: [],
    });
  },

  selectNodes: (ids) =>
    set({
      selectedNodeIds: ids,
    }),

  selectEdges: (ids) =>
    set({
      selectedEdgeIds: ids,
    }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  saveHistory: () => {
    const state = get();
    set({
      history: pushHistory(
        state.history,
        createSnapshot(state.nodes, state.edges),
      ),
      future: [],
    });
  },
}));
