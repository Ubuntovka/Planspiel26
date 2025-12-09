import { Position, Handle } from "@xyflow/react";
import type { NodeProps } from "@/types/diagram";

const ApplicationNode = ({ data, selected }: NodeProps) => {
  const strokeColor = selected ? 'var(--editor-accent)' : 'var(--editor-text)';
  return (
    <div className="relative w-full h-full rounded-xl">
        <svg width="87" height="88" viewBox="0 0 87 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.94713 15.1788C1.94713 8.03705 7.73668 2.24748 14.8785 2.24748H72.351C79.4928 2.24748 85.2823 8.03704 85.2823 15.1788V72.6513C85.2823 79.7931 79.4928 85.5827 72.351 85.5827H14.8785C7.73669 85.5827 1.94713 79.7931 1.94713 72.6513V15.1788Z" stroke={strokeColor} strokeWidth="2.87363"/>
        </svg>

      <Handle type="source" position={Position.Top} id="top-source"/>
      <Handle type="source" position={Position.Left} id="left-source"/>
      <Handle type="source" position={Position.Right} id="right-source"/>
      <Handle type="source" position={Position.Bottom} id="bottom-source"/>
    </div>
  );
};

export default ApplicationNode;

