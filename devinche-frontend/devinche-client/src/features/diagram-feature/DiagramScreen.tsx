"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactFlowProvider } from '@xyflow/react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDiagram } from './hooks/useDiagram';
import DiagramCanvas from './ui/DiagramCanvas';
import { ProcessUnitNode } from "./ui/nodes/ProcessUnitNode";
import DataProviderNode from "./ui/nodes/DataProviderNode";
import ApplicationNode from "./ui/nodes/ApplicationNode";
import SecurityRealmNode from "./ui/nodes/SecurityRealmNode";
import ServiceNode from "./ui/nodes/ServiceNode";
import IdentityProviderNode from "./ui/nodes/IdentityProviderNode";
// import StepEdge from "./ui/edges/StepEdge";
import type { NodeTypes, EdgeTypes } from "@xyflow/react";
import TrustEdge from "./ui/edges/TrustEdge";
import Invocation from "./ui/edges/Invocation";
import Legacy from "./ui/edges/Legacy";
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
import AiApplicationNode from './ui/nodes/AiApplicationNode';
import AiServiceNode from './ui/nodes/AiServiceNode';
import { generateDiagramFromPrompt } from './api';
import ShareDialog from './ui/ShareDialog';
import CommitDialog from './ui/CommitDialog';
import VersionHistoryPanel from './ui/VersionHistoryPanel';
import CommentsPanel from './ui/comments/CommentsPanel';
import { listComments, type CommentItem, type CommentAnchor, createDiagramVersion, type DiagramVersionFull, generateDiagramDocumentation } from './api';
import { useCollaboration, type DiagramUpdatePayload } from './collaboration/useCollaboration';
import { getDiagramAsPngDataUrl } from './imports-exports/exports';

const nodeTypes: NodeTypes = {
  processUnitNode: ProcessUnitNode,
  aiProcessNode: AiProcessNode,
  dataProviderNode: DataProviderNode,
  datasetNode: DatasetNode,
  applicationNode: ApplicationNode,
  aiApplicationNode: AiApplicationNode,
  securityRealmNode: SecurityRealmNode,
  serviceNode: ServiceNode,
  aiServiceNode: AiServiceNode,
  identityProviderNode: IdentityProviderNode,
};

const edgeTypes: EdgeTypes = {
  // step: StepEdge,
  trust: TrustEdge,
  invocation: Invocation,
  legacy: Legacy,
};

interface DiagramScreenContentProps {
  diagramId?: string | null;
}

const DiagramScreenContent = ({ diagramId }: DiagramScreenContentProps) => {
  const { getToken, isAuthenticated, user } = useAuth();
  const userDisplayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.email ||
      "Anonymous"
    : "Anonymous";
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
    onFlowInit,
    exportToJson,
    importFromJson,
    addNode,
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
    selectedEdge,
    onNodeClick,
    onUpdateNode,
    onUpdateEdge,
    diagramName,
    onRenameDiagram,
    saveDiagram,
    saveDiagramAs,
    openProperties,
    accessLevel,
  } = useDiagram({
    diagramId: diagramId ?? undefined,
    getToken,
    onConnectionError: useCallback((errors: string[]) => {
      setValidationError(errors);
      if (hideTimeoutRef.current !== null) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = window.setTimeout(() => {
        setValidationError(null);
        hideTimeoutRef.current = null;
      }, 10000);
    }, []),
  });
  const { t } = useLanguage();
  const collaborationEnabled = !!(diagramId && getToken?.());
  const isApplyingRemoteRef = useRef(false);
  const sendDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentSnapshotRef = useRef<string>('');

  const handleRemoteDiagramUpdate = useCallback(
    (payload: DiagramUpdatePayload) => {
      isApplyingRemoteRef.current = true;
      lastSentSnapshotRef.current = JSON.stringify({ nodes: payload.nodes, edges: payload.edges });
      setNodes(payload.nodes as any);
      setEdges(payload.edges as any);
      // Keep "applying remote" so the send effect won't echo; clear after debounce window
      setTimeout(() => {
        isApplyingRemoteRef.current = false;
      }, 400);
    },
    [setNodes, setEdges],
  );

  const {
    cursors: collaborationCursors,
    sendCursor,
    myColor: collaborationMyColor,
    connected: collaborationConnected,
    sendDiagramUpdate,
  } = useCollaboration(
    collaborationEnabled ? diagramId : null,
    getToken ?? (() => null),
    userDisplayName,
    handleRemoteDiagramUpdate,
  );

  const { zoomIn, zoomOut, fitView, screenToFlowPosition } = useReactFlow();
  const isViewer = accessLevel === 'viewer';
  const isOwner = accessLevel === 'owner';
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [commentsPanelOpen, setCommentsPanelOpen] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentAnchor, setCommentAnchor] = useState<CommentAnchor | null>(null);
  const [commitDialogOpen, setCommitDialogOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [isGeneratingDocumentation, setIsGeneratingDocumentation] = useState(false);

  const loadComments = useCallback(async () => {
    if (!diagramId || !getToken?.()) return;
    const token = getToken();
    if (!token) return;
    try {
      const { comments: list } = await listComments(token, diagramId);
      setComments(list);
    } catch {
      setComments([]);
    }
  }, [diagramId, getToken]);

  useEffect(() => {
    if (diagramId && getToken?.()) loadComments();
  }, [diagramId, loadComments]);

  const contextMenuProps = menu
    ? {
        ...menu,
        resetCanvas,
        selectAllNodes,
        closeMenu,
        onOpenProperties: (id: string) => openProperties(id, menu.type),
      }
    : null;
  const contextMenuForCanvas = isViewer ? null : contextMenuProps;
  const [validationError, setValidationError] = useState<string[] | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const handlePaletteNodeClick = useCallback((item: any) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const position = screenToFlowPosition({
      x: centerX + (Math.random() * 40 - 20), 
      y: centerY + (Math.random() * 40 - 20),
    });
    addNode(item, position);
  }, [screenToFlowPosition, addNode]);
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

  const handleCommit = useCallback(
    async (message: string, description: string) => {
      if (!diagramId || !getToken) throw new Error('No diagram or auth token');
      const token = getToken();
      if (!token) throw new Error('Not authenticated');
      await createDiagramVersion(token, diagramId, message, description);
    },
    [diagramId, getToken]
  );

  const handleVersionRestore = useCallback(
    (version: DiagramVersionFull) => {
      importFromJson(
        JSON.stringify({ nodes: version.nodes, edges: version.edges, viewport: version.viewport })
      );
      setVersionHistoryOpen(false);
    },
    [importFromJson]
  );

  const handleGenerateDocumentation = useCallback(async () => {
    const json = exportToJson();
    if (!json) return;
    let diagramData: { nodes: any[]; edges: any[]; viewport?: any };
    try {
      diagramData = JSON.parse(json);
    } catch {
      return;
    }
    setIsGeneratingDocumentation(true);
    try {
      const { markdown, diagramName: docName } = await generateDiagramDocumentation(
        diagramData,
        diagramName ?? 'Untitled Diagram'
      );
      // Prepend the title and generate a download
      const title = `# ${docName}\n\n`;
      const blob = new Blob([title + markdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(docName || 'diagram').replace(/[^a-z0-9_-]/gi, '_').toLowerCase()}_documentation.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Documentation generation failed:', err);
    } finally {
      setIsGeneratingDocumentation(false);
    }
  }, [exportToJson, diagramName]);

  const handleSaveAs = useCallback(
    async (name: string) => {
      if (!saveDiagramAs) return null;
      const id = await saveDiagramAs(name);
      if (id) router.push(`/editor/${id}`);
      return id;
    },
    [saveDiagramAs, router],
  );

  // Debounced broadcast: avoid sending on every drag step and avoid echo after remote apply
  const DEBOUNCE_MS = 280;
  useEffect(() => {
    if (!collaborationEnabled || !sendDiagramUpdate) return;
    if (sendDebounceRef.current) clearTimeout(sendDebounceRef.current);
    sendDebounceRef.current = setTimeout(() => {
      sendDebounceRef.current = null;
      if (isApplyingRemoteRef.current) return;
      const snapshot = JSON.stringify({ nodes, edges });
      if (snapshot === lastSentSnapshotRef.current) return;
      lastSentSnapshotRef.current = snapshot;
      sendDiagramUpdate({ nodes: nodes as any[], edges: edges as any[] });
    }, DEBOUNCE_MS);
    return () => {
      if (sendDebounceRef.current) clearTimeout(sendDebounceRef.current);
      sendDebounceRef.current = null;
    };
  }, [nodes, edges, collaborationEnabled, sendDiagramUpdate]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (saveDiagram) saveDiagram();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/validation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: json,
        },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Validation failed: ${response.status}`,
        );
      }

      const data = await response.json();
      const errors = data.errors.errors || [];
      const sources = data.errors.sources || [];
      const errorNodeIds = new Set(sources.map((item: { id: any }) => item.id));
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            hasError: errorNodeIds.has(node.id),
          },
        })),
      );

      const errorEdgeIds = new Set(sources.map((item: { id: any }) => item.id));
      setEdges((eds: DiagramEdge[]) =>
        eds.map((edge: DiagramEdge) => ({
          ...edge,
          data: {
            ...edge.data,
            hasError: errorEdgeIds.has(edge.id),
          },
        })),
      );

      setValidationError(errors.length ? errors : []);
    } catch (error) {
      console.error("Validation error:", error);
      setValidationError(["Validation request failed. Please try again."]);
    } finally {
      hideTimeoutRef.current = window.setTimeout(() => {
        setValidationError(null);
        hideTimeoutRef.current = null;
      }, 10000);
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
    <div className="relative w-screen h-screen overflow-hidden bg-(--editor-bg)">
      <Toolbar
        onBack={diagramId ? () => router.push('/editor') : undefined}
        backLabel={t('toolbar.diagrams')}
        onSave={isViewer ? undefined : handleSave}
        onSaveAs={isViewer ? undefined : handleSaveAs}
        diagramName={diagramName ?? 'Untitled Diagram'}
        onRenameDiagram={!isViewer ? onRenameDiagram : undefined}
        isViewer={isViewer}
        getToken={getToken ?? undefined}
        onNotificationNavigate={() => setCommentsPanelOpen(false)}
        isLoggedIn={isAuthenticated}
        onUndo={isViewer ? () => {} : onUndo}
        onRedo={isViewer ? () => {} : onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        handleValidation={isViewer ? undefined : handleValidation}
        exportToJson={exportToJson}
        importFromJson={importFromJson}
        flowWrapperRef={flowWrapperRef}
        allNodes={nodes}
        canShare={isOwner}
        diagramId={diagramId}
        onShareClick={isOwner ? () => setShareDialogOpen(true) : undefined}
        onCommentsClick={
          !isViewer && diagramId ? () => setCommentsPanelOpen(true) : undefined
        }
        commentsUnresolvedCount={comments.filter((c) => !c.resolved).length}
        activeUsers={collaborationCursors.map((c) => ({ id: c.id, displayName: c.displayName, color: c.color }))}
        myColor={collaborationMyColor ?? undefined}
        myDisplayName={userDisplayName}
        collaborationConnected={collaborationConnected}
        onCommitVersion={!isViewer && diagramId ? () => setCommitDialogOpen(true) : undefined}
        onVersionHistory={diagramId && getToken?.() ? () => setVersionHistoryOpen(true) : undefined}
        onGenerateDocumentation={handleGenerateDocumentation}
        isGeneratingDocumentation={isGeneratingDocumentation}
      />
      {validationError && (
        <ValidationError
          errors={validationError}
          handleClose={closeValidationError}
        />
      )}

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
        menu={contextMenuForCanvas}
        onFlowInit={onFlowInit}
        setNodes={setNodes}
        selectedEdgeType={selectedEdgeType}
        onMoveEnd={onMoveEnd}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        readOnly={isViewer}
        diagramId={diagramId}
        getToken={getToken}
        userDisplayName={userDisplayName}
        collaboration={{ cursors: collaborationCursors, sendCursor }}
        comments={comments}
        onCommentClick={() => setCommentsPanelOpen(true)}
        onAddCommentAtPoint={
          !isViewer
            ? (anchor) => {
                setCommentAnchor(anchor);
                setCommentsPanelOpen(true);
              }
            : undefined
        }
      />
      {!isViewer && (
        <PalettePanel
          selectedEdgeType={selectedEdgeType}
          onEdgeTypeSelect={setSelectedEdgeType}
          onNodeClick={handlePaletteNodeClick}
        />
      )}
      <PropertiesPanel
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onUpdateNode={onUpdateNode}
        onUpdateEdge={onUpdateEdge}
        onClose={onPaneClick}
        isOpen={selectedNode !== null || selectedEdge !== null}
      />
      {!isViewer && (
        <MonaChatFab
          onGenerateDiagram={async (prompt) => {
            const result = await generateDiagramFromPrompt(prompt);
            return {
              diagramJson: JSON.stringify(result.diagram),
              validationErrors: result.validationErrors,
            };
          }}
          onApplyDiagram={importFromJson}
          getCurrentDiagram={() => {
            try {
              const json = exportToJson();
              if (!json) return null;
              const obj = JSON.parse(json) as { nodes?: any[]; edges?: any[]; viewport?: { x: number; y: number; zoom: number } };
              return { nodes: obj.nodes ?? [], edges: obj.edges ?? [], viewport: obj.viewport ?? { x: 0, y: 0, zoom: 1 } };
            } catch {
              return null;
            }
          }}
          getDiagramImage={() => getDiagramAsPngDataUrl(flowWrapperRef.current)}
        />
      )}
      {shareDialogOpen && diagramId && getToken && (
        <ShareDialog
          diagramId={diagramId}
          getToken={getToken}
          onClose={() => setShareDialogOpen(false)}
        />
      )}
      {commitDialogOpen && (
        <CommitDialog
          onClose={() => setCommitDialogOpen(false)}
          onCommit={handleCommit}
        />
      )}
      {versionHistoryOpen && diagramId && getToken && (
        <VersionHistoryPanel
          diagramId={diagramId}
          getToken={getToken}
          onClose={() => setVersionHistoryOpen(false)}
          onRestore={handleVersionRestore}
        />
      )}
      {commentsPanelOpen && diagramId && getToken && user?._id && (
        <CommentsPanel
          diagramId={diagramId}
          getToken={getToken}
          currentUserId={user._id}
          onClose={() => setCommentsPanelOpen(false)}
          anchorToAttach={commentAnchor}
          onClearAnchor={() => setCommentAnchor(null)}
          comments={comments}
          setComments={setComments}
        />
      )}
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
