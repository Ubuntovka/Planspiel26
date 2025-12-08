// import { useCallback, useMemo } from "react";
// import { useReactFlow } from "@xyflow/react";
// import { v4 as uuidv4 } from "uuid";
// import type { ContextMenuState } from "@/types/diagram";

// interface ContextMenuProps extends ContextMenuState {
//   onClick?: () => void;
// }

// export default function ContextMenu({
//   id,
//   type = "node",
//   top,
//   left,
//   right,
//   bottom,
//   onClick,
//   ...props
// }: ContextMenuProps) {
//   const { getNode, getEdges, addNodes, deleteElements } = useReactFlow();

//   // Get node/edge data
//   const elementData = useMemo(() => {
//     if (type === "node") {
//       const node = getNode(id);
//       if (node) {
//         // 1. width and height of the node
//         return `Width: ${node.measured?.width ?? "N/A"}px, Height: ${
//           node.measured?.height ?? "N/A"
//         }px`;
//       }
//     } else if (type === "edge") {
//       // Find edge using getEdges(), return source/target ID
//       const edge = getEdges().find((e) => e.id === id);
//       if (edge) {
//         // 2. Returns the node IDs connected to the edge
//         return `Source: ${edge.source}, Target: ${edge.target}`;
//       }
//     }
//     return "No info";
//   }, [id, type, getNode, getEdges]);

//   // NODE DUPLICATION
//   const duplicateNode = useCallback(() => {
//     if (type !== "node") return;

//     const node = getNode(id);
//     if (!node) return;

//     // NEW NODE: created 50px right and below
//     const position = { x: node.position.x + 50, y: node.position.y + 50 };
//     const newId = uuidv4();
//     // addNodes({ ...node, selected: false, dragging: false, id: newId, position });
//     // TODO: Need to improve the logic for handling newly added nodes (Database)
//     addNodes({
//       id: newId,
//       type: node.type,
//       position,
//       data: { ...node.data },
//       style: { ...node.style },
//       selected: false,
//       dragging: false,
//     });
//   }, [id, getNode, addNodes, type]);

//   // NODE and EDGE DELETION
//   const deleteItem = useCallback(() => {
//     // deleteElements({ nodes: Node[], edges: Edge[] })
//     if (type === "node") {
//       deleteElements({ nodes: [{ id }] });
//     } else if (type === "edge") {
//       deleteElements({ edges: [{ id }] });
//     }
//   }, [id, type, deleteElements]);

//   return (
//     <div
//       style={{ top, left, right, bottom }}
//       className="absolute bg-white/95 border border-gray-200 rounded-lg shadow-lg p-3 z-50 flex flex-col gap-2 backdrop-blur-sm"
//       {...props}
//     >
//       <p className="text-sm m-0 border-b pb-2 border-gray-200">
//         <small className="text-gray-600">
//           {type} id: {id}
//           <br />
//           <span className="font-semibold text-gray-800">{elementData}</span>
//         </small>
//       </p>
//       {type === "node" && (
//         <button
//           className="px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition duration-150 hover:cursor-pointer"
//           onClick={() => {
//             duplicateNode();
//             onClick?.();
//           }}
//         >
//           Duplicate Node
//         </button>
//       )}
//       <button
//         className="px-3 py-1 text-sm text-red-700 bg-red-100 hover:bg-red-200 rounded transition duration-150 hover:cursor-pointer"
//         onClick={() => {
//           deleteItem();
//           onClick?.();
//         }}
//       >
//         Delete {type === "node" ? "Node" : "Edge"}
//       </button>
//     </div>
//   );
// }






// npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
// https://mui.com/material-ui/material-icons/
import { useCallback, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type { ContextMenuState } from "@/types/diagram";

// --- MUI Icons Import ---
import {
  SquareRounded,      // Node icon
  Link,               // Edge icon
  AspectRatio,        // Size/Dimensions icon
  OutlinedFlag,       // Source icon
  LocationOnOutlined, // Target icon
} from "@mui/icons-material";
// ------------------------

interface ContextMenuProps extends ContextMenuState {
  onClick?: () => void;
}

// 아이콘 플레이스홀더 함수를 MUI 컴포넌트로 대체합니다.
// 모든 아이콘은 'small' 사이즈로 설정하여 메뉴와 조화를 이루도록 합니다.
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
      style={{ top, left, right, bottom }}
      className="absolute bg-white border border-gray-300 rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-2 min-w-[200px]"
      {...props}
    >
      {/* --- Info section --- */}
      <div className="flex items-center space-x-2 border-b pb-2 mb-2 border-gray-200">
        <span className="text-blue-500 w-4 h-4 flex items-center justify-center">
          {type === "node" ? <IconNode /> : <IconEdge />}
        </span>
        <h3 className="text-sm font-semibold text-gray-800 capitalize m-0 p-0">
          {type}
        </h3>
      </div>
      
      {/* ID  */}
      <div className="text-xs text-gray-500 flex flex-col gap-1">
        <span className="font-medium">ID:</span>
        <span className="truncate max-w-full font-mono bg-gray-50 text-gray-700 px-2 py-0.5 rounded">
          {id}
        </span>
      </div>

      {/* dynamic data */}
      {elementData.length > 0 && (
        <div className="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
          {elementData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs text-gray-600">
              <span className="flex items-center space-x-1 font-medium">
                <span className="text-gray-500 w-4 h-4 flex items-center justify-center">
                  {item.icon}
                </span>
                <span>{item.label}:</span>
              </span>
              <span className="font-semibold text-gray-800">
                {item.value}
                {item.unit && <span className="ml-1 text-gray-500 font-normal">{item.unit}</span>}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <div className="pt-2 border-t border-gray-200 mt-1 flex flex-col gap-1">
        {type === "node" && (
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
        <button
          className="flex items-center justify-center px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition duration-150 hover:cursor-pointer font-medium"
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