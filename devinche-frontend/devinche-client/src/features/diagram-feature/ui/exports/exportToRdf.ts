import type { DiagramNode, DiagramEdge } from '@/types/diagram';

const RDFS_LABEL = 'http://www.w3.org/2000/01/rdf-schema#label';
const EX_CONNECTS_TO = 'https://example.org/vocab#connectsTo';

export function exportDiagramToRdfTurtle(
  nodes: DiagramNode[],
  edges: DiagramEdge[]
): string {
  const lines: string[] = [];

  // prefixes
  lines.push('@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .');
  lines.push('@prefix ex:   <https://example.org/vocab#> .');
  lines.push('');

  // node labels
  for (const node of nodes) {
    const id = node.id;
    const label = node.data?.label;
    if (label) {
      const escaped = String(label).replace(/"/g, '\\"');
      lines.push(`<urn:node:${id}> rdfs:label "${escaped}" .`);
    }
  }

  // edges as connectsTo relations
  for (const edge of edges) {
    if (!edge.source || !edge.target) continue;
    lines.push(
      `<urn:node:${edge.source}> ex:connectsTo <urn:node:${edge.target}> .`
    );
  }

  return lines.join('\n');
}
