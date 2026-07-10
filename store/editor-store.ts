"use client"

import { create } from "zustand"
import { applyNodeChanges, applyEdgeChanges, addEdge, type NodeChange, type EdgeChange, type Connection } from "@xyflow/react"
import { EditorNode, EditorEdge, } from "@/types/editor"
import { nodeRegistry } from "@/components/editor/nodes/registry"

interface EditorSnapshot {
  nodes: EditorNode[]
  edges: EditorEdge[]
}

interface EditorState {
  nodes: EditorNode[]
  edges: EditorEdge[]

  selectedNodeIds: string[]

  history: EditorSnapshot[]
  future: EditorSnapshot[]

  sidebarOpen: boolean

  addNode: (type: string) => void
  deleteNode: (id: string) => void

  onNodesChange(changes: NodeChange<EditorNode>[]): void
  onEdgesChange(changes: EdgeChange<EditorEdge>[]): void
  onConnect(connection: Connection): void

  undo(): void
  redo(): void

  copySelected(): void
  deleteSelected(): void

  selectNodes(ids: string[]): void

  toggleSidebar(): void

  saveHistory(): void
}

const pushHistory = (history: EditorSnapshot[], snapshot: EditorSnapshot) => [...history.slice(-50), snapshot]

const createSnapshot = (nodes: EditorNode[], edges: EditorEdge[]): EditorSnapshot => ({
  nodes: structuredClone(nodes),
  edges: structuredClone(edges)
})

export const useEditorStore = create<EditorState>((set, get) => ({
  nodes: [],
  edges: [],

  selectedNodeIds: [],

  history: [],
  future: [],

  sidebarOpen: false,

  addNode: (type) => {
    const state = get()
    const definition = nodeRegistry.find(node => node.type === type)
    if (!definition) return
    const newNode: EditorNode = {
      id: crypto.randomUUID(),
      type: definition.type,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500
      },
      data: {
        label: definition.label,
        icon: definition.icon
      }
    }
    set({
      history: pushHistory(state.history, createSnapshot(state.nodes, state.edges)),
      future: [],
      nodes: [...state.nodes, newNode]
    })
  },

  deleteNode: (id) => {
    const state = get()
    set({
      history: pushHistory(state.history, createSnapshot(state.nodes, state.edges)),
      future: [],
      nodes: state.nodes.filter(node => node.id !== id),
      edges: state.edges.filter(edge => edge.source !== id && edge.target !== id)
    })
  },

  onNodesChange: (changes) => set(state => ({
    nodes: applyNodeChanges(changes, state.nodes)
  })),

  onEdgesChange: (changes) => set(state => ({
    edges: applyEdgeChanges(changes, state.edges)
  })),

  onConnect: (connection) => {
    const state = get()
    set({
      history: pushHistory(state.history, createSnapshot(state.nodes, state.edges)),
      future: [],
      edges: addEdge(connection, state.edges)
    })
  },

  undo: () => {
    const state = get()
    const previous = state.history[state.history.length - 1]
    if (!previous) return
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      history: state.history.slice(0, -1),
      future: [createSnapshot(state.nodes, state.edges), ...state.future]
    })
  },

  redo: () => {
    const state = get()
    const next = state.future[0]
    if (!next) return
    set({
      nodes: next.nodes,
      edges: next.edges,
      future: state.future.slice(1),
      history: pushHistory(state.history, createSnapshot(state.nodes, state.edges)),
    })
  },

  copySelected: () => {
    const state = get()
    const selectedNodes = state.nodes.filter(node => state.selectedNodeIds.includes(node.id))
    if (selectedNodes.length === 0) return
    const copiedNodes = selectedNodes.map(node => ({
      ...structuredClone(node),
      id: crypto.randomUUID(),
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50
      }
    }))
    set({
      nodes: [...state.nodes, ...copiedNodes]
    })
  },

  deleteSelected: () => {
    const state = get()
    if (state.selectedNodeIds.length === 0) return
    set({
      history: pushHistory(state.history, createSnapshot(state.nodes, state.edges)),
      future: [],
      nodes: state.nodes.filter(node => !state.selectedNodeIds.includes(node.id)),
      edges: state.edges.filter(edge => !state.selectedNodeIds.includes(edge.source) && !state.selectedNodeIds.includes(edge.target)),
      selectedNodeIds: []
    })
  },

  selectNodes: (ids) => set({
    selectedNodeIds: ids
  }),

  toggleSidebar: () => set(state => ({
    sidebarOpen: !state.sidebarOpen
  })),

  saveHistory: () => {
    const state = get()
    set({
      history: pushHistory(state.history, createSnapshot(state.nodes, state.edges)),
      future: []
    })
  }

}))