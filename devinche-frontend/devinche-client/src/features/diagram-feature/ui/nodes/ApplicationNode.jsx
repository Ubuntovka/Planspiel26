// Standard node with handle, resizer
import { Position, Handle, NodeResizer } from "@xyflow/react";

const ApplicationNode = ({ data, selected }) => {
  return (
    <div className="relative border bg-white w-full h-full rounded-xl">
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={50}
      />
      <div className="flex items-center justify-center p-2.5 h-full">
        {data.label}
      </div>
      <Handle type="source" position={Position.Top} id="top-source"/>
      <Handle type="source" position={Position.Left} id="left-source"/>
      <Handle type="source" position={Position.Right} id="right-source"/>
      <Handle type="source" position={Position.Bottom} id="bottom-source"/>
    </div>
  );
};

export default ApplicationNode;
