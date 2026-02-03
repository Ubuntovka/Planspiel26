'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import DiagramScreen from '@/features/diagram-feature/DiagramScreen';
import {
  listDiagrams,
  createDiagram,
  deleteDiagram,
  renameDiagram,
  type DiagramListItem,
} from '@/features/diagram-feature/api';
import { DiagramPreviewFlow } from '@/features/diagram-feature/ui/DiagramPreviewFlow';

function DiagramsDashboard() {
  const { getToken, logout } = useAuth();
  const router = useRouter();
  const [diagrams, setDiagrams] = useState<DiagramListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchDiagrams = async () => {
    const token = getToken();
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const { diagrams: list } = await listDiagrams(token);
      setDiagrams(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load diagrams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagrams();
  }, [getToken]);

  const handleCreate = async () => {
    const token = getToken();
    if (!token) return;
    try {
      setCreating(true);
      setError(null);
      const { diagram } = await createDiagram(token, { name: 'Untitled Diagram' });
      router.push(`/editor/${diagram._id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create diagram');
    } finally {
      setCreating(false);
    }
  };

  const handleOpen = (id: string) => {
    router.push(`/editor/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const token = getToken();
    if (!token) return;
    if (!confirm('Delete this diagram?')) return;
    try {
      await deleteDiagram(token, id);
      setDiagrams((prev) => prev.filter((d) => d._id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete diagram');
    }
  };

  const handleRename = async (id: string, newName: string) => {
    const token = getToken();
    if (!token) return;
    const trimmed = newName.trim() || 'Untitled Diagram';
    try {
      await renameDiagram(token, id, trimmed);
      setDiagrams((prev) =>
        prev.map((d) => (d._id === id ? { ...d, name: trimmed, updatedAt: new Date().toISOString() } : d))
      );
      setEditingId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to rename diagram');
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 24 * 60 * 60 * 1000) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return d.toLocaleDateString([], { weekday: 'short' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="min-h-screen"
      data-page="editor-dashboard"
      style={{
        background: 'var(--editor-bg)',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, var(--editor-accent) 0%, transparent 50%)',
      }}
    >
      <header
        className="sticky top-0 z-20 backdrop-blur-xl border-b transition-colors"
        style={{
          borderColor: 'var(--editor-border)',
          backgroundColor: 'color-mix(in srgb, var(--editor-surface) 85%, transparent)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Image src="/devince_log.svg" alt="Devinche" width={40} height={40} className="drop-shadow-sm" />
              <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--editor-text)' }}>
                My Diagrams
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <button
              onClick={handleCreate}
              disabled={creating}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white disabled:opacity-60 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, var(--editor-accent) 0%, var(--editor-accent-hover) 100%)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {creating ? 'Creating...' : 'New diagram'}
            </button>
            <button
              onClick={() => logout()}
              className="px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: 'var(--editor-surface)',
                color: 'var(--editor-text-secondary)',
                border: '1px solid var(--editor-border)',
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {error && (
          <div
            className="mb-6 px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg"
            style={{
              backgroundColor: 'var(--editor-error)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ backgroundColor: 'var(--editor-surface)', border: '1px solid var(--editor-border)' }}
              >
                <div className="aspect-[4/3] w-full" style={{ backgroundColor: 'var(--editor-surface-hover)' }} />
                <div className="p-4 space-y-3">
                  <div className="h-5 rounded-lg w-3/4" style={{ backgroundColor: 'var(--editor-surface-hover)' }} />
                  <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--editor-surface-hover)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : diagrams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: 'linear-gradient(135deg, var(--editor-accent) 0%, var(--editor-accent-hover) 100%)',
                opacity: 0.15,
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--editor-accent)" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--editor-text)' }}>
              No diagrams yet
            </h2>
            <p className="text-base mb-8 max-w-md" style={{ color: 'var(--editor-text-muted)' }}>
              Create your first diagram to visualize workflows, architectures, and more.
            </p>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white disabled:opacity-60 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, var(--editor-accent) 0%, var(--editor-accent-hover) 100%)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {creating ? 'Creating...' : 'Create your first diagram'}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--editor-text)' }}>
                Recent diagrams
              </h2>
              <p className="text-sm" style={{ color: 'var(--editor-text-muted)' }}>
                Click a diagram to edit, or create a new one
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="group flex flex-col items-center justify-center min-h-[180px] rounded-2xl border-2 border-dashed transition-all duration-200 hover:scale-[1.02] hover:border-[var(--editor-accent)] disabled:opacity-50"
                style={{
                  borderColor: 'var(--editor-border)',
                  backgroundColor: 'color-mix(in srgb, var(--editor-surface) 50%, transparent)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-colors"
                  style={{ backgroundColor: 'var(--editor-surface-hover)' }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:stroke-[var(--editor-accent)]" style={{ color: 'var(--editor-text-muted)' }}>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <span className="font-semibold" style={{ color: 'var(--editor-text-secondary)' }}>
                  {creating ? 'Creating...' : 'New diagram'}
                </span>
              </button>

              {diagrams.map((d, i) => (
                <div
                  key={d._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpen(d._id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleOpen(d._id)}
                  className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                  style={{
                    backgroundColor: 'var(--editor-surface)',
                    border: '1px solid var(--editor-border)',
                    boxShadow: '0 4px 20px var(--editor-shadow)',
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  <div
                    className="aspect-[4/3] w-full flex items-center justify-center overflow-hidden relative"
                    style={{ backgroundColor: 'var(--editor-surface-hover)', color: 'var(--editor-accent)' }}
                  >
                    {d.nodes?.length || d.edges?.length ? (
                      <DiagramPreviewFlow nodes={d.nodes} edges={d.edges} className="w-full h-full" />
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M9 21V9" />
                        <path d="M14 9v12" />
                      </svg>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col min-w-0">
                    {editingId === d._id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleRename(d._id, editName)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(d._id, editName);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        className="w-full px-3 py-2 rounded-lg font-semibold text-base border-0 focus:ring-2 focus:ring-[var(--editor-accent)] focus:outline-none"
                        style={{ backgroundColor: 'var(--editor-bg)', color: 'var(--editor-text)' }}
                      />
                    ) : (
                      <p
                        className="font-semibold truncate text-base mb-1"
                        style={{ color: 'var(--editor-text)' }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingId(d._id);
                          setEditName(d.name || 'Untitled Diagram');
                        }}
                      >
                        {d.name || 'Untitled Diagram'}
                      </p>
                    )}
                    <p className="text-sm truncate" style={{ color: 'var(--editor-text-muted)' }}>
                      Edited {formatDate(d.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, d._id)}
                    className="absolute top-3 right-3 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[var(--editor-error)]/20"
                    style={{ color: 'var(--editor-text-muted)' }}
                    aria-label="Delete diagram"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hover:stroke-[var(--editor-error)]">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function EditorPage() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--editor-bg,#e8eaed)]">
        <div className="text-[var(--editor-text,#111)]">Loading...</div>
      </div>
    );
  }

  // Logged in: show diagrams dashboard (select existing or create new)
  if (isAuthenticated) {
    return <DiagramsDashboard />;
  }

  // Not logged in: show editor directly (uses localStorage)
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DiagramScreen />
    </div>
  );
}
