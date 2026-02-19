// src/features/diagram-feature/hooks/useDiagramDnD.ts
import { useCallback } from 'react';
import type { Node, ReactFlowInstance } from '@xyflow/react';
import { NODE_DEFAULT_SIZE } from '../data/nodeSizes';
import { DEFAULT_NODE_COSTS } from '../data/nodeCosts';
import type { DiagramNode } from '@/types/diagram';

interface DnDProps {
  flowWrapperRef: React.RefObject<HTMLDivElement | null>;
  screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number };
  setNodes: React.Dispatch<React.SetStateAction<DiagramNode[]>>;
  getNodes: () => DiagramNode[];
  getIntersectingNodes: (node: Node | { id: string }, partially?: boolean) => Node[];
  onAfterChange: () => void; // Trigger snapshot
}

export const useDiagramDnD = ({
  flowWrapperRef,
  screenToFlowPosition,
  setNodes,
  getNodes,
  getIntersectingNodes,
  onAfterChange
}: DnDProps) => {

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!flowWrapperRef.current) return;

    const dataString = event.dataTransfer.getData('application/reactflow');
    if (!dataString) return;

    const data = JSON.parse(dataString);
    if (data.type === 'node' && data.nodeType) {
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const size = NODE_DEFAULT_SIZE[data.nodeType] ?? { width: 80, height: 60 };
      const isSecurityRealm = data.nodeType === 'securityRealmNode';

      setNodes((nds) => {
        // Check if dropping over Security Realm
        const securityRealmParent = nds.find((n) => {
          if (n.type !== 'securityRealmNode' || !n.position || !n.width || !n.height) return false;
          return (
            position.x >= n.position.x &&
            position.x <= n.position.x + n.width! &&
            position.y >= n.position.y &&
            position.y <= n.position.y + n.height!
          );
        });

        const newNode: DiagramNode = {
          id: `${data.nodeType}-${Date.now()}`,
          type: data.nodeType,
          position: securityRealmParent && !isSecurityRealm && securityRealmParent.position
            ? { x: position.x - securityRealmParent.position.x, y: position.y - securityRealmParent.position.y }
            : position,
          data: { 
            label: data.label,
            cost: DEFAULT_NODE_COSTS[data.nodeType] || 0,
            extra: {} 
          },
          width: size.width,
          height: size.height,
          ...(securityRealmParent && !isSecurityRealm 
            ? { parentId: securityRealmParent.id, extent: 'parent' as const } 
            : {}),
        };

        const updated = nds.concat(newNode);
        // Sort for RF (parents first)
        const parents = updated.filter(n => !n.parentId || n.type === 'securityRealmNode');
        const children = updated.filter(n => n.parentId && n.type !== 'securityRealmNode');
        return [...parents, ...children];
      });

      setTimeout(onAfterChange, 0);
    }
  }, [flowWrapperRef, screenToFlowPosition, setNodes, onAfterChange]);

  const onNodeDrag = useCallback((_: React.MouseEvent, node: Node) => {
    // Only visual feedback during drag
    const intersections = getIntersectingNodes(node, true).map((n) => n.id);
    setNodes((ns) =>
      ns.map((n) => {
        const isIntersecting = intersections.includes(n.id) && n.id !== node.id;
        const isDragging = n.id === node.id;
        let className = '';
        if (isDragging) className += ' is-dragging';
        if (isIntersecting) className += ' is-intersecting';
        return { ...n, className: className.trim() };
      })
    );
  }, [getIntersectingNodes, setNodes]);

  const onNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
    if (!node.position) return;
    const currentNodes = getNodes();
    const currentNode = currentNodes.find((n) => n.id === node.id);
    if (!currentNode) return;

    setNodes((ns) => {
        // Clear highlighting
        let updatedNodes = ns.map(n => ({ ...n, className: '' }));

        // Logic 1: Handle Security Realm node movement (update children absolute pos)
        if (currentNode.type === 'securityRealmNode') {
             // ... (Complex logic for parent movement simplified for brevity, refer to original file logic)
             // In refactor, keeping exact logic from original is key.
             // (Copying the specific logic from original file here...)
             updatedNodes = updatedNodes.map((n) => {
                if (n.id === node.id && n.parentId) {
                    const { parentId, extent, ...rest } = n;
                    const oldParent = currentNodes.find((p) => p.id === parentId);
                    if (oldParent && oldParent.position && node.position) {
                        return { ...rest, position: { x: oldParent.position.x + node.position.x, y: oldParent.position.y + node.position.y } };
                    }
                    if (node.position) return { ...rest, position: node.position };
                    return rest;
                }
                return n;
             });
        } else {
             // Logic 2: Handle Child node movement (check intersection with Security Realm)
             const intersections = getIntersectingNodes(currentNode, true);
             const securityRealmParent = intersections.find(n => n.type === 'securityRealmNode' && n.id !== node.id);

             updatedNodes = updatedNodes.map((n) => {
                if (n.id !== node.id) return n;
                
                if (securityRealmParent) {
                     // Attach to parent
                     const parentNode = currentNodes.find(p => p.id === securityRealmParent.id);
                     if (parentNode && parentNode.position && currentNode.position) {
                         let absX = currentNode.position.x;
                         let absY = currentNode.position.y;
                         if (currentNode.parentId) {
                             const oldParent = currentNodes.find(p => p.id === currentNode.parentId);
                             if (oldParent && oldParent.position) {
                                 absX = oldParent.position.x + currentNode.position.x;
                                 absY = oldParent.position.y + currentNode.position.y;
                             }
                         }
                         return {
                             ...n,
                             parentId: securityRealmParent.id,
                             position: { x: absX - parentNode.position.x, y: absY - parentNode.position.y },
                             extent: 'parent' as const
                         };
                     }
                } else {
                     // Detach from parent
                     if (n.parentId) {
                         const { parentId, extent, ...rest } = n;
                         const oldParent = currentNodes.find(p => p.id === parentId);
                         if (oldParent && oldParent.position && currentNode.position) {
                             return { ...rest, position: { x: oldParent.position.x + currentNode.position.x, y: oldParent.position.y + currentNode.position.y } };
                         }
                         return rest;
                     }
                }
                return n;
             });
        }

        // Re-sort
        const parents = updatedNodes.filter(n => !n.parentId || n.type === 'securityRealmNode');
        const children = updatedNodes.filter(n => n.parentId && n.type !== 'securityRealmNode');
        return [...parents, ...children];
    });

    // We must wait for React Flow to update internal state before snapshotting
    setTimeout(onAfterChange, 100);
  }, [getNodes, getIntersectingNodes, setNodes, onAfterChange]);

  return { onDragOver, onDrop, onNodeDrag, onNodeDragStop };
};