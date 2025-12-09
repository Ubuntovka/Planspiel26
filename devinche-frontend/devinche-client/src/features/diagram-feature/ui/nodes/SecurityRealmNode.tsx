import { Handle, Position, NodeResizer, Node, NodeProps } from "@xyflow/react";
import type { SecurityRealmData } from "@/types/diagram";
type SecurityRealmDataNode = Node<SecurityRealmData>
const SecurityRealmNode = ({ data, selected }: NodeProps<SecurityRealmDataNode>) => {
  return (
    <div className="relative w-full h-full">
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={91}
        minHeight={91}
      />
      <svg width="100%" height="100%" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <path d="M63.2898 1.50571L89.0742 25.048" stroke="black" strokeWidth="2.9895" />
        <rect x="2.00506" y="1.87939" width="86.6955" height="86.6955" rx="13.4528" stroke="black" strokeWidth="2.9895" />
        {data.label && (
          <text
            x="82"
            y="12"
            fontSize="10"
            fill="black"
            textAnchor="middle"
            dominantBaseline="middle"
          // transform="rotate(-45 76.182 13.277)"
          >
            {data.label}
          </text>
        )}
      </svg>

      {/* <Handle type="source" position={Position.Top} id="top-source" /> */}
      <Handle type="source" position={Position.Left} id="left-source" />
      <Handle type="source" position={Position.Right} id="right-source" />
      {/* <Handle type="source" position={Position.Bottom} id="bottom-source" /> */}
    </div>
  );
};

export default SecurityRealmNode;

