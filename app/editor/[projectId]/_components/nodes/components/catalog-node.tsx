import Image from "next/image";
import { Handle, Position, NodeProps } from "@xyflow/react";

export default function CatalogNode({ data }: NodeProps) {
  return (
    <div className="rounded-xl border bg-white shadow p-4 w-48">
      <Image
        src={data.icon as string}
        alt={data.label as string}
        width={40} height={40}
      />
      <h3 className="text-center font-medium">
        {data.label as string}
      </h3>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}