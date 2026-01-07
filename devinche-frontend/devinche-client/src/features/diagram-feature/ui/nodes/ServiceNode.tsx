import type { NodeProps } from "@/types/diagram";
import { Handle, NodeResizer, Position } from "@xyflow/react";

const ServiceNode = ({ data, selected }: NodeProps) => {
  const strokeColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const fillColor = "var(--editor-surface)";
  const textColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  return (
    <div className="relative w-full h-full">
      <NodeResizer
        isVisible={selected}
        color="var(--editor-accent)"
        minWidth={87}
        minHeight={76}
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
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 87 77"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M31.7544 8.43415
             C36.7317 -0.186735 49.1748 -0.186749 54.1521 8.43413
             L82.1492 56.9266
             C87.1265 65.5475 80.9049 76.3236 70.9504 76.3236
             H14.9561
             C5.0016 76.3236 -1.22 65.5475 3.75727 56.9266
             L31.7544 8.43415Z"
          stroke={strokeColor}
          strokeWidth="2.87363"
          fill={fillColor}
          vectorEffect="non-scaling-stroke"
        />
        {data.label && (
          <text
            x="50%"
            y="60%"
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

      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={{ top: "3%", background: strokeColor }}
      />

      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{
          left: "17%",
          top: "50%",
          background: strokeColor,
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{
          right: "18%",
          top: "50%",
          background: strokeColor,
        }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{ bottom: "1%", background: strokeColor }}
      />
    </div>
  );
};

export default ServiceNode;