import { BaseEdge, getEdgeCenter, getSimpleBezierPath } from '@xyflow/react'
import type { EdgeProps } from '@/types/diagram'
import React from 'react'

const Invocation = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) => {
    const [d] = getSimpleBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
    const [centerX, centerY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });
    
    const markerId = `trust-arrow-${id}`;
    
    return (
        <g>
            <defs>
                <marker
                    id={markerId}
                    markerWidth="10"
                    markerHeight="7"
                    refX="10"
                    refY="3.5"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
                </marker>
            </defs>
            <BaseEdge
                id={id}
                path={d}
                markerEnd={`url(#${markerId})`}
                style={{ stroke: '#000', strokeWidth: 2 }}
            />
        </g>
    )
}

export default Invocation