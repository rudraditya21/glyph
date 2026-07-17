import { Clipboard, Copy, Redo, Save, Square, Trash, Undo } from "lucide-react";
import { useRef } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getEditorEdgeData } from "@/lib/editor-edge";
import { useEditorStore } from "@/store/editor-store";
import type {
  EditorEdgeMarkerKind,
  EditorEdgeRouting,
  EditorEdgeStyleVariant,
} from "@/types/editor";

import MenuItem from "./menu-item";

interface MenuAction {
  icon: Parameters<typeof MenuItem>[0]["icon"];
  action: () => void;
  disabled: boolean;
  label?: string;
}

export default function TopMenu() {
  const edgeLabelEditingRef = useRef(false);

  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const copy = useEditorStore((s) => s.copySelected);
  const paste = useEditorStore((s) => s.paste);
  const remove = useEditorStore((s) => s.deleteSelected);
  const addNode = useEditorStore((s) => s.addNode);
  const edges = useEditorStore((s) => s.edges);
  const selectedEdgeIds = useEditorStore((s) => s.selectedEdgeIds);
  const saveHistory = useEditorStore((s) => s.saveHistory);
  const updateSelectedEdgeLabel = useEditorStore(
    (s) => s.updateSelectedEdgeLabel,
  );
  const updateSelectedEdgeRouting = useEditorStore(
    (s) => s.updateSelectedEdgeRouting,
  );
  const updateSelectedEdgeStyleVariant = useEditorStore(
    (s) => s.updateSelectedEdgeStyleVariant,
  );
  const updateSelectedEdgeMarker = useEditorStore(
    (s) => s.updateSelectedEdgeMarker,
  );

  const canUndo = useEditorStore((s) => s.history.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);

  const selectedEdges = edges.filter((edge) =>
    selectedEdgeIds.includes(edge.id),
  );
  const primarySelectedEdge =
    selectedEdges.length > 0 ? getEditorEdgeData(selectedEdges[0].data) : null;

  function save() {
    const state = useEditorStore.getState();
    console.log("Workflow Saved:", {
      nodes: state.nodes,
      edges: state.edges,
    });
  }

  const menuGroups: MenuAction[][] = [
    [
      { icon: Undo, action: undo, disabled: !canUndo },
      { icon: Redo, action: redo, disabled: !canRedo },
    ],
    [
      {
        icon: Square,
        action: () => addNode("layout.container"),
        disabled: false,
        label: "Add container",
      },
    ],
    [
      { icon: Copy, action: copy, disabled: false },
      { icon: Clipboard, action: paste, disabled: false },
    ],
    [{ icon: Trash, action: remove, disabled: false }],
    [{ icon: Save, action: save, disabled: false }],
  ];
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-background text-foreground border rounded-2xl">
      {menuGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center gap-2">
          {group.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              onClick={item.action}
              disabled={item.disabled}
              label={item.label}
            />
          ))}

          {groupIndex !== menuGroups.length - 1 && (
            <Separator orientation="vertical" className="h-8" />
          )}
        </div>
      ))}

      {selectedEdges.length > 0 ? (
        <>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-2">
            <span className="px-2 text-xs font-medium text-muted-foreground">
              Edge
            </span>

            <Input
              value={
                selectedEdges.length === 1
                  ? (primarySelectedEdge?.label ?? "")
                  : ""
              }
              onChange={(event) => updateSelectedEdgeLabel(event.target.value)}
              onFocus={() => {
                if (edgeLabelEditingRef.current) return;

                saveHistory();
                edgeLabelEditingRef.current = true;
              }}
              onBlur={() => {
                edgeLabelEditingRef.current = false;
              }}
              disabled={selectedEdges.length !== 1}
              placeholder={
                selectedEdges.length === 1
                  ? "Edge label"
                  : `${selectedEdges.length} edges selected`
              }
              className="w-36"
            />

            <Select
              value={primarySelectedEdge?.routing ?? "orthogonal"}
              onValueChange={(value) =>
                updateSelectedEdgeRouting(value as EditorEdgeRouting)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="orthogonal">Orthogonal</SelectItem>
                <SelectItem value="bezier">Bezier</SelectItem>
                <SelectItem value="straight">Straight</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={primarySelectedEdge?.styleVariant ?? "solid"}
              onValueChange={(value) =>
                updateSelectedEdgeStyleVariant(value as EditorEdgeStyleVariant)
              }
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="muted">Muted</SelectItem>
                <SelectItem value="highlight">Highlight</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={primarySelectedEdge?.markerStartKind ?? "none"}
              onValueChange={(value) =>
                updateSelectedEdgeMarker("start", value as EditorEdgeMarkerKind)
              }
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Start" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Start</SelectItem>
                <SelectItem value="arrow">Arrow</SelectItem>
                <SelectItem value="arrowClosed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={primarySelectedEdge?.markerEndKind ?? "arrowClosed"}
              onValueChange={(value) =>
                updateSelectedEdgeMarker("end", value as EditorEdgeMarkerKind)
              }
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="End" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No End</SelectItem>
                <SelectItem value="arrow">Arrow</SelectItem>
                <SelectItem value="arrowClosed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      ) : null}
    </div>
  );
}
