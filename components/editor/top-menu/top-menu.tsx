import { Clipboard, Copy, Redo, Save, Square, Trash, Undo } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useEditorStore } from "@/store/editor-store";

import MenuItem from "./menu-item";

interface MenuAction {
  icon: Parameters<typeof MenuItem>[0]["icon"];
  action: () => void;
  disabled: boolean;
  label?: string;
}

export default function TopMenu() {
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const copy = useEditorStore((s) => s.copySelected);
  const paste = useEditorStore((s) => s.paste);
  const remove = useEditorStore((s) => s.deleteSelected);
  const addNode = useEditorStore((s) => s.addNode);

  const canUndo = useEditorStore((s) => s.history.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);

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
    </div>
  );
}
