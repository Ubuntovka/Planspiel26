/**
 * Diagram API – CRUD for user diagrams.
 * Requires auth token (Bearer) for all requests.
 */

const getApiBase = (): string => {
  if (typeof window === 'undefined') return '';
  return (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/$/, '');
};

export interface DiagramListItem {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  nodes?: any[];
  edges?: any[];
  viewport?: { x: number; y: number; zoom: number };
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

export async function getDiagram(token: string, id: string): Promise<{ diagram: DiagramData }> {
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
