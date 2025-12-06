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
} from "@xyflow/react";
import { initialNodes, initialEdges } from "./data/initialElements";
import type { DiagramNode, DiagramEdge, ContextMenuState, UseDiagramReturn } from "@/types/diagram";

export const useDiagram = (): UseDiagramReturn => {
    const [nodes, setNodes] = useState<DiagramNode[]>(initialNodes);
    const [edges, setEdges] = useState<DiagramEdge[]>(initialEdges);
    const [menu, setMenu] = useState<ContextMenuState | null>(null);
    const flowWrapperRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>; 

    // 1. Node change handler
    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes((nds) => applyNodeChanges(changes, nds) as DiagramNode[]);
    }, []);

    // 2. Edge change handler
    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges((eds) => applyEdgeChanges(changes, eds) as DiagramEdge[]);
    }, []);

    // 3. Connection handler
    const onConnect = useCallback((params: Connection) => {
        if (!params.source || !params.target) return;
        
        const newEdge: DiagramEdge = {
            ...params,
            id: params.source + '-' + params.target,
            type: "step", 
            source: params.source, 
            target: params.target, 
            markerEnd: { type: 'arrowclosed', color: '#808080' },
        };
        setEdges((eds) => addEdge(newEdge, eds) as DiagramEdge[]);
    }, []);

    // 4. Node context menu handler
    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => { 
            event.preventDefault();

            if (!flowWrapperRef.current) return;
            const pane = flowWrapperRef.current.getBoundingClientRect();
            
            const top = event.clientY < pane.height - 200 ? event.clientY : undefined;
            const left = event.clientX < pane.width - 200 ? event.clientX : undefined;
            const right = event.clientX >= pane.width - 200 ? pane.width - event.clientX : undefined;
            const bottom = event.clientY >= pane.height - 200 ? pane.height - event.clientY : undefined;
            
            setMenu({ id: node.id, top, left, right, bottom });
        },
        [] 
    );

    // 5. Edge context menu handler
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
        onPaneClick,
    };
};

