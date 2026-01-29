import { BaseEdge, getStraightPath } from '@xyflow/react'
import type { EdgeProps } from '@/types/diagram'
import React from 'react'

const Legacy = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) => {
    const errorColor = "#FF4D4F";
    const hasError = data?.hasError

    const [d] = getStraightPath({ sourceX, sourceY, targetX, targetY })
    
    return (
        <g>
            <BaseEdge
                id={id}
                path={d}
                style={{ stroke: hasError ? errorColor : '#000', strokeWidth: 2 }}
            />
        </g>
    )
}

export default Legacy