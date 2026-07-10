import { Clipboard,Copy, Redo, Trash, Undo } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useEditorStore } from "@/store/editor-store";

import MenuItem from "./menu-item";

export default function TopMenu() {
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const copy = useEditorStore((s) => s.copySelected);
  const paste = useEditorStore((s) => s.paste);
  const remove = useEditorStore((s) => s.deleteSelected);

  const canUndo = useEditorStore((s) => s.history.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);

  const menuGroups = [
    [
      { icon: Undo, action: undo, disabled: !canUndo },
      { icon: Redo, action: redo, disabled: !canRedo },
    ],
    [
      { icon: Copy, action: copy, disabled: false },
      { icon: Clipboard, action: paste, disabled: false },
    ],
    [{ icon: Trash, action: remove, disabled: false }],
  ];
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-2xl">
      {menuGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center gap-2">
          {group.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              onClick={item.action}
              disabled={item.disabled}
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
