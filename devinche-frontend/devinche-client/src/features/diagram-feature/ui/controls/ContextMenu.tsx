import { useCallback, useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import type { ContextMenuState } from "@/types/diagram";
import { useLanguage } from "@/contexts/LanguageContext";

import {
  SquareRounded,
  Link,
  AspectRatio,
  OutlinedFlag,
  LocationOnOutlined,
  Refresh,
  Dashboard,
  SelectAll,
  ContentCopy,
  DeleteOutline,
  Settings,
  ChatBubbleOutline,
} from "@mui/icons-material";

interface ContextMenuProps extends ContextMenuState {
  onClick?: () => void;
  resetCanvas?: () => void;
  selectAllNodes?: () => void;
  onOpenProperties?: (nodeId: string) => void;
  closeMenu?: () => void;
  flowWrapperRef?: React.RefObject<HTMLDivElement | null>;
  onAddCommentAtPoint?: (anchor: { type: 'point'; x: number; y: number }) => void;
}

const IconNode = () => <SquareRounded fontSize="small" />;
const IconEdge = () => <Link fontSize="small" />;
const IconDimensions = () => <AspectRatio fontSize="small" />;
const IconSource = () => <OutlinedFlag fontSize="small" />;
const IconTarget = () => <LocationOnOutlined fontSize="small" />;
const IconPane = () => <Refresh fontSize="small" />;
const IconCanvas = () => <Dashboard fontSize="small" />;
const IconSelectAll = () => <SelectAll fontSize="small" />;
const IconDuplicate = () => <ContentCopy fontSize="small" />;
const IconDelete = () => <DeleteOutline fontSize="small" />;
const IconProperties = () => <Settings fontSize="small" />;

export default function ContextMenu({
  id,
  type,
  top,
  left,
  right,
  bottom,
  clientX,
  clientY,
  onClick,
  resetCanvas,
  selectAllNodes,
  onOpenProperties,
  closeMenu,
  flowWrapperRef,
  onAddCommentAtPoint,
  ...props
}: ContextMenuProps) {
  const { t } = useLanguage();
  const { getNode, getEdges, deleteElements, setNodes, screenToFlowPosition } = useReactFlow();

  const elementType = type;
  const isCanvasMenu = elementType === "canvas";

  const elementData = useMemo(() => {
    const data = [];
    if (elementType === "node") {
      const node = getNode(id);
      if (node) {
        data.push({
          icon: <IconDimensions />,
          label: t("contextMenu.size"),
          value: `${node.measured?.width ?? "N/A"}x${node.measured?.height ?? "N/A"}`,
          unit: "px",
        });
      }
    } else if (elementType === "edge") {
      const edge = getEdges().find((e) => e.id === id);
      if (edge) {
        data.push({ icon: <IconSource />, label: t("contextMenu.source"), value: edge.source });
        data.push({ icon: <IconTarget />, label: t("contextMenu.target"), value: edge.target });
      }
    }
    return data;
  }, [id, elementType, getNode, getEdges, t]);

  // duplicate node (HEAD logic)
  const duplicateNode = useCallback(() => {
  if (elementType !== "node") return;
  const node = getNode(id);
  if (!node) return;
  
  const newNode = {
    ...node,
    id: uuidv4(), 
    // id: `${node.type}-${Date.now()}`,
    selected: false,
    position: {
      x: node.position.x + 50,
      y: node.position.y + 50,
    },
  };

  setNodes((nds) => nds.concat(newNode)); 
}, [id, getNode, setNodes, elementType]);

  // delete (HEAD logic)
  const deleteItem = useCallback(() => {
    if (elementType === "node") {
      deleteElements({ nodes: [{ id }] });
    } else if (elementType === "edge") {
      deleteElements({ edges: [{ id }] });
    }
  }, [id, elementType, deleteElements]);

  const handleResetCanvas = useCallback(() => {
    resetCanvas?.();
  }, [resetCanvas]);

  const handleSelectAll = useCallback(() => {
    selectAllNodes?.();
  }, [selectAllNodes]);

  const headerTitle = isCanvasMenu ? t("contextMenu.canvas") : elementType === "node" ? t("contextMenu.node") : t("contextMenu.edge");
  const headerSubtitle = isCanvasMenu ? t("contextMenu.diagram") : t("contextMenu.element");

  return (
    <div
      className="context-menu absolute flex flex-col"
      style={{ top, left, right, bottom }}
      {...props}
    >
      {/* Header */}
      <div className="context-menu__header">
        <span className="context-menu__header-icon">
          {isCanvasMenu ? <IconCanvas /> : elementType === "node" ? <IconNode /> : <IconEdge />}
        </span>
        <div className="context-menu__title-wrap">
          <h3 className="context-menu__title">{headerTitle}</h3>
          <p className="context-menu__subtitle">{headerSubtitle}</p>
        </div>
      </div>

      <div className="context-menu__body custom-scrollbar">
        {/* Details: ID + Size / Source+Target */}
        {!isCanvasMenu && (
          <div className="context-menu__section">
            <div className="context-menu__section-label">{t("contextMenu.details")}</div>
            <div className="context-menu__details">
              <div className="context-menu__id-block">
                <div className="context-menu__id-label">{t("contextMenu.id")}</div>
                <div className="context-menu__id-value">{id}</div>
              </div>
              {elementData.length > 0 &&
                elementData.map((item, idx) => (
                  <div key={idx} className="context-menu__info-row">
                    <span className="context-menu__info-label">
                      <span className="context-menu__info-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="context-menu__info-value">
                      {item.value}
                      {item.unit ? ` ${item.unit}` : ""}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="context-menu__section">
          <div className="context-menu__section-label">{t("contextMenu.actions")}</div>
          <div className="context-menu__actions">
          {isCanvasMenu && (
            <>
              {onAddCommentAtPoint && flowWrapperRef?.current != null && clientX != null && clientY != null && (
                <button
                  type="button"
                  className="context-menu-item"
                  onClick={() => {
                    const rect = flowWrapperRef.current!.getBoundingClientRect();
                    const rel = { x: clientX - rect.left, y: clientY - rect.top };
                    const flowPos = screenToFlowPosition(rel);
                    onAddCommentAtPoint({ type: 'point', x: flowPos.x, y: flowPos.y });
                    closeMenu?.();
                    onClick?.();
                  }}
                >
                  <span className="context-menu-item__icon">
                    <ChatBubbleOutline />
                  </span>
                  <span>{t("contextMenu.addCommentHere")}</span>
                </button>
              )}
              <button
                type="button"
                className="context-menu-item"
                onClick={() => {
                  handleResetCanvas();
                  onClick?.();
                }}
              >
                <span className="context-menu-item__icon">
                  <IconPane />
                </span>
                <span>{t("contextMenu.resetCanvas")}</span>
              </button>
              <button
                type="button"
                className="context-menu-item"
                onClick={() => {
                  handleSelectAll();
                  onClick?.();
                }}
              >
                <span className="context-menu-item__icon">
                  <IconSelectAll />
                </span>
                <span>{t("contextMenu.selectAll")}</span>
              </button>
            </>
          )}

          {elementType === "node" && (
            <>
              <button
                type="button"
                className="context-menu-item"
                onClick={() => {
                  onOpenProperties?.(id);
                  onClick?.();
                }}
              >
                <span className="context-menu-item__icon">
                  <IconProperties />
                </span>
<span>{t("contextMenu.properties")}</span>
                </button>
              <button
                type="button"
                className="context-menu-item"
                onClick={() => {
                  duplicateNode();
                  onClick?.();
                }}
              >
                <span className="context-menu-item__icon">
                  <IconDuplicate />
                </span>
                <span>{t("contextMenu.duplicateNode")}</span>
              </button>
            </>
          )}
          {elementType === "edge" && (
            <>
              <button
                type="button"
                className="context-menu-item"
                onClick={() => {
                  onOpenProperties?.(id);
                  onClick?.();
                }}
              >
                <span className="context-menu-item__icon">
                  <IconProperties />
                </span>
<span>{t("contextMenu.properties")}</span>
                </button>
            </>
          )}
          {!isCanvasMenu && (
            <button
              type="button"
              className="context-menu-item context-menu-item--danger"
              onClick={() => {
                deleteItem();
                onClick?.();
                closeMenu?.();
              }}
            >
              <span className="context-menu-item__icon">
                <IconDelete />
              </span>
              <span>{elementType === "node" ? t("contextMenu.deleteNode") : t("contextMenu.deleteEdge")}</span>
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
