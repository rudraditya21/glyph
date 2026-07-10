import { Redo, Undo, Copy, Trash } from "lucide-react"
import MenuItem from "./menu-item"
import { Separator } from "@/components/ui/separator"
import { useEditorStore } from "@/store/editor-store";

export default function TopMenu() {
  const undo = useEditorStore(s => s.undo)
  const redo = useEditorStore(s => s.redo)
  const copy = useEditorStore(s => s.copySelected)
  const remove = useEditorStore(s => s.deleteSelected)

  const menuGroups = [
    [
      { icon: Undo, action: undo },
      { icon: Redo, action: redo },
    ],
    [
      { icon: Copy, action: copy },
      { icon: Trash, action: remove },
    ],
  ];
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-2xl">
      {menuGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center gap-2">
          {group.map((item, index) => (
            <MenuItem key={index} icon={item.icon} onClick={item.action} />
          ))}

          {groupIndex !== menuGroups.length - 1 && (
            <Separator orientation="vertical" className="h-8" />
          )}
        </div>
      ))}
    </div>
  )
}