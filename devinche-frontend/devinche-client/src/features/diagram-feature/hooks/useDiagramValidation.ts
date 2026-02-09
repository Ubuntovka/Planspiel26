import { useCallback } from 'react';
import type { DiagramNode, DiagramEdge } from '@/types/diagram';

export const useDiagramValidation = (
  getNodes: () => DiagramNode[],
  getEdges: () => DiagramEdge[],
  setNodes: React.Dispatch<React.SetStateAction<DiagramNode[]>>,
  setEdges: React.Dispatch<React.SetStateAction<DiagramEdge[]>>
) => {
  const validate = useCallback(async (newEdge: DiagramEdge) => {
    const currentNodes = getNodes() as DiagramNode[];
    const currentEdges = getEdges() as DiagramEdge[];

    const edgesForValidation = [...currentEdges, newEdge];

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/validation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { nodes: currentNodes, edges: edgesForValidation } }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Validation failed: ${response.status}`);
      }

      const data = await response.json();
      const sources = data.errors?.sources || [];
      console.log('Validation Sources:', sources);

      const errorNodeIds = new Set(
        sources.map((item: { id: any; }) => item.id)
      );
      console.log('Error Nodes:', errorNodeIds);

      setNodes((nds) => 
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            hasError: errorNodeIds.has(node.id)
          }
        }))
      );

      const errorEdgeIds = new Set(
        sources.map((item: { id: any; }) => item.id)
      );
      console.log('Error Edges:', errorEdgeIds);

      setEdges((eds: DiagramEdge[]) => 
        eds.map((edge: DiagramEdge) => ({
          ...edge,
          data: {
            ...edge.data,
            hasError: errorEdgeIds.has(edge.id)
          }
        }))
      );
      
    } catch (error) {
      console.error("Validation error:", error);
    } 
  }, [getNodes, getEdges, setNodes, setEdges]);

  return { validate };
};