import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { nodeRegistry } from "../nodes/registry";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface SidebarProps {
  addNode: (type: string) => void;
}

export default function Sidebar({ addNode }: SidebarProps) {
  return (
    <TooltipProvider>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Catalog</SheetTitle>
          <SheetDescription>Drag or click a node to add it to your workflow</SheetDescription>
        </SheetHeader>
        <div className="mt-6 grid grid-cols-4 gap-3 px-4 overflow-y-auto">
          {nodeRegistry.map((node) => (
            <Tooltip key={node.type}>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  onClick={() => addNode(node.type)}
                  className="h-20 w-20 flex items-center justify-center rounded-xl p-3"
                >
                  <Image
                    src={node.icon as string}
                    alt={node.label}
                    width={32}
                    height={32}
                  />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>{node.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </SheetContent>
    </TooltipProvider>
  );
}