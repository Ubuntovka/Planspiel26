import {
  ReactFlow,
  Background,
  Controls,
  ConnectionMode,
  type ReactFlowInstance,
  type NodeTypes,
  type EdgeTypes,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import ContextMenu from './controls/ContextMenu';
import type { DiagramNode, DiagramEdge, ContextMenuState } from '@/types/diagram';

interface DiagramCanvasProps {
  flowWrapperRef: React.RefObject<HTMLDivElement>;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  onNodeContextMenu: (event: React.MouseEvent, node: any) => void;
  onEdgeContextMenu: (event: React.MouseEvent, edge: any) => void;
  onPaneClick: () => void;
  menu: ContextMenuState | null;
  onFlowInit: (instance: ReactFlowInstance<DiagramNode, DiagramEdge>) => void;
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
  menu,
  onFlowInit,
}: DiagramCanvasProps) => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#ffffff' }} ref={flowWrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneClick={onPaneClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        onInit={onFlowInit}
      >
        <Background />
        <Controls />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </div>
  );
};

export default DiagramCanvas;
