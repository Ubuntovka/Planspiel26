'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useCollaboration } from '../collaboration/useCollaboration';

interface CollaborationCursorsProps {
  diagramId: string | null | undefined;
  getToken: () => string | null;
  userDisplayName: string;
  flowWrapperRef: React.RefObject<HTMLDivElement | null>;
  enabled?: boolean;
}

export default function CollaborationCursors({
  diagramId,
  getToken,
  userDisplayName,
  flowWrapperRef,
  enabled = true,
}: CollaborationCursorsProps) {
  const { screenToFlowPosition, flowToScreenPosition } = useReactFlow();
  const { cursors, sendCursor } = useCollaboration(enabled ? diagramId : null, getToken, userDisplayName);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!flowWrapperRef.current) return;
      const rect = flowWrapperRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const flow = screenToFlowPosition({ x, y });
      lastRef.current = flow;
    },
    [screenToFlowPosition, flowWrapperRef]
  );

  useEffect(() => {
    if (!enabled || !diagramId) return;
    const el = flowWrapperRef.current;
    if (!el) return;

    const flush = () => {
      if (lastRef.current) {
        sendCursor(lastRef.current.x, lastRef.current.y);
        lastRef.current = null;
      }
      rafRef.current = requestAnimationFrame(flush);
    };
    rafRef.current = requestAnimationFrame(flush);

    el.addEventListener('mousemove', handleMouseMove);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, diagramId, flowWrapperRef, handleMouseMove, sendCursor]);

  if (!enabled || cursors.length === 0) return null;

  return (
    <div
      className="collaboration-cursors"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {cursors.map((c) => {
        const screen = flowToScreenPosition({ x: c.x, y: c.y });
        return (
          <div
            key={c.id}
            style={{
              position: 'absolute',
              left: screen.x,
              top: screen.y,
              transform: 'translate(-2px, -2px)',
              width: 16,
              height: 16,
              border: `2px solid ${c.color}`,
              borderRadius: '50%',
              backgroundColor: `${c.color}40`,
              pointerEvents: 'none',
              transition: 'left 0.05s linear, top 0.05s linear',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 20,
                top: -2,
                padding: '2px 6px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                backgroundColor: c.color,
                color: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            >
              {c.displayName}
            </span>
          </div>
        );
      })}
    </div>
  );
}
