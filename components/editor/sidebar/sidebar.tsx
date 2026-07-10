import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { nodeRegistry } from "../nodes/registry";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";

interface SidebarProps {
  addNode: (type: string) => void;
}

export default function Sidebar({ addNode }: SidebarProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>("All");

  const categories = Array.from(
    new Set(nodeRegistry.map((node) => node.category))
  );

  const filteredNodes = useMemo(() => {
    return nodeRegistry.filter((node) => {
      const matchesSearch =
        node.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        node.type
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        node.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const groupedNodes = filteredNodes.reduce(
    (acc, node) => {
      if (!acc[node.category]) {
        acc[node.category] = [];
      }

      acc[node.category].push(node);

      return acc;
    },
    {} as Record<string, typeof nodeRegistry>
  );

  return (
    <TooltipProvider>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Catalog</SheetTitle>
          <SheetDescription>
            Drag or click a node to add it to your workflow
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex gap-2 px-4">
          <Input
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={category}
            onValueChange={setCategory}
          >
            <SelectTrigger className="w-32.5">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">
                All
              </SelectItem>

              {categories.map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                >
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 mb-6 flex-1 overflow-y-auto px-4">
          {Object.entries(groupedNodes).map(
            ([category, nodes], index) => (
              <div key={category}>
                <h3 className="mb-3 text-sm font-semibold">
                  {category}
                </h3>

                <div className="grid grid-cols-4 gap-3">
                  {nodes.map((node) => (
                    <Tooltip key={node.type}>
                      <TooltipTrigger>
                        <Button
                          variant="outline"
                          onClick={() =>
                            addNode(node.type)
                          }
                          className="h-20 w-20 rounded-xl p-3"
                        >
                          <Image
                            src={node.icon as string}
                            alt={node.name}
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

                {index <
                  Object.entries(groupedNodes).length - 1 && (
                    <Separator className="my-6" />
                  )}
              </div>
            )
          )}

          {filteredNodes.length === 0 && (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              No nodes found
            </p>
          )}
        </div>
      </SheetContent>
    </TooltipProvider>
  );
}