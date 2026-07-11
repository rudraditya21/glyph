"use client";

import "@xyflow/react/dist/style.css";

import { Background, Controls, Panel, ReactFlow } from "@xyflow/react";

import ThemeToggle from "@/components/theme-toggle";
import { Sheet } from "@/components/ui/sheet";
import { useEditorShortcuts } from "@/hooks/use-editor-shortcuts";
import { useEditorStore } from "@/store/editor-store";
import { useThemeStore } from "@/store/theme-store";

import { nodeRegistry } from "./nodes/registry";
import Sidebar from "./sidebar/sidebar";
import SidebarTrigger from "./sidebar/sidebar-trigger";
import TopMenu from "./top-menu/top-menu";

const nodeTypes = Object.fromEntries(
  nodeRegistry.map((node) => [node.type, node.component]),
);

export default function Editor() {
  useEditorShortcuts();

  const dark = useThemeStore((state) => state.dark);

  const nodes = useEditorStore((state) => state.nodes);
  const edges = useEditorStore((state) => state.edges);

  const onNodesChange = useEditorStore((state) => state.onNodesChange);
  const onEdgesChange = useEditorStore((state) => state.onEdgesChange);
  const onConnect = useEditorStore((state) => state.onConnect);

  const addNode = useEditorStore((state) => state.addNode);

  const selectNodes = useEditorStore((s) => s.selectNodes);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        colorMode={dark ? "dark" : "light"}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        deleteKeyCode={null}
        nodeTypes={nodeTypes}
        onSelectionChange={(elements) => {
          const ids = elements.nodes.map((n) => n.id);
          selectNodes(ids);
        }}
        onNodeDragStart={() => {
          useEditorStore.getState().saveHistory();
        }}
        fitView
        fitViewOptions={{
          padding: 0.5,
          maxZoom: 0.85,
        }}
        minZoom={0.2}
        maxZoom={1.5}
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
  );
}
