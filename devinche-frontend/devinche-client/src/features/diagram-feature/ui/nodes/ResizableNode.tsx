// Node for resizer practice
// refer: https://reactflow.dev/examples/nodes/node-resizer
import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import type { NodeProps } from "@/types/diagram";

const ResizableNodeSelected = ({ data, selected }: NodeProps) => {
  const borderColor = selected ? 'var(--editor-accent)' : 'var(--editor-border)';
  const bgColor = selected ? 'var(--editor-surface-hover)' : 'var(--editor-surface)';
  const textColor = 'var(--editor-text)';
  return (
    <div className='relative border w-full h-full' style={{ borderColor, backgroundColor: bgColor, color: textColor }}>
      <NodeResizer
        color="var(--editor-accent)"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(ResizableNodeSelected);

