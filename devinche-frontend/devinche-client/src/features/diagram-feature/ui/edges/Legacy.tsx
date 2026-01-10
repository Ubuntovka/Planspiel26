import { BaseEdge, getStraightPath } from '@xyflow/react'
import type { EdgeProps } from '@/types/diagram'
import React from 'react'

const Legacy = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }: EdgeProps) => {
    const [d] = getStraightPath({ sourceX, sourceY, targetX, targetY })
    
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