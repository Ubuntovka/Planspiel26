import { BaseEdge, getEdgeCenter, getStraightPath } from '@xyflow/react'
import type { EdgeProps } from '@/types/diagram'
import React from 'react'

const TrustEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) => {
    const errorColor = "#FF4D4F";
    const hasError = data?.hasError

    // Check if edge should be step (90-degree) or straight
    const isStep = data?.isStep === true;
    
    let d: string;
    let centerXLabel: number;
    let centerYLabel: number;
    
    if (isStep) {
        // Create 90-degree step path: vertical first, then horizontal, then vertical
        const centerX = (sourceX + targetX) / 2;
        const centerY = (sourceY + targetY) / 2;
        d = `M ${sourceX} ${sourceY} L ${sourceX} ${centerY} L ${targetX} ${centerY} L ${targetX} ${targetY}`;
        [centerXLabel, centerYLabel] = getEdgeCenter({
            sourceX,
            sourceY,
            targetX,
            targetY,
        });
    } else {
        // Straight path
        [d] = getStraightPath({ 
            sourceX, 
            sourceY, 
            targetX, 
            targetY
        });
        [centerXLabel, centerYLabel] = getEdgeCenter({
            sourceX,
            sourceY,
            targetX,
            targetY,
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
                    <polygon points="0 0, 10 3.5, 0 7" fill={hasError ? errorColor : "#000"} />
                </marker>
            </defs>
            <BaseEdge
                id={id}
                path={d}
                markerEnd={`url(#${markerId})`}
                style={{ stroke: hasError ? errorColor : '#000', strokeWidth: 2 }}
            />
            {/* Dark gray label above the arrow */}
            <text
                x={centerXLabel}
                y={centerYLabel - 10}
                textAnchor="middle"
                className="pointer-events-none select-none"
                style={{ 
                    fontSize: '12px',
                    fill: '#666',
                    fontFamily: 'sans-serif'
                }}
            >
                Trust
            </text>
            {/* Black label below the arrow */}
            {/* <text
                x={centerX}
                y={centerY + 20}
                textAnchor="middle"
                className="pointer-events-none select-none"
                style={{ 
                    fontSize: '12px',
                    fill: '#000',
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold'
                }}
            >
                Trust
            </text> */}
        </g>
    )
}

export default TrustEdge