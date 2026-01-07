import { Handle, Position, NodeResizer, Node, NodeProps } from "@xyflow/react";
import type { SecurityRealmData } from "@/types/diagram";

type SecurityRealmDataNode = Node<SecurityRealmData>;

const SecurityRealmNode = ({
  data,
  selected,
}: NodeProps<SecurityRealmDataNode>) => {
  const strokeColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const textColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const fillColor = "var(--editor-surface)";
  const fixedStrokeWidth = 3;

  return (
    <div className="relative w-full h-full">
      <NodeResizer
        color="var(--editor-accent)"
        isVisible={selected}
        minWidth={91}
        minHeight={91}
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
        viewBox="0 0 91 91"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ overflow: "visible", display: "block" }} 
      >
        <rect
          x="0"
          y="0"
          width="91"
          height="91"
          rx="14"
          stroke={strokeColor}
          strokeWidth={fixedStrokeWidth}
          vectorEffect="non-scaling-stroke"
          fill={fillColor}
        />
        <path
          d="M65 0L91 26" 
          stroke={strokeColor}
          strokeWidth={fixedStrokeWidth}
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
      
      {/* <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" /> */}
    </div>
  );
};

export default SecurityRealmNode;