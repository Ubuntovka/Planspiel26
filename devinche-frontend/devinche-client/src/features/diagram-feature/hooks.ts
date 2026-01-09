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

export const useDiagram = (): UseDiagramReturn => {
    const [nodes, setNodes] = useState<DiagramNode[]>(initialNodes);
    const [edges, setEdges] = useState<DiagramEdge[]>(initialEdges);
    const [menu, setMenu] = useState<ContextMenuState | null>(null);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance<DiagramNode, DiagramEdge> | null>(null);
    const [selectedEdgeType, setSelectedEdgeType] = useState<string>('step');
    const flowWrapperRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
    const { screenToFlowPosition, getIntersectingNodes, getNodes } = useReactFlow();

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
        }
    }, [screenToFlowPosition, setNodes]);


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
                        if (oldParent && oldParent.position) {
                            return {
                                ...rest,
                                position: {
                                    x: oldParent.position.x + node.position.x,
                                    y: oldParent.position.y + node.position.y,
                                },
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
            return [...parents, ...children];
        });
    }, [getIntersectingNodes, setNodes, getNodes]);



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
    };
};

