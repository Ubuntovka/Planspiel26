import type { DiagramNode, DiagramEdge } from '@/types/diagram';

export function exportDiagramToXML(
  nodes: DiagramNode[],
  edges: DiagramEdge[]
): string {
  const xmlParts: string[] = [];
  xmlParts.push('<?xml version="1.0" encoding="UTF-8"?>');
  xmlParts.push('<Diagram>');

  // nodes
  xmlParts.push('<Nodes>');
  for (const node of nodes) {
    const label = node.data?.label ?? node.type ?? node.id;
    const type = node.type
    xmlParts.push(`<Node id="${node.id}" type="${node.type}">`);
    xmlParts.push(`<Label>${String(label)}</Label>`);
    if (node.position) {
      xmlParts.push(
        `<Position x="${node.position.x}" y="${node.position.y}" />`
      );
    }
    if (node.measured) {
        xmlParts.push(
            `<Size width="${node.measured.width}" height="${node.measured.height}" />`
        )
    }
    xmlParts.push('</Node>');
  }
  xmlParts.push('</Nodes>');

// edges    
xmlParts.push('<Edges>');
    for (const edge of edges) { 
        xmlParts.push(`<Edge id="${edge.id}" type="${edge.type}">`);
        xmlParts.push(`<Source>${edge.source}</Source>`);
        xmlParts.push(`<Target>${edge.target}</Target>`);
        xmlParts.push('</Edge>');
    }
    xmlParts.push('</Edges>');

  return xmlParts.join('\n') + '\n</Diagram>';
}