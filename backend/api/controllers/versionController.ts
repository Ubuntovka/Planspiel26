import mongoose from 'mongoose';
import Diagram from '../../models/Diagram';
import DiagramVersion, { IDiagramVersion } from '../../models/DiagramVersion';

const MAX_VERSIONS = 10;

export interface VersionSummary {
  _id: string;
  diagramId: string;
  message: string;
  description?: string;
  nodeCount: number;
  edgeCount: number;
  createdBy: string;
  createdAt: Date;
}

function toSummary(v: IDiagramVersion): VersionSummary {
  return {
    _id: v._id.toString(),
    diagramId: v.diagramId.toString(),
    message: v.message,
    description: v.description ?? '',
    nodeCount: Array.isArray(v.nodes) ? v.nodes.length : 0,
    edgeCount: Array.isArray(v.edges) ? v.edges.length : 0,
    createdBy: v.createdBy.toString(),
    createdAt: v.createdAt,
  };
}

/** Verify the requesting user has at least editor access to the diagram. */
async function canAccess(
  diagramId: string,
  userId: string,
  requireEditor = false
): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(diagramId)) return false;
  const diagram = await Diagram.findById(diagramId).lean();
  if (!diagram) return false;
  if (diagram.userId.toString() === userId) return true;
  const entry = diagram.sharedWith?.find((e) => e.userId.toString() === userId);
  if (!entry) return false;
  if (requireEditor) return entry.role === 'editor' || entry.role === 'owner';
  return true;
}

/** POST /api/diagrams/:id/versions – create a new version snapshot */
export async function createVersion(
  diagramId: string,
  userId: string,
  message: string,
  description?: string
): Promise<{ version: VersionSummary } | { error: string }> {
  const hasAccess = await canAccess(diagramId, userId, true);
  if (!hasAccess) return { error: 'Diagram not found or insufficient permissions' };

  const diagram = await Diagram.findById(diagramId).lean();
  if (!diagram) return { error: 'Diagram not found' };

  const trimmedMessage = (message || '').trim();
  if (!trimmedMessage) return { error: 'Commit message is required' };

  const version = new DiagramVersion({
    diagramId: new mongoose.Types.ObjectId(diagramId),
    message: trimmedMessage,
    description: (description || '').trim(),
    nodes: diagram.nodes ?? [],
    edges: diagram.edges ?? [],
    viewport: diagram.viewport ?? { x: 0, y: 0, zoom: 1 },
    createdBy: new mongoose.Types.ObjectId(userId),
  });
  await version.save();

  // Prune to keep only MAX_VERSIONS newest versions per diagram
  const count = await DiagramVersion.countDocuments({ diagramId: version.diagramId });
  if (count > MAX_VERSIONS) {
    const oldest = await DiagramVersion.find({ diagramId: version.diagramId })
      .sort({ createdAt: 1 })
      .limit(count - MAX_VERSIONS)
      .select('_id')
      .lean();
    const ids = oldest.map((v) => v._id);
    await DiagramVersion.deleteMany({ _id: { $in: ids } });
  }

  return { version: toSummary(version) };
}

/** GET /api/diagrams/:id/versions – list all versions (summary) */
export async function listVersions(
  diagramId: string,
  userId: string
): Promise<{ versions: VersionSummary[] } | { error: string }> {
  const hasAccess = await canAccess(diagramId, userId, false);
  if (!hasAccess) return { error: 'Diagram not found or insufficient permissions' };

  const versions = await DiagramVersion.find({ diagramId: new mongoose.Types.ObjectId(diagramId) })
    .sort({ createdAt: -1 })
    .lean();

  return { versions: (versions as unknown as IDiagramVersion[]).map(toSummary) };
}

/** GET /api/diagrams/:id/versions/:versionId – get full version (nodes + edges) */
export async function getVersion(
  diagramId: string,
  versionId: string,
  userId: string
): Promise<{ version: IDiagramVersion } | { error: string }> {
  const hasAccess = await canAccess(diagramId, userId, false);
  if (!hasAccess) return { error: 'Diagram not found or insufficient permissions' };
  if (!mongoose.Types.ObjectId.isValid(versionId)) return { error: 'Invalid version ID' };

  const version = await DiagramVersion.findOne({
    _id: versionId,
    diagramId: new mongoose.Types.ObjectId(diagramId),
  });
  if (!version) return { error: 'Version not found' };

  return { version };
}

/** POST /api/diagrams/:id/versions/:versionId/restore – restore diagram to this version */
export async function restoreVersion(
  diagramId: string,
  versionId: string,
  userId: string
): Promise<{ message: string } | { error: string }> {
  const hasAccess = await canAccess(diagramId, userId, true);
  if (!hasAccess) return { error: 'Diagram not found or insufficient permissions' };
  if (!mongoose.Types.ObjectId.isValid(versionId)) return { error: 'Invalid version ID' };

  const version = await DiagramVersion.findOne({
    _id: versionId,
    diagramId: new mongoose.Types.ObjectId(diagramId),
  });
  if (!version) return { error: 'Version not found' };

  await Diagram.findByIdAndUpdate(diagramId, {
    nodes: version.nodes,
    edges: version.edges,
    viewport: version.viewport ?? { x: 0, y: 0, zoom: 1 },
  });

  return { message: `Restored to version: "${version.message}"` };
}
