// Refer: https://reactflow.dev/examples/grouping/parent-child-relation

import { NodeResizer } from "@xyflow/react";

const SecurityRealm = ({ data, selected }) => {
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

    </div>
  );
};

export default SecurityRealm;
