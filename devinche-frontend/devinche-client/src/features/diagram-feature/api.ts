/**
 * Diagram API – CRUD for user diagrams.
 * Requires auth token (Bearer) for all requests.
 */

const getApiBase = (): string => {
  if (typeof window === 'undefined') return '';
  return (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
};

export type DiagramAccessLevel = 'owner' | 'editor' | 'viewer';

export interface DiagramListItem {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  nodes?: any[];
  edges?: any[];
  viewport?: { x: number; y: number; zoom: number };
  accessLevel?: DiagramAccessLevel;
}

export interface SharedWithEntry {
  userId: string;
  email: string;
  role: 'viewer' | 'editor' | 'owner';
}

export interface DiagramData {
  _id: string;
  name: string;
  nodes: any[];
  edges: any[];
  viewport?: { x: number; y: number; zoom: number };
  createdAt?: string;
  updatedAt?: string;
}

function headers(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function listDiagrams(token: string): Promise<{ diagrams: DiagramListItem[] }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams`, {
    method: 'GET',
    headers: headers(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to fetch diagrams');
  return data;
}

export async function createDiagram(
  token: string,
  opts?: { name?: string; nodes?: any[]; edges?: any[]; viewport?: { x: number; y: number; zoom: number } }
): Promise<{ diagram: DiagramData }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(opts || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to create diagram');
  return data;
}

export async function getDiagram(
  token: string,
  id: string
): Promise<{ diagram: DiagramData; accessLevel?: DiagramAccessLevel }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${id}`, {
    method: 'GET',
    headers: headers(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to fetch diagram');
  return data;
}

export async function updateDiagram(
  token: string,
  id: string,
  opts: { name?: string; nodes?: any[]; edges?: any[]; viewport?: { x: number; y: number; zoom: number } }
): Promise<{ diagram: DiagramData }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${id}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(opts),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to update diagram');
  return data;
}

export async function renameDiagram(token: string, id: string, name: string): Promise<{ diagram: DiagramData }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${id}/rename`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({ name }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to rename diagram');
  return data;
}

export async function deleteDiagram(token: string, id: string): Promise<void> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to delete diagram');
}

/** List users with access to a diagram (owner only). */
export async function listSharedWith(
  token: string,
  diagramId: string
): Promise<{ sharedWith: SharedWithEntry[] }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/shared`, {
    method: 'GET',
    headers: headers(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to load sharing');
  return data;
}

/** Share diagram with a user by email (owner only). */
export async function shareDiagram(
  token: string,
  diagramId: string,
  email: string,
  role: 'viewer' | 'editor' | 'owner'
): Promise<{ sharedWith: SharedWithEntry[] }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/share`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ email: email.trim(), role }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to share');
  return data;
}

/** Remove a user's access (owner only). */
export async function unshareDiagram(
  token: string,
  diagramId: string,
  targetUserId: string
): Promise<{ sharedWith: SharedWithEntry[] }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/share/${targetUserId}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to remove access');
  return data;
}

/** Update a user's access role (owner only). */
export async function updateSharedRole(
  token: string,
  diagramId: string,
  targetUserId: string,
  role: 'viewer' | 'editor' | 'owner'
): Promise<{ sharedWith: SharedWithEntry[] }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/share/${targetUserId}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({ role }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to update access');
  return data;
}

/** Transfer ownership to another user (owner only). */
export async function transferOwnership(
  token: string,
  diagramId: string,
  targetUserId: string
): Promise<{ ownerId: string; sharedWith: SharedWithEntry[] }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/transfer-owner`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ targetUserId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to transfer ownership');
  return data;
}

/** Get API base without auth (for public endpoints like LLM generate) */
function getApiBasePublic(): string {
  if (typeof window === 'undefined') return '';
  return (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
}

// --- Comments & Notifications (auth required) ---

export interface CommentAnchor {
  type: 'point' | 'node' | 'edge';
  nodeId?: string;
  edgeId?: string;
  x?: number;
  y?: number;
}

export interface CommentAuthor {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface CommentItem {
  _id: string;
  diagramId: string;
  userId: string;
  content: string;
  anchor?: CommentAnchor;
  mentions: string[];
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
  author?: CommentAuthor;
}

export interface CollaboratorUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export async function getDiagramCollaborators(
  token: string,
  diagramId: string
): Promise<{ users: CollaboratorUser[] }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/collaborators`, {
    method: 'GET',
    headers: headers(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to load collaborators');
  return data;
}

export async function listComments(
  token: string,
  diagramId: string
): Promise<{ comments: CommentItem[] }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/comments`, {
    method: 'GET',
    headers: headers(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to load comments');
  return data;
}

export async function createComment(
  token: string,
  diagramId: string,
  body: { content: string; anchor?: CommentAnchor; mentions?: string[] }
): Promise<{ comment: CommentItem }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/comments`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to add comment');
  return data;
}

export async function updateComment(
  token: string,
  diagramId: string,
  commentId: string,
  updates: { content?: string; resolved?: boolean }
): Promise<{ comment: CommentItem }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/comments/${commentId}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(updates),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to update comment');
  return data;
}

export async function deleteComment(
  token: string,
  diagramId: string,
  commentId: string
): Promise<void> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to delete comment');
}

export interface NotificationItem {
  _id: string;
  type: string;
  commentId: string;
  diagramId: string;
  diagramName?: string;
  fromUserId?: string;
  read: boolean;
  createdAt: string;
}

export async function listNotifications(
  token: string,
  opts?: { unreadOnly?: boolean; limit?: number }
): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
  const base = getApiBase();
  const params = new URLSearchParams();
  if (opts?.unreadOnly) params.set('unreadOnly', 'true');
  if (opts?.limit != null) params.set('limit', String(opts.limit));
  const qs = params.toString();
  const url = `${base}/api/notifications${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { method: 'GET', headers: headers(token) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to load notifications');
  return data;
}

export async function markNotificationRead(
  token: string,
  notificationId: string
): Promise<{ notification: NotificationItem }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to mark as read');
  return data;
}

export async function markAllNotificationsRead(token: string): Promise<{ updated: number }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/notifications/read-all`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to mark all as read');
  return data;
}

export interface GenerateDiagramResult {
  diagram: { nodes: any[]; edges: any[]; viewport?: { x: number; y: number; zoom: number } };
  /** Present when the diagram still has WAM validation issues after retry. */
  validationErrors?: string[];
}

/**
 * Generate WAM diagram JSON from a natural-language prompt via the backend LLM.
 * Does not require auth. Backend must have OPENAI_API_KEY configured.
 */
export async function generateDiagramFromPrompt(prompt: string): Promise<GenerateDiagramResult> {
  const base = getApiBasePublic();
  if (!base) throw new Error('API base URL not configured');
  const res = await fetch(`${base}/api/llm/generate-diagram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as { error?: string }).error || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data as GenerateDiagramResult;
}

export interface ExplainDiagramCostSummary {
  nodes: number;
  edges: number;
  realms: number;
  aiProcesses: number;
  estimatedMonthlyUsd: number;
}

export interface ExplainDiagramResponse {
  explanation: string;
  level: string;
  validation: { valid: boolean; errors: string[] };
  summary: { nodeCount: number; edgeCount: number; realmCount: number; isValid: boolean };
}

export async function explainDiagram(
  diagram: { nodes: any[]; edges: any[]; viewport?: { x: number; y: number; zoom: number } },
  level?: 'simple' | 'technical'
): Promise<ExplainDiagramResponse> {
  const base = getApiBasePublic();
  if (!base) throw new Error('API base URL not configured');
  const res = await fetch(`${base}/api/llm/explain-diagram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ diagram, level: level || 'simple' }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as { error?: string }).error || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data as ExplainDiagramResponse;
}

// --- Diagram Versions ---

export interface DiagramVersionSummary {
  _id: string;
  diagramId: string;
  message: string;
  description?: string;
  nodeCount: number;
  edgeCount: number;
  createdBy: string;
  createdAt: string;
}

export interface DiagramVersionFull extends DiagramVersionSummary {
  nodes: any[];
  edges: any[];
  viewport?: { x: number; y: number; zoom: number };
}

export async function createDiagramVersion(
  token: string,
  diagramId: string,
  message: string,
  description?: string
): Promise<{ version: DiagramVersionSummary }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/versions`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ message, description }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to create version');
  return data;
}

export async function listDiagramVersions(
  token: string,
  diagramId: string
): Promise<{ versions: DiagramVersionSummary[] }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/versions`, {
    method: 'GET',
    headers: headers(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to list versions');
  return data;
}

export async function getDiagramVersion(
  token: string,
  diagramId: string,
  versionId: string
): Promise<{ version: DiagramVersionFull }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/versions/${versionId}`, {
    method: 'GET',
    headers: headers(token),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to get version');
  return data;
}

export async function restoreDiagramVersion(
  token: string,
  diagramId: string,
  versionId: string
): Promise<{ message: string }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/diagrams/${diagramId}/versions/${versionId}/restore`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Failed to restore version');
  return data;
}

// --- LLM Documentation ---

export async function generateDiagramDocumentation(
  diagram: { nodes: any[]; edges: any[]; viewport?: { x: number; y: number; zoom: number } },
  diagramName?: string
): Promise<{ markdown: string; diagramName: string }> {
  const base = getApiBasePublic();
  if (!base) throw new Error('API base URL not configured');
  const res = await fetch(`${base}/api/llm/generate-documentation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ diagram, diagramName: diagramName || 'Untitled Diagram' }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as { error?: string }).error || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data as { markdown: string; diagramName: string };
}
