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
import PropertiesPanel from './ui/properties/PropertiesPanel';
import { useCallback, useRef, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import ValidationError from './validation/ValidationError';
import { DiagramEdge } from '@/types/diagram';
import DatasetNode from './ui/nodes/DatasetNode';
import { AiProcessNode } from './ui/nodes/AiProcessNode';

const nodeTypes: NodeTypes = {
    processUnitNode: ProcessUnitNode,
    aiProcessNode: AiProcessNode,
    dataProviderNode: DataProviderNode,
    datasetNode: DatasetNode,
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
    setEdges,
    selectedEdgeType,
    setSelectedEdgeType,
    onMoveEnd,
    onDragOver,
    onDrop,
    onNodeDrag,
    onNodeDragStop,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    selectedNode,
    onNodeClick,
    onUpdateNode,
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

  /**
   * Sends diagram data to backend for validation
   */
  const handleValidation = useCallback(async () => {
    const json = exportToJson();
    if (!json) return;

    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
    }

    setValidationError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/validation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: json }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Validation failed: ${response.status}`);
      }

      const data = await response.json();
      const errors = data.errors.errors || [];
      const sources = data.errors.sources || [];
      console.log(sources)
      const errorNodeIds = new Set(
        sources.map((item: { id: any; }) => item.id)
      );
      console.log(errorNodeIds)
      setNodes(nds => 
        nds.map(node => ({
          ...node,
          data: {
            ...node.data,
            hasError: errorNodeIds.has(node.id)
          }
        }))
      );

      const errorEdgeIds = new Set(
        sources.map((item: { id: any; }) => item.id)
      );
      console.log(errorEdgeIds)
      setEdges((eds: DiagramEdge[]) => 
        eds.map((edge: DiagramEdge) => ({
          ...edge,
          data: {
            ...edge.data,
            hasError: errorEdgeIds.has(edge.id)
          }
        }))
      );
      
      setValidationError(errors.length ? errors : []);
    } catch (error) {
      console.error("Validation error:", error);
      setValidationError(["Validation request failed. Please try again."]);
    } finally {

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
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        exportToJson={exportToJson}
        exportToRdf={exportToRdf}
        exportToXml={exportToXml}
        importFromJson={importFromJson}
        handleValidation={handleValidation}
        flowWrapperRef={flowWrapperRef}
        allNodes={nodes}
      />
      {validationError && <ValidationError errors={validationError} handleClose={closeValidationError} />}

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
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
      />
      <PalettePanel 
        selectedEdgeType={selectedEdgeType}
        onEdgeTypeSelect={setSelectedEdgeType}
      />
      <PropertiesPanel
        selectedNode={selectedNode}
        onUpdateNode={onUpdateNode}
        onClose={onPaneClick}
        isOpen={selectedNode !== null}
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
