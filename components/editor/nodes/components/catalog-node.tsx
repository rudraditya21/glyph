import { Handle, NodeProps, Position } from "@xyflow/react";
import Image from "next/image";

import { EditorNode } from "@/types/editor";

export default function CatalogNode({ data }: NodeProps<EditorNode>) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-28 h-28 rounded-xl border bg-background text-foreground shadow flex flex-col items-center justify-center">
        <Image
          src={data.icon as string}
          alt={data.label as string}
          width={40}
          height={40}
        />
        <Handle id="input" type="target" position={Position.Left} />
        <Handle id="output" type="source" position={Position.Right} />
      </div>
      <span
        className="mt-2 max-w-28 truncate text-center text-xs font-medium text-muted-foreground"
        title={data.label as string}
      >
        {data.label as string}
      </span>
    </div>
  );
}
