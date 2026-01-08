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
// import Exports from './ui/exports/Exports';
import Toolbar from './ui/toolbar/Toolbar';
import PalettePanel from './ui/palette/PalettePanel';
import { useCallback, useRef, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import ValidationError from './validation/ValidationError';
import { validate } from './validation/validate';

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
    onPaneContextMenu,
    resetCanvas,
    selectAllNodes,
    onPaneClick,
    onFlowInit,
    exportToJson,
    exportToRdf,
    exportToXml,
    importFromJson,
    setNodes,
    selectedEdgeType,
    setSelectedEdgeType,
    onMoveEnd,
  } = useDiagram();


  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const contextMenuProps = menu ? { ...menu, resetCanvas, selectAllNodes } : null;
  const [validationError, setValidationError] = useState<string[] | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

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

  const handleValidation = useCallback(() => {
    const json = exportToJson();
    if (json) {
      if (hideTimeoutRef.current !== null) {
        clearTimeout(hideTimeoutRef.current);
      }

      const errors = validate(json);
      setValidationError(errors);

      hideTimeoutRef.current = window.setTimeout(() => {
        setValidationError(null);
        hideTimeoutRef.current = null;
      }, 60000); 
    }
  }, [exportToJson]);

  const closeValidationError = useCallback(() => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setValidationError(null);
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <Toolbar
        onSave={handleSave}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        exportToJson={exportToJson}
        exportToRdf={exportToRdf}
        exportToXml={exportToXml}
        importFromJson={importFromJson}
        handleValidation={handleValidation}
        flowWrapperRef={flowWrapperRef}
      />
      {validationError && <ValidationError errors={validationError} handleClose={closeValidationError} />}
      {/* <Exports exportToJson={exportToJson} flowWrapperRef={flowWrapperRef} exportToRdf={exportToRdf} exportToXml={exportToXml} importFromJson={importFromJson}/> */}

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
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        menu={contextMenuProps}
        onFlowInit={onFlowInit}
        setNodes={setNodes}
        selectedEdgeType={selectedEdgeType}
        onMoveEnd={onMoveEnd}
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
