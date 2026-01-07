import { Position, Handle } from "@xyflow/react";
import type { NodeProps } from "@/types/diagram";


const ServiceNode = ({ data, selected }: NodeProps) => {
    const strokeColor = selected ? 'var(--editor-accent)' : 'var(--editor-text)';
    const fillColor = "var(--editor-surface)"; 
    
    return (
        <div className="relative" style={{ width: 86, height: 78 }}>
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 86 78"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path 
                    d="M31.7544 8.43415C36.7317 -0.186735 49.1748 -0.186749 54.1521 8.43413L82.1492 56.9266C87.1265 65.5475 80.9049 76.3236 70.9504 76.3236H14.9561C5.0016 76.3236 -1.22 65.5475 3.75727 56.9266L31.7544 8.43415Z" 
                    stroke={strokeColor} 
                    strokeWidth="2.87363"
                    fill={fillColor} 
                />
            </svg>
            <div
                className="absolute inset-0 flex items-center justify-center text-center p-2 pointer-events-none"
                style={{ color: "var(--editor-text)", fontSize: "10px" }}
            >
                {data.label}
            </div>

            <Handle type="source" position={Position.Top} id="top-source" />
            <Handle type="source" position={Position.Left} id="left-source" style={{ left: 12 }}/>
            <Handle type="source" position={Position.Right} id="right-source" style={{ right: 12 }}/>
            <Handle type="source" position={Position.Bottom} id="bottom-source" />
        </div>
    );
};

export default ServiceNode;