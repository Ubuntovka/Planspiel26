import { NodeResizer, Node, NodeProps, Position, Handle } from "@xyflow/react";
import type { SecurityRealmData } from "@/types/diagram";

type SecurityRealmDataNode = Node<SecurityRealmData>;

const SecurityRealmNode = ({
  data,
  selected,
}: NodeProps<SecurityRealmDataNode>) => {
  const errorColor = "#FF4D4F";
  const strokeColor = data.hasError ? errorColor : (selected ? "var(--editor-accent)" : "var(--editor-text)");
  const textColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const fillColor = "var(--editor-surface)";
  const fixedStrokeWidth = 3;
  const hasName = data.name && data.name.trim();

  return (
    <div 
      className="relative w-full h-full"
      style={{ containerType: "size" }} 
    >
      <NodeResizer
        color="var(--editor-accent)"
        isVisible={selected}
        minWidth={300}
        minHeight={300}
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
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible", display: "block" }}
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="25"
          stroke={strokeColor}
          strokeWidth={fixedStrokeWidth}
          fill={fillColor}
        />
        <line
          x1="calc(100% - 80px)"
          y1="0"
          x2="100%"
          y2="80"
          stroke={strokeColor}
          strokeWidth={fixedStrokeWidth}
        />
      </svg>

      <div
        className="absolute inset-0 flex flex-col items-start justify-end pointer-events-none"
        style={{
          color: textColor,
          fontSize: "10px", 
          paddingTop: "10",
          paddingRight: "10",
          width: "100%",
          height: "100%",
        }}
      >
        <div 
          className="flex items-center justify-center text-center"
          style={{
            width: "50px",
            minHeight: "50px",
            lineHeight: "1.1",
          }}
        >
          {hasName && (
            <span className="wrap-break-words line-clamp-3 w-full pr-2 font-medium">
              {data.name}
            </span>
          )}
        </div>
      </div>

      {/* Handles for trust edges (realm to realm): left and right so two realms can connect */}
      <Handle type="source" position={Position.Right} id="trust-out" />
      <Handle type="target" position={Position.Right} id="trust-in" />
      <Handle type="source" position={Position.Left} id="trust-out-left" />
      <Handle type="target" position={Position.Left} id="trust-in-left" />
    </div>
  );
};

export default SecurityRealmNode;