"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactFlowProvider } from '@xyflow/react';
import { useAuth } from '@/contexts/AuthContext';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import ValidationError from './validation/ValidationError';
import { DiagramEdge } from '@/types/diagram';
import DatasetNode from './ui/nodes/DatasetNode';
import { AiProcessNode } from './ui/nodes/AiProcessNode';
import MonaChatFab from './ui/MonaChatFab';
import AiApplicationNode from '../../../AiApplicationNode_backup';
import AiServiceNode from '../../../AiServiceNode_backup';

const nodeTypes: NodeTypes = {
    processUnitNode: ProcessUnitNode,
    aiProcessNode: AiProcessNode,
    dataProviderNode: DataProviderNode,
    datasetNode: DatasetNode,
    applicationNode: ApplicationNode,
    aiApplicationNode: AiApplicationNode,
    resizableNode: ResizableNode,
    securityRealmNode: SecurityRealmNode,
    serviceNode: ServiceNode,
    aiServiceNode: AiServiceNode,
    identityProviderNode: IdentityProviderNode,
};

const edgeTypes: EdgeTypes = {
    step: StepEdge,
    trust: TrustEdge,
    invocation: Invocation,
    legacy:Legacy
};

interface DiagramScreenContentProps {
  diagramId?: string | null;
}

const DiagramScreenContent = ({ diagramId }: DiagramScreenContentProps) => {
  const { getToken, isAuthenticated } = useAuth();
  const router = useRouter();
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
    closeMenu,
    openPropertiesForNode,
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
    diagramName,
    onRenameDiagram,
    saveDiagram,
    saveDiagramAs,
  } = useDiagram({ diagramId: diagramId ?? undefined, getToken });


  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const contextMenuProps = menu
    ? { ...menu, resetCanvas, selectAllNodes, closeMenu, onOpenProperties: openPropertiesForNode }
    : null;
  const [validationError, setValidationError] = useState<string[] | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const [nameInput, setNameInput] = useState(diagramName ?? 'Untitled Diagram');
  useEffect(() => {
    setNameInput(diagramName ?? 'Untitled Diagram');
  }, [diagramName]);

  const handleZoomIn = useCallback(() => {
    zoomIn();
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView();
  }, [fitView]);

  const handleSave = useCallback(async () => {
    if (saveDiagram) return saveDiagram();
    return true;
  }, [saveDiagram]);

  const handleSaveAs = useCallback(
    async (name: string) => {
      if (!saveDiagramAs) return null;
      const id = await saveDiagramAs(name);
      if (id) router.push(`/editor/${id}`);
      return id;
    },
    [saveDiagramAs, router]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (saveDiagram) saveDiagram();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [saveDiagram]);

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
      {diagramId && (
        <div
          className="flex items-center gap-2 px-3 py-1.5 shrink-0"
          style={{ backgroundColor: 'var(--editor-surface)', borderBottom: '1px solid var(--editor-border)' }}
        >
          <Link
            href="/editor"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--editor-surface-hover)] transition-colors"
            style={{ color: 'var(--editor-text-secondary)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          {onRenameDiagram && (
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={async () => {
                const val = nameInput.trim() || 'Untitled Diagram';
                if (val !== (diagramName ?? 'Untitled Diagram')) {
                  await onRenameDiagram(val);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur();
              }}
              className="flex-1 min-w-0 px-2 py-1 rounded border-0 bg-transparent font-medium focus:outline-none focus:ring-1"
              style={{ color: 'var(--editor-text)', maxWidth: 300 }}
            />
          )}
        </div>
      )}
      <Toolbar
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        diagramName={diagramName ?? 'Untitled Diagram'}
        isLoggedIn={isAuthenticated}
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
        onCloseMenu={closeMenu}
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
      <MonaChatFab />
    </div>
  );
};

interface DiagramScreenProps {
  diagramId?: string | null;
}

const DiagramScreen = ({ diagramId }: DiagramScreenProps) => {
  return (
    <ReactFlowProvider>
      <DiagramScreenContent diagramId={diagramId} />
    </ReactFlowProvider>
  );
};

export default DiagramScreen;
