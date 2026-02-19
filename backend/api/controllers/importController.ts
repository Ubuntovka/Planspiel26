import { DOMParser } from "@xmldom/xmldom";

import {
  DiagramState,
  DiagramEdge,
  DiagramNode,
} from "../../types/diagramTypes";

/**
 * Converts RDF digrams to JSON diagram
 * @param rdfData RDF representation of wam digram
 * @returns JSON of nodes and edges
 */
export function RDFtoJSON(rdfData: string): DiagramState {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];

  // nodes
  const nodeMatch = rdfData.match(/^wam:node:[^.]*/gm);
  if (nodeMatch) {
    for (const node of nodeMatch) {
      const lines = node.split("\n").map((l) => l.trim());
      let count = 0;
      let nodeJson: any = {};
      const labels: any = [];
      const values: any = [];
      // match lines
      for (const line of lines) {
        count += 1;
        const label = line.match(/^rdfs:label "([^"]+)" ;/m);
        if (label) nodeJson["label"] = label[1];
        const id = line.match(/^schema:identifier "([^"]+)" ;/m);
        if (id) nodeJson["id"] = id[1];
        const type = nodeJson.id ? nodeJson.id.match(/^[a-zA-Z]+/) : "";
        if (type) nodeJson["type"] = type[0];
        const parentId = line.match(/^wam:parentId <wam:node:([^>]+)> ;/m);
        if (parentId) nodeJson["parentId"] = parentId[1];
        const other = line.match(/^wam:(\w+) "([^"]+)"(?:\^\^xsd:decimal)? ;/m);
        if (other) labels.push(other[1]);
        if (other) values.push(other[2]);
        if (other) nodeJson[other[1]] = other[2];
      }
      console.log(nodeJson)
      // restructure JSON
      const commonData = [
        "x",
        "y",
        "width",
        "height",
        "extent",
        "label",
        "name",
        "type",
        "cost",
      ];
      const extra: any = {};
      for (let i = 0; i < labels.length; i++) {
        if (!commonData.includes(labels[i])) {
          extra[labels[i]] = values[i];
        }
      }

      const data: any = {};
      if (nodeJson.label) data.label = nodeJson.label;
      if (nodeJson.name) data.name = nodeJson.name;
      if (nodeJson.type) data.type = nodeJson.category;
      if (nodeJson.cost) data.cost = parseFloat(nodeJson.cost);
      data.extra = {
        ...(Object.keys(extra).length && extra),
      };

      let structuredNodeJson = {
        id: nodeJson.id,
        type: nodeJson.type,
        position: {
          x: parseInt(nodeJson.x),
          y: parseInt(nodeJson.y),
        },
        width: parseInt(nodeJson.width),
        height: parseInt(nodeJson.height),
        measured: {
          width: parseInt(nodeJson.width),
          height: parseInt(nodeJson.height),
        },
        ...(Object.keys(data).length && { data }),
        ...(nodeJson.parentId && { parentId: nodeJson.parentId }),
        ...(nodeJson.extent && { extent: nodeJson.extent }),
      };
      nodes.push(structuredNodeJson);
    }
  }

  // edges
  const edgeMatch = rdfData.match(/wam:edge:[^.]*/gm);
  if (edgeMatch) {
    for (const edge of edgeMatch) {
      const lines = edge.split("\n").map((l) => l.trim());
      let count = 0;
      let edgeJson: any = {};
      const labels: any = [];
      const values: any = [];
      // match lines
      for (const line of lines) {
        count += 1;
        const id = line.match(/^schema:identifier "([^"]+)" ;/m);
        if (id) edgeJson["id"] = id[1];
        const type = line.match(/wam:[^ ]+ a wam:([^ ;]+)/);
        if (type) edgeJson["type"] = type[1].toLowerCase().slice(0, -4);
        const source = line.match(/wam:source <wam:node:([^>]+)>/);
        if (source) edgeJson["source"] = source[1];
        const target = line.match(/wam:target <wam:node:([^>]+)>/);
        if (target) edgeJson["target"] = target[1];
        const strokeColor = line.match(/wam:strokeColor\s+"([^"]*)"/);
        if (strokeColor) edgeJson["stroke"] = strokeColor[1];
        const strokeWidth = line.match(/^wam:strokeWidth\s+"([^"]*)"/);
        if (strokeWidth) edgeJson["strokeWidth"] = strokeWidth[1];
        const other = line.match(/wam:([a-zA-Z0-9]+)\s+"([^"]+)"\s*;/);
        if (other) labels.push(other[1]);
        if (other) values.push(other[2]);
        if (other) edgeJson[other[1]] = other[2];
      }

      // restructure JSON
      const commonData = [
        "strokeColor",
        "strokeWidth",
        "id",
        "markerType",
        "markerColor",
        "sourceHandle",
        "targetHandle",
        "label",
      ];
      const extra: any = {};
      for (let i = 0; i < labels.length; i++) {
        if (!commonData.includes(labels[i])) {
          extra[labels[i]] = values[i];
        }
      }

      const data: any = {};
      if (edgeJson.source)
        data.extra = {
          ...(Object.keys(extra).length && extra),
        };

      let structuredEdgeJson = {
        id: edgeJson.id,
        type: edgeJson.type,
        label: edgeJson.label,
        source: edgeJson.source,
        target: edgeJson.target,
        sourceHandle: edgeJson.sourceHandle,
        targetHandle: edgeJson.targetHandle,
        style: {
          stroke: edgeJson.stroke,
          strokeWidth: edgeJson.strokeWidth,
        },
        markerEnd: {
          type: edgeJson.markerType,
          color: edgeJson.markerColor,
        },
        data: {
          ...(Object.keys(extra).length && { extra: extra }),
        },
      };
      edges.push(structuredEdgeJson);
    }
  }
  return { nodes, edges };
}

/**
 * Converts XML digrams to JSON diagram
 * @param xml XML representation of wam digram
 * @returns JSON of nodes and edges
 */
export function XMLtoJSON(xml: string): DiagramState {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];

  const nodesElement = doc.getElementsByTagName("Nodes")[0];
  const nodeElements = nodesElement.getElementsByTagName("Node");

  for (let i = 0; i < nodeElements.length; i++) {
    const nodeEl = nodeElements[i];
    const id = nodeEl.getAttribute("id") || "";
    const type = nodeEl.getAttribute("type") || "";

    const labelEl = nodeEl.getElementsByTagName("Label")[0];
    const label = labelEl ? labelEl.textContent || "" : "";

    const positionEl = nodeEl.getElementsByTagName("Position")[0];
    const position = {
      x: parseInt(positionEl?.getAttribute("x") || "0"),
      y: parseInt(positionEl?.getAttribute("y") || "0"),
    };

    const sizeEl = nodeEl.getElementsByTagName("Size")[0];
    let width = parseInt(sizeEl.getAttribute("width") || "0");
    let height = parseInt(sizeEl.getAttribute("height") || "0");
    const measured = sizeEl
      ? {
          width,
          height,
        }
      : undefined;

    const parentIdEl = nodeEl.getElementsByTagName("ParentId")[0];
    const parentId = parentIdEl ? parentIdEl.textContent || "" : "";

    const dataEl = nodeEl.getElementsByTagName("Data")[0];
    const data: { [key: string]: any } = { label };

    if (dataEl) {
      const dataFields = dataEl.childNodes;
      for (let j = 0; j < dataFields.length; j++) {
        const field = dataFields[j];
        if (field.nodeType === 1) {
          const key =
            field.nodeName.charAt(0).toLowerCase() +
            String(field.nodeName).slice(1);

          if (key === "extra") {
            const extraEl = field as Element;
            const extraData: { [key: string]: any } = {};
            const extraFields = extraEl.childNodes;
            for (let k = 0; k < extraFields.length; k++) {
              const extraField = extraFields[k];
              if (extraField.nodeType === 1) {
                const extraKey =
                  extraField.nodeName.charAt(0).toLowerCase() +
                  String(extraField.nodeName).slice(1);
                let extraValue = extraField.textContent || "";
                extraData[extraKey] = extraValue;
              }
            }
            data[key] = extraData;
          } else {
            let value = field.textContent || "";
            data[key] = value;
          }
        }
      }
    }

    nodes.push({
      id,
      type,
      width,
      height,
      parentId,
      data: Object.keys(data).length > 1 ? data : { label },
      position,
      ...(measured && { measured }),
    });
  }

  const edgesElement = doc.getElementsByTagName("Edges")[0];
  const edgeElements = edgesElement.getElementsByTagName("Edge");

  for (let i = 0; i < edgeElements.length; i++) {
    const edgeEl = edgeElements[i];
    const id = edgeEl.getAttribute("id") || "";
    const type = edgeEl.getAttribute("type") || "";

    const sourceEl = edgeEl.getElementsByTagName("Source")[0];
    const targetEl = edgeEl.getElementsByTagName("Target")[0];
    const sourceHandleEl = edgeEl.getElementsByTagName("SourceHandle")[0];
    const targetHandleEl = edgeEl.getElementsByTagName("TargetHandle")[0];
    const label = edgeEl.getElementsByTagName("Label")[0];

    const styleEl = edgeEl.getElementsByTagName("Style")[0];
    const style = styleEl
      ? {
          stroke: styleEl.getElementsByTagName("Stroke")[0]?.textContent || "",
          strokeWidth: parseInt(
            styleEl.getElementsByTagName("StrokeWidth")[0]?.textContent || "1",
          ),
        }
      : undefined;

    const markerEndEl = edgeEl.getElementsByTagName("MarkerEnd")[0];
    const markerEnd = markerEndEl
      ? {
          type: markerEndEl.getElementsByTagName("Type")[0]?.textContent || "",
          color:
            markerEndEl.getElementsByTagName("Color")[0]?.textContent || "",
        }
      : undefined;

    const dataEl = edgeEl.getElementsByTagName("Data")[0];
    const data: { [key: string]: any } = {};

    if (dataEl) {
      const dataFields = dataEl.childNodes;
      for (let j = 0; j < dataFields.length; j++) {
        const field = dataFields[j];
        if (field.nodeType === 1) {
          const key =
            field.nodeName.charAt(0).toLowerCase() +
            String(field.nodeName).slice(1);

          if (key === "extra") {
            const extraEl = field as Element;
            const extraData: { [key: string]: any } = {};
            const extraFields = extraEl.childNodes;
            for (let k = 0; k < extraFields.length; k++) {
              const extraField = extraFields[k];
              if (extraField.nodeType === 1) {
                const extraKey =
                  extraField.nodeName.charAt(0).toLowerCase() +
                  String(extraField.nodeName).slice(1);
                let extraValue = extraField.textContent || "";
                extraData[extraKey] = extraValue;
              }
            }
            data[key] = extraData;
          } else {
            let value = field.textContent || "";
            data[key] = value;
          }
        }
      }
    }

    edges.push({
      id,
      source: sourceEl?.textContent || "",
      target: targetEl?.textContent || "",
      sourceHandle: sourceHandleEl?.textContent || "",
      targetHandle: targetHandleEl?.textContent || "",
      label: label?.textContent || "",
      type,
      ...(Object.keys(data).length > 0 && { data }),
      ...(style && { style }),
      ...(markerEnd && { markerEnd }),
    });
  }

  return { nodes, edges };
}
