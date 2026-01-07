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
  onMoveEnd: (event: any, viewport: { x: number; y: number; zoom: number }) => void;
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
  onMoveEnd,
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
    

  
  /**
   * 💡 노드 드래그 시 교차(intersection) 감지 핸들러
   * 드래그 중인 노드와 겹치는 다른 노드에 시각적 피드백을 제공합니다.
   */
  const onNodeDrag = useCallback((_: React.MouseEvent, node: Node) => {
    // getIntersectingNodes를 사용하여 현재 노드와 겹치는 노드를 찾습니다.
    // 'true'를 전달하여 부분적으로 교차하는 노드도 포함합니다.
    const intersections = reactFlowInstance
      .getIntersectingNodes(node, true)
      .map((n) => n.id);

    setNodes((ns) =>
      ns.map((n) => {
        // 교차 노드에 클래스 추가
        const isIntersecting = intersections.includes(n.id) && n.id !== node.id;
        // 드래그 중인 노드 자체에 클래스 추가
        const isDragging = n.id === node.id;

        let className = '';
        if (isDragging) {
          className += ' is-dragging';
        }
        if (isIntersecting) {
          className += ' is-intersecting';
        }

        return {
          ...n,
          // 노드의 'className' 속성을 업데이트하여 스타일 변경
          className: className.trim(),
        };
      }),
    );
  }, [reactFlowInstance, setNodes]);

  /**
   * 💡 노드 드래그가 끝났을 때 스타일(클래스)을 초기화하는 핸들러
   */
  const onNodeDragStop = useCallback(() => {
    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: '', // 모든 노드의 클래스 초기화
      })),
    );
  }, [setNodes]);
  
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
        onMoveEnd={onMoveEnd}
        // node drag handlers for intersection detection
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        
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