import { useState, useCallback, useRef } from "react";
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
} from "@xyflow/react";
import { initialNodes, initialEdges } from "./data/initialElements";

export const useDiagram = () => {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [menu, setMenu] = useState(null);
    const flowWrapperRef = useRef(null); 

    // 1. Node change handler
    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);

    // 2. Edge change handler
    const onEdgesChange = useCallback((changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);

    // 3. Connection handler
    const onConnect = useCallback((params) => {
        const newEdge = {
            ...params,
            type: "step", 
            source: params.source, 
            target: params.target, 
            markerEnd: { type: 'arrowclosed', color: '#808080' },
        };
        setEdges((eds) => addEdge(newEdge, eds));
    }, []);

    // 4. Node context menu handler
    const onNodeContextMenu = useCallback(
        (event, node) => { 
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
    const onEdgeContextMenu = useCallback((event, edge) => { 
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