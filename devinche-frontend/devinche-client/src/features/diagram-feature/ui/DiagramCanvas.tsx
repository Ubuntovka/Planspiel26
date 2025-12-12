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
  useReactFlow,
  Node,
  Edge,
} from '@xyflow/react';
import ContextMenu from './controls/ContextMenu';
import PalettePanel from "./palette/PalettePanel";
import { useCallback } from 'react';
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
  onNodeContextMenu: (event: React.MouseEvent, node: Node) => void;
  onEdgeContextMenu: (event: React.MouseEvent, edge: Edge) => void;
  onPaneClick: () => void;
  onPaneContextMenu: (event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => void;
  menu: ContextMenuState | null;
  onFlowInit: (instance: ReactFlowInstance<DiagramNode, DiagramEdge>) => void;
  setNodes: React.Dispatch<React.SetStateAction<DiagramNode[]>>;
  selectedEdgeType: string;
}

interface PaletteItem {
    id: string;
    type: 'cursor' | 'node' | 'edge';
    label: string;
    nodeType?: string;
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
  onPaneContextMenu,
  menu,
  onFlowInit,
  setNodes,
  selectedEdgeType,
}: DiagramCanvasProps) => {
    const reactFlowInstance = useReactFlow();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const reactFlowBounds = flowWrapperRef.current?.getBoundingClientRect();
            if (!reactFlowBounds) return;

            const dataString = event.dataTransfer.getData('application/reactflow');
            if (!dataString) return;

            const data: PaletteItem = JSON.parse(dataString);

            if (data.type === 'node' && data.nodeType) {
                const position = reactFlowInstance.screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });

                const newNode: DiagramNode = {
                    id: `${data.nodeType}-${Date.now()}`,
                    type: data.nodeType,
                    position,
                    data: { label: data.label },
                };

                setNodes((nds) => nds.concat(newNode));
            }
        },
        [reactFlowInstance, flowWrapperRef, setNodes]
    );

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
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        onInit={onFlowInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
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
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </div>
  );
};

export default DiagramCanvas;
