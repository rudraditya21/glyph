import { SheetContent } from "@/components/ui/sheet"
import { nodeRegistry } from "../nodes/registry";

interface SidebarProps {
  addNode: (type: string) => void;
}

export default function Sidebar({ addNode }: SidebarProps) {
  return (
    <SheetContent>
      {nodeRegistry.map((node) => (
        <button
          key={node.type}
          onClick={() => addNode(node.type)}
          className="border p-2 rounded-md w-full"
        >
          {node.label}
        </button>
      ))}
    </SheetContent>
  );
}