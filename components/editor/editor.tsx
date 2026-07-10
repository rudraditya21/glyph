"use client"

import { ReactFlow, Background, Controls, Panel } from "@xyflow/react"
import '@xyflow/react/dist/style.css'
import ThemeToggle from "@/components/theme-toggle";
import { Sheet } from "@/components/ui/sheet";
import Sidebar from "./sidebar/sidebar";
import SidebarTrigger from "./sidebar/sidebar-trigger";
import TopMenu from "./top-menu/top-menu";
import { nodeRegistry } from "./nodes/registry";

import { useEditorStore } from "@/store/editor-store";

const nodeTypes = Object.fromEntries(
  nodeRegistry.map((node) => [node.type, node.component])
)

export default function Editor() {
  const nodes = useEditorStore(state => state.nodes)
  const edges = useEditorStore(state => state.edges)

  const onNodesChange = useEditorStore(state => state.onNodesChange)
  const onEdgesChange = useEditorStore(state => state.onEdgesChange)
  const onConnect = useEditorStore(state => state.onConnect)

  const addNode = useEditorStore(state => state.addNode)

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