import { ReactFlow, Background, Controls, Panel, BackgroundVariant } from "@xyflow/react";
import ContextMenu from "./controls/ContextMenu";
import type { DiagramNode, DiagramEdge, ContextMenuState } from "@/types/diagram";
import { NodeTypes, EdgeTypes, NodeChange, EdgeChange, Connection, ConnectionMode } from "@xyflow/react";

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
}: DiagramCanvasProps) => {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#ffffff" }} ref={flowWrapperRef}>
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
      >
        {/* <Panel position="top-center">top-center panel</Panel> */}
        <Background variant={BackgroundVariant.Lines} gap={10} color="#f1f1f1" id="1" />
        <Background variant={BackgroundVariant.Lines} gap={100} color="#ccc" id="2" />
        <Controls />
        <Controls />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </div>
  );
};

export default DiagramCanvas;

