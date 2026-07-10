import type { LucideIcon } from "lucide-react"

interface MenuItemProps {
  icon: LucideIcon;
  onClick: () => void
}

export default function MenuItem({ icon: Icon, onClick }: MenuItemProps) {
  return (
    <div className="px-4 py-2 hover:bg-secondary rounded-2xl cursor-auto" onClick={onClick}>
      <Icon className="w-4 h-4" />
    </div>
  )
}