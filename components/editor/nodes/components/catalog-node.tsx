import { Handle, NodeProps, Position } from "@xyflow/react";
import Image from "next/image";

export default function CatalogNode({ data }: NodeProps) {
  return (
    <div className="w-28 h-28 rounded-xl border bg-background text-foreground shadow flex flex-col items-center justify-center">
      <Image
        src={data.icon as string}
        alt={data.label as string}
        width={40}
        height={40}
      />
      <h3 className="text-center font-medium">{data.label as string}</h3>

      <Handle id="input" type="target" position={Position.Left} />
      <Handle id="output" type="source" position={Position.Right} />
    </div>
  );
}
