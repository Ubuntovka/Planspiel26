import type { NodeProps } from "@/types/diagram";
import {Handle, Position } from "@xyflow/react";


const IdentityProviderNode = ({ data, selected }: NodeProps) => {
    const strokeColor = selected ? 'var(--editor-accent)' : 'var(--editor-text)';
    const fillColor = "var(--editor-surface)"; 
    
    return (
        <div className="relative" style={{ width: 76, height: 77 }}>
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 76 77"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M74.3946 65.3453V11.8404C74.3946 3.30662 64.0769 -0.967114 58.0426 5.06717L4.53775 58.5721C-1.49653 64.6063 2.77722 74.924 11.311 74.924H64.8158C70.106 74.924 74.3946 70.6355 74.3946 65.3453Z"
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

            <Handle type="source" position={Position.Left} id="left-source" style={{ top: 30, left: 30 }}/>
            <Handle type="source" position={Position.Right} id="right-source"/>
            <Handle type="source" position={Position.Bottom} id="bottom-source"/>

        </div>
    );
};

export default IdentityProviderNode;