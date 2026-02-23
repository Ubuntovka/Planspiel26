import { useState, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { ContextMenuState } from '@/types/diagram';

export const useDiagramMenu = (flowWrapperRef: React.RefObject<HTMLDivElement | null>) => {
  const [menu, setMenu] = useState<ContextMenuState | null>(null);

  const closeMenu = useCallback(() => {
    setMenu(null);
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setMenu({
      id: node.id,
      type: 'node',
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }, []);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setMenu({
      id: edge.id,
      type: 'edge',
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }, []);

  const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
    event.preventDefault();
    const clientX = 'clientX' in event ? event.clientX : (event as any).clientX;
    const clientY = 'clientY' in event ? event.clientY : (event as any).clientY;

    setMenu({
      id: 'pane-menu',
      type: 'canvas',
      clientX,
      clientY,
    });
  }, []);

  return {
    menu,
    setMenu,
    closeMenu,
    onNodeContextMenu,
    onEdgeContextMenu,
    onPaneContextMenu,
  };
};