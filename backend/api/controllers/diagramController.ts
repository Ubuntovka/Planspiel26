import Diagram, { IDiagram, ShareRole } from '../../models/Diagram';
import User from '../../models/User';
import mongoose from 'mongoose';

export type AccessLevel = 'owner' | 'editor' | 'viewer';

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

export interface DiagramWithAccess {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  nodes?: any[];
  edges?: any[];
  viewport?: { x: number; y: number; zoom: number };
  accessLevel: AccessLevel;
}

function getAccessLevel(diagram: IDiagram, userId: string): AccessLevel {
  const uid = userId.toString();
  if (diagram.userId.toString() === uid) return 'owner';
  const entry = diagram.sharedWith?.find((e) => e.userId.toString() === uid);
  if (entry) return entry.role as AccessLevel;
  return 'viewer'; // will be filtered out when listing
}

export async function listDiagrams(userId: string): Promise<{ diagrams: DiagramWithAccess[] }> {
  const owned = await Diagram.find({ userId })
    .sort({ updatedAt: -1 })
    .select('_id name createdAt updatedAt nodes edges viewport sharedWith userId')
    .lean();
  const shared = await Diagram.find({
    'sharedWith.userId': new mongoose.Types.ObjectId(userId),
    userId: { $ne: new mongoose.Types.ObjectId(userId) },
  })
    .sort({ updatedAt: -1 })
    .select('_id name createdAt updatedAt nodes edges viewport sharedWith userId')
    .lean();
  const seen = new Set<string>();
  const result: DiagramWithAccess[] = [];
  type DiagramLean = Pick<IDiagram, '_id' | 'userId' | 'name' | 'nodes' | 'edges' | 'viewport' | 'sharedWith' | 'createdAt' | 'updatedAt'>;
  const ownedList = owned as unknown as DiagramLean[];
  const sharedList = shared as unknown as DiagramLean[];
  for (const d of ownedList) {
    seen.add(d._id.toString());
    result.push({
      _id: d._id.toString(),
      name: d.name,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      nodes: d.nodes,
      edges: d.edges,
      viewport: d.viewport,
      accessLevel: 'owner',
    });
  }
  for (const d of sharedList) {
    if (seen.has(d._id.toString())) continue;
    seen.add(d._id.toString());
    const level = getAccessLevel(d as IDiagram, userId);
    result.push({
      _id: d._id.toString(),
      name: d.name,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      nodes: d.nodes,
      edges: d.edges,
      viewport: d.viewport,
      accessLevel: level,
    });
  }
  result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return { diagrams: result };
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
): Promise<{ diagram: IDiagram; accessLevel: AccessLevel } | { error: string }> {
  if (!mongoose.Types.ObjectId.isValid(diagramId)) {
    return { error: 'Invalid diagram ID' };
  }
  const diagram = await Diagram.findOne({ _id: diagramId });
  if (!diagram) {
    return { error: 'Diagram not found' };
  }
  const accessLevel = getAccessLevel(diagram, userId);
  if (accessLevel === 'viewer' && diagram.userId.toString() !== userId) {
    const entry = diagram.sharedWith?.find((e) => e.userId.toString() === userId);
    if (!entry) return { error: 'Diagram not found' };
  }
  return { diagram, accessLevel };
}

export async function updateDiagram(
  diagramId: string,
  userId: string,
  input: UpdateDiagramInput
): Promise<{ diagram: IDiagram } | { error: string }> {
  if (!mongoose.Types.ObjectId.isValid(diagramId)) {
    return { error: 'Invalid diagram ID' };
  }
  const diagram = await Diagram.findOne({ _id: diagramId });
  if (!diagram) return { error: 'Diagram not found' };
  const accessLevel = getAccessLevel(diagram, userId);
  if (accessLevel !== 'owner' && accessLevel !== 'editor') {
    return { error: 'You do not have permission to edit this diagram' };
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
  const diagram = await Diagram.findOne({ _id: diagramId });
  if (!diagram) return { error: 'Diagram not found' };
  const accessLevel = getAccessLevel(diagram, userId);
  if (accessLevel !== 'owner') {
    return { error: 'Only owners can delete this diagram' };
  }
  await Diagram.deleteOne({ _id: diagramId });
  return { success: true };
}

// --- Sharing ---

export interface SharedWithEntry {
  userId: string;
  email: string;
  role: ShareRole;
}

export async function listSharedWith(
  diagramId: string,
  userId: string
): Promise<{ sharedWith: SharedWithEntry[] } | { error: string }> {
  if (!mongoose.Types.ObjectId.isValid(diagramId)) {
    return { error: 'Invalid diagram ID' };
  }
  const diagram = await Diagram.findOne({ _id: diagramId });
  if (!diagram) return { error: 'Diagram not found' };
  const accessLevel = getAccessLevel(diagram, userId);
  if (accessLevel !== 'owner') {
    return { error: 'Only owners can view sharing settings' };
  }
  const sharedWith = diagram.sharedWith || [];
  const users = await User.find({ _id: { $in: sharedWith.map((e) => e.userId) } }).select('_id email').lean();
  const byId = new Map(users.map((u: any) => [u._id.toString(), u.email]));
  const result: SharedWithEntry[] = sharedWith.map((e) => ({
    userId: e.userId.toString(),
    email: byId.get(e.userId.toString()) || '(unknown)',
    role: e.role as ShareRole,
  }));
  return { sharedWith: result };
}

export async function shareDiagram(
  diagramId: string,
  ownerId: string,
  email: string,
  role: ShareRole
): Promise<{ sharedWith: SharedWithEntry[] } | { error: string }> {
  if (!mongoose.Types.ObjectId.isValid(diagramId)) {
    return { error: 'Invalid diagram ID' };
  }
  const diagram = await Diagram.findOne({ _id: diagramId });
  if (!diagram) return { error: 'Diagram not found' };
  const accessLevel = getAccessLevel(diagram, ownerId);
  if (accessLevel !== 'owner') {
    return { error: 'Only owners can share this diagram' };
  }
  const targetUser = await User.findOne({ email: (email || '').trim().toLowerCase() });
  if (!targetUser) {
    return { error: 'No user found with that email address' };
  }
  const targetId = targetUser._id.toString();
  if (targetId === ownerId) {
    return { error: 'You cannot share a diagram with yourself' };
  }
  const list = diagram.sharedWith || [];
  const existing = list.find((e) => e.userId.toString() === targetId);
  if (existing) {
    existing.role = role;
  } else {
    list.push({ userId: targetUser._id as mongoose.Types.ObjectId, role });
  }
  diagram.sharedWith = list;
  await diagram.save();
  return listSharedWith(diagramId, ownerId);
}

export async function unshareDiagram(
  diagramId: string,
  ownerId: string,
  targetUserId: string
): Promise<{ sharedWith: SharedWithEntry[] } | { error: string }> {
  if (!mongoose.Types.ObjectId.isValid(diagramId)) {
    return { error: 'Invalid diagram ID' };
  }
  const diagram = await Diagram.findOne({ _id: diagramId });
  if (!diagram) return { error: 'Diagram not found' };
  const accessLevel = getAccessLevel(diagram, ownerId);
  if (accessLevel !== 'owner') {
    return { error: 'Only owners can remove access' };
  }
  diagram.sharedWith = (diagram.sharedWith || []).filter(
    (e) => e.userId.toString() !== targetUserId
  );
  await diagram.save();
  return listSharedWith(diagramId, ownerId);
}

export async function updateSharedRole(
  diagramId: string,
  ownerId: string,
  targetUserId: string,
  role: ShareRole
): Promise<{ sharedWith: SharedWithEntry[] } | { error: string }> {
  if (!mongoose.Types.ObjectId.isValid(diagramId)) {
    return { error: 'Invalid diagram ID' };
  }
  const diagram = await Diagram.findOne({ _id: diagramId });
  if (!diagram) return { error: 'Diagram not found' };
  const accessLevel = getAccessLevel(diagram, ownerId);
  if (accessLevel !== 'owner') {
    return { error: 'Only owners can update access' };
  }
  const entry = (diagram.sharedWith || []).find((e) => e.userId.toString() === targetUserId);
  if (!entry) {
    return { error: 'User does not have access' };
  }
  entry.role = role;
  await diagram.save();
  return listSharedWith(diagramId, ownerId);
}

export async function transferOwnership(
  diagramId: string,
  ownerId: string,
  targetUserId: string
): Promise<{ ownerId: string; sharedWith: SharedWithEntry[] } | { error: string }> {
  if (!mongoose.Types.ObjectId.isValid(diagramId)) {
    return { error: 'Invalid diagram ID' };
  }
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    return { error: 'Invalid user ID' };
  }
  const diagram = await Diagram.findOne({ _id: diagramId });
  if (!diagram) return { error: 'Diagram not found' };
  if (diagram.userId.toString() !== ownerId) {
    return { error: 'Only the owner can transfer ownership' };
  }
  const targetUser = await User.findById(targetUserId).select('_id email');
  if (!targetUser) {
    return { error: 'User not found' };
  }
  const prevOwnerId = diagram.userId.toString();
  diagram.userId = targetUser._id as mongoose.Types.ObjectId;
  diagram.sharedWith = (diagram.sharedWith || []).filter((e) => e.userId.toString() !== targetUserId);
  const alreadyShared = (diagram.sharedWith || []).some((e) => e.userId.toString() === prevOwnerId);
  if (!alreadyShared) {
    diagram.sharedWith.push({ userId: new mongoose.Types.ObjectId(prevOwnerId), role: 'editor' });
  }
  await diagram.save();
  const sharedWith = diagram.sharedWith || [];
  const users = await User.find({ _id: { $in: sharedWith.map((e) => e.userId) } }).select('_id email').lean();
  const byId = new Map(users.map((u: any) => [u._id.toString(), u.email]));
  const result: SharedWithEntry[] = sharedWith.map((e) => ({
    userId: e.userId.toString(),
    email: byId.get(e.userId.toString()) || '(unknown)',
    role: e.role as ShareRole,
  }));
  return { ownerId: targetUser._id.toString(), sharedWith: result };
}
