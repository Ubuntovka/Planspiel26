'use client';

import { useId } from 'react';

/**
 * Renders a React Flow–style preview: dot grid background, rounded node shapes,
 * and bezier edges. Minimal/abstract representation without full node UI.
 */

interface Node {
  id: string;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
  parentId?: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface DiagramPreviewProps {
  nodes?: Node[];
  edges?: Edge[];
  className?: string;
  style?: React.CSSProperties;
}

const VIEW_W = 280;
const VIEW_H = 210;
const PADDING = 20;
const GRID_SIZE = 16;
const MIN_NODE_PX = 8;
const MAX_NODE_PX = 24;

export function DiagramPreview({ nodes = [], edges = [], className = '', style = {} }: DiagramPreviewProps) {
  const markerId = useId().replace(/:/g, '-');

  if (!nodes?.length && !edges?.length) {
    return null;
  }

  const nodeMap = new Map<string | undefined, { x: number; y: number; w: number; h: number }>();
  const nodesList = Array.isArray(nodes) ? nodes : [];

  for (const n of nodesList) {
    const pos = n.position ?? { x: 0, y: 0 };
    const w = n.width ?? 80;
    const h = n.height ?? 60;
    nodeMap.set(n.id, { x: pos.x, y: pos.y, w, h });
  }

  for (const n of nodesList) {
    if (!n.parentId) continue;
    const parent = nodeMap.get(n.parentId);
    const self = nodeMap.get(n.id);
    if (parent && self) {
      nodeMap.set(n.id, {
        x: parent.x + self.x,
        y: parent.y + self.y,
        w: self.w,
        h: self.h,
      });
    }
  }

  const nodeEntries = Array.from(nodeMap.entries()).filter(([id]) => id != null) as [string, { x: number; y: number; w: number; h: number }][];

  if (nodeEntries.length === 0) return null;

  const minX = Math.min(...nodeEntries.map(([, v]) => v.x));
  const minY = Math.min(...nodeEntries.map(([, v]) => v.y));
  const maxX = Math.max(...nodeEntries.map(([, v]) => v.x + v.w));
  const maxY = Math.max(...nodeEntries.map(([, v]) => v.y + v.h));

  const contentW = Math.max(maxX - minX, 1);
  const contentH = Math.max(maxY - minY, 1);

  const scale = Math.min(
    (VIEW_W - PADDING * 2) / contentW,
    (VIEW_H - PADDING * 2) / contentH,
    2
  );
  const offsetX = PADDING + (VIEW_W - PADDING * 2 - contentW * scale) / 2 - minX * scale;
  const offsetY = PADDING + (VIEW_H - PADDING * 2 - contentH * scale) / 2 - minY * scale;

  const toView = (x: number, y: number) => ({
    x: offsetX + x * scale,
    y: offsetY + y * scale,
  });

  const edgesList = Array.isArray(edges) ? edges : [];
  const nodeById = new Map(nodeEntries);

  // Bezier midpoint helper (quadratic bezier from source to target)
  const getBezierPath = (sx: number, sy: number, tx: number, ty: number) => {
    const mx = (sx + tx) / 2;
    const my = (sy + ty) / 2;
    const dx = tx - sx;
    const dy = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const perpX = -dy / len * Math.min(len * 0.2, 30);
    const perpY = dx / len * Math.min(len * 0.2, 30);
    const cx = mx + perpX;
    const cy = my + perpY;
    return `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
  };

  const gridDots: { x: number; y: number }[] = [];
  for (let x = GRID_SIZE / 2; x < VIEW_W; x += GRID_SIZE) {
    for (let y = GRID_SIZE / 2; y < VIEW_H; y += GRID_SIZE) {
      gridDots.push({ x, y });
    }
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'var(--editor-surface-hover)',
        borderRadius: '8px',
        ...style,
      }}
    >
      <defs>
        <marker
          id={`arrow-preview-${markerId}`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,8 L8,4 z" fill="currentColor" opacity={0.5} />
        </marker>
        <filter id={`shadow-${markerId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Dot grid (React Flow–style canvas background) */}
      <g opacity={0.35}>
        {gridDots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="0.8" fill="currentColor" />
        ))}
      </g>

      {/* Edges – bezier curves (React Flow–style) */}
      {edgesList.map((e) => {
        const src = nodeById.get(e.source);
        const tgt = nodeById.get(e.target);
        if (!src || !tgt) return null;
        const sCenter = toView(src.x + src.w / 2, src.y + src.h / 2);
        const tCenter = toView(tgt.x + tgt.w / 2, tgt.y + tgt.h / 2);
        const d = getBezierPath(sCenter.x, sCenter.y, tCenter.x, tCenter.y);
        return (
          <path
            key={e.id}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeOpacity={0.4}
            markerEnd={`url(#arrow-preview-${markerId})`}
          />
        );
      })}

      {/* Nodes – rounded rects (React Flow node shape, no labels/icons) */}
      {nodeEntries.map(([id, { x, y, w, h }]) => {
        const tl = toView(x, y);
        const br = toView(x + w, y + h);
        let nodeW = br.x - tl.x;
        let nodeH = br.y - tl.y;
        nodeW = Math.max(MIN_NODE_PX, Math.min(MAX_NODE_PX, nodeW));
        nodeH = Math.max(MIN_NODE_PX, Math.min(MAX_NODE_PX, nodeH));
        const cx = (tl.x + br.x) / 2;
        const cy = (tl.y + br.y) / 2;

        return (
          <g key={id} filter={`url(#shadow-${markerId})`}>
            <rect
              x={cx - nodeW / 2}
              y={cy - nodeH / 2}
              width={nodeW}
              height={nodeH}
              rx={4}
              fill="var(--editor-bg)"
              fillOpacity={0.9}
              stroke="currentColor"
              strokeWidth={1}
              strokeOpacity={0.35}
            />
          </g>
        );
      })}
    </svg>
  );
}
