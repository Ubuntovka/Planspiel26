'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

export interface RemoteCursor {
  id: string;
  displayName: string;
  color: string;
  x: number;
  y: number;
}

interface CollaborationCursorsProps {
  flowWrapperRef: React.RefObject<HTMLDivElement | null>;
  cursors: RemoteCursor[];
  sendCursor: ((x: number, y: number) => void) | undefined;
  enabled: boolean;
}

export default function CollaborationCursors({
  flowWrapperRef,
  cursors,
  sendCursor,
  enabled,
}: CollaborationCursorsProps) {
  const { screenToFlowPosition, flowToScreenPosition } = useReactFlow();
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
    if (!enabled || !sendCursor) return;
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
  }, [enabled, sendCursor, flowWrapperRef, handleMouseMove]);

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
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              transition: 'left 0.08s ease-out, top 0.08s ease-out',
            }}
          >
            {/* Cursor dot with subtle ring (Docs-style) */}
            <div
              data-cursor-dot
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: `2px solid ${c.color}`,
                backgroundColor: `${c.color}50`,
                boxShadow: `0 0 0 1px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.12)`,
              }}
            />
            {/* Name pill */}
            <span
              style={{
                position: 'absolute',
                left: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '3px 8px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                backgroundColor: c.color,
                color: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
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
