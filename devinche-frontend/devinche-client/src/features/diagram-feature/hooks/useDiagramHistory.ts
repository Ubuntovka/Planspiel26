// src/features/diagram-feature/hooks/useDiagramHistory.ts
import { useState, useRef, useCallback } from 'react';
import type { ReactFlowInstance, ReactFlowJsonObject, Viewport } from '@xyflow/react';
import type { DiagramNode, DiagramEdge } from '@/types/diagram';

type Snapshot = ReactFlowJsonObject<DiagramNode, DiagramEdge>;

export const useDiagramHistory = (
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  rfInstance: ReactFlowInstance<DiagramNode, DiagramEdge> | null,
  setNodes: (nodes: DiagramNode[]) => void,
  setEdges: (edges: DiagramEdge[]) => void
) => {
  const backendHistoryRef = useRef<Snapshot[]>([]);
  const backendPtrRef = useRef(0);
  const restoringRef = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Helper: Normalize for comparison
  const normalizeSnapshot = (snap: Snapshot) => {
    const nodes = [...(snap.nodes ?? [])].sort((a: any, b: any) => String(a.id).localeCompare(String(b.id)));
    const edges = [...(snap.edges ?? [])].sort((a: any, b: any) => String(a.id).localeCompare(String(b.id)));
    const vp = snap.viewport;
    const viewport = vp ? { x: vp.x ?? 0, y: vp.y ?? 0, zoom: vp.zoom ?? 1 } : undefined;
    return { nodes, edges, viewport };
  };

  const snapshotsEqual = (a?: Snapshot, b?: Snapshot) => {
    if (!a || !b) return false;
    try {
      return JSON.stringify(normalizeSnapshot(a)) === JSON.stringify(normalizeSnapshot(b));
    } catch {
      return false;
    }
  };

  const takeSnapshot = useCallback((overrideNodes?: DiagramNode[], overrideEdges?: DiagramEdge[]): Snapshot => {
    if (rfInstance) {
      const snapshot = rfInstance.toObject();
      if (overrideNodes || overrideEdges) {
        return {
          ...snapshot,
          nodes: overrideNodes ?? snapshot.nodes,
          edges: overrideEdges ?? snapshot.edges,
        };
      }
      return snapshot;
    }
    return { nodes: overrideNodes ?? nodes, edges: overrideEdges ?? edges } as unknown as Snapshot;
  }, [rfInstance, nodes, edges]);

  const updateUndoRedoFlags = useCallback((hist?: Snapshot[], ptrIdx?: number) => {
    const history = hist ?? backendHistoryRef.current;
    const ptr = ptrIdx ?? backendPtrRef.current;
    setCanUndo(ptr > 0);
    setCanRedo(ptr < history.length - 1);
  }, []);

  const pushSnapshot = useCallback((overrideNodes?: DiagramNode[], overrideEdges?: DiagramEdge[]) => {
    if (restoringRef.current) return;
    
    const current = takeSnapshot(overrideNodes, overrideEdges);
    let history = backendHistoryRef.current;
    let ptr = backendPtrRef.current;

    if (ptr < history.length - 1) {
      history = history.slice(0, ptr + 1);
    }

    const last = history[history.length - 1];
    if (last && snapshotsEqual(last, current)) {
      updateUndoRedoFlags(history, ptr);
      return;
    }

    history.push(current);
    // Cap history size
    if (history.length > 50) { // Increased from 3 for better UX, originally 3
      history = history.slice(history.length - 50);
    }
    
    ptr = history.length - 1;
    backendHistoryRef.current = history;
    backendPtrRef.current = ptr;
    updateUndoRedoFlags(history, ptr);
  }, [takeSnapshot, updateUndoRedoFlags]);

  const applySnapshot = useCallback((snap: Snapshot | undefined) => {
    if (!snap) return;
    restoringRef.current = true;
    
    const nextNodes = (Array.isArray(snap.nodes) ? snap.nodes : []) as DiagramNode[];
    const nextEdges = (Array.isArray(snap.edges) ? snap.edges : []) as DiagramEdge[];
    
    // Simple validation
    const validNodes = nextNodes.filter((n) => n && n.id && n.position);
    const validEdges = nextEdges.filter((e) => e && e.id && e.source && e.target);

    setNodes(validNodes);
    setEdges(validEdges);

    if (rfInstance && snap.viewport) {
      const { x = 0, y = 0, zoom = 1 } = snap.viewport;
      rfInstance.setViewport({ x, y, zoom });
    }
    
    setTimeout(() => { restoringRef.current = false; }, 0);
  }, [rfInstance, setNodes, setEdges]);

  const undo = useCallback(() => {
    let ptr = backendPtrRef.current;
    if (ptr <= 0) return;
    
    ptr -= 1;
    backendPtrRef.current = ptr;
    applySnapshot(backendHistoryRef.current[ptr]);
    updateUndoRedoFlags();
  }, [applySnapshot, updateUndoRedoFlags]);

  const redo = useCallback(() => {
    let ptr = backendPtrRef.current;
    const history = backendHistoryRef.current;
    if (ptr >= history.length - 1) return;
    
    ptr += 1;
    backendPtrRef.current = ptr;
    applySnapshot(history[ptr]);
    updateUndoRedoFlags();
  }, [applySnapshot, updateUndoRedoFlags]);

  // Initializing history manually
  const initHistory = useCallback((snap: Snapshot) => {
      backendHistoryRef.current = [snap];
      backendPtrRef.current = 0;
      updateUndoRedoFlags([snap], 0);
  }, [updateUndoRedoFlags]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    pushSnapshot,
    takeSnapshot,
    applySnapshot,
    initHistory,
    restoringRef
  };
};