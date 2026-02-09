import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  ConnectionMode,
  type ReactFlowInstance,
  type NodeTypes,
  type EdgeTypes,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Node,
  Edge,
} from '@xyflow/react';
import ContextMenu from './controls/ContextMenu';
import CollaborationCursors from './CollaborationCursors';
import CommentMarkers from './comments/CommentMarkers';
import type { DiagramNode, DiagramEdge, ContextMenuState } from '@/types/diagram';
import type { CommentItem } from '../api';

interface DiagramCanvasProps {
  flowWrapperRef: React.RefObject<HTMLDivElement>;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  onNodeContextMenu: (event: React.MouseEvent, node: Node) => void;
  onEdgeContextMenu: (event: React.MouseEvent, edge: Edge) => void;
  onPaneClick: () => void;
  onCloseMenu?: () => void;
  onPaneContextMenu: (event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => void;
  menu: (ContextMenuState & { closeMenu?: () => void; onOpenProperties?: (nodeId: string) => void }) | null;
  onFlowInit: (instance: ReactFlowInstance<DiagramNode, DiagramEdge>) => void;
  setNodes: React.Dispatch<React.SetStateAction<DiagramNode[]>>;
  selectedEdgeType: string;
  onMoveEnd: (event: any, viewport: { x: number; y: number; zoom: number }) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  onNodeDrag: (event: React.MouseEvent, node: Node) => void;
  onNodeDragStop: (event: React.MouseEvent, node: Node) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  /** When true, diagram is read-only (viewer mode): no drag, no connect, no drop. */
  readOnly?: boolean;
  /** For real-time collaboration: cursors and sendCursor from useCollaboration (if provided, CollaborationCursors uses these instead of its own hook). */
  collaboration?: { cursors: { id: string; displayName: string; color: string; x: number; y: number }[]; sendCursor: (x: number, y: number) => void };
  diagramId?: string | null;
  getToken?: () => string | null;
  userDisplayName?: string;
  /** Comments with anchors to show as pins on the diagram. */
  comments?: CommentItem[];
  onCommentClick?: (commentId: string) => void;
  /** For canvas context menu: "Add comment here" */
  onAddCommentAtPoint?: (anchor: { type: 'point'; x: number; y: number }) => void;
}


const DiagramCanvas = ({
  flowWrapperRef,
  nodes,
  edges,
  nodeTypes,
  edgeTypes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeContextMenu,
  onEdgeContextMenu,
  onPaneClick,
  onCloseMenu,
  onPaneContextMenu,
  menu,
  onFlowInit,
  setNodes,
  selectedEdgeType,
  onMoveEnd,
  onDragOver,
  onDrop,
  onNodeDrag,
  onNodeDragStop,
  onNodeClick,
  readOnly = false,
  collaboration,
  diagramId,
  getToken,
  userDisplayName = 'Anonymous',
  comments = [],
  onCommentClick,
  onAddCommentAtPoint,
}: DiagramCanvasProps) => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--editor-bg)' }} ref={flowWrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={readOnly ? undefined : onNodeContextMenu}
        onEdgeContextMenu={readOnly ? undefined : onEdgeContextMenu}
        onPaneContextMenu={readOnly ? undefined : onPaneContextMenu}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        onInit={onFlowInit}
        onDrop={readOnly ? undefined : onDrop}
        onDragOver={readOnly ? undefined : onDragOver}
        onMoveEnd={onMoveEnd}
        onNodeDrag={readOnly ? undefined : onNodeDrag}
        onNodeDragStop={readOnly ? undefined : onNodeDragStop}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        defaultEdgeOptions={{
          style: { stroke: 'var(--editor-border)', strokeWidth: 2 },
          type: selectedEdgeType,
        }}
        connectionLineStyle={{ stroke: 'var(--editor-accent)', strokeWidth: 2 }}
        snapToGrid={true}
        snapGrid={[20, 20]}
      >
        {/* Major grid lines - every 100px - more prominent */}
        <Background 
          variant={BackgroundVariant.Lines} 
          gap={100} 
          lineWidth={1.5}
          style={{ 
            color: 'var(--editor-grid)',
            opacity: 0.7 
          }}
        />
        {/* Minor grid lines - every 20px */}
        <Background 
          variant={BackgroundVariant.Lines} 
          gap={20} 
          lineWidth={0.8}
          style={{ 
            color: 'var(--editor-grid)',
            opacity: 0.5 
          }}
        />
        {/* Grid dots for better visual reference at intersections */}
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={2} 
          style={{ 
            color: 'var(--editor-grid)',
            opacity: 0.6 
          }}
        />
        <Controls 
          position="bottom-right"
          showInteractive={false}
        />
        {menu && (
          <ContextMenu
            onClick={onCloseMenu ?? onPaneClick}
            {...menu}
            flowWrapperRef={flowWrapperRef}
            onAddCommentAtPoint={onAddCommentAtPoint}
          />
        )}
        <CollaborationCursors
          flowWrapperRef={flowWrapperRef}
          cursors={collaboration?.cursors ?? []}
          sendCursor={collaboration?.sendCursor}
          enabled={!!(diagramId && collaboration)}
        />
        {comments.length > 0 && (
          <CommentMarkers comments={comments} onCommentClick={onCommentClick} />
        )}
      </ReactFlow>
    </div>
  );
};

export default DiagramCanvas;