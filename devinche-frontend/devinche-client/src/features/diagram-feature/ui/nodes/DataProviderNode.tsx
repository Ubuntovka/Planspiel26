import { Position, Handle, NodeResizer } from "@xyflow/react";
import type { NodeProps } from "@/types/diagram";

const DataProviderNode = ({ data, selected }: NodeProps) => {
  const strokeColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const fillColor = "var(--editor-surface)";
  const textColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const strokeWidth = 2;
  const hasName = data.name && data.name.trim();

  return (
    <div className="relative w-full h-full">
      <NodeResizer
        isVisible={selected}
        color="var(--editor-accent)"
        minWidth={77}
        minHeight={88}
        keepAspectRatio
        lineStyle={{ borderColor: "var(--editor-accent)" }}
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
        viewBox="0 0 77 88"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible", display: "block" }}
        preserveAspectRatio="none"
      >
        {/* Fill */}
        <path
          d="
            M0,13.88 
            C0,6.21 17.25,0 38.5,0 
            C59.75,0 77,6.21 77,13.88 
            V74.12 
            C77,81.79 59.75,88 38.5,88 
            C17.25,88 0,81.79 0,74.12 
            Z
          "
          fill={fillColor}
        />

        {/* Outline */}
        <path
          d="
            M0,13.88 
            C0,6.21 17.25,0 38.5,0 
            C59.75,0 77,6.21 77,13.88 
            M0,13.88 V74.12 
            M77,13.88 V74.12 
            M0,74.12 C0,81.79 17.25,88 38.5,88 C59.75,88 77,81.79 77,74.12
          "
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />

        {/* Inner Stroke */}
        <path
          d="M0,13.88 C0,21.55 17.25,27.76 38.5,27.76 C59.75,27.76 77,21.55 77,13.88"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
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
            {data.name.length > 12 ? `${data.name.substring(0, 12)}...` : data.name}
          </text>
        )}
      </svg>

      <Handle type="source" position={Position.Top} id="top-source" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <Handle type="source" position={Position.Right} id="right-source" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" />
    </div>
  );
};

export default DataProviderNode;
