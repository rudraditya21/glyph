import type { LucideIcon } from "lucide-react"

interface MenuItemProps {
  icon: LucideIcon
  onClick: () => void
  disabled?: boolean
}

export default function MenuItem({ icon: Icon, onClick, disabled = false }: MenuItemProps) {
  return (
    <div className={`px-4 py-2 rounded-lg transition ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-secondary cursor-pointer"}`} onClick={disabled ? undefined : onClick}>
      <Icon className="w-4 h-4" />
    </div>
  )
}