import type { NodeProps } from "@/types/diagram";
import {Handle, Position } from "@xyflow/react";

export function ProcessUnitNode({ data, selected }: NodeProps) {
  const strokeColor = selected ? 'var(--editor-accent)' : 'var(--editor-text)';
  const fillColor = "var(--editor-surface)"; 
    
  return (
    <div className="relative w-full h-full">
        <svg width="87" height="87" viewBox="0 0 87 87" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle 
                cx="43.6147" 
                cy="43.7823" 
                r="41.6676" 
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

        <Handle type="source" position={Position.Top} id="top-source"/>
        <Handle type="source" position={Position.Left} id="left-source"/>
        <Handle type="source" position={Position.Right} id="right-source"/>
        <Handle type="source" position={Position.Bottom} id="bottom-source"/>
    </div>
  );
}