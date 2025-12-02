// Node for resizer practice
// refer: https://reactflow.dev/examples/nodes/node-resizer
import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const ResizableNodeSelected = ({ data, selected }) => {
  return (
    <div className='relative border w-full h-full bg-gray-300'>
      <NodeResizer
        color="#ff0071"
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
