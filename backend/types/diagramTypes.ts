export interface BaseNode<T = any> {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: T;
  width?: number | null;
  height?: number | null;
  parentId?: string | null;
  parentNode?: BaseNode<T> | null;
  draggable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  dragging?: boolean;
  [key: string]: any;
}

export interface BaseEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
//   style?: React.CSSProperties | undefined;
  data?: any;
  selected?: boolean;
  animated?: boolean;
  hidden?: boolean;
  [key: string]: any;
}


export interface DiagramState {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

// Extended node type with our custom data structure
export interface DiagramNode extends BaseNode<NodeData> {
  type: string;
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

export interface DiagramEdge extends BaseEdge {
  type: string;
}