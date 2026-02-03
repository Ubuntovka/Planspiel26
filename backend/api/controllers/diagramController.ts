import Diagram, { IDiagram } from '../../models/Diagram';
import mongoose from 'mongoose';

export interface CreateDiagramInput {
  name?: string;
  nodes?: any[];
  edges?: any[];
  viewport?: { x: number; y: number; zoom: number };
}

export interface UpdateDiagramInput {
  name?: string;
  nodes?: any[];
  edges?: any[];
  viewport?: { x: number; y: number; zoom: number };
}

export async function listDiagrams(userId: string): Promise<{ diagrams: IDiagram[] }> {
  const diagrams = await Diagram.find({ userId })
    .sort({ updatedAt: -1 })
    .select('_id name createdAt updatedAt nodes edges viewport')
    .lean();
  return { diagrams: diagrams as unknown as IDiagram[] };
}

export async function createDiagram(
  userId: string,
  input: CreateDiagramInput = {}
): Promise<{ diagram: IDiagram } | { error: string }> {
  const diagram = new Diagram({
    userId,
    name: input.name || 'Untitled Diagram',
    nodes: input.nodes || [],
    edges: input.edges || [],
    viewport: input.viewport || { x: 0, y: 0, zoom: 1 },
  });
  await diagram.save();
  return { diagram };
}

export async function getDiagram(
  diagramId: string,
  userId: string
): Promise<{ diagram: IDiagram } | { error: string }> {
  if (!mongoose.Types.ObjectId.isValid(diagramId)) {
    return { error: 'Invalid diagram ID' };
  }
  const diagram = await Diagram.findOne({ _id: diagramId, userId });
  if (!diagram) {
    return { error: 'Diagram not found' };
  }
  return { diagram };
}

export async function updateDiagram(
  diagramId: string,
  userId: string,
  input: UpdateDiagramInput
): Promise<{ diagram: IDiagram } | { error: string }> {
  if (!mongoose.Types.ObjectId.isValid(diagramId)) {
    return { error: 'Invalid diagram ID' };
  }
  const diagram = await Diagram.findOne({ _id: diagramId, userId });
  if (!diagram) {
    return { error: 'Diagram not found' };
  }
  if (input.name !== undefined) diagram.name = input.name;
  if (input.nodes !== undefined) diagram.nodes = input.nodes;
  if (input.edges !== undefined) diagram.edges = input.edges;
  if (input.viewport !== undefined) diagram.viewport = input.viewport;
  await diagram.save();
  return { diagram };
}

export async function renameDiagram(
  diagramId: string,
  userId: string,
  name: string
): Promise<{ diagram: IDiagram } | { error: string }> {
  return updateDiagram(diagramId, userId, { name: name.trim() || 'Untitled Diagram' });
}

export async function deleteDiagram(
  diagramId: string,
  userId: string
): Promise<{ success: boolean } | { error: string }> {
  if (!mongoose.Types.ObjectId.isValid(diagramId)) {
    return { error: 'Invalid diagram ID' };
  }
  const result = await Diagram.deleteOne({ _id: diagramId, userId });
  if (result.deletedCount === 0) {
    return { error: 'Diagram not found' };
  }
  return { success: true };
}
