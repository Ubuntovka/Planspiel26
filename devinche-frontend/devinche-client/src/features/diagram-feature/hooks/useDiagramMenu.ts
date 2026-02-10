import { useState, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { ContextMenuState } from '@/types/diagram';

export const useDiagramMenu = (flowWrapperRef: React.RefObject<HTMLDivElement | null>) => {
  const [menu, setMenu] = useState<ContextMenuState | null>(null);

  const calculateMenuPosition = useCallback((event: React.MouseEvent | MouseEvent) => {
    if (!flowWrapperRef.current) return null;

    const pane = flowWrapperRef.current.getBoundingClientRect();
    
    const clientX = 'clientX' in event ? event.clientX : (event as any).clientX;
    const clientY = 'clientY' in event ? event.clientY : (event as any).clientY;

    return {
      top: clientY < pane.height - 200 ? clientY : undefined,
      left: clientX < pane.width - 200 ? clientX : undefined,
      right: clientX >= pane.width - 200 ? pane.width - clientX : undefined,
      bottom: clientY >= pane.height - 200 ? pane.height - clientY : undefined,
      clientX, 
      clientY
    };
  }, [flowWrapperRef]);

  const closeMenu = useCallback(() => {
    setMenu(null);
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    const pos = calculateMenuPosition(event);
    if (pos) {
      setMenu({
        id: node.id,
        type: 'node',
        top: pos.top,
        left: pos.left,
        right: pos.right,
        bottom: pos.bottom,
      });
    }
  }, [calculateMenuPosition]);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    const pos = calculateMenuPosition(event);
    if (pos) {
      setMenu({
        id: edge.id,
        type: 'edge',
        top: pos.top,
        left: pos.left,
        right: pos.right,
        bottom: pos.bottom,
      });
    }
  }, [calculateMenuPosition]);

  const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
    event.preventDefault();
    const pos = calculateMenuPosition(event);
    if (pos) {
      setMenu({
        id: 'pane-menu',
        type: 'canvas',
        top: pos.top,
        left: pos.left,
        right: pos.right,
        bottom: pos.bottom,
        clientX: pos.clientX,
        clientY: pos.clientY,
      });
    }
  }, [calculateMenuPosition]);

  return {
    menu,
    setMenu,
    closeMenu,
    onNodeContextMenu,
    onEdgeContextMenu,
    onPaneContextMenu,
  };
};