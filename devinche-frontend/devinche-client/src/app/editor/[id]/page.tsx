'use client';

import { useParams, useRouter } from 'next/navigation';
import DiagramScreen from '@/features/diagram-feature/DiagramScreen';
import { useAuth } from '@/contexts/AuthContext';

export default function EditorDiagramPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const id = typeof params.id === 'string' ? params.id : null;

  // Must be logged in to edit a specific diagram
  if (!loading && !isAuthenticated) {
    router.replace(`/login?returnUrl=${encodeURIComponent(`/editor/${id || ''}`)}`);
    return null;
  }

  if (!id) {
    router.replace('/editor');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--editor-bg,#e8eaed)]">
        <div className="text-[var(--editor-text,#111)]">Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DiagramScreen diagramId={id} />
    </div>
  );
}
