import type { DiagramNode, DiagramEdge } from '@/types/diagram';

export function exportDiagramToRdfTurtle(
  nodes: DiagramNode[],
  edges: DiagramEdge[]
): string {
  const lines: string[] = [];

  // prefixes (all real vocabularies)
  lines.push('@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .');
  lines.push('@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .');
  lines.push('@prefix schema: <https://schema.org/> .');
  lines.push('@prefix wam:   <https://your-domain.org/wam#> .');
  lines.push('');

  // optional: one diagram resource identified by a URN
  const diagramId = 'urn:diagram:1';
  lines.push(`<${diagramId}> a wam:Diagram .`);
  lines.push('');

  // helper to mint node URNs consistently
  const nodeIri = (id: string) => `urn:node:${id}`;
  const edgeIri = (id: string) =>
    `urn:edge:${id.replace(/[^A-Za-z0-9_-]/g, '_')}`;

  // nodes as instances of wam:*Node subclasses
  for (const node of nodes) {
    const iri = nodeIri(node.id);
    const label = node.data?.label ?? node.type ?? node.id;
    const escapedLabel = String(label).replace(/"/g, '\\"');

    let nodeClass = 'wam:Node';
    switch (node.type) {
      case 'processUnitNode':
        nodeClass = 'wam:ProcessUnitNode';
        break;
      case 'dataProviderNode':
        nodeClass = 'wam:DataProviderNode';
        break;
      case 'applicationNode':
        nodeClass = 'wam:ApplicationNode';
        break;
      case 'serviceNode':
        nodeClass = 'wam:ServiceNode';
        break;
      case 'securityRealmNode':
        nodeClass = 'wam:SecurityRealmNode';
        break;
      case 'identityProviderNode':
        nodeClass = 'wam:IdentityProviderNode';
        break;
    }

    lines.push(`${iri} a ${nodeClass} ;`);
    lines.push(`  rdfs:label "${escapedLabel}" ;`);

    // identifier (from JSON id)
    lines.push(`  schema:identifier "${node.id}" ;`);

    // position (if present)
    if (node.position) {
      lines.push(`  wam:xPos ${node.position.x} ;`);
      lines.push(`  wam:yPos ${node.position.y} ;`);
    }

    // measured width/height (if present)
    const width = (node as any).measured?.width ?? (node as any).width;
    const height = (node as any).measured?.height ?? (node as any).height;
    if (typeof width === 'number') {
      lines.push(`  wam:width ${width} ;`);
    }
    if (typeof height === 'number') {
      lines.push(`  wam:height ${height} ;`);
    }

    lines.push('  .');
    lines.push('');

    // link node to diagram
    lines.push(`<${diagramId}> wam:hasNode <${iri}> .`);
    lines.push('');
  }

  // edges as instances of wam:*Edge subclasses + functional predicates
  for (const edge of edges) {
    if (!edge.source || !edge.target || !edge.type) continue;

    const id = edge.id ?? `${edge.source}-${edge.target}`;
    const iri = edgeIri(id);
    const source = nodeIri(edge.source);
    const target = nodeIri(edge.target);

    let edgeClass = 'wam:Edge';
    let predicate = 'wam:connectsTo';

    switch (edge.type) {
      case 'invocation':
        edgeClass = 'wam:InvocationEdge';
        predicate = 'wam:invokes';
        break;
      case 'trust':
        edgeClass = 'wam:TrustEdge';
        predicate = 'wam:trusts';
        break;
      case 'legacy':
        edgeClass = 'wam:LegacyEdge';
        predicate = 'wam:legacyConnectsTo';
        break;
      // case 'step':
      //   edgeClass = 'wam:StepEdge';
      //   predicate = 'wam:stepConnectsTo';
      //   break;
    }

    // edge instance
    lines.push(`<${iri}> a ${edgeClass} ;`);
    lines.push(`  schema:identifier "${id}" ;`);
    lines.push(`  wam:source <${source}> ;`);
    lines.push(`  wam:target <${target}> ;`);

    // optional styling info
    const style = (edge as any).style;
    if (style?.stroke) {
      const strokeEscaped = String(style.stroke).replace(/"/g, '\\"');
      lines.push(`  wam:strokeColor "${strokeEscaped}" ;`);
    }
    if (typeof style?.strokeWidth === 'number') {
      lines.push(`  wam:strokeWidth ${style.strokeWidth} ;`);
    }

    const markerEnd = (edge as any).markerEnd;
    if (markerEnd?.type) {
      const typeEscaped = String(markerEnd.type).replace(/"/g, '\\"');
      lines.push(`  wam:markerType "${typeEscaped}" ;`);
    }
    if (markerEnd?.color) {
      const colorEscaped = String(markerEnd.color).replace(/"/g, '\\"');
      lines.push(`  wam:markerColor "${colorEscaped}" ;`);
    }

    lines.push('  .');
    lines.push('');

    // functional triple for the relationship
    lines.push(`<${source}> ${predicate} <${target}> .`);
    lines.push('');

    // link edge to diagram
    lines.push(`<${diagramId}> wam:hasEdge <${iri}> .`);
    lines.push('');
  }

  return lines.join('\n');
}
