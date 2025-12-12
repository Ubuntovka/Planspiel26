import { useState, useCallback, useRef, useEffect } from "react";
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
    MarkerType
} from "@xyflow/react";
import { initialNodes, initialEdges } from "./data/initialElements";
import type { DiagramNode, DiagramEdge, ContextMenuState, UseDiagramReturn } from "@/types/diagram";
import { exportDiagramToRdfTurtle } from "./ui/exports/exportToRdf";

const STORAGE_KEY = 'diagram.flow';

export const useDiagram = (): UseDiagramReturn => {
    const [nodes, setNodes] = useState<DiagramNode[]>(initialNodes);
    const [edges, setEdges] = useState<DiagramEdge[]>(initialEdges);
    const [menu, setMenu] = useState<ContextMenuState | null>(null);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance<DiagramNode, DiagramEdge> | null>(null);
    const [selectedEdgeType, setSelectedEdgeType] = useState<string>('step');
    const flowWrapperRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

    // load saved flow from storage
    const loadSaved = useCallback((): ReactFlowJsonObject<DiagramNode, DiagramEdge> | null => {
        if (typeof window === 'undefined') return null;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw) as ReactFlowJsonObject<DiagramNode, DiagramEdge>;
        } catch (e) {
            console.warn('Failed to parse saved diagram from storage', e);
            return null;
        }
    }, []);

    // persist flow to storage
    const saveToStorage = useCallback(() => {
        if (typeof window === 'undefined') return;
        try {
            if (rfInstance) {
                const obj = rfInstance.toObject();
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
            } else {
                const minimal: Partial<ReactFlowJsonObject<DiagramNode, DiagramEdge>> = { nodes, edges };
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
            }
        } catch (e) {
            console.warn('Failed to save diagram to storage', e);
        }
    }, [rfInstance, nodes, edges]);

    // On mount: load saved nodes/edges
    useEffect(() => {
        const saved = loadSaved();
        if (saved) {
            if (saved.nodes) setNodes(saved.nodes as DiagramNode[]);
            if (saved.edges) setEdges(saved.edges as DiagramEdge[]);
        }
        // else keep initialNodes/initialEdges
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // reactflow initial state handler
    const onFlowInit = useCallback(
        (instance: ReactFlowInstance<DiagramNode, DiagramEdge>) => { 
        setRfInstance(instance);
        // apply saved viewport if available
        const saved = loadSaved();
        const vp = saved?.viewport;
        if (vp) {
            const { x = 0, y = 0, zoom = 1 } = vp as Viewport;
            instance.setViewport({ x, y, zoom });
        }
        },
        [loadSaved]
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
        // persist immediately after state updates (defer to next tick to let RF apply)
        setTimeout(() => {
            saveToStorage();
        }, 0);
        },
        [rfInstance, saveToStorage]
    );

    // Node change handler
    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes((nds) => applyNodeChanges(changes, nds) as DiagramNode[]);
    }, []);

    // Edge change handler
    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges((eds) => applyEdgeChanges(changes, eds) as DiagramEdge[]);
    }, []);

    // Persist whenever nodes or edges change
    useEffect(() => {
        saveToStorage();
    }, [nodes, edges, saveToStorage]);

    // Persist viewport when panning/zooming ends
    const onMoveEnd = useCallback((event: any, viewport: Viewport) => {
        // rfInstance.toObject() includes viewport
        saveToStorage();
    }, [saveToStorage]);

    // Connection handler
    const onConnect = useCallback((params: Connection) => {
        if (!params.source || !params.target) return;

        const newEdge: DiagramEdge = {
            ...params,
            id: `${params.source}-${params.target}-${Date.now()}`,
            type: selectedEdgeType,
            source: params.source,
            target: params.target,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#808080' },
        };
        setEdges((eds) => addEdge(newEdge, eds) as DiagramEdge[]);
    }, [selectedEdgeType]);

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
        // reset viewport
        if (rfInstance) {
            rfInstance.setViewport({ x: 0, y: 0, zoom: 1 });
        }
        // clear persisted cache as requested
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.removeItem(STORAGE_KEY);
            } catch (e) {
                console.warn('Failed to clear cached diagram from storage', e);
            }
        }
    }, [rfInstance]);
    
    // Separate onPaneClick, close menu
    const closeMenu = useCallback(() => {
        setMenu(null);
    }, []);

    const onPaneClick = useCallback(() => {
        setMenu(null);
    }, []);

    const selectAllNodes = useCallback(() => {
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                selected: true,
            }))
        );
    }, [setNodes]);

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
        selectAllNodes,
        onPaneClick,
        closeMenu,
        onFlowInit,
        exportToJson,
        exportToRdf, 
        importFromJson,
        setNodes,
        selectedEdgeType,
        setSelectedEdgeType,
        onMoveEnd,
    };
};

