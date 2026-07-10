"use client"

import { useState, useCallback } from "react"
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Panel, type Connection, NodeChange, EdgeChange } from "@xyflow/react"
import '@xyflow/react/dist/style.css'
import ThemeToggle from "@/components/theme-toggle";
import { Sheet } from "@/components/ui/sheet";
import Sidebar from "./sidebar/sidebar";
import SidebarTrigger from "./sidebar/sidebar-trigger";
import TopMenu from "./top-menu/top-menu";
import { EditorNode, EditorEdge } from "@/types/editor";
import { nodeRegistry } from "./nodes/registry";

const nodeTypes = Object.fromEntries(
  nodeRegistry.map((node) => [node.type, node.component])
)

const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];

const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

export default function Editor() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange = useCallback(
    (changes: NodeChange<EditorNode>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<EditorEdge>[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const addNode = (type: string) => {
    const definition = nodeRegistry.find((node) => node.type === type)
    if (!definition) return;
    setNodes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: definition.type,
        position: {
          x: Math.random() * 500,
          y: Math.random() * 500,
        },
        data: {
          label: definition.label,
          icon: definition.icon
        }
      }
    ])
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Panel position="top-center">
          <TopMenu />
        </Panel>
        <Panel position="top-right">
          <Sheet>
            <SidebarTrigger />
            <Sidebar addNode={addNode} />
          </Sheet>
        </Panel>
        <Panel position="bottom-right">
          <ThemeToggle />
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}