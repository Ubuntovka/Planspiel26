"use client"

import { ReactFlowProvider } from '@xyflow/react';
import { useDiagram } from './hooks';
import DiagramCanvas from './ui/DiagramCanvas';
import { ProcessUnitNode } from "./ui/nodes/ProcessUnitNode"; 
import DataProviderNode from "./ui/nodes/DataProviderNode";
import ApplicationNode from "./ui/nodes/ApplicationNode";
import ResizableNode from "./ui/nodes/ResizableNode";
import SecurityRealm from "./ui/nodes/SecurityRealmNode";
import ServiceNode from "./ui/nodes/ServiceNode";
import IdentityProviderNode from "./ui/nodes/IdentityProviderNode";
import StepEdge from "./ui/edges/StepEdge";
import type { NodeTypes, EdgeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
    processUnitNode: ProcessUnitNode,
    dataProviderNode: DataProviderNode,
    applicationNode: ApplicationNode,
    resizableNode: ResizableNode,
    securityRealmNode: SecurityRealm,
    serviceNode: ServiceNode,
    identityProviderNode: IdentityProviderNode,
};

const edgeTypes: EdgeTypes = {
    step: StepEdge, 
};

const DiagramScreen = () => {
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
    } = useDiagram();

    return (
        <ReactFlowProvider>
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
            />
        </ReactFlowProvider>
    );
}

export default DiagramScreen;

