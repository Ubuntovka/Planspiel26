import type { Node, Edge, Connection, NodeChange, EdgeChange, ReactFlowInstance } from '@xyflow/react';
import type React from 'react';

// Extended node type with our custom data structure
export interface DiagramNode extends Node {
  type: string;
  data: NodeData;
}

// Node data structure
export interface NodeData {
  label?: string | null;
  [key: string]: any;
}

// Extended edge type
export interface DiagramEdge extends Edge {
  type?: string;
}

// Context menu state
export interface ContextMenuState {
  id: string;
  type?: 'node' | 'edge';
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

// Hook return type
export interface UseDiagramReturn {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  menu: ContextMenuState | null;
  flowWrapperRef: React.RefObject<HTMLDivElement>;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  onNodeContextMenu: (event: React.MouseEvent, node: Node) => void;
  onEdgeContextMenu: (event: React.MouseEvent, edge: Edge) => void;
  onPaneClick: () => void;
  closeMenu: () => void,
  onFlowInit: (instance: ReactFlowInstance<DiagramNode, DiagramEdge>) => void;
  exportToJson: () => string | null;
  exportToRdf: () => string;
  importFromJson: (json: string) => void;
  setNodes: React.Dispatch<React.SetStateAction<DiagramNode[]>>;
}

// Node component props
export interface NodeProps {
  id: string;
  data: NodeData;
  selected?: boolean;
  dragging?: boolean;
  position?: { x: number; y: number };
  [key: string]: any;
}

// Edge component props
export interface EdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  source: string;
  target: string;
  [key: string]: any;
}


export interface SecurityRealmData {
  label?: string
  [key: string]: any;
}
