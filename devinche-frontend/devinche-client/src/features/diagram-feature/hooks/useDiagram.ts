// src/features/diagram-feature/hooks/useDiagram.ts
import { useCallback, useEffect } from "react";
import { addEdge, type Connection, MarkerType, type Viewport } from "@xyflow/react";
import type { DiagramNode, DiagramEdge, UseDiagramReturn } from "@/types/diagram";

import { useDiagramState } from "./useDiagramState";
import { useDiagramHistory } from "./useDiagramHistory";
import { useDiagramPersistence } from "./useDiagramPersistence";
import { useDiagramDnD } from "./useDiagramDnD";
import { useDiagramValidation } from "./useDiagramValidation";
import { useDiagramMenu } from "./useDiagramMenu";

export interface UseDiagramOptions {
  diagramId?: string | null;
  getToken?: () => string | null;
}

export const useDiagram = (options?: UseDiagramOptions): UseDiagramReturn => {
  const { diagramId, getToken } = options || {};
  const useBackend = !!getToken;

  // 1. Core State
  const state = useDiagramState();
  const { 
    nodes, setNodes, edges, setEdges, rfInstance, 
    selectedNode, setSelectedNode, selectedEdge, setSelectedEdge,
    selectedEdgeType, setSelectedEdgeType, flowWrapperRef, onNodesChange, onEdgesChange
  } = state;

  // 2. History & Undo/Redo
  const history = useDiagramHistory(nodes, edges, rfInstance, setNodes, setEdges);
  const { pushSnapshot, takeSnapshot, initHistory } = history;

  // 3. Persistence (API/Storage)
  const persistence = useDiagramPersistence({
    useBackend,
    getToken,
    diagramId,
    takeSnapshot,
    applySnapshot: history.applySnapshot,
    initHistory,
    setNodes,
    setEdges,
  });
  // Helper: Trigger save/history on changes
  const handleChange = useCallback(() => {
    const currentSnap = takeSnapshot(); // Get latest
    pushSnapshot(); // Push to history
    persistence.markDirty(); // Mark for autosave
  }, [pushSnapshot, takeSnapshot, persistence]); // eslint-disable-line react-hooks/exhaustive-deps


  // Apply pending viewport from persistence if exists (on init)
  useEffect(() => {
    // Only when persistence.pendingViewportRef.current exist
    if (state.rfInstance && persistence.pendingViewportRef.current) {
        const { x, y, zoom } = persistence.pendingViewportRef.current;
        state.rfInstance.setViewport({ x, y, zoom });
        
        persistence.clearPendingViewport(); 
    }
  }, [state.rfInstance, persistence.pendingViewportRef, persistence.clearPendingViewport]);

  // 4. Validation
  const { validate } = useDiagramValidation(state.getNodes, state.getEdges, setNodes, setEdges);

  // 5. Interactions (Connect, Updates)
  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) return;
    const newEdge: DiagramEdge = {
      ...params,
      id: `${params.source}-${params.target}-${Date.now()}`,
      type: selectedEdgeType,
      source: params.source,
      target: params.target,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#808080' },
      data: { hasError: false }
    };
    setEdges((eds) => addEdge(newEdge, eds) as DiagramEdge[]);
    validate(newEdge);
    setTimeout(handleChange, 0);
  }, [selectedEdgeType, setEdges, validate, handleChange]);

  const onUpdateNode = useCallback((nodeId: string, data: Partial<import('@/types/diagram').NodeData>) => {
    setNodes((nds) => {
      const updated = nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n);
      setSelectedNode(current => current?.id === nodeId ? updated.find(n => n.id === nodeId) || null : current);
      setTimeout(handleChange, 0);
      return updated;
    });
  }, [setNodes, setSelectedNode, handleChange]);

  const onUpdateEdge = useCallback((edgeId: string, data: any) => {
    setEdges(eds => eds.map(e => e.id === edgeId ? { ...e, ...data } : e));
    setSelectedEdge(curr => curr?.id === edgeId ? { ...curr, ...data } : curr);
  }, [setEdges, setSelectedEdge]);

  // Wrappers to detect "removal" changes for snapshotting
  const onNodesChangeWrapped = useCallback((changes: any[]) => {
      onNodesChange(changes);
      if (changes.some(c => c.type === 'remove')) setTimeout(handleChange, 0);
  }, [onNodesChange, handleChange]);

  const onEdgesChangeWrapped = useCallback((changes: any[]) => {
      onEdgesChange(changes);
      if (changes.some(c => c.type === 'remove')) setTimeout(handleChange, 0);
  }, [onEdgesChange, handleChange]);

  const onMoveEnd = useCallback(() => {
      // Viewport change end -> save to storage (but maybe not push history to avoid spam?)
      persistence.markDirty();
  }, [persistence]);

  // 6. Drag & Drop
  const dnd = useDiagramDnD({
    flowWrapperRef,
    screenToFlowPosition: state.screenToFlowPosition,
    setNodes,
    getNodes: state.getNodes,
    getIntersectingNodes: state.getIntersectingNodes,
    onAfterChange: handleChange
  });

  // 7. Context Menu
  const menu = useDiagramMenu(flowWrapperRef);
  
  const onPaneClick = useCallback(() => {
    menu.closeMenu();
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [menu, setSelectedNode, setSelectedEdge]);

  const openProperties = useCallback((id: string, type?: string) => {
    if (type === 'edge') {
        const edge = edges.find(e => e.id === id);
        if (edge) { setSelectedEdge(edge); setSelectedNode(null); }
    } else {
        const node = nodes.find(n => n.id === id);
        if (node) { setSelectedNode(node); setSelectedEdge(null); }
    }
  }, [nodes, edges, setSelectedEdge, setSelectedNode]);

  // 8. Exports
  const exportToJson = useCallback(() => rfInstance ? JSON.stringify(rfInstance.toObject(), null, 2) : null, [rfInstance]);
  
  const importFromJson = useCallback((json: string) => {
    try {
        const obj = JSON.parse(json);
        setNodes(obj.nodes ?? []);
        setEdges(obj.edges ?? []);
        if (rfInstance && obj.viewport) rfInstance.setViewport(obj.viewport);
        setTimeout(handleChange, 0);
    } catch (e) { console.error('Import failed', e); }
  }, [rfInstance, setNodes, setEdges, handleChange]);

  const resetCanvas = useCallback(() => {
    setNodes([]); setEdges([]);
    if (rfInstance) rfInstance.setViewport({ x: 0, y: 0, zoom: 1 });
    if (typeof window !== 'undefined') {
        localStorage.removeItem('diagram.flow');
        localStorage.removeItem('diagram.flow.ptr');
    }
    setTimeout(() => {
        const snap = takeSnapshot([], []);
        initHistory(snap);
    }, 0);
  }, [rfInstance, setNodes, setEdges, takeSnapshot, initHistory]);

  const selectAllNodes = useCallback(() => {
      setNodes(nds => nds.map(n => ({ ...n, selected: true })));
  }, [setNodes]);

  return {
    // State
    nodes,
    edges,
    flowWrapperRef,
    isDirty: persistence.isDirty,
    diagramName: persistence.diagramName,
    accessLevel: persistence.accessLevel,
    selectedNode,
    selectedEdge,
    selectedEdgeType,
    setSelectedEdgeType,
    menu: menu.menu,

    // Handlers
    onNodesChange: onNodesChangeWrapped,
    onEdgesChange: onEdgesChangeWrapped,
    onConnect,
    onMoveEnd,
    onNodeClick: useCallback(() => {}, []), // No-op as per original
    onPaneClick,
    
    // Interactions
    onNodeContextMenu: menu.onNodeContextMenu,
    onEdgeContextMenu: menu.onEdgeContextMenu,
    onPaneContextMenu: menu.onPaneContextMenu,
    closeMenu: menu.closeMenu,
    
    // DnD
    onDragOver: dnd.onDragOver,
    onDrop: dnd.onDrop,
    onNodeDrag: dnd.onNodeDrag,
    onNodeDragStop: dnd.onNodeDragStop,

    // Actions
    resetCanvas,
    selectAllNodes,
    openProperties,
    onUpdateNode,
    onUpdateEdge,
    onRenameDiagram: persistence.onRenameDiagram,
    saveDiagram: persistence.saveDiagram,
    saveDiagramAs: persistence.saveDiagramAs,

    // History
    onUndo: history.undo,
    onRedo: history.redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,

    // IO
    onFlowInit: state.onFlowInit,
    exportToJson,
    importFromJson,
    setNodes,
    setEdges
  };
};