import { BaseEdge } from "@xyflow/react";

export default function StepEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const centerY = (targetY - sourceY) / 2 + sourceY;

  const edgePath = `M ${sourceX} ${sourceY} L ${sourceX} ${centerY} L ${targetX} ${centerY} L ${targetX} ${targetY}`;

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd="url(#arrowhead)"
      style={{ stroke: "#222", strokeWidth: 2 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#222" />
        </marker>
      </defs>
    </BaseEdge>
  );
}
