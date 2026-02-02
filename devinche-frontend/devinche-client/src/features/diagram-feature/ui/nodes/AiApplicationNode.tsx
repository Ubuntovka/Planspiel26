import { Position, Handle, NodeResizer } from "@xyflow/react";
import type { NodeProps } from "@/types/diagram";

export function AiApplicationNode({ data, selected }: NodeProps) {
  const strokeColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const fillColor = "var(--editor-surface)";
  const textColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const hasName = data.name && data.name.trim();

  return (
    <div className="relative w-full h-full">
      <NodeResizer
        isVisible={selected}
        color="var(--editor-accent)"
        minWidth={50}
        minHeight={50}
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
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible", display: "block" }}
      >
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          rx="15"
          stroke={strokeColor}
          strokeWidth="2"
          fill={fillColor}
          vectorEffect="non-scaling-stroke"
        />

        <circle
          cx="50"
          cy="50"
          r="12"
          fill="#000000"
          stroke="none"
        />

        {hasName && data.name && (
          <text
            x="50%"
            y="50%"
            fontSize="10"
            fill={textColor}
            textAnchor="middle"
            dominantBaseline="middle"
            className="pointer-events-none select-none font-medium"
          >
            {data.name.length > 15 ? `${data.name.substring(0, 15)}...` : data.name}
          </text>
        )}
      </svg>
      
      <Handle type="source" position={Position.Top} id="top-source" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <Handle type="source" position={Position.Right} id="right-source" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" />
    </div>
  );
}

export default AiApplicationNode;