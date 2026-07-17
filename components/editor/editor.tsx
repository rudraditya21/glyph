"use client";

import "@xyflow/react/dist/style.css";

import { Background, Controls, MiniMap, Panel, ReactFlow } from "@xyflow/react";

import EditorEdgeComponent from "@/components/editor/edges/editor-edge";
import ThemeToggle from "@/components/theme-toggle";
import { Sheet } from "@/components/ui/sheet";
import { useEditorShortcuts } from "@/hooks/use-editor-shortcuts";
import { useEditorStore } from "@/store/editor-store";
import { useThemeStore } from "@/store/theme-store";
import type { EditorEdge, EditorNode } from "@/types/editor";

import { nodeRegistry } from "./nodes/registry";
import Sidebar from "./sidebar/sidebar";
import SidebarTrigger from "./sidebar/sidebar-trigger";
import TopMenu from "./top-menu/top-menu";

const nodeTypes = Object.fromEntries(
  nodeRegistry.map((node) => [node.type, node.component]),
);
const edgeTypes = {
  editorEdge: EditorEdgeComponent,
};

export default function Editor() {
  useEditorShortcuts();

  const dark = useThemeStore((state) => state.dark);

  const nodes = useEditorStore((state) => state.nodes);
  const edges = useEditorStore((state) => state.edges);

  const onNodesChange = useEditorStore((state) => state.onNodesChange);
  const onEdgesChange = useEditorStore((state) => state.onEdgesChange);
  const onConnect = useEditorStore((state) => state.onConnect);
  const onReconnect = useEditorStore((state) => state.onReconnect);

  const addNode = useEditorStore((state) => state.addNode);

  const selectNodes = useEditorStore((s) => s.selectNodes);
  const selectEdges = useEditorStore((s) => s.selectEdges);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow<EditorNode, EditorEdge>
        nodes={nodes}
        edges={edges}
        colorMode={dark ? "dark" : "light"}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        edgesReconnectable
        deleteKeyCode={null}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        panOnScroll
        panOnScrollSpeed={0.9}
        panActivationKeyCode="Space"
        zoomActivationKeyCode={["Meta", "Control"]}
        zoomOnDoubleClick={false}
        onSelectionChange={(elements) => {
          selectNodes(elements.nodes.map((node) => node.id));
          selectEdges(elements.edges.map((edge) => edge.id));
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
        <Panel position="top-left">
          <ThemeToggle />
        </Panel>
        <Panel position="bottom-center">
          <div className="rounded-full border border-border bg-background/90 px-4 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-md">
            Scroll to pan. Hold{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
              Ctrl
            </kbd>{" "}
            or{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
              Cmd
            </kbd>{" "}
            to zoom.
          </div>
        </Panel>
        <Background />
        <MiniMap
          position="bottom-left"
          pannable
          zoomable
          ariaLabel="Canvas overview"
          offsetScale={8}
          zoomStep={12}
          nodeBorderRadius={10}
          nodeStrokeWidth={3}
          bgColor={dark ? "var(--card)" : "var(--background)"}
          maskColor={dark ? "rgb(255 255 255 / 0.08)" : "rgb(15 23 42 / 0.08)"}
          maskStrokeColor={dark ? "var(--primary)" : "var(--foreground)"}
          nodeColor={dark ? "var(--secondary)" : "var(--muted)"}
          nodeStrokeColor={dark ? "var(--primary)" : "var(--foreground)"}
          className="!overflow-hidden !rounded-2xl !border !border-border !shadow-md"
        />
        <Controls
          position="bottom-right"
          orientation="horizontal"
          showInteractive={false}
          fitViewOptions={{
            padding: 0.5,
            maxZoom: 0.85,
          }}
          className="!overflow-hidden !rounded-2xl !border !border-border !bg-card/95 !shadow-md !backdrop-blur-md"
        />
      </ReactFlow>
    </div>
  );
}
