"use client"
import { create } from "zustand"
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "@xyflow/react"
import { EditorNode, EditorEdge } from "@/types/editor"
import { nodeRegistry } from "@/components/editor/nodes/registry"

interface EditorState {
  nodes: EditorNode[]
  edges: EditorEdge[]

  selectedNodeId: string | null
  sidebarOpen: boolean

  addNode: (type: string) => void
  deleteNode: (id: string) => void

  onNodesChange: (changes: NodeChange<EditorNode>[]) => void
  onEdgesChange: (changes: EdgeChange<EditorEdge>[]) => void

  onConnect: (
    connection: Connection
  ) => void

  selectNode: (id: string | null) => void

  toggleSidebar: () => void
}

const initialNodes: EditorNode[] = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } }
]

const initialEdges: EditorEdge[] = [
  { id: "n1-n2", source: "n1", target: "n2" }
]

export const useEditorStore = create<EditorState>((set) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  sidebarOpen: false,

  addNode: (type) => {
    const definition = nodeRegistry.find(
      node => node.type === type
    )
    if (!definition)
      return
    const newNode: EditorNode = {
      id: crypto.randomUUID(),
      type: definition.type,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500
      },
      data: {
        label: definition.label,
        icon: definition.icon,
      }
    }
    set(state => ({
      nodes: [
        ...state.nodes,
        newNode
      ]
    }))
  },

  deleteNode: (id) => set(state => ({
    nodes:
      state.nodes.filter(
        node => node.id !== id
      ),
    edges:
      state.edges.filter(
        edge =>
          edge.source !== id &&
          edge.target !== id
      )
  })),

  onNodesChange: (changes) => set(state => ({
    nodes:
      applyNodeChanges(
        changes,
        state.nodes
      )
  })),

  onEdgesChange: (changes) => set(state => ({
    edges:
      applyEdgeChanges(
        changes,
        state.edges
      )
  })),

  onConnect: (connection) => set(state => ({
    edges:
      addEdge(
        connection,
        state.edges
      )
  })),

  selectNode: (id) => set({
    selectedNodeId: id
  }),

  toggleSidebar: () => set(state => ({
    sidebarOpen:
      !state.sidebarOpen
  }))

}))