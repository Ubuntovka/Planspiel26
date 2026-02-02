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
    const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<DiagramEdge | null>(null);
    const flowWrapperRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
    const { screenToFlowPosition, getIntersectingNodes, getNodes, getEdges } = useReactFlow();

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

    const takeSnapshot = useCallback((overrideNodes?: DiagramNode[], overrideEdges?: DiagramEdge[]): Snapshot => {
        if (rfInstance) {
            const snapshot = rfInstance.toObject();
            // If override nodes/edges are provided, use them instead (more up-to-date)
            if (overrideNodes || overrideEdges) {
                return {
                    ...snapshot,
                    nodes: overrideNodes ?? snapshot.nodes,
                    edges: overrideEdges ?? snapshot.edges,
                };
            }
            return snapshot;
        }
        // Fallback to state if rfInstance not available
        return { nodes: overrideNodes ?? nodes, edges: overrideEdges ?? edges } as unknown as Snapshot;
    }, [rfInstance, nodes, edges]);

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const updateUndoRedoFlags = useCallback((hist?: Snapshot[], ptrIdx?: number) => {
        const history = hist ?? readHistory();
        const ptr = ptrIdx ?? readPtr();
        setCanUndo(ptr > 0);
        setCanRedo(ptr < history.length - 1);
    }, [readHistory, readPtr]);

    const pushSnapshot = useCallback((overrideNodes?: DiagramNode[], overrideEdges?: DiagramEdge[]) => {
        const current = takeSnapshot(overrideNodes, overrideEdges);
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
        // Ensure we have valid arrays (not null/undefined)
        const nextNodes = (Array.isArray(snap.nodes) ? snap.nodes : []) as DiagramNode[];
        const nextEdges = (Array.isArray(snap.edges) ? snap.edges : []) as DiagramEdge[];
        
        // Validate node structure - ensure all nodes have required fields
        const validNodes = nextNodes.filter((n) => n && n.id && n.type && n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number');
        
        // Validate edge structure - ensure all edges have required fields
        const validEdges = nextEdges.filter((e) => e && e.id && e.source && e.target);
        
        setNodes(validNodes);
        setEdges(validEdges);
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
    const saveToStorage = useCallback((overrideNodes?: DiagramNode[], overrideEdges?: DiagramEdge[]) => {
        if (restoringRef.current) return; // avoid pushing while applying a snapshot
        pushSnapshot(overrideNodes, overrideEdges);
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

    const validate = async (newEdge: DiagramEdge) => {
    const currentNodes = getNodes() as DiagramNode[];
    const currentEdges = getEdges() as DiagramEdge[];

     const edgesForValidation = [...currentEdges, newEdge];

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/validation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { nodes: currentNodes, edges: edgesForValidation } }),
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
      
    } catch (error) {
      console.error("Validation error:", error);
    } 
  }

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
        console.log("SWT")
        validate(newEdge)
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



const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge as DiagramEdge);
    setSelectedNode(null);
}, []);


const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as DiagramNode);
    setSelectedEdge(null); 
}, []);


const onPaneClick = useCallback(() => {
    setMenu(null);
    setSelectedNode(null);
    setSelectedEdge(null); 
}, []);

const onUpdateEdge = useCallback((edgeId: string, data: Partial<any>) => {
    setEdges((eds) => {
        const updatedEdges = eds.map((edge) => {
            if (edge.id === edgeId) {
                return { 
                    ...edge, 
                    data: { ...edge.data, ...data },
                    label: data.label ?? data.name ?? edge.label 
                };
            }
            return edge;
        });
        setSelectedEdge((current) => {
            if (current && current.id === edgeId) {
                const updated = updatedEdges.find((e) => e.id === edgeId);
                return updated || null;
            }
            return current;
        });
        setTimeout(() => saveToStorage(), 0);
        return updatedEdges;
    });
}, [saveToStorage]);

    // Update node data handler
    const onUpdateNode = useCallback((nodeId: string, data: Partial<import('@/types/diagram').NodeData>) => {
        setNodes((nds) => {
            const updated = nds.map((n) => {
                if (n.id === nodeId) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            ...data,
                        },
                    };
                }
                return n;
            });
            
            // Update selected node if it's the one being updated
            setSelectedNode((current) => {
                if (current && current.id === nodeId) {
                    const updatedNode = updated.find((n) => n.id === nodeId);
                    return updatedNode || null;
                }
                return current;
            });

            // Save snapshot after update
            setTimeout(() => {
                saveToStorage();
            }, 0);

            return updated;
        });
    }, [saveToStorage]);

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
        
        // Don't allow Security Realm nodes to be children
        const isSecurityRealm = data.nodeType === 'securityRealmNode';
        
        setNodes((nds) => {
            // Check if drop position is over a Security Realm node
            const securityRealmParent = nds.find((n) => {
                if (n.type !== 'securityRealmNode' || !n.position || !n.width || !n.height) {
                    return false;
                }
                const nodeX = n.position.x;
                const nodeY = n.position.y;
                const nodeWidth = n.width;
                const nodeHeight = n.height;
                
                // Check if drop position is within the Security Realm bounds
                return (
                    position.x >= nodeX &&
                    position.x <= nodeX + nodeWidth &&
                    position.y >= nodeY &&
                    position.y <= nodeY + nodeHeight
                );
            });

        const newNode: DiagramNode = {
            id: `${data.nodeType}-${Date.now()}`,
            type: data.nodeType,
                position: securityRealmParent && !isSecurityRealm && securityRealmParent.position
                    ? {
                        // Relative position to parent
                        x: position.x - securityRealmParent.position.x,
                        y: position.y - securityRealmParent.position.y,
                    }
                    : position,
            data: { label: data.label },
            width: size.width,
            height: size.height,
                ...(securityRealmParent && !isSecurityRealm 
                    ? { 
                        parentId: securityRealmParent.id,
                        extent: 'parent' as const,
                    } 
                    : {}),
            };

            const updatedNodes = nds.concat(newNode);
            // Ensure parents come before children in the array (React Flow requirement)
            const parents = updatedNodes.filter((n) => !n.parentId || n.type === 'securityRealmNode');
            const children = updatedNodes.filter((n) => n.parentId && n.type !== 'securityRealmNode');
            return [...parents, ...children];
        });
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

    const onNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
        if (!node.position) return;
        
        // Get current nodes from React Flow (most up-to-date state)
        const currentNodes = getNodes();
        const currentNode = currentNodes.find((n) => n.id === node.id);
        if (!currentNode) return;
        
        // Clear className for all nodes (original functionality)
        setNodes((ns) => {
            // First, clear className
            let updatedNodes = ns.map((n) => ({ ...n, className: '' }));
            
            // Don't allow Security Realm nodes to be children
            if (currentNode.type === 'securityRealmNode') {
                updatedNodes = updatedNodes.map((n) => {
                    if (n.id === node.id && n.parentId) {
                        const { parentId, extent, ...rest } = n;
                        // Convert relative position back to absolute
                        const oldParent = currentNodes.find((p) => p.id === parentId);
                        if (oldParent && oldParent.position && node.position) {
                            return {
                                ...rest,
                                position: {
                                    x: oldParent.position.x + node.position.x,
                                    y: oldParent.position.y + node.position.y,
                                },
                            };
                        }
                        // If parent doesn't exist or has no position, keep current position
                        if (node.position) {
                            return {
                                ...rest,
                                position: node.position,
                            };
                        }
                        return rest;
                    }
                    return n;
                });
            } else {
                // Find Security Realm nodes that the dragged node is intersecting with
                // Use the node from React Flow state, not the parameter (which might have stale position)
                const intersections = getIntersectingNodes(currentNode, true);
                const securityRealmParent = intersections.find(
                    (n) => n.type === 'securityRealmNode' && n.id !== node.id
                );
                
                // Also check manually if getIntersectingNodes doesn't work properly
                if (!securityRealmParent && currentNode.position) {
                    // Get absolute position of dragged node
                    let absX = currentNode.position.x;
                    let absY = currentNode.position.y;
                    if (currentNode.parentId) {
                        const oldParent = currentNodes.find((p) => p.id === currentNode.parentId);
                        if (oldParent && oldParent.position) {
                            absX = oldParent.position.x + currentNode.position.x;
                            absY = oldParent.position.y + currentNode.position.y;
                        }
                    }
                    
                    const manualCheck = currentNodes.find((n) => {
                        if (n.type !== 'securityRealmNode' || n.id === node.id || !n.position || !n.width || !n.height) {
                            return false;
                        }
                        // Check if node center or any part is within Security Realm bounds
                        const nodeWidth = currentNode.width || 80;
                        const nodeHeight = currentNode.height || 60;
                        return (
                            (absX >= n.position.x && absX <= n.position.x + n.width &&
                             absY >= n.position.y && absY <= n.position.y + n.height) ||
                            (absX + nodeWidth >= n.position.x && absX + nodeWidth <= n.position.x + n.width &&
                             absY + nodeHeight >= n.position.y && absY + nodeHeight <= n.position.y + n.height) ||
                            (absX + nodeWidth / 2 >= n.position.x && absX + nodeWidth / 2 <= n.position.x + n.width &&
                             absY + nodeHeight / 2 >= n.position.y && absY + nodeHeight / 2 <= n.position.y + n.height)
                        );
                    });
                    
                    if (manualCheck) {
                        const relativeX = absX - manualCheck.position.x;
                        const relativeY = absY - manualCheck.position.y;
                        
                        updatedNodes = updatedNodes.map((n) => {
                            if (n.id !== node.id) return n;
                            return {
                                ...n,
                                parentId: manualCheck.id,
                                position: { x: relativeX, y: relativeY },
                                extent: 'parent' as const,
                            };
                        });
                        const parents = updatedNodes.filter((n) => !n.parentId || n.type === 'securityRealmNode');
                        const children = updatedNodes.filter((n) => n.parentId && n.type !== 'securityRealmNode');
                        return [...parents, ...children];
                    }
                }

                updatedNodes = updatedNodes.map((n) => {
                    if (n.id !== node.id) return n;

                    // If dragged node is over a Security Realm, set it as parent
                    if (securityRealmParent) {
                        const parentNode = currentNodes.find((p) => p.id === securityRealmParent.id);
                        if (parentNode && parentNode.position && currentNode.position) {
                            // Calculate absolute position of dragged node
                            // Use currentNode.position which is the actual current position
                            let absoluteX = currentNode.position.x;
                            let absoluteY = currentNode.position.y;
                            
                            // If node already had a parent, the position is relative, so convert to absolute
                            if (currentNode.parentId) {
                                const oldParent = currentNodes.find((p) => p.id === currentNode.parentId);
                                if (oldParent && oldParent.position) {
                                    absoluteX = oldParent.position.x + currentNode.position.x;
                                    absoluteY = oldParent.position.y + currentNode.position.y;
                                }
                            }
                            
                            // Calculate relative position to new parent
                            const relativeX = absoluteX - parentNode.position.x;
                            const relativeY = absoluteY - parentNode.position.y;
                            
                            return {
                                ...n,
                                parentId: securityRealmParent.id,
                                position: {
                                    x: relativeX,
                                    y: relativeY,
                                },
                                extent: 'parent' as const,
                            };
                        }
                    } else {
                        // If not over a Security Realm, remove parentId if it exists
                        if (n.parentId) {
                            const { parentId, extent, ...rest } = n;
                            // Convert relative position back to absolute
                            const oldParent = currentNodes.find((p) => p.id === parentId);
                            if (oldParent && oldParent.position && currentNode.position) {
                                return {
                                    ...rest,
                                    position: {
                                        x: oldParent.position.x + currentNode.position.x,
                                        y: oldParent.position.y + currentNode.position.y,
                                    },
                                };
                            }
                            return rest;
                        }
                    }

                    return n;
                });
            }
            
            // Ensure parents come before children in the array (React Flow requirement)
            const parents = updatedNodes.filter((n) => !n.parentId || n.type === 'securityRealmNode');
            const children = updatedNodes.filter((n) => n.parentId && n.type !== 'securityRealmNode');
            const finalNodes = [...parents, ...children];
            
            // Save snapshot with the updated nodes to ensure we capture the latest state
            // Use a longer timeout to ensure React Flow has processed the update
            // Get the latest nodes and edges from React Flow to ensure we have the most up-to-date state
            setTimeout(() => {
                const latestNodes = getNodes();
                const latestEdges = getEdges();
                // Validate that we have valid data before saving
                if (latestNodes && latestNodes.length >= 0 && latestEdges && Array.isArray(latestEdges)) {
                    saveToStorage(latestNodes as DiagramNode[], latestEdges as DiagramEdge[]);
                }
            }, 100);
            
            return finalNodes;
        });
    }, [getIntersectingNodes, setNodes, getNodes, getEdges, saveToStorage]);



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
        setEdges,
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
        selectedNode,
        onNodeClick,
        onUpdateNode,
        selectedEdge,     
        onEdgeClick,      
        onUpdateEdge,          
    };
};

