// src/features/diagram-feature/hooks/useDiagramDnD.ts
import { useCallback } from 'react';
import type { Node } from '@xyflow/react';
import { NODE_DEFAULT_SIZE } from '../data/nodeSizes';
import { DEFAULT_NODE_COSTS } from '../data/nodeCosts';
import type { DiagramNode } from '@/types/diagram';

interface DnDProps {
  flowWrapperRef: React.RefObject<HTMLDivElement | null>;
  screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number };
  setNodes: React.Dispatch<React.SetStateAction<DiagramNode[]>>;
  getNodes: () => DiagramNode[];
  getIntersectingNodes: (node: Node | { id: string }, partially?: boolean) => Node[];
  onAfterChange: () => void;
}

export const useDiagramDnD = ({
  flowWrapperRef,
  screenToFlowPosition,
  setNodes,
  getNodes,
  getIntersectingNodes,
  onAfterChange
}: DnDProps) => {

  const handleAddNode = useCallback((data: any, position: { x: number; y: number }) => {
    const size = NODE_DEFAULT_SIZE[data.nodeType] ?? { width: 80, height: 60 };
    const isSecurityRealm = data.nodeType === 'securityRealmNode';

    setNodes((nds) => {
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
      const parents = updated.filter(n => !n.parentId || n.type === 'securityRealmNode');
      const children = updated.filter(n => n.parentId && n.type !== 'securityRealmNode');
      return [...parents, ...children];
    });

    setTimeout(onAfterChange, 0);
  }, [setNodes, onAfterChange]);

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
      handleAddNode(data, position);
    }
  }, [flowWrapperRef, screenToFlowPosition, handleAddNode]);

  const onNodeDrag = useCallback((_: React.MouseEvent, node: Node) => {
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
        let updatedNodes = ns.map(n => ({ ...n, className: '' }));

        if (currentNode.type === 'securityRealmNode') {
            updatedNodes = updatedNodes.map((n) => {
                if (n.id === node.id && n.parentId) {
                    const { parentId, extent, ...rest } = n;
                    const oldParent = currentNodes.find((p) => p.id === parentId);
                    if (oldParent && oldParent.position && node.position) {
                        return { ...rest, position: { x: oldParent.position.x + node.position.x, y: oldParent.position.y + node.position.y } };
                    }
                    return node.position ? { ...rest, position: node.position } : rest;
                }
                return n;
            });
        } else {
            const intersections = getIntersectingNodes(currentNode, true);
            const securityRealmParent = intersections.find(n => n.type === 'securityRealmNode' && n.id !== node.id);

            updatedNodes = updatedNodes.map((n) => {
                if (n.id !== node.id) return n;
                
                if (securityRealmParent) {
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
                } else if (n.parentId) {
                    const { parentId, extent, ...rest } = n;
                    const oldParent = currentNodes.find(p => p.id === parentId);
                    if (oldParent && oldParent.position && currentNode.position) {
                        return { ...rest, position: { x: oldParent.position.x + currentNode.position.x, y: oldParent.position.y + currentNode.position.y } };
                    }
                    return rest;
                }
                return n;
            });
        }

        const parents = updatedNodes.filter(n => !n.parentId || n.type === 'securityRealmNode');
        const children = updatedNodes.filter(n => n.parentId && n.type !== 'securityRealmNode');
        return [...parents, ...children];
    });

    setTimeout(onAfterChange, 100);
  }, [getNodes, getIntersectingNodes, setNodes, onAfterChange]);

  return { onDragOver, onDrop, onNodeDrag, onNodeDragStop, addNode: handleAddNode };
};