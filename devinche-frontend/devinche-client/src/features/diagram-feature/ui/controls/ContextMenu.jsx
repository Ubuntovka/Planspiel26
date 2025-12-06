import { useCallback, useMemo } from "react";
import { useReactFlow } from "@xyflow/react"; 
import { v4 as uuidv4 } from 'uuid';

export default function ContextMenu({ id, type = "node", top, left, right, bottom, ...props }) {
  const { getNode, getEdges, addNodes, deleteElements } = useReactFlow();

  // Get node/edge data
  const elementData = useMemo(() => {
    if (type === "node") {
      const node = getNode(id);
      if (node) {
        // 1. width and height of the node
        return `Width: ${node.measured.width ?? 'N/A'}px, Height: ${node.measured.height ?? 'N/A'}px`;
      }
    } else if (type === "edge") {
      // Find edge using getEdges(), return source/target ID
      const edge = getEdges().find(e => e.id === id); 
      if (edge) {
        // 2. Returns the node IDs connected to the edge
        return `Source: ${edge.source}, Target: ${edge.target}`;
      }
    }
    return 'No info';
  }, [id, type, getNode, getEdges]);

  // NODE DUPLICATION
  const duplicateNode = useCallback(() => {
    if (type !== "node") return;

    const node = getNode(id);
    if (!node) return;

    // NEW NODE: created 50px right and below
    const position = { x: node.position.x + 50, y: node.position.y + 50 };
    const newId = uuidv4();
    // addNodes({ ...node, selected: false, dragging: false, id: newId, position });
    // TODO: Need to improve the logic for handling newly added nodes (Database)
    addNodes({ 
        id: newId, 
        type: node.type,
        position, 
        data: { ...node.data }, 
        style: { ...node.style },
        selected: false, 
        dragging: false 
    });
  }, [id, getNode, addNodes, type]);

  // NODE and EDGE DELETION
  const deleteItem = useCallback(() => {
    // deleteElements({ nodes: Node[], edges: Edge[] })
    if (type === "node") {
      deleteElements({ nodes: [{ id }] });
    } else if (type === "edge") {
      deleteElements({ edges: [{ id }] });
    }
  }, [id, type, deleteElements]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute bg-white border rounded shadow p-2 z-50 flex flex-col gap-2"
      {...props}
    >
      <p className="text-sm m-0">
        <small>
          {type}: {id}
          <br />
          **{elementData}**
        </small>
      </p>
      {type === "node" && (
        <button className="px-2 py-1 bg-gray-200 rounded" onClick={duplicateNode}>
          duplicate
        </button>
      )}
      <button className="px-2 py-1 bg-red-200 rounded" onClick={deleteItem}>
        delete
      </button>
    </div>
  );
}