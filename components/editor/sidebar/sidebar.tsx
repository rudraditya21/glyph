import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { nodeRegistry } from "../nodes/registry";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  addNode: (type: string) => void;
}

export default function Sidebar({ addNode }: SidebarProps) {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Catalog</SheetTitle>
        <SheetDescription>Drag or click a node to add it to your workflow</SheetDescription>
      </SheetHeader>
      <div className="mt-6 grid grid-cols-4 gap-3 px-4">
        {nodeRegistry.map((node) => (
          <Button
            key={node.type}
            variant="outline"
            onClick={() => addNode(node.type)}
            className="h-20 flex flex-col items-center justify-center gap-2 rounded-xl p-3"
          >
            <Image
              src={node.icon as string}
              alt={node.label}
              width={32}
              height={32}
            />

            <span className="text-xs font-medium text-center leading-tight">
              {node.label}
            </span>
          </Button>
        ))}
      </div>
    </SheetContent>
  );
}