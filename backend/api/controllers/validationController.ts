/**
 * RULES TO VALIDATE:
 *  1. Trust: only Realm to Realm
 *  2. Invocation: Application to Service and Service to Service only.
 *  3. Legacy connection: Application to Data Unit/Processing Unit or Service to Data Unit/Processing Unit. 
 *  4. Contains (Realm): Realm contains one or more elements (Applications, Services, Identity Providers, Data/Processing Units).
 *  5. Identity Provider: No use edges.
 */

// Backend recreation of @xyflow/react Node/Edge base types
export interface BaseNode<T = any> {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: T;
  width?: number | null;
  height?: number | null;
  parentId?: string | null;
  parentNode?: BaseNode<T> | null;
  draggable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  dragging?: boolean;
  [key: string]: any;
}

export interface BaseEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
//   style?: React.CSSProperties | undefined;
  data?: any;
  selected?: boolean;
  animated?: boolean;
  hidden?: boolean;
  [key: string]: any;
}


export interface DiagramState {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

// Extended node type with our custom data structure
export interface DiagramNode extends BaseNode<NodeData> {
  type: string;
  data: NodeData;
}

// Node data structure
export interface NodeData {
  label?: string | null;
  name?: string;
  type?: string;
  cost?: number | string;
  [key: string]: any;
}

export interface DiagramEdge extends BaseEdge {
  type?: string;
}


/**
 * Validates the current diagram against the rules established above
 * @param diagramState Current diagram state as JSON string
 * @returns List of validation error messages
 */
export async function validate(diagramState: string | null): Promise<{errors: string[], sources: any[]}> {
    if (!diagramState || diagramState == null) return {errors: [], sources: []};
    let diagramJson: DiagramState;
    try {
        diagramJson = JSON.parse(diagramState) as DiagramState;
    } catch {
        return {errors: ['Invalid diagram JSON'], sources: []};
    }

    const { nodes, edges } = diagramJson;
    const errors: string[] = [];
    const errorSources: any[] = [];
    for (const node of nodes) {
        if(node.type === "securityRealmNode") {
            const err = checkSecurityRealmChildren(node, nodes);
            if(err.length > 0) {
                errorSources.push(node);
                errors.push(...err);
            }
        }
    }
    for (const edge of edges) {
        const sourceNode = nodes.find(node => node.id === edge.source);
        const targetNode = nodes.find(node => node.id === edge.target);
        if (!sourceNode || !targetNode) {
            errors.push(`Source or target node not found for edge ${edge.id}.`);
            continue;
        }
        if(sourceNode.type === 'identityProviderNode' || targetNode.type === 'identityProviderNode') {
            errors.push(`Invalid use of Identity Provider node in edge from ${sourceNode?.id} to ${targetNode?.id}.`);
        }
        if(edge.type === 'invocation') {
            const err = checkInvocationRelationships(sourceNode, targetNode);
            if(err.length > 0) {
                errorSources.push(edge);
                errors.push(...err);
            }
        }
        if(edge.type === 'trust') {
            const err = checkTrustRelationships(sourceNode, targetNode);
            if(err.length > 0) {    
                errorSources.push(edge);
                errors.push(...err);
            }
        }
        if(edge.type === 'legacy') {
            const err = checkLegacyRelationships(sourceNode, targetNode);
            if(err.length > 0) {
                errorSources.push(edge);
                errors.push(...err);
            }
        }
    }
    return {errors: errors, sources: errorSources};
}

const checkSecurityRealmChildren = (sourceNode: DiagramNode, nodes: DiagramNode[]): string[] => {
    const errors: string[] = [];
    for(const node of nodes) {
        if(node.parentId === sourceNode.id) {
            return []
        }
    }
    return [`Invalide Security Realm ${sourceNode.id}.`]
}

const checkTrustRelationships = (sourceNode: DiagramNode, targetNode: DiagramNode): string[] => {
    const errors: string[] = [];
    const validSourceTypes = ['securityRealmNode'];
    const validTargetTypes = ['securityRealmNode'];
    if (!validSourceTypes.includes(sourceNode.type) || !validTargetTypes.includes(targetNode.type)) {
        errors.push(`Invalide Trust relationship from ${sourceNode?.id} to ${targetNode?.id}.`);
    }
    return errors;
}

const checkInvocationRelationships = (sourceNode: DiagramNode, targetNode: DiagramNode): string[] => {
    const errors: string[] = [];
    const validSourceTypes = ['applicationNode', 'serviceNode'];
    const validTargetTypes = ['serviceNode'];
    if (!validSourceTypes.includes(sourceNode.type) || !validTargetTypes.includes(targetNode.type)) {
        errors.push(`Invalide Invocation relationship from ${sourceNode?.id} to ${targetNode?.id}.`);
    }
    return errors
}

const checkLegacyRelationships = (sourceNode: DiagramNode, targetNode: DiagramNode): string[] => {
    const errors: string[] = [];
    const validSourceTypes = ['applicationNode', 'serviceNode'];
    const validTargetTypes = ['dataProviderNode', 'dataProcessorNode'];
    if (!validSourceTypes.includes(sourceNode.type) || !validTargetTypes.includes(targetNode.type)) {
        errors.push(`Invalide Legacy Connection from ${sourceNode?.id} to ${targetNode?.id}.`);
    }
    return errors
}