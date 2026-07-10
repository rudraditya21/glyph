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
import { useEditorShortcuts } from "@/hooks/use-editor-shortcuts";

const nodeTypes = Object.fromEntries(
  nodeRegistry.map((node) => [node.type, node.component])
)

export default function Editor() {
  useEditorShortcuts()

  const nodes = useEditorStore(state => state.nodes)
  const edges = useEditorStore(state => state.edges)

  const onNodesChange = useEditorStore(state => state.onNodesChange)
  const onEdgesChange = useEditorStore(state => state.onEdgesChange)
  const onConnect = useEditorStore(state => state.onConnect)

  const addNode = useEditorStore(state => state.addNode)

  const selectNodes = useEditorStore(s => s.selectNodes)

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        deleteKeyCode={null}
        nodeTypes={nodeTypes}
        onSelectionChange={(elements) => {
          const ids = elements.nodes.map(n => n.id)
          selectNodes(ids)
        }}
        onNodeDragStart={() => {
          useEditorStore.getState().saveHistory()
        }}
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