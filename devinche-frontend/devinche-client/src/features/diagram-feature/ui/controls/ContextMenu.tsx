import { useCallback, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type { ContextMenuState } from "@/types/diagram";

import {
  SquareRounded, // Node icon
  Link, // Edge icon
  AspectRatio, // Size/Dimensions icon
  OutlinedFlag, // Source icon
  LocationOnOutlined, // Target icon
  Refresh, // Reset icon
} from "@mui/icons-material";

interface ContextMenuProps extends ContextMenuState {
  onClick?: () => void;
  resetCanvas?: () => void;
}

const IconNode = () => <SquareRounded fontSize="small" />;
const IconEdge = () => <Link fontSize="small" />;
const IconDimensions = () => <AspectRatio fontSize="small" />;
const IconSource = () => <OutlinedFlag fontSize="small" />;
const IconTarget = () => <LocationOnOutlined fontSize="small" />;
const IconPane = () => <Refresh fontSize="small" />; 

export default function ContextMenu({
  id,
  type,
  top,
  left,
  right,
  bottom,
  onClick,
  resetCanvas, 
  ...props
}: ContextMenuProps) {
  const { getNode, getEdges, addNodes, deleteElements } = useReactFlow();

  const elementType = type; 
  const isCanvasMenu = elementType === "canvas";

  // Get node/edge data
  const elementData = useMemo(() => {
    const data = [];
    if (elementType === "node") { 
      const node = getNode(id);
      if (node) {
        data.push({
          icon: <IconDimensions />,
          label: "Size",
          value: `${node.measured?.width ?? "N/A"}x${
            node.measured?.height ?? "N/A"
          }`,
          unit: "px",
        });
      }
    } else if (elementType === "edge") { 
      const edge = getEdges().find((e) => e.id === id);
      if (edge) {
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
  }, [id, elementType, getNode, getEdges]);

  // NODE DUPLICATION
  const duplicateNode = useCallback(() => {
    if (elementType !== "node") return; 

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
  }, [id, getNode, addNodes, elementType]); 

  // NODE and EDGE DELETION
  const deleteItem = useCallback(() => {
    if (elementType === "node") { 
      deleteElements({ nodes: [{ id }] });
    } else if (elementType === "edge") { 
      deleteElements({ edges: [{ id }] });
    }
  }, [id, elementType, deleteElements]); 

  // CANVAS RESET
  const handleResetCanvas = useCallback(() => {
    resetCanvas?.(); 
  }, [resetCanvas]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute bg-white border border-gray-300 rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-2 min-w-[200px]"
      {...props}
    >
      {/* --- Info section --- */}
      <div className="flex items-center space-x-2 border-b pb-2 mb-2 border-gray-200">
        <span className="text-blue-500 w-4 h-4 flex items-center justify-center">
          {isCanvasMenu ? <IconPane /> : elementType === "node" ? <IconNode /> : <IconEdge />}
        </span>
        <h3 className="text-sm font-semibold text-gray-800 capitalize m-0 p-0">
          {isCanvasMenu ? "Canvas" : elementType}
        </h3>
      </div>

      {/* ID (hidden when canvas type) */}
      {!isCanvasMenu && (
        <div className="text-xs text-gray-500 flex flex-col gap-1">
          <span className="font-medium">ID:</span>
          <span className="truncate max-w-full font-mono bg-gray-50 text-gray-700 px-2 py-0.5 rounded">
            {id}
          </span>
        </div>
      )}

      {/* dynamic data (hidden when canvas type) */}
      {elementData.length > 0 && !isCanvasMenu && (
        <div className="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
          {elementData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-xs text-gray-600"
            >
              <span className="flex items-center space-x-1 font-medium">
                <span className="text-gray-500 w-4 h-4 flex items-center justify-center">
                  {item.icon}
                </span>
                <span>{item.label}:</span>
              </span>
              <span className="font-semibold text-gray-800">
                {item.value}
                {item.unit && (
                  <span className="ml-1 text-gray-500 font-normal">
                    {item.unit}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-gray-200 mt-1 flex flex-col gap-1">
        {/* Reset Canvas button (show only when canvas type) */}
        {isCanvasMenu && (
          <button
            className="flex items-center justify-center px-3 py-1.5 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-150 hover:cursor-pointer font-medium"
            onClick={() => {
              handleResetCanvas();
              onClick?.();
            }}
          >
            <IconPane />
            <span className="ml-1">Reset Canvas</span>
          </button>
        )}

        {/* Duplicate Node button (show only when Node type) */}
        {elementType === "node" && (
          <button
            className="flex items-center justify-center px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-150 hover:cursor-pointer font-medium"
            onClick={() => {
              duplicateNode();
              onClick?.();
            }}
          >
            Duplicate Node
          </button>
        )}

        {/* Delete Node/Edge button (show only when Canvas type) */}
        {!isCanvasMenu && (
          <button
            className="flex items-center justify-center px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition duration-150 hover:cursor-pointer font-medium"
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