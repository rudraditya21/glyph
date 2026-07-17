import type { LucideIcon } from "lucide-react";

interface MenuItemProps {
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export default function MenuItem({
  icon: Icon,
  onClick,
  disabled = false,
  label,
}: MenuItemProps) {
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-lg transition ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-secondary cursor-pointer"}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
