'use client';

import { useReactFlow } from '@xyflow/react';
import type { CommentItem } from '../../api';

interface CommentMarkersProps {
  comments: CommentItem[];
  onCommentClick?: (commentId: string) => void;
}

/** Renders small pins on the diagram for comments that have an anchor (point or node). */
export default function CommentMarkers({ comments, onCommentClick }: CommentMarkersProps) {
  const { flowToScreenPosition, getNode } = useReactFlow();
  const withAnchor = comments.filter((c) => c.anchor && !c.resolved);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden
    >
      {withAnchor.map((c) => {
        const anchor = c.anchor!;
        let x: number;
        let y: number;
        if (anchor.type === 'point' && typeof anchor.x === 'number' && typeof anchor.y === 'number') {
          const screen = flowToScreenPosition({ x: anchor.x, y: anchor.y });
          x = screen.x;
          y = screen.y;
        } else if (anchor.type === 'node' && anchor.nodeId) {
          const node = getNode(anchor.nodeId);
          if (!node?.position) return null;
          const screen = flowToScreenPosition({
            x: node.position.x + (node.width ?? 0) / 2,
            y: node.position.y,
          });
          x = screen.x;
          y = screen.y;
        } else return null;

        return (
          <div
            key={c._id}
            role="button"
            tabIndex={0}
            onClick={() => onCommentClick?.(c._id)}
            onKeyDown={(e) => e.key === 'Enter' && onCommentClick?.(c._id)}
            className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-transform border-2 pointer-events-auto"
            style={{
              left: x,
              top: y,
              backgroundColor: 'var(--editor-accent)',
              borderColor: 'var(--editor-bg)',
              color: 'white',
            }}
            title="Comment"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
