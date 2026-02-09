// src/features/diagram-feature/hooks/useDiagramState.ts
import { useState, useRef, useCallback } from 'react';
import {
  useReactFlow,
  type ReactFlowInstance,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { initialNodes, initialEdges } from '../data/initialElements';
import type { DiagramNode, DiagramEdge } from '@/types/diagram';

export const useDiagramState = () => {
  const [nodes, setNodes] = useState<DiagramNode[]>(initialNodes);
  const [edges, setEdges] = useState<DiagramEdge[]>(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<DiagramNode, DiagramEdge> | null>(null);
  
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<DiagramEdge | null>(null);
  const [selectedEdgeType, setSelectedEdgeType] = useState<string>('invocation');

  const flowWrapperRef = useRef<HTMLDivElement>(null);

  // React Flow hooks wrapping
  const { screenToFlowPosition, getIntersectingNodes, getNodes, getEdges } = useReactFlow();

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds) as DiagramNode[]);
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds) as DiagramEdge[]);
  }, []);

  const onFlowInit = useCallback((instance: ReactFlowInstance<DiagramNode, DiagramEdge>) => {
    setRfInstance(instance);
  }, []);

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    rfInstance,
    setRfInstance,
    onFlowInit,
    selectedNode,
    setSelectedNode,
    selectedEdge,
    setSelectedEdge,
    selectedEdgeType,
    setSelectedEdgeType,
    flowWrapperRef,
    // RF Helpers
    screenToFlowPosition,
    getIntersectingNodes,
    getNodes,
    getEdges
  };
};