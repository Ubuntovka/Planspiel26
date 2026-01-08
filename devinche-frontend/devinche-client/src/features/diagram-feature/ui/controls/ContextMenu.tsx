import { useCallback, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type { ContextMenuState } from "@/types/diagram";

import {
  SquareRounded,
  Link,
  AspectRatio,
  OutlinedFlag,
  LocationOnOutlined,
  Refresh,
  Dashboard,
  SelectAll,
} from "@mui/icons-material";

interface ContextMenuProps extends ContextMenuState {
  onClick?: () => void;
  resetCanvas?: () => void;
  selectAllNodes?: () => void;
}

const IconNode = () => <SquareRounded fontSize="small" />;
const IconEdge = () => <Link fontSize="small" />;
const IconDimensions = () => <AspectRatio fontSize="small" />;
const IconSource = () => <OutlinedFlag fontSize="small" />;
const IconTarget = () => <LocationOnOutlined fontSize="small" />;
const IconPane = () => <Refresh fontSize="small" />;
const IconCanvas = () => <Dashboard fontSize="small" />;
const IconSelectAll = () => <SelectAll fontSize="small" />;

export default function ContextMenu({
  id,
  type,
  top,
  left,
  right,
  bottom,
  onClick,
  resetCanvas,
  selectAllNodes,
  ...props
}: ContextMenuProps) {
  const { getNode, getEdges, addNodes, deleteElements, setNodes } = useReactFlow();

  const elementType = type;
  const isCanvasMenu = elementType === "canvas";

  const elementData = useMemo(() => {
    const data = [];
    if (elementType === "node") {
      const node = getNode(id);
      if (node) {
        data.push({
          icon: <IconDimensions />,
          label: "Size",
          value: `${node.measured?.width ?? "N/A"}x${node.measured?.height ?? "N/A"}`,
          unit: "px",
        });
      }
    } else if (elementType === "edge") {
      const edge = getEdges().find((e) => e.id === id);
      if (edge) {
        data.push({ icon: <IconSource />, label: "Source", value: edge.source });
        data.push({ icon: <IconTarget />, label: "Target", value: edge.target });
      }
    }
    return data;
  }, [id, elementType, getNode, getEdges]);

  // duplicate node (HEAD logic)
  const duplicateNode = useCallback(() => {
  if (elementType !== "node") return;
  const node = getNode(id);
  if (!node) return;
  
  const newNode = {
    ...node,
    id: uuidv4(), 
    // id: `${node.type}-${Date.now()}`,
    selected: false,
    position: {
      x: node.position.x + 50,
      y: node.position.y + 50,
    },
  };

  setNodes((nds) => nds.concat(newNode)); 
}, [id, getNode, setNodes, elementType]);

  // delete (HEAD logic)
  const deleteItem = useCallback(() => {
    if (elementType === "node") {
      deleteElements({ nodes: [{ id }] });
    } else if (elementType === "edge") {
      deleteElements({ edges: [{ id }] });
    }
  }, [id, elementType, deleteElements]);

  const handleResetCanvas = useCallback(() => {
    resetCanvas?.();
  }, [resetCanvas]);

  const handleSelectAll = useCallback(() => {
    selectAllNodes?.();
  }, [selectAllNodes]);

  return (
    <div
      className="absolute rounded-lg shadow-2xl p-3 z-50 flex flex-col gap-2 min-w-[240px]"
      style={{
        top,
        left,
        right,
        bottom,
        backgroundColor: "var(--editor-panel-bg)",
        border: "1px solid var(--editor-border)",
        boxShadow: "0 8px 16px var(--editor-shadow-lg)",
      }}
      {...props}
    >
      {/* Header */}
      <div
        className="flex items-center space-x-2 pb-2 mb-2"
        style={{ borderBottom: "1px solid var(--editor-border)" }}
      >
        <span
          className="w-4 h-4 flex items-center justify-center"
          style={{ color: "var(--editor-accent)" }}
        >
          {isCanvasMenu ? <IconCanvas /> : elementType === "node" ? <IconNode /> : <IconEdge />}
        </span>
        <h3
          className="text-sm font-semibold capitalize m-0 p-0"
          style={{ color: "var(--editor-text)" }}
        >
          {isCanvasMenu ? "Canvas" : elementType}
        </h3>
      </div>

      {/* ID */}
      {!isCanvasMenu && (
        <div
          className="text-xs flex flex-col gap-1"
          style={{ color: "var(--editor-text-secondary)" }}
        >
          <span className="font-medium">ID:</span>
          <span
            className="truncate max-w-full font-mono px-2 py-0.5 rounded"
            style={{
              backgroundColor: "var(--editor-bg)",
              color: "var(--editor-text)",
              border: "1px solid var(--editor-border)",
            }}
          >
            {id}
          </span>
        </div>
      )}

      {/* Node/edge info */}
      {elementData.length > 0 && !isCanvasMenu && (
        <div
          className="pt-2 flex flex-col gap-1.5"
          style={{ borderTop: "1px solid var(--editor-border)" }}
        >
          {elementData.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs"
              style={{ color: "var(--editor-text-secondary)" }}
            >
              <span className="flex items-center space-x-1 font-medium">
                <span
                  className="w-4 h-4 flex items-center justify-center"
                  style={{ color: "var(--editor-text-muted)" }}
                >
                  {item.icon}
                </span>
                <span>{item.label}:</span>
              </span>

              <span className="font-semibold" style={{ color: "var(--editor-text)" }}>
                {item.value}
                {item.unit && (
                  <span
                    className="ml-1 font-normal"
                    style={{ color: "var(--editor-text-secondary)" }}
                  >
                    {item.unit}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div
        className="pt-2 mt-1 flex flex-col gap-1.5"
        style={{ borderTop: "1px solid var(--editor-border)" }}
      >
        {/* Reset Canvas */}
        {isCanvasMenu && (
          <button
            className="flex items-center justify-center px-3 py-2 text-sm rounded-md font-medium transition"
            style={{
              color: "var(--editor-text)",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--editor-surface-hover)";
              e.currentTarget.style.color = "var(--editor-accent)";
              e.currentTarget.style.borderColor = "var(--editor-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--editor-text)";
              e.currentTarget.style.borderColor = "transparent";
            }}
            onClick={() => {
              handleResetCanvas();
              onClick?.();
            }}
          >
            <IconPane />
            <span className="ml-1">Reset Canvas</span>
          </button>
        )}
        {/* Select All Nodes (New Button) */} 
        {isCanvasMenu && (
          <button
            className="flex items-center justify-center px-3 py-2 text-sm rounded-md font-medium transition"
            style={{
              color: "var(--editor-text)",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--editor-surface-hover)";
              e.currentTarget.style.color = "var(--editor-accent)";
              e.currentTarget.style.borderColor = "var(--editor-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--editor-text)";
              e.currentTarget.style.borderColor = "transparent";
            }}
            onClick={() => {
              handleSelectAll();
              onClick?.();
            }}
          >
            <IconSelectAll />
            <span className="ml-1">Select All</span>
          </button>
        )}

        {/* Duplicate Node */}
        {elementType === "node" && (
          <button
            className="flex items-center justify-center px-3 py-2 text-sm rounded-md font-medium transition border border-transparent"
            style={{ color: "var(--editor-text)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--editor-surface-hover)";
              e.currentTarget.style.color = "var(--editor-accent)";
              e.currentTarget.style.borderColor = "var(--editor-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--editor-text)";
              e.currentTarget.style.borderColor = "transparent";
            }}
            onClick={() => {
              duplicateNode();
              onClick?.();
            }}
          >
            Duplicate Node
          </button>
        )}

        {/* Delete node/edge */}
        {!isCanvasMenu && (
          <button
            className="flex items-center justify-center px-3 py-2 text-sm rounded-md font-medium transition border border-transparent"
            style={{ color: "var(--editor-error)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--editor-surface-hover)";
              e.currentTarget.style.borderColor = "var(--editor-error)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }}
            onClick={() => {
              deleteItem();
              onClick?.();
            }}
          >
            Delete {elementType === "node" ? "Node" : "Edge"}
          </button>
        )}
      </div>
    </div>
  );
}
