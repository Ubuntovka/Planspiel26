import type { NodeProps } from "@/types/diagram";

export function ProcessUnitNode({ data }: NodeProps) {
  return (
    <div className="w-16 h-16 border bg-white rounded-full flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap">
      <div>
        <label htmlFor="text" className="text-xs">ProcessUnit</label>
      </div>
    </div>
  );
}

