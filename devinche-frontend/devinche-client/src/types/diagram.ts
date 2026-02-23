import type { Node, Edge, Connection, NodeChange, EdgeChange, ReactFlowInstance } from '@xyflow/react';
import type React from 'react';

export interface DiagramState {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

// Extended node type with our custom data structure
export interface DiagramNode extends Node {
  type?: string;
  data: NodeData;
}

// Node data structure
export interface NodeData {
  label?: string | null;
  name?: string;
  type?: string;
  cost?: number | string;
  [key: string]: any;
}

// Extended edge type
export interface DiagramEdge extends Edge {
  type?: string;
}

// Context menu state
export interface ContextMenuState {
  id: string;
  type: 'node' | 'edge' | 'canvas';
  /** Pane right-click position (for "Add comment here") */
  clientX?: number;
  clientY?: number;
  resetCanvas?: () => void;
}

// Hook return type
export interface UseDiagramReturn {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  menu: ContextMenuState | null;
  flowWrapperRef: React.RefObject<HTMLDivElement | null>;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  onNodeContextMenu: (event: React.MouseEvent, node: Node) => void;
  onEdgeContextMenu: (event: React.MouseEvent, edge: Edge) => void;
  onPaneContextMenu: (event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => void;
  resetCanvas: () => void;
  selectAllNodes: () => void;
  onPaneClick: () => void;
  closeMenu: () => void;
  openProperties: (id: string, type?: string) => void;
  onFlowInit: (instance: ReactFlowInstance<DiagramNode, DiagramEdge>) => void;
  exportToJson: () => string | null;
  importFromJson: (json: string) => void;
  setNodes: React.Dispatch<React.SetStateAction<DiagramNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<DiagramEdge[]>>;
  selectedEdgeType: string;
  setSelectedEdgeType: React.Dispatch<React.SetStateAction<string>>;
  onMoveEnd: (event: any, viewport: { x: number; y: number; zoom: number }) => void;
  addNode: (data: any, position: { x: number; y: number }) => void;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onNodeDrag: (event: React.MouseEvent, node: Node) => void;
  onNodeDragStop: (event: React.MouseEvent, node: Node) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedNode: DiagramNode | null;
  selectedEdge: DiagramEdge | null;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onUpdateNode: (nodeId: string, data: Partial<NodeData>) => void;
  onUpdateEdge: (edgeId: string, data: any) => void;
  diagramName?: string | null;
  onRenameDiagram?: (name: string) => Promise<void>;
  saveDiagram?: () => Promise<boolean>;
  saveDiagramAs?: (name: string) => Promise<string | null>;
  /** Autosave/dirty state */
  isDirty?: boolean;
  /** 'owner' | 'editor' | 'viewer' when loaded from backend; undefined when not loaded or local. */
  accessLevel?: DiagramAccessLevel;
}

export interface UseDiagramOptions {
    diagramId?: string | null;
    getToken?: () => string | null;
}

export type DiagramAccessLevel = 'owner' | 'editor' | 'viewer';

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

export interface NodeSize {
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}