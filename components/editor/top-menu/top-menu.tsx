import { Redo, Undo, Copy, Trash } from "lucide-react"
import MenuItem from "./menu-item"
import { Separator } from "@/components/ui/separator"

const menuGroups = [
  [
    { icon: Undo },
    { icon: Redo },
  ],
  [
    { icon: Copy },
    { icon: Trash },
  ],
];

export default function TopMenu() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-2xl">
      {menuGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center gap-2">
          {group.map((item, index) => (
            <MenuItem key={index} icon={item.icon} />
          ))}

          {groupIndex !== menuGroups.length - 1 && (
            <Separator orientation="vertical" className="h-8" />
          )}
        </div>
      ))}
    </div>
  )
}