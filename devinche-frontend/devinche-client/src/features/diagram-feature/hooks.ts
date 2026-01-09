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
    MarkerType,
    useReactFlow
} from "@xyflow/react";
import { initialNodes, initialEdges } from "./data/initialElements";
import type { DiagramNode, DiagramEdge, ContextMenuState, UseDiagramReturn } from "@/types/diagram";
import { exportDiagramToRdfTurtle } from "./ui/exports/exportToRdf";
import { NODE_DEFAULT_SIZE } from "./data/nodeSizes";
import { exportDiagramToXML } from "./ui/exports/exportToXML";

const STORAGE_KEY = 'diagram.flow';
const STORAGE_PTR_KEY = 'diagram.flow.ptr';

export const useDiagram = (): UseDiagramReturn => {
    const [nodes, setNodes] = useState<DiagramNode[]>(initialNodes);
    const [edges, setEdges] = useState<DiagramEdge[]>(initialEdges);
    const [menu, setMenu] = useState<ContextMenuState | null>(null);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance<DiagramNode, DiagramEdge> | null>(null);
    const [selectedEdgeType, setSelectedEdgeType] = useState<string>('step');
    const flowWrapperRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
    const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();

    // History helpers (max 3 snapshots)
    type Snapshot = ReactFlowJsonObject<DiagramNode, DiagramEdge>;

    const readHistory = useCallback((): Snapshot[] => {
        if (typeof window === 'undefined') return [];
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed as Snapshot[];
            }
            // migrate legacy single snapshot to array
            return [parsed as Snapshot];
        } catch (e) {
            console.warn('Failed to parse history from storage', e);
            return [];
        }
    }, []);

    const readPtr = useCallback((): number => {
        if (typeof window === 'undefined') return 0;
        try {
            const raw = window.localStorage.getItem(STORAGE_PTR_KEY);
            const n = raw != null ? Number(raw) : NaN;
            return Number.isFinite(n) ? n : 0;
        } catch {
            return 0;
        }
    }, []);

    const writeHistory = useCallback((hist: Snapshot[], ptr: number) => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hist));
            window.localStorage.setItem(String(STORAGE_PTR_KEY), String(ptr));
        } catch (e) {
            console.warn('Failed to write history to storage', e);
        }
    }, []);

    // Normalize a snapshot for comparison (sort nodes/edges and keep only essential viewport fields)
    const normalizeSnapshot = (snap: Snapshot) => {
        const nodes = [...(snap.nodes ?? [])].sort((a: any, b: any) => String(a.id).localeCompare(String(b.id)));
        const edges = [...(snap.edges ?? [])].sort((a: any, b: any) => String(a.id).localeCompare(String(b.id)));
        const vp = snap.viewport as Viewport | undefined;
        const viewport = vp ? { x: vp.x ?? 0, y: vp.y ?? 0, zoom: vp.zoom ?? 1 } : undefined;
        return { nodes, edges, viewport };
    };

    const snapshotsEqual = (a?: Snapshot, b?: Snapshot) => {
        if (!a || !b) return false;
        try {
            return JSON.stringify(normalizeSnapshot(a)) === JSON.stringify(normalizeSnapshot(b));
        } catch {
            return false;
        }
    };

    const takeSnapshot = useCallback((): Snapshot => {
        if (rfInstance) return rfInstance.toObject();
        return { nodes, edges } as unknown as Snapshot;
    }, [rfInstance, nodes, edges]);

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const updateUndoRedoFlags = useCallback((hist?: Snapshot[], ptrIdx?: number) => {
        const history = hist ?? readHistory();
        const ptr = ptrIdx ?? readPtr();
        setCanUndo(ptr > 0);
        setCanRedo(ptr < history.length - 1);
    }, [readHistory, readPtr]);

    const pushSnapshot = useCallback(() => {
        const current = takeSnapshot();
        let history = readHistory();
        let ptr = readPtr();
        // if we are not at the end, drop forward history
        if (ptr < history.length - 1) {
            history = history.slice(0, ptr + 1);
        }
        // avoid pushing duplicates
        const last = history[history.length - 1];
        if (last && snapshotsEqual(last, current)) {
            updateUndoRedoFlags(history, ptr);
            return;
        }
        // add and cap to last 3
        history.push(current);
        if (history.length > 3) {
            history = history.slice(history.length - 3);
        }
        ptr = history.length - 1;
        writeHistory(history, ptr);
        updateUndoRedoFlags(history, ptr);
    }, [readHistory, readPtr, takeSnapshot, writeHistory, updateUndoRedoFlags]);

    const restoringRef = useRef(false);

    const applySnapshot = useCallback((snap: Snapshot | undefined) => {
        if (!snap) return;
        restoringRef.current = true;
        const nextNodes = (snap.nodes ?? []) as DiagramNode[];
        const nextEdges = (snap.edges ?? []) as DiagramEdge[];
        setNodes(nextNodes);
        setEdges(nextEdges);
        const vp = snap.viewport as Viewport | undefined;
        if (rfInstance && vp) {
            const { x = 0, y = 0, zoom = 1 } = vp;
            rfInstance.setViewport({ x, y, zoom });
        }
        // release the restoring flag on next tick to allow normal saves again
        setTimeout(() => { restoringRef.current = false; }, 0);
    }, [rfInstance]);

    const undo = useCallback(() => {
        let history = readHistory();
        let ptr = readPtr();
        if (ptr <= 0) return;
        ptr -= 1;
        writeHistory(history, ptr);
        applySnapshot(history[ptr]);
        updateUndoRedoFlags(history, ptr);
    }, [applySnapshot, readHistory, readPtr, writeHistory, updateUndoRedoFlags]);

    const redo = useCallback(() => {
        let history = readHistory();
        let ptr = readPtr();
        if (ptr >= history.length - 1) return;
        ptr += 1;
        writeHistory(history, ptr);
        applySnapshot(history[ptr]);
        updateUndoRedoFlags(history, ptr);
    }, [applySnapshot, readHistory, readPtr, writeHistory, updateUndoRedoFlags]);

    // legacy single-snapshot loader retained for initial mount
    const loadSaved = useCallback((): ReactFlowJsonObject<DiagramNode, DiagramEdge> | null => {
        if (typeof window === 'undefined') return null;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw) as ReactFlowJsonObject<DiagramNode, DiagramEdge> | ReactFlowJsonObject<DiagramNode, DiagramEdge>[] as any;
        } catch (e) {
            console.warn('Failed to parse saved diagram from storage', e);
            return null;
        }
    }, []);

    // persist flow to storage (push snapshot)
    const saveToStorage = useCallback(() => {
        if (restoringRef.current) return; // avoid pushing while applying a snapshot
        pushSnapshot();
    }, [pushSnapshot]);

    // On mount: load saved nodes/edges (supports legacy object or history array)
    useEffect(() => {
        const saved = loadSaved();
        if (saved) {
            if (Array.isArray(saved)) {
                const hist = saved as Snapshot[];
                const ptr = Math.max(0, hist.length - 1);
                writeHistory(hist, ptr);
                applySnapshot(hist[ptr]);
                updateUndoRedoFlags(hist, ptr);
            } else {
                const obj = saved as Snapshot;
                // migrate legacy to history array with single snapshot
                const hist = [obj];
                const ptr = 0;
                writeHistory(hist, ptr);
                applySnapshot(obj);
                updateUndoRedoFlags(hist, ptr);
            }
        } else {
            // initialize history with initial state
            const snap = takeSnapshot();
            writeHistory([snap], 0);
            updateUndoRedoFlags([snap], 0);
        }
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

    // XML export handler
    const exportToXml = useCallback((): string => {
        return exportDiagramToXML(nodes, edges);
    }, [nodes, edges]);

    // import JSON handler
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
        // push snapshot only for meaningful node changes like removal
        if (changes.some((c) => c.type === 'remove')) {
            setTimeout(() => {
                saveToStorage();
            }, 0);
        }
    }, [saveToStorage]);

    // Edge change handler
    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges((eds) => applyEdgeChanges(changes, eds) as DiagramEdge[]);
        // push snapshot for meaningful edge changes like removal
        if (changes.some((c) => c.type === 'remove')) {
            setTimeout(() => {
                saveToStorage();
            }, 0);
        }
    }, [saveToStorage]);

    // Snapshot policy: do NOT push on every change. We push on meaningful boundaries
    // such as drag stop, connect, remove/add, drop, import, and viewport move end.
    // This avoids duplicate or near-identical snapshots that break undo/redo UX.

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
        // snapshot after connect
        setTimeout(() => {
            saveToStorage();
        }, 0);
    }, [selectedEdgeType, saveToStorage]);

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
        // clear persisted cache & history
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.removeItem(STORAGE_KEY);
                window.localStorage.removeItem(STORAGE_PTR_KEY);
            } catch (e) {
                console.warn('Failed to clear cached diagram from storage', e);
            }
        }
        // re-init history with empty state
        setTimeout(() => {
            const snap = takeSnapshot();
            writeHistory([snap], 0);
            updateUndoRedoFlags([snap], 0);
        }, 0);
    }, [rfInstance, takeSnapshot, writeHistory, updateUndoRedoFlags]);
    
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
    
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        if (!flowWrapperRef.current) return;

        const dataString = event.dataTransfer.getData('application/reactflow');
        if (!dataString) return;

        const data = JSON.parse(dataString);
        if (data.type === 'node' && data.nodeType) {
        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const size = NODE_DEFAULT_SIZE[data.nodeType] ?? { width: 80, height: 60 };
        const newNode: DiagramNode = {
            id: `${data.nodeType}-${Date.now()}`,
            type: data.nodeType,
            position,
            data: { label: data.label },
            width: size.width,
            height: size.height,
        };

        setNodes((nds) => nds.concat(newNode));
        // snapshot after drop
        setTimeout(() => {
            saveToStorage();
        }, 0);
        }
    }, [screenToFlowPosition, setNodes, saveToStorage]);


    const onNodeDrag = useCallback((_: React.MouseEvent, node: Node) => {
        const intersections = getIntersectingNodes(node, true).map((n) => n.id);

        setNodes((ns) =>
        ns.map((n) => {
            const isIntersecting = intersections.includes(n.id) && n.id !== node.id;
            const isDragging = n.id === node.id;
            let className = '';
            if (isDragging) className += ' is-dragging';
            if (isIntersecting) className += ' is-intersecting';
            return { ...n, className: className.trim() };
        })
        );
    }, [getIntersectingNodes, setNodes]);

    const onNodeDragStop = useCallback(() => {
        setNodes((ns) => ns.map((n) => ({ ...n, className: '' })));
        // snapshot after drag stops
        setTimeout(() => {
            saveToStorage();
        }, 0);
    }, [setNodes, saveToStorage]);



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
        exportToXml,
        importFromJson,
        setNodes,
        selectedEdgeType,
        setSelectedEdgeType,
        onMoveEnd,
        onDragOver,
        onDrop,
        onNodeDrag,
        onNodeDragStop,
        onUndo: undo,
        onRedo: redo,
        canUndo,
        canRedo,
    };
};

