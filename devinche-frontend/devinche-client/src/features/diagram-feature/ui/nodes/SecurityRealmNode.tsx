// import { Handle, Position, NodeResizer, Node, NodeProps } from "@xyflow/react";
// import type { SecurityRealmData } from "@/types/diagram";

// type SecurityRealmDataNode = Node<SecurityRealmData>;

// const SecurityRealmNode = ({
//   data,
//   selected,
// }: NodeProps<SecurityRealmDataNode>) => {
//   const strokeColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
//   const textColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
//   const fillColor = "var(--editor-surface)";
//   const fixedStrokeWidth = 3;

//   return (
//     <div className="relative w-full h-full">
//       <NodeResizer
//         color="var(--editor-accent)"
//         isVisible={selected}
//         minWidth={300}
//         minHeight={300}
//         lineStyle={{
//           borderColor: "var(--editor-accent)",
//         }}
//         handleStyle={{
//           width: "8px",
//           height: "8px",
//           backgroundColor: "white",
//           border: `2px solid var(--editor-accent)`,
//           borderRadius: "2px",
//         }}
//       />
//       <svg
//         width="100%"
//         height="100%"
//         style={{
//           overflow: "visible",
//           display: "block",
//           position: "absolute",
//           top: 0,
//           left: 0,
//         }}
//       >
//         {/* 배경 사각형 */}
//         <rect
//           x="0"
//           y="0"
//           width="100%"
//           height="100%"
//           rx="25"
//           stroke={strokeColor}
//           strokeWidth={fixedStrokeWidth}
//           fill={fillColor}
//           // vectorEffect를 제거하거나 유지 (100% 기반일 땐 제거해도 무방)
//         />

//         {/* 우측 상단 사선: 오른쪽 끝에서 26px 왼쪽 지점(M)에서 오른쪽 끝 아래 26px 지점(L)까지 */}
//         <line
//           x1="calc(100% - 80px)"
//           y1="0"
//           x2="100%"
//           y2="80"
//           stroke={strokeColor}
//           strokeWidth={fixedStrokeWidth}
//         />
//       </svg>

//       {/* <Handle type="source" position={Position.Left} id="left" />
//       <Handle type="source" position={Position.Right} id="right" /> */}
//     </div>
//   );
// };

// export default SecurityRealmNode;


import { Handle, Position, NodeResizer, Node, NodeProps } from "@xyflow/react";
import type { SecurityRealmData } from "@/types/diagram";

type SecurityRealmDataNode = Node<SecurityRealmData>;

const SecurityRealmNode = ({
  data,
  selected,
}: NodeProps<SecurityRealmDataNode>) => {
  const strokeColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const textColor = selected ? "var(--editor-accent)" : "var(--editor-text)";
  const fillColor = "var(--editor-surface)";
  const fixedStrokeWidth = 3;

  return (
    <div 
      className="relative w-full h-full"
      style={{ containerType: "size" }} // 컨테이너 쿼리 단위 사용을 위해 설정
    >
      <NodeResizer
        color="var(--editor-accent)"
        isVisible={selected}
        minWidth={300}
        minHeight={300}
        lineStyle={{ borderColor: "var(--editor-accent)" }}
        handleStyle={{
          width: "8px",
          height: "8px",
          backgroundColor: "white",
          border: `2px solid var(--editor-accent)`,
          borderRadius: "2px",
        }}
      />
      
      {/* 배경 SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible", display: "block" }}
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="25"
          stroke={strokeColor}
          strokeWidth={fixedStrokeWidth}
          fill={fillColor}
        />
        {/* 우측 상단 80px 크기의 삼각형을 만드는 사선 */}
        <line
          x1="calc(100% - 80px)"
          y1="0"
          x2="100%"
          y2="80"
          stroke={strokeColor}
          strokeWidth={fixedStrokeWidth}
        />
      </svg>

      {/* 텍스트 레이어: 우측 상단 삼각형 영역에 배치 */}
      <div
        className="absolute inset-0 flex items-start justify-end pointer-events-none"
        style={{
          color: textColor,
          // cqw를 사용하여 노드 크기에 반응하는 폰트 사이즈
          fontSize: "10px", 
          paddingTop: "10",
          paddingRight: "10",
          width: "100%",
          height: "100%",
        }}
      >
        <div 
          className="flex items-center justify-center text-center"
          style={{
            width: "50px",
            height: "50px",
            lineHeight: "1.1",
          }}
        >
          <span className="break-words line-clamp-3 w-full pr-2 mb-2">
            {data.label}
          </span>
        </div>
      </div>

      {/* 중심부에도 라벨이 필요한 경우를 위해 원본 label 유지 (선택 사항) */}
      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <span>중앙 텍스트</span>
      </div> 
      */}

      {/* <Handle type="source" position={Position.Left} id="left" />
      <Handle type="source" position={Position.Right} id="right" /> */}
    </div>
  );
};

export default SecurityRealmNode;