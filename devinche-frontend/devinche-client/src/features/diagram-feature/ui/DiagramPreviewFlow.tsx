'use client';

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react';
import { ProcessUnitNode } from './nodes/ProcessUnitNode';
import { AiProcessNode } from './nodes/AiProcessNode';
import DataProviderNode from './nodes/DataProviderNode';
import DatasetNode from './nodes/DatasetNode';
import ApplicationNode from './nodes/ApplicationNode';
import ResizableNode from './nodes/ResizableNode';
import SecurityRealmNode from './nodes/SecurityRealmNode';
import ServiceNode from './nodes/ServiceNode';
import IdentityProviderNode from './nodes/IdentityProviderNode';
import StepEdge from './edges/StepEdge';
import TrustEdge from './edges/TrustEdge';
import Invocation from './edges/Invocation';
import Legacy from './edges/Legacy';

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
  legacy: Legacy,
};

interface DiagramPreviewFlowProps {
  nodes?: any[];
  edges?: any[];
  className?: string;
  style?: React.CSSProperties;
}

export function DiagramPreviewFlow({ nodes = [], edges = [], className = '', style = {} }: DiagramPreviewFlowProps) {
  const nodesList = Array.isArray(nodes) ? nodes : [];
  const edgesList = Array.isArray(edges) ? edges : [];

  if (!nodesList.length && !edgesList.length) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        minHeight: 1,
        background: 'var(--editor-bg)',
        borderRadius: 8,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodesList}
          edges={edgesList}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, duration: 0 }}
          onInit={(instance) => instance.fitView({ padding: 0.2, duration: 0 })}
          proOptions={{ hideAttribution: true }}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnScroll={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          connectOnClick={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={1}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={16}
            size={1}
            style={{ color: 'var(--editor-grid)', opacity: 0.5 }}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
