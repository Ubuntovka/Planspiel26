import type { DiagramState, DiagramNode, DiagramEdge } from '@/types/diagram';

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
export function validate(diagramState: string | null): string[] {
    if (!diagramState || diagramState == null) return [];

    let diagramJson: DiagramState;
    try {
        diagramJson = JSON.parse(diagramState) as DiagramState;
    } catch {
        return ['Invalid diagram JSON'];
    }

    const { nodes, edges } = diagramJson;
    const errors: string[] = [];


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
            errors.push(...checkInvocationRelationships(sourceNode, targetNode));
        }
        if(edge.type === 'trust') {
            errors.push(...checkTrustRelationships(sourceNode, targetNode));
        }
        if(edge.type === 'legacy') {
            errors.push(...checkLegacyRelationships(sourceNode, targetNode));
        }
        // TODO: Add Realm Contains validation

    }
    return errors;
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