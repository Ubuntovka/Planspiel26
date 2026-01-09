import { BaseEdge, getStraightPath } from '@xyflow/react'
import type { EdgeProps } from '@/types/diagram'
import React from 'react'

const Invocation = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) => {
    // Check if edge should be step (90-degree) or straight
    const isStep = data?.isStep === true;
    
    let d: string;
    
    if (isStep) {
        // Create 90-degree step path: vertical first, then horizontal, then vertical
        const centerX = (sourceX + targetX) / 2;
        const centerY = (sourceY + targetY) / 2;
        d = `M ${sourceX} ${sourceY} L ${sourceX} ${centerY} L ${targetX} ${centerY} L ${targetX} ${targetY}`;
    } else {
        // Straight path
        [d] = getStraightPath({ 
            sourceX, 
            sourceY, 
            targetX, 
            targetY
        });
    }
    
    const markerId = `trust-arrow-${id}`;
    
    return (
        <g>
            <defs>
                <marker
                    id={markerId}
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
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