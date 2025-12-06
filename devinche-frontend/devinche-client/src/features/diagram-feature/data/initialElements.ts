import type { DiagramNode, DiagramEdge } from "@/types/diagram";

// Example nodes. Feel free to add or remove them.
export const initialNodes: DiagramNode[] = [
  {
    id: "n1",
    type: "processUnitNode",
    position: { x: 0, y: 0 },
    data: { label: "Process Unit" },
  },
  { 
    id: "n2", 
    type: "default",
    position: { x: 0, y: 100 }, 
    data: { label: "Node 2" } 
  },
  { 
    id: "n3", 
    type: "default",
    position: { x: 0, y: 200 }, 
    data: { label: "Node 3" } 
  },
  {
    id: "n4",
    type: "dataProviderNode",
    position: { x: -100, y: 0 },
    data: { label: "Data Provider" },
  },
  {
    id: "n5",
    type: "applicationNode",
    position: { x: -200, y: 0 },
    data: { label: "Application" },
  },
  {
    id: "n6",
    type: "resizableNode",
    position: { x: -300, y: 0 },
    data: { label: "resizableNode" },
  },
  {
    id: 'A',
    type: 'securityRealm',
    data: { label: null },
    position: { x: 0, y: 0 },
    style: {
      width: 170,
      height: 140,
    },
  },
  {
    id: 'B',
    type: 'applicationNode',
    data: { label: 'child node 1' },
    position: { x: 10, y: 10 },
    parentId: 'A',
    extent: 'parent',
  },
  {
    id: 'C',
    type: 'applicationNode',
    data: { label: 'child node 2' },
    position: { x: 10, y: 90 },
    parentId: 'A',
    extent: 'parent',
  },
];

export const initialEdges: DiagramEdge[] = [
//   { 
//     id: "n2-n3", 
//     source: "n2", 
//     target: "n3", 
//     type: "step" 
//   }
];

