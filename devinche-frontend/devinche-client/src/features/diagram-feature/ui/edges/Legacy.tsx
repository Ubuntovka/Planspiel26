import { BaseEdge, getEdgeCenter, getSimpleBezierPath } from '@xyflow/react'
import type { EdgeProps } from '@/types/diagram'
import React from 'react'

const Legacy = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) => {
    const [d] = getSimpleBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
    const [centerX, centerY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });    
    return (
        <g>
            <BaseEdge
                id={id}
                path={d}
                style={{ stroke: '#000', strokeWidth: 2 }}
            />
        </g>
    )
}

export default Legacy