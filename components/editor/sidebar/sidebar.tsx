"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

import { nodeRegistry } from "../nodes/registry";

interface SidebarProps {
  addNode: (type: string) => void;
}

interface CatalogEntry {
  type: string;
  name: string;
  category: string;
  icon?: string;
  searchText: string;
}

const ALL_CATEGORY = "All";
const ICON_SIZE = 80;
const GRID_GAP = 12;
const CHUNK_ROWS = 24;
const DEFAULT_COLUMN_COUNT = 4;

export default function Sidebar({ addNode }: SidebarProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORY);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [visibleChunks, setVisibleChunks] = useState(1);

  const deferredSearch = useDeferredValue(search);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const catalogEntries = useMemo<CatalogEntry[]>(
    () =>
      nodeRegistry.map((node) => ({
        type: node.type,
        name: node.name,
        category: node.category,
        icon: node.icon,
        searchText: `${node.name} ${node.type}`.toLowerCase(),
      })),
    [],
  );

  const categories = useMemo(
    () => Array.from(new Set(catalogEntries.map((node) => node.category))),
    [catalogEntries],
  );

  const filteredNodes = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    const hasQuery = query.length > 0;
    const hasCategory = category !== ALL_CATEGORY;

    if (!hasQuery && !hasCategory) {
      return catalogEntries;
    }

    return catalogEntries.filter((node) => {
      const matchesCategory = !hasCategory || node.category === category;
      const matchesSearch = !hasQuery || node.searchText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [catalogEntries, category, deferredSearch]);

  const columnCount = Math.max(
    1,
    Math.floor((viewportWidth + GRID_GAP) / (ICON_SIZE + GRID_GAP)) ||
      DEFAULT_COLUMN_COUNT,
  );

  const chunkSize = Math.max(columnCount * CHUNK_ROWS, DEFAULT_COLUMN_COUNT * 12);
  const visibleCount = visibleChunks * chunkSize;
  const renderedNodes = filteredNodes.slice(0, visibleCount);
  const hasMoreNodes = visibleCount < filteredNodes.length;

  useEffect(() => {
    const root = scrollRef.current;
    const target = loadMoreRef.current;

    if (!root || !target || !hasMoreNodes) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) return;

        setVisibleChunks((current) => current + 1);
      },
      {
        root,
        rootMargin: "200px 0px",
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [chunkSize, filteredNodes.length, hasMoreNodes]);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    const updateViewportWidth = () => {
      setViewportWidth(element.clientWidth);
    };

    updateViewportWidth();

    const resizeObserver = new ResizeObserver(updateViewportWidth);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    element.scrollTop = 0;
  }, [category, deferredSearch]);

  const statusText = useMemo(
    () =>
      `${renderedNodes.length.toLocaleString()} of ${filteredNodes.length.toLocaleString()} nodes`,
    [filteredNodes.length, renderedNodes.length],
  );

  return (
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
          onChange={(event) => {
            setSearch(event.target.value);
            setVisibleChunks(1);
          }}
        />

        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value ?? ALL_CATEGORY);
            setVisibleChunks(1);
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value={ALL_CATEGORY}>{ALL_CATEGORY}</SelectItem>

            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-3 px-4 text-xs text-muted-foreground">
        {statusText}
      </div>

      <div ref={scrollRef} className="mt-4 flex-1 overflow-y-auto px-4">
        {filteredNodes.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No nodes found
          </p>
        ) : (
          <div
            className="grid content-start pb-4"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              gap: GRID_GAP,
            }}
          >
            {renderedNodes.map((node) => (
              <div key={node.type} className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addNode(node.type)}
                  className="size-20 rounded-xl p-3"
                  aria-label={`Add ${node.name}`}
                  title={node.name}
                >
                  {node.icon ? (
                    <>
                      {/* Plain img is cheaper here than next/image for a large, virtualized local icon grid. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={node.icon}
                        alt={node.name}
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="h-8 w-8 object-contain"
                      />
                    </>
                  ) : null}
                </Button>
              </div>
            ))}
            <div
              ref={loadMoreRef}
              className="col-span-full h-px"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </SheetContent>
  );
}
