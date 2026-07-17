import { NodeProps, NodeResizer } from "@xyflow/react";
import { useRef } from "react";

import { useEditorStore } from "@/store/editor-store";
import { EditorNode } from "@/types/editor";

export default function OrganizationNode({
  id,
  data,
  selected,
}: NodeProps<EditorNode>) {
  const updateNodeLabel = useEditorStore((state) => state.updateNodeLabel);
  const saveHistory = useEditorStore((state) => state.saveHistory);
  const editingRef = useRef(false);

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={280}
        minHeight={160}
        color="var(--primary)"
        lineStyle={{ borderColor: "var(--border)", opacity: 0.9 }}
        handleStyle={{
          width: 12,
          height: 12,
          borderWidth: 2,
          borderColor: "var(--background)",
          backgroundColor: "var(--primary)",
          borderRadius: 999,
        }}
      />
      <div
        className="h-full w-full rounded-[28px] border-2 border-dashed border-border bg-background/50 p-4 text-left shadow-[0_0_0_1px_var(--border)_inset] backdrop-blur-[2px]"
      >
        <div className="organization-node__header -mt-8 mb-4 flex">
          <div className="rounded-full border border-border bg-background px-2 py-1 shadow-sm">
            <input
              value={String(data.label ?? "")}
              onChange={(event) => updateNodeLabel(id, event.target.value)}
              onFocus={() => {
                if (editingRef.current) return;

                saveHistory();
                editingRef.current = true;
              }}
              onBlur={() => {
                editingRef.current = false;
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              onDoubleClick={(event) => {
                event.stopPropagation();
              }}
              className="nodrag nopan min-w-36 bg-transparent px-2 text-sm font-medium text-foreground outline-none"
              aria-label="Container title"
            />
          </div>
        </div>

        <div className="h-[calc(100%-2.5rem)] rounded-[20px] border border-dashed border-border/70 p-4" />
      </div>
    </>
  );
}
