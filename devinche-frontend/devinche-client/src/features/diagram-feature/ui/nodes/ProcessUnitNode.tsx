import type { NodeProps } from "@/types/diagram";
import { Handle, NodeResizer, Position } from "@xyflow/react";

export function ProcessUnitNode({ data, selected }: NodeProps) {
  const strokeColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const fillColor = "var(--editor-surface)";
  const textColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  return (
    <div className="relative w-full h-full">
      <NodeResizer
        isVisible={selected}
        color="var(--editor-accent)"
        minWidth={87}
        minHeight={87}
        keepAspectRatio
        lineStyle={{
          borderColor: "var(--editor-accent)",
        }}
        handleStyle={{
          width: "8px",
          height: "8px",
          backgroundColor: "white",
          border: `2px solid var(--editor-accent)`,
          borderRadius: "2px",
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <circle
          cx="50"
          cy="50"
          r="50"
          stroke={strokeColor}
          strokeWidth="2"
          fill={fillColor}
          vectorEffect="non-scaling-stroke"
        />
        {data.label && (
          <text
            x="50%"
            y="50%"
            fontSize="10"
            fill={textColor}
            textAnchor="middle"
            dominantBaseline="middle"
            className="pointer-events-none select-none"
          >
            {data.label}
          </text>
        )}
      </svg>
      {/* <div
        className="absolute inset-0 flex items-center justify-center text-center p-2 pointer-events-none"
        style={{ color: "var(--editor-text)", fontSize: "10px" }}
      >
        {data.label}
      </div> */}

      <Handle type="source" position={Position.Top} id="top-source" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <Handle type="source" position={Position.Right} id="right-source" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" />
    </div>
  );
}
