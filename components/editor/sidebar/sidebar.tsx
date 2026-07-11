"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { nodeRegistry } from "../nodes/registry";

interface SidebarProps {
  addNode: (type: string) => void;
}

export default function Sidebar({ addNode }: SidebarProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>("All");

  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(nodeRegistry.map((node) => node.category)));
  }, []);

  const filteredNodes = useMemo(() => {
    const query = search.toLowerCase();

    return nodeRegistry.filter((node) => {
      const matchesSearch =
        node.name.toLowerCase().includes(query) ||
        node.type.toLowerCase().includes(query);

      const matchesCategory = category === "All" || node.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const rows = useMemo(() => {
    const result = [];

    for (let i = 0; i < filteredNodes.length; i += 4) {
      result.push(filteredNodes.slice(i, i + 4));
    }

    return result;
  }, [filteredNodes]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 110,
    overscan: 5,
    initialRect: {
      width: 300,
      height: 600,
    },
  });

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      rowVirtualizer.measure();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [filteredNodes]);

  return (
    <TooltipProvider>
      <SheetContent className="flex min-h-0 flex-col">
        <SheetHeader>
          <SheetTitle>Catalog</SheetTitle>

          <SheetDescription>
            Click a node to add it to your workflow
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
            onValueChange={(value) => setCategory(value ?? "All")}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">All</SelectItem>

              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div ref={scrollRef} className="mt-4 flex-1 overflow-y-auto px-4">
          {filteredNodes.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              No nodes found
            </p>
          ) : (
            <div
              className="relative w-full"
              style={{
                height: rowVirtualizer.getTotalSize(),
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];

                return (
                  <div
                    key={virtualRow.key}
                    className="absolute left-0 top-0 grid w-full grid-cols-4 gap-3"
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {row.map((node) => (
                      <Tooltip key={node.type}>
                        <TooltipTrigger>
                          <Button
                            variant="outline"
                            onClick={() => addNode(node.type)}
                            className="
                                h-20
                                w-20
                                rounded-xl
                                p-3
                              "
                          >
                            <Image
                              src={node.icon as string}
                              alt={node.name}
                              width={32}
                              height={32}
                              loading="lazy"
                            />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>{node.name}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </TooltipProvider>
  );
}
