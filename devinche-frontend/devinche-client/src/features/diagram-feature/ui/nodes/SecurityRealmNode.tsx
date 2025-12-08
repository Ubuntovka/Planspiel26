import {Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@/types/diagram";

const SecurityRealmNode = ({ data, selected }: NodeProps) => {
  return (
    <div className="relative w-full h-full">
        <svg width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M63.2898 1.50571L89.0742 25.048" stroke="black" stroke-width="2.9895"/>
            <rect x="2.00506" y="1.87939" width="86.6955" height="86.6955" rx="13.4528" stroke="black" stroke-width="2.9895"/>
        </svg>

        <Handle type="source" position={Position.Top} id="top-source"/>
        <Handle type="source" position={Position.Left} id="left-source"/>
        <Handle type="source" position={Position.Right} id="right-source"/>
        <Handle type="source" position={Position.Bottom} id="bottom-source"/>
    </div>
  );
};

export default SecurityRealmNode;

