import { DiagramEdge, DiagramState } from "../../types/diagramTypes";

/**
 * Translates JSON diagram to RDF diagram
 * @param diagram JSON: JSON of current diagram state
 * @returns RDF: RDF string of current diagram state
 */
export function exportDiagramToRdfTurtle(diagram: DiagramState): string {
  const nodes = diagram.nodes;
  const edges = diagram.edges;

  const lines: string[] = [];

  // prefixes (all real vocabularies)
  lines.push("@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .");
  lines.push("@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .");
  lines.push("@prefix schema: <https://schema.org/> .");
  lines.push("@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .");
  lines.push("@prefix wam:   <https://devinche/schemas/rdf#> .");
  lines.push("");

  // helper to mint node URNs consistently
  const nodeIri = (id: string) => `wam:node:${id}`;
  const edgeIri = (id: string) =>
    `wam:edge:${id.replace(/[^A-Za-z0-9_-]/g, "_")}`;

  // nodes
  for (const node of nodes) {
    const iri = nodeIri(node.id);
    const label = node.data?.label ?? node.type ?? node.id;
    const escapedLabel = String(label).replace(/"/g, '\\"');
    const nodeClass = `wam:${String(node.type).charAt(0).toUpperCase() + String(node.type).slice(1)}`;

    lines.push(`${iri} a ${nodeClass};`);
    lines.push(`  rdfs:label "${escapedLabel}" ;`);

    // identifier
    lines.push(`  schema:identifier "${node.id}" ;`);

    // position
    if (node.position) {
      lines.push(`  wam:xPos "${node.position.x}"^^xsd:decimal ;`);
      lines.push(`  wam:yPos "${node.position.y}"^^xsd:decimal ;`);
    }

    // measured width/height
    const width = (node as any).measured?.width ?? (node as any).width;
    const height = (node as any).measured?.height ?? (node as any).height;
    if (typeof width === "number") {
      lines.push(`  wam:width "${width}"^^xsd:decimal ;`);
    }
    if (typeof height === "number") {
      lines.push(`  wam:height "${height}"^^xsd:decimal ;`);
    }

    // all other data
    if (node.data) {
      for (const [key, value] of Object.entries(node.data)) {
        if (key === "extra" || typeof value === "object" || key === "label")
          continue; // Handle nested below

        const predicate = `wam:${key.replace(/[^a-zA-Z0-9]/g, "")}`; // Sanitize to RDF-safe
        const literal =
          typeof value === "number" ? `"${value}"^^xsd:decimal` : `"${value}"`;
        lines.push(`  ${predicate} ${literal} ;`);
      }
      if (node.data.extra) {
        for (const [key, value] of Object.entries(node.data.extra)) {
          if (key === "extra" || typeof value === "object") continue; // Handle nested below

          const predicate = `wam:${key.replace(/[^a-zA-Z0-9]/g, "")}`; // Sanitize to RDF-safe
          const literal =
            typeof value === "number"
              ? `"${value}"^^xsd:decimal`
              : `"${value}"`;
          lines.push(`  ${predicate} ${literal} ;`);
        }
      }
    }
    // parent relationship
    if (node.parentId) {
      lines.push(`  wam:parentId <wam:node:${node.parentId}> ;`);
      lines.push(`  wam:extent "${node.extent}" ;`);
    }

    lines.push("  .");
    lines.push("");
  }

  // edges
  for (const edge of edges) {
    if (!edge.source || !edge.target || !edge.type) continue;

    const id = edge.id ?? `${edge.source}-${edge.target}`;
    const iri = edgeIri(id);
    const source = nodeIri(edge.source);
    const target = nodeIri(edge.target);

    let edgeClass = "wam:Edge";
    let predicate = "wam:connectsTo";

    switch (edge.type) {
      case "invocation":
        edgeClass = "wam:InvocationEdge";
        predicate = "wam:invokes";
        break;
      case "trust":
        edgeClass = "wam:TrustEdge";
        predicate = "wam:trusts";
        break;
      case "legacy":
        edgeClass = "wam:LegacyEdge";
        predicate = "wam:legacyConnectsTo";
        break;
    }

    // edge instance
    lines.push(`<${iri}> a ${edgeClass} ;`);
    lines.push(`  schema:identifier "${id}" ;`);
    lines.push(`  wam:source <${source}> ;`);
    lines.push(`  wam:target <${target}> ;`);

    // style info
    const style = (edge as DiagramEdge).style;
    if (style?.stroke) {
      const strokeEscaped = String(style.stroke).replace(/"/g, '\\"');
      lines.push(`  wam:strokeColor "${strokeEscaped}" ;`);
    }
    if (typeof style?.strokeWidth === "number") {
      lines.push(`  wam:strokeWidth "${style.strokeWidth}"^^xsd:decimal ;`);
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
    if (edge.sourceHandle) {
      lines.push(`  wam:sourceHandle "${edge.sourceHandle}" ;`);
    }
    if (edge.targetHandle) {
      lines.push(`  wam:targetHandle "${edge.targetHandle}" ;`);
    }

    // data
    if (edge.data) {
      for (const [key, value] of Object.entries(edge.data)) {
        if (key === "extra" || typeof value === "object") continue;

        const predicate = `wam:${key.replace(/[^a-zA-Z0-9]/g, "")}`; // Sanitize to RDF-safe
        const literal =
          typeof value === "number" ? `"${value}"^^xsd:decimal` : `"${value}"`;
        lines.push(`  ${predicate} ${literal} ;`);
      }
      // extra
      if (edge.data.extra) {
        for (const [key, value] of Object.entries(edge.data.extra)) {
          const predicate = `wam:${key.replace(/[^a-zA-Z0-9]/g, "")}`; // Sanitize to RDF-safe
          const literal =
            typeof value === "number"
              ? `"${value}"^^xsd:decimal`
              : `"${value}"`;
          lines.push(`  ${predicate} ${literal} ;`);
        }
      }
    }

    lines.push("  .");
    lines.push("");

    // functional triple for the relationship
    lines.push(`<${source}> ${predicate} <${target}> .`);
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Translates JSON diagram to XML diagram
 * @param diagram JSON: JSON of current diagram state
 * @returns XML: XML string of current diagram state
 */
export function exportDiagramToXml(diagram: DiagramState): string {
  const nodes = diagram.nodes;
  const edges = diagram.edges;

  const xmlParts: string[] = [];
  xmlParts.push('<?xml version="1.0" encoding="UTF-8"?>');
  xmlParts.push("<Diagram>");

  // nodes
  xmlParts.push("<Nodes>");
  for (const node of nodes) {
    const label = node.data?.label ?? node.type ?? node.id;
    const type = node.type;
    xmlParts.push(`<Node id="${node.id}" type="${node.type}">`);
    xmlParts.push(`<Label>${String(label)}</Label>`);
    if (node.position) {
      xmlParts.push(
        `<Position x="${node.position.x}" y="${node.position.y}" />`,
      );
    }
    if (node.measured) {
      xmlParts.push(
        `<Size width="${node.measured.width}" height="${node.measured.height}" />`,
      );
    }
    if (node.data && Object.keys(node.data).length > 1) {
      xmlParts.push("<Data>");
      for (const [key, value] of Object.entries(node.data)) {
        if (key === "extra" || typeof value === "object" || key === "label")
          continue;

        xmlParts.push(
          `<${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>${value}</${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>`,
        );
      }
      if (node.data.extra) {
        for (const [key, value] of Object.entries(node.data.extra)) {
          xmlParts.push(
            `<${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>${value}</${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>`,
          );
        }
      }
      xmlParts.push("</Data>");
    }
    xmlParts.push("</Node>");
  }
  xmlParts.push("</Nodes>");

  // edges
  xmlParts.push("<Edges>");
  for (const edge of edges) {
    xmlParts.push(`<Edge id="${edge.id}" type="${edge.type}">`);
    xmlParts.push(`<Source>${edge.source}</Source>`);
    xmlParts.push(`<Target>${edge.target}</Target>`);
    xmlParts.push(`<SourceHandle>${edge.sourceHandle}</SourceHandle>`);
    xmlParts.push(`<TargetHandle>${edge.targetHandle}</TargetHandle>`);
    xmlParts.push("<Style>");
    for (const [key, value] of Object.entries(edge.style)) {
      xmlParts.push(
        `<${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>${value}</${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>`,
      );
    }
    xmlParts.push("</Style>");
    xmlParts.push("<MarkerEnd>");
    for (const [key, value] of Object.entries(edge.markerEnd)) {
      xmlParts.push(
        `<${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>${value}</${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>`,
      );
    }
    xmlParts.push("</MarkerEnd>");
    if (edge.data) {
      xmlParts.push("<Data>");
      for (const [key, value] of Object.entries(edge.data)) {
        if (key === "extra" || typeof value === "object" || key === "label")
          continue;
        xmlParts.push(
          `<${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>${value}</${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>`,
        );
      }
      if (edge.data.extra) {
        for (const [key, value] of Object.entries(edge.data.extra)) {
          xmlParts.push(
            `<${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>${value}</${String(key).charAt(0).toUpperCase() + String(key).slice(1)}>`,
          );
        }
      }
      xmlParts.push("</Data>");
    }

    xmlParts.push("</Edge>");
  }
  xmlParts.push("</Edges>");

  return xmlParts.join("\n") + "\n</Diagram>";
}
