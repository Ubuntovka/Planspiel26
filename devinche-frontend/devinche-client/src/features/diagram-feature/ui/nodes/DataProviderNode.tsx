import type { NodeProps } from "@/types/diagram";
import {Handle, Position } from "@xyflow/react";

const DataProviderNode = ({ data, selected }: NodeProps) => {
  const strokeColor = selected ? 'var(--editor-accent)' : 'var(--editor-text)';
  const fillColor = selected ? 'var(--editor-accent)' : 'var(--editor-text)';
  return (
    <div className="relative w-full h-full">
        <svg width="77" height="88" viewBox="0 0 77 88" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M74.5476 74.7956C74.5476 75.9572 73.8791 77.2888 72.1596 78.7125C70.4501 80.1278 67.881 81.4735 64.5665 82.6342C57.9522 84.9504 48.7112 86.4124 38.4288 86.4124C28.1464 86.4124 18.9053 84.9504 12.291 82.6342C8.97658 81.4735 6.40748 80.1278 4.698 78.7125C2.9785 77.2888 2.30999 75.9572 2.30999 74.7956C2.30999 73.634 2.9785 72.3023 4.698 70.8787C6.40748 69.4633 8.97658 68.1177 12.291 66.957C18.9053 64.6407 28.1464 63.1787 38.4288 63.1787C48.7112 63.1787 57.9522 64.6407 64.5665 66.957C67.881 68.1177 70.4501 69.4633 72.1596 70.8787C73.8791 72.3023 74.5476 73.634 74.5476 74.7956Z" stroke={strokeColor} strokeWidth="3.17528"/>
            <mask id="path-2-inside-1_129_16" fill="white">
                <path d="M0.722351 13.0325H76.1352V75.2215H0.722351V13.0325Z"/>
            </mask>
            <path d="M72.9599 13.0325V75.2215H79.3105V13.0325H72.9599ZM3.89763 75.2215V13.0325H-2.45293V75.2215H3.89763Z" fill={fillColor} mask="url(#path-2-inside-1_129_16)"/>
            <path d="M74.5476 13.8844C74.5476 15.046 73.8791 16.3776 72.1596 17.8013C70.4501 19.2166 67.881 20.5623 64.5665 21.723C57.9522 24.0392 48.7112 25.5013 38.4288 25.5013C28.1464 25.5013 18.9053 24.0392 12.291 21.723C8.97658 20.5623 6.40748 19.2166 4.698 17.8013C2.9785 16.3776 2.30999 15.046 2.30999 13.8844C2.30999 12.7228 2.9785 11.3911 4.698 9.96748C6.40748 8.55212 8.97658 7.2065 12.291 6.0458C18.9053 3.72952 28.1464 2.26751 38.4288 2.26751C48.7112 2.26751 57.9522 3.72952 64.5665 6.0458C67.881 7.2065 70.4501 8.55212 72.1596 9.96748C73.8791 11.3911 74.5476 12.7228 74.5476 13.8844Z" stroke={strokeColor} strokeWidth="3.17528"/>
        </svg>

        <Handle type="source" position={Position.Top} id="top-source"/>
        <Handle type="source" position={Position.Left} id="left-source"/>
        <Handle type="source" position={Position.Right} id="right-source"/>
        <Handle type="source" position={Position.Bottom} id="bottom-source"/>
    </div>
  );
};

export default DataProviderNode;

