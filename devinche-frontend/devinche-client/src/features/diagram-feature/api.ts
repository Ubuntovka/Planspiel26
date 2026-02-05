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
