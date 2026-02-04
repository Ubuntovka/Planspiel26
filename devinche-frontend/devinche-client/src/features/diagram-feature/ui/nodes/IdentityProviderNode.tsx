import type { NodeProps } from "@/types/diagram";
import { NodeResizer } from "@xyflow/react";

const IdentityProviderNode = ({ data, selected }: NodeProps) => {
  const strokeColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const fillColor = "var(--editor-surface)";
  const textColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const hasName = data.name && data.name.trim();
  const nameLength = hasName && data.name ? data.name.length : 0;
  const fontSize =
    nameLength > 10
      ? `clamp(8px, ${Math.max(4, 10 - (nameLength - 10) * 0.3)}cqw, 40px)`
      : "clamp(14px, 12cqw, 60px)";
  return (
    <div
      className="relative w-full h-full"
      style={{
        containerType: "size",
      }}
    >
      <NodeResizer
        isVisible={selected}
        color="var(--editor-accent)"
        minWidth={76}
        minHeight={77}
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
        viewBox="0 0 76 77"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M74.3946 65.3453V11.8404C74.3946 3.30662 64.0769 -0.967114 58.0426 5.06717L4.53775 58.5721C-1.49653 64.6063 2.77722 74.924 11.311 74.924H64.8158C70.106 74.924 74.3946 70.6355 74.3946 65.3453Z"
          stroke={strokeColor}
          strokeWidth="2.87363"
          fill={fillColor}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-center p-3 pointer-events-none"
        style={{
          color: textColor,
          fontSize: fontSize,
          paddingTop: "40%",
          paddingLeft: "50%",
          paddingRight: "10%",
        }}
      >
        {hasName && (
          <span className="wrap-break-words leading-tight w-full font-medium overflow-hidden text-ellipsis line-clamp-2" style={{ maxWidth: '100%' }}>
            {data.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default IdentityProviderNode;
