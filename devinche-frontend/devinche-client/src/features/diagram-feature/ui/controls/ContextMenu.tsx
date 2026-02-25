import { useCallback, useMemo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import {
  useFloating,
  flip,
  shift,
  offset,
  autoUpdate,
  type VirtualElement,
} from "@floating-ui/react";
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
  Close,
} from "@mui/icons-material";
import { useIsMobile } from "../../hooks/useMobile";

interface ContextMenuProps extends ContextMenuState {
  onClick?: () => void;
  resetCanvas?: () => void;
  selectAllNodes?: () => void;
  onOpenProperties?: (nodeId: string) => void;
  closeMenu?: () => void;
  flowWrapperRef?: React.RefObject<HTMLDivElement | null>;
  onAddCommentAtPoint?: (anchor: {
    type: "point";
    x: number;
    y: number;
  }) => void;
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
  const isMobile = useIsMobile();
  const { getNode, getEdges, deleteElements, setNodes, screenToFlowPosition } =
    useReactFlow();

  const isCanvasMenu = type === "canvas";

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);

    setTimeout(() => {
      setCopiedText(null);
    }, 600);
  };

  // --- 1. Floating UI (desktop) ---
  const virtualReference = useMemo<VirtualElement>(
    () => ({
      getBoundingClientRect() {
        const x = clientX ?? 0;
        const y = clientY ?? 0;

        return {
          x,
          y,
          top: y,
          left: x,
          bottom: y,
          right: x,
          width: 0,
          height: 0,
        };
      },
    }),
    [clientX, clientY],
  );

  const { refs, floatingStyles } = useFloating({
    placement: "right-start",
    middleware: [
      offset(4),
      flip({ fallbackAxisSideDirection: "start" }),
      shift({ padding: 12 }),
    ],
    whileElementsMounted: autoUpdate,
    open: !isMobile,
  });

  useEffect(() => {
    if (!isMobile) refs.setReference(virtualReference);
  }, [refs, virtualReference, isMobile]);

  const handleAction = useCallback(
    (actionFn?: () => void) => {
      actionFn?.();
      onClick?.();
      closeMenu?.();
    },
    [onClick, closeMenu],
  );

  const duplicateNode = useCallback(() => {
    if (type !== "node") return;
    const node = getNode(id);
    if (!node) return;
    const newNode = {
      ...node,
      id: uuidv4(),
      selected: false,
      position: { x: node.position.x + 50, y: node.position.y + 50 },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [id, getNode, setNodes, type]);

  const deleteItem = useCallback(() => {
    if (type === "node") deleteElements({ nodes: [{ id }] });
    else if (type === "edge") deleteElements({ edges: [{ id }] });
  }, [id, type, deleteElements]);

  const handleAddComment = useCallback(() => {
    if (!flowWrapperRef?.current) return;
    const rect = flowWrapperRef.current.getBoundingClientRect();
    const x = clientX ?? window.innerWidth / 2;
    const y = clientY ?? window.innerHeight / 2;
    const flowPos = screenToFlowPosition({ x: x - rect.left, y: y - rect.top });

    onAddCommentAtPoint?.({ type: "point", x: flowPos.x, y: flowPos.y });
    handleAction();
  }, [
    clientX,
    clientY,
    flowWrapperRef,
    screenToFlowPosition,
    onAddCommentAtPoint,
    handleAction,
  ]);

  // --- 3. Data and style  ---
  const elementData = useMemo(() => {
    const data = [];
    if (type === "node") {
      const node = getNode(id);
      if (node) {
        data.push({
          icon: <IconDimensions />,
          label: t("contextMenu.size"),
          value: `${node.measured?.width ?? "N/A"}x${node.measured?.height ?? "N/A"}`,
          unit: "px",
        });
      }
    } else if (type === "edge") {
      const edge = getEdges().find((e) => e.id === id);
      if (edge) {
        data.push({
          icon: <IconSource />,
          label: t("contextMenu.source"),
          value: edge.source,
        });
        data.push({
          icon: <IconTarget />,
          label: t("contextMenu.target"),
          value: edge.target,
        });
      }
    }
    return data;
  }, [id, type, getNode, getEdges, t]);

  const mobileContainerStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 3000,
    backgroundColor: "var(--bg-paper)",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-2999 animate-in fade-in duration-200"
          onClick={closeMenu}
        />
      )}

      <div
        ref={isMobile ? null : refs.setFloating}
        className={`context-menu flex flex-col ${isMobile ? "mobile-bottom-sheet animate-in slide-in-from-bottom duration-300" : "absolute"}`}
        style={
          isMobile ? mobileContainerStyle : { ...floatingStyles, zIndex: 2500 }
        }
        {...props}
      >
        {isMobile && (
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />
        )}

        {/* Header */}
        <div className="context-menu__header flex justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="context-menu__header-icon">
              {isCanvasMenu ? (
                <IconCanvas />
              ) : type === "node" ? (
                <IconNode />
              ) : (
                <IconEdge />
              )}
            </span>
            <div className="context-menu__title-wrap">
              <h3 className="context-menu__title font-bold text-sm">
                {isCanvasMenu
                  ? t("contextMenu.canvas")
                  : type === "node"
                    ? t("contextMenu.node")
                    : t("contextMenu.edge")}
              </h3>
              <p className="context-menu__subtitle text-xs text-gray-500">
                {isCanvasMenu
                  ? t("contextMenu.diagram")
                  : t("contextMenu.element")}
              </p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={closeMenu}
              className="p-2 -mr-2 text-gray-400 active:bg-gray-100 rounded-full transition-colors"
            >
              <Close />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="context-menu__body custom-scrollbar overflow-y-auto px-1 py-2">
          {!isCanvasMenu && (
            <div className="context-menu__section px-3 mb-2">
              <div className="context-menu__section-label text-[10px] font-bold uppercase text-gray-400 mb-2 px-1">
                {t("contextMenu.details")}
              </div>
              <div className="context-menu__details  rounded-lg p-2 space-y-2 relative">
                {copiedText && (
                  <div
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md text-white text-xs shadow-md transition-all duration-300 pointer-events-none ${
                      copiedText
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                  >
                    {"Copied"}
                  </div>
                )}

                <div
                  className="context-menu__info-row flex justify-between items-start text-xs cursor-pointer p-1 rounded transition-colors"
                  onClick={() => handleCopy(id)}
                  title="Click to copy ID"
                >
                  <span className="context-menu__info-label text-[10px] text-gray-400 font-bold uppercase shrink-0">
                    {t("contextMenu.id")}
                  </span>
                  <span className="context-menu__id-value font-mono break-all text-right ml-4 text-gray-700">
                    {id}
                  </span>
                </div>

                {elementData.map((item, idx) => (
                  <div
                    key={idx}
                    className="context-menu__info-row flex justify-between items-center text-xs text-gray-400 cursor-pointer p-1 rounded transition-colors"
                    onClick={() => handleCopy(item.value)}
                    title={`Click to copy ${item.label}`}
                  >
                    <span className="context-menu__info-label flex items-center gap-1 text-gray-500 shrink-0">
                      {item.icon} {item.label}
                    </span>
                    <span className="context-menu__info-value font-medium text-gray-700 text-right">
                      {item.value}
                      {item.unit ? ` ${item.unit}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div
            className={`context-menu__section px-2 ${isMobile ? "pb-8" : "pb-1"}`}
          >
            <div className="context-menu__section-label text-[10px] font-bold uppercase text-gray-400 mb-1 px-2">
              {t("contextMenu.actions")}
            </div>
            <div className="context-menu__actions grid grid-cols-1 gap-0.5">
              {isCanvasMenu ? (
                <>
                  {onAddCommentAtPoint && (
                    <button
                      type="button"
                      className="context-menu-item"
                      onClick={handleAddComment}
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
                    onClick={() => handleAction(resetCanvas)}
                  >
                    <span className="context-menu-item__icon">
                      <IconPane />
                    </span>
                    <span>{t("contextMenu.resetCanvas")}</span>
                  </button>
                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => handleAction(selectAllNodes)}
                  >
                    <span className="context-menu-item__icon">
                      <IconSelectAll />
                    </span>
                    <span>{t("contextMenu.selectAll")}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => handleAction(() => onOpenProperties?.(id))}
                  >
                    <span className="context-menu-item__icon">
                      <IconProperties />
                    </span>
                    <span>{t("contextMenu.properties")}</span>
                  </button>
                  {type === "node" && (
                    <button
                      type="button"
                      className="context-menu-item"
                      onClick={() => handleAction(duplicateNode)}
                    >
                      <span className="context-menu-item__icon">
                        <IconDuplicate />
                      </span>
                      <span>{t("contextMenu.duplicateNode")}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="context-menu-item context-menu-item--danger"
                    onClick={() => handleAction(deleteItem)}
                  >
                    <span className="context-menu-item__icon">
                      <IconDelete />
                    </span>
                    <span>
                      {type === "node"
                        ? t("contextMenu.deleteNode")
                        : t("contextMenu.deleteEdge")}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
