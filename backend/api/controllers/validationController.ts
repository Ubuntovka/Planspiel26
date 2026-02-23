import { DiagramState, DiagramNode } from "../../types/diagramTypes";
/**
 * RULES TO VALIDATE:
 *  1. Trust: only Realm to Realm
 *  2. Invocation: Application to Service and Service to Service only.
 *  3. Legacy connection: Application to Data Unit/Processing Unit or Service to Data Unit/Processing Unit. 
 *  4. Contains (Realm): Realm contains one or more elements (Applications, Services, Identity Providers, Data/Processing Units).
 *  5. Identity Provider: No use edges.
 */


/**
 * Validates the current diagram against the rules established above
 * @param diagramState Current diagram state as JSON string
 * @returns List of validation error messages
 */
export async function validate(diagramState: DiagramState): Promise<{errors: string[], sources: any[]}> {
    if (!diagramState || diagramState == null) return {errors: [], sources: []};

    const { nodes, edges } = diagramState;
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
    const validTargetTypes = ['dataProviderNode', 'datasetNode', 'processUnitNode', 'aiProcessNode'];
    if (!validSourceTypes.includes(sourceNode.type) || !validTargetTypes.includes(targetNode.type)) {
        errors.push(`Invalide Legacy Connection from ${sourceNode?.id} to ${targetNode?.id}.`);
    }
    return errors
}