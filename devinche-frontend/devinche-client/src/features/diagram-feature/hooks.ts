import { useState, useCallback, useRef } from "react";
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type NodeChange,
    type EdgeChange,
    type Connection,
    type Node,
    type Edge,
    ReactFlowInstance,
    type ReactFlowJsonObject,
    type Viewport,
    MarkerType,
    useReactFlow
} from "@xyflow/react";
// import { useReactFlow } from '@xyflow/react'; 
import { initialNodes, initialEdges } from "./data/initialElements";
import type { DiagramNode, DiagramEdge, ContextMenuState, UseDiagramReturn } from "@/types/diagram";
import { exportDiagramToRdfTurtle } from "./ui/exports/exportToRdf";

export const useDiagram = (): UseDiagramReturn => {
    const [nodes, setNodes] = useState<DiagramNode[]>(initialNodes);
    const [edges, setEdges] = useState<DiagramEdge[]>(initialEdges);
    const [menu, setMenu] = useState<ContextMenuState | null>(null);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance<DiagramNode, DiagramEdge> | null>(null);
    const flowWrapperRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

    // reactflow initial state handler
    const onFlowInit = useCallback(
        (instance: ReactFlowInstance<DiagramNode, DiagramEdge>) => { 
        setRfInstance(instance);
        },
        []
    );

    // JSON export handler
    const exportToJson = useCallback((): string | null => { 
        if (!rfInstance) return null;
        const flow: ReactFlowJsonObject<DiagramNode, DiagramEdge> = rfInstance.toObject();
        return JSON.stringify(flow, null, 2);
    }, [rfInstance]);

    // RDF export handler
    const exportToRdf = useCallback((): string => {
        return exportDiagramToRdfTurtle(nodes, edges);
    }, [nodes, edges]);

    const importFromJson = useCallback(
        (json: string) => {
        let obj: ReactFlowJsonObject<DiagramNode, DiagramEdge>;
        try {
            obj = JSON.parse(json);
        } catch (e) {
            console.error('Invalid JSON for import', e);
            return;
        }

        const nodes = obj.nodes ?? [];
        const edges = obj.edges ?? [];
        const viewport: Viewport | undefined = obj.viewport;

        setNodes(nodes);
        setEdges(edges);

        if (rfInstance && viewport) {
            const { x = 0, y = 0, zoom = 1 } = viewport;
            rfInstance.setViewport({ x, y, zoom });
        }
        },
        [rfInstance]
    );

    // Node change handler
    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes((nds) => applyNodeChanges(changes, nds) as DiagramNode[]);
    }, []);

    // Edge change handler
    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges((eds) => applyEdgeChanges(changes, eds) as DiagramEdge[]);
    }, []);

    // Connection handler
    const onConnect = useCallback((params: Connection) => {
        if (!params.source || !params.target) return;

        const newEdge: DiagramEdge = {
            ...params,
            id: params.source + '-' + params.target,
            // type: "step", 
            source: params.source,
            target: params.target,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#808080' },
        };
        setEdges((eds) => addEdge(newEdge, eds) as DiagramEdge[]);
    }, []);

    // Node context menu handler
    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            event.preventDefault();

            if (!flowWrapperRef.current) return;
            const pane = flowWrapperRef.current.getBoundingClientRect();

            const top = event.clientY < pane.height - 200 ? event.clientY : undefined;
            const left = event.clientX < pane.width - 200 ? event.clientX : undefined;
            const right = event.clientX >= pane.width - 200 ? pane.width - event.clientX : undefined;
            const bottom = event.clientY >= pane.height - 200 ? pane.height - event.clientY : undefined;

            setMenu({ id: node.id, type: 'node', top, left, right, bottom });
        },
        []
    );

    // Edge context menu handler
    const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
        event.preventDefault();

        if (!flowWrapperRef.current) return;
        const pane = flowWrapperRef.current.getBoundingClientRect();

        const top = event.clientY < pane.height - 200 ? event.clientY : undefined;
        const left = event.clientX < pane.width - 200 ? event.clientX : undefined;
        const right = event.clientX >= pane.width - 200 ? pane.width - event.clientX : undefined;
        const bottom = event.clientY >= pane.height - 200 ? pane.height - event.clientY : undefined;

        setMenu({ id: edge.id, type: 'edge', top, left, right, bottom });
    }, []);

    // Canvas context menu handler
   const onPaneContextMenu = useCallback((event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
        event.preventDefault(); 

        if (!flowWrapperRef.current) return;
        const pane = flowWrapperRef.current.getBoundingClientRect();

        const top = event.clientY < pane.height - 200 ? event.clientY : undefined;
        const left = event.clientX < pane.width - 200 ? event.clientX : undefined;
        const right = event.clientX >= pane.width - 200 ? pane.width - event.clientX : undefined;
        const bottom = event.clientY >= pane.height - 200 ? pane.height - event.clientY : undefined;

        setMenu({ id: 'pane-menu', type: 'canvas', top, left, right, bottom }); 
    }, []);

    // Canvas reset handler
    const resetCanvas = useCallback(() => {
        setNodes([]);
        setEdges([]);
        if (rfInstance) {
            rfInstance.setViewport({ x: 0, y: 0, zoom: 1 });
        }
    }, [rfInstance]);
    
    // Separate onPaneClick, close menu
    const closeMenu = useCallback(() => {
        setMenu(null);
    }, []);

    const onPaneClick = useCallback(() => {
        setMenu(null);
    }, []);

    return {
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
        onPaneClick,
        closeMenu,
        onFlowInit,
        exportToJson,
        exportToRdf, 
        importFromJson,
        setNodes,
    };
};

