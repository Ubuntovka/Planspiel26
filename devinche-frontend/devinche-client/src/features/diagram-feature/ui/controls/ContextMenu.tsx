import { useCallback, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type { ContextMenuState } from "@/types/diagram";

import {
  SquareRounded,      // Node icon
  Link,               // Edge icon
  AspectRatio,        // Size/Dimensions icon
  OutlinedFlag,       // Source icon
  LocationOnOutlined, // Target icon
} from "@mui/icons-material";

interface ContextMenuProps extends ContextMenuState {
  onClick?: () => void;
}

const IconNode = () => <SquareRounded fontSize="small" />;
const IconEdge = () => <Link fontSize="small" />;
const IconDimensions = () => <AspectRatio fontSize="small" />;
const IconSource = () => <OutlinedFlag fontSize="small" />;
const IconTarget = () => <LocationOnOutlined fontSize="small" />;

export default function ContextMenu({
  id,
  type = "node",
  top,
  left,
  right,
  bottom,
  onClick,
  ...props
}: ContextMenuProps) {
  const { getNode, getEdges, addNodes, deleteElements } = useReactFlow();

  // Get node/edge data
  const elementData = useMemo(() => {
    const data = [];
    if (type === "node") {
      const node = getNode(id);
      if (node) {
        data.push({
          icon: <IconDimensions />, 
          label: "Size",
          value: `${node.measured?.width ?? "N/A"}x${node.measured?.height ?? "N/A"}`,
          unit: "px",
        });
      }
    } else if (type === "edge") {
      // Find edge using getEdges(), return source/target ID
      const edge = getEdges().find((e) => e.id === id);
      if (edge) {
        // Returns the node IDs connected to the edge
        data.push({
          icon: <IconSource />,
          label: "Source",
          value: edge.source,
        });
        data.push({
          icon: <IconTarget />,
          label: "Target",
          value: edge.target,
        });
      }
    }
    return data;
  }, [id, type, getNode, getEdges]);

  // NODE DUPLICATION
  const duplicateNode = useCallback(() => {
    if (type !== "node") return;

    const node = getNode(id);
    if (!node) return;

    // NEW NODE: created 50px right and below
    const position = { x: node.position.x + 50, y: node.position.y + 50 };
    const newId = uuidv4();
    addNodes({
      id: newId,
      type: node.type,
      position,
      data: { ...node.data },
      style: { ...node.style },
      selected: false,
      dragging: false,
    });
  }, [id, getNode, addNodes, type]);

  // NODE and EDGE DELETION
  const deleteItem = useCallback(() => {
    if (type === "node") {
      deleteElements({ nodes: [{ id }] });
    } else if (type === "edge") {
      deleteElements({ edges: [{ id }] });
    }
  }, [id, type, deleteElements]);

  return (
    <div
      className="absolute rounded-lg shadow-2xl p-3 z-50 flex flex-col gap-2 min-w-[240px]"
      style={{ 
        top, 
        left, 
        right, 
        bottom,
        backgroundColor: 'var(--editor-panel-bg)',
        border: '1px solid var(--editor-border)',
        boxShadow: '0 8px 16px var(--editor-shadow-lg)'
      }}
      {...props}
    >
      {/* --- Info section --- */}
      <div className="flex items-center space-x-2 pb-2 mb-2" style={{ borderBottom: '1px solid var(--editor-border)' }}>
        <span className="w-4 h-4 flex items-center justify-center" style={{ color: 'var(--editor-accent)' }}>
          {type === "node" ? <IconNode /> : <IconEdge />}
        </span>
        <h3 className="text-sm font-semibold capitalize m-0 p-0" style={{ color: 'var(--editor-text)' }}>
          {type}
        </h3>
      </div>
      
      {/* ID  */}
      <div className="text-xs flex flex-col gap-1" style={{ color: 'var(--editor-text-secondary)' }}>
        <span className="font-medium">ID:</span>
        <span className="truncate max-w-full font-mono px-2 py-1 rounded" style={{ 
          backgroundColor: 'var(--editor-bg)',
          color: 'var(--editor-text)',
          border: '1px solid var(--editor-border)'
        }}>
          {id}
        </span>
      </div>

      {/* dynamic data */}
      {elementData.length > 0 && (
        <div className="pt-2 flex flex-col gap-1.5" style={{ borderTop: '1px solid var(--editor-border)' }}>
          {elementData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs" style={{ color: 'var(--editor-text-secondary)' }}>
              <span className="flex items-center space-x-1 font-medium">
                <span className="w-4 h-4 flex items-center justify-center" style={{ color: 'var(--editor-text-muted)' }}>
                  {item.icon}
                </span>
                <span>{item.label}:</span>
              </span>
              <span className="font-semibold" style={{ color: 'var(--editor-text)' }}>
                {item.value}
                {item.unit && <span className="ml-1 font-normal" style={{ color: 'var(--editor-text-secondary)' }}>{item.unit}</span>}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <div className="pt-2 mt-1 flex flex-col gap-1.5" style={{ borderTop: '1px solid var(--editor-border)' }}>
        {type === "node" && (
          <button
            className="flex items-center justify-center px-3 py-2 text-sm rounded-md transition duration-150 hover:cursor-pointer font-medium border border-transparent"
            style={{ color: 'var(--editor-text)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
              e.currentTarget.style.color = 'var(--editor-accent)';
              e.currentTarget.style.borderColor = 'var(--editor-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--editor-text)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            onClick={() => {
              duplicateNode();
              onClick?.();
            }}
          >
            Duplicate Node
          </button>
        )}
        <button
          className="flex items-center justify-center px-3 py-2 text-sm rounded-md transition duration-150 hover:cursor-pointer font-medium border border-transparent"
          style={{ color: 'var(--editor-error)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
            e.currentTarget.style.borderColor = 'var(--editor-error)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'transparent';
          }}
          onClick={() => {
            deleteItem();
            onClick?.();
          }}
        >
          Delete {type === "node" ? "Node" : "Edge"}
        </button>
      </div>
    </div>
  );
}