import { SheetContent } from "@/components/ui/sheet"

const nodeTypes = [
  {
    type: "text",
    label: "Text Node",
  },
];

interface SidebarProps {
  addNode: (type: string) => void;
}

export default function Sidebar({ addNode }: SidebarProps) {
  return (
    <SheetContent>
      {nodeTypes.map((node) => (
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