"use client";

import { ReactFlowProvider } from '@xyflow/react';
import { useDiagram } from './hooks';
import DiagramCanvas from './ui/DiagramCanvas';
import { ProcessUnitNode } from "./ui/nodes/ProcessUnitNode";
import DataProviderNode from "./ui/nodes/DataProviderNode";
import ApplicationNode from "./ui/nodes/ApplicationNode";
import ResizableNode from "./ui/nodes/ResizableNode";
import SecurityRealmNode from "./ui/nodes/SecurityRealmNode";
import ServiceNode from "./ui/nodes/ServiceNode";
import IdentityProviderNode from "./ui/nodes/IdentityProviderNode";
import StepEdge from "./ui/edges/StepEdge";
import type { NodeTypes, EdgeTypes } from '@xyflow/react';
import TrustEdge from './ui/edges/TrustEdge';
import Invocation from './ui/edges/Invocation';
import Legacy from './ui/edges/Legacy';
import Exports from './ui/exports/Exports';
import Toolbar from './ui/toolbar/Toolbar';
import PalettePanel from './ui/palette/PalettePanel';
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

const nodeTypes: NodeTypes = {
    processUnitNode: ProcessUnitNode,
    dataProviderNode: DataProviderNode,
    applicationNode: ApplicationNode,
    resizableNode: ResizableNode,
    securityRealmNode: SecurityRealmNode,
    serviceNode: ServiceNode,
    identityProviderNode: IdentityProviderNode,
};

const edgeTypes: EdgeTypes = {
    step: StepEdge,
    trust: TrustEdge,
    invocation: Invocation,
    legacy:Legacy
};

const DiagramScreenContent = () => {
  const {
    nodes,
    edges,
    menu,
    flowWrapperRef,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeContextMenu,
    onEdgeContextMenu,
    onPaneClick,
    onFlowInit,
    exportToJson,
    exportToRdf,
    importFromJson,
    setNodes,
    selectedEdgeType,
    setSelectedEdgeType,
  } = useDiagram();

  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleZoomIn = useCallback(() => {
    zoomIn();
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView();
  }, [fitView]);

  const handleSave = useCallback(() => {
    exportToJson();
  }, [exportToJson]);

  return (
    <div className="relative w-screen h-screen">
      <Toolbar
        onSave={handleSave}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
      />
      <Exports exportToJson={exportToJson} flowWrapperRef={flowWrapperRef} exportToRdf={exportToRdf} importFromJson={importFromJson}/>

      <DiagramCanvas
        flowWrapperRef={flowWrapperRef}
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
        menu={menu}
        onFlowInit={onFlowInit}
        setNodes={setNodes}
        selectedEdgeType={selectedEdgeType}
      />
      <PalettePanel 
        selectedEdgeType={selectedEdgeType}
        onEdgeTypeSelect={setSelectedEdgeType}
      />
    </div>
  );
};

const DiagramScreen = () => {
  return (
    <ReactFlowProvider>
      <DiagramScreenContent />
    </ReactFlowProvider>
  );
};

export default DiagramScreen;
