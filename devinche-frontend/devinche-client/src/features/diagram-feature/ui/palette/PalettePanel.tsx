import { useState } from "react";
import {
  Pointer,
  ChevronLeft,
  ChevronRight,
  Layers,
  ArrowUpIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import { AiNodes, Tools, Nodes, Edges, PaletteItem } from "./paletteData";

interface PalettePanelProps {
  onDragStart?: (event: React.DragEvent, item: PaletteItem) => void;
  selectedEdgeType?: string;
  onEdgeTypeSelect?: (edgeType: string) => void;
  onNodeClick?: (item: PaletteItem) => void;
}

const PaletteListItem = ({
  item,
  isDraggable,
  isSelected,
  displayLabel,
  onClick,
  onDragStart,
}: {
  item: PaletteItem;
  isDraggable?: boolean;
  isSelected?: boolean;
  displayLabel: string;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent, item: PaletteItem) => void;
}) => {
  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => isDraggable && onDragStart?.(e, item)}
      onClick={onClick}
      className={`
                px-3 py-2 mb-1 rounded-lg flex items-center gap-3 transition-all duration-150 border
                ${isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}
                ${
                  isSelected
                    ? "bg-[var(--editor-surface-hover)] border-[var(--editor-accent)] text-[var(--editor-text)]"
                    : "border-transparent text-[var(--editor-text-secondary)] hover:bg-[var(--editor-surface-hover)] hover:text-[var(--editor-text)] hover:border-[var(--editor-border)]"
                }
            `}
    >
      <span
        className={`transition-colors ${isSelected ? "text-[var(--editor-accent)]" : "text-[var(--editor-text-muted)]"}`}
      >
        {item.icon}
      </span>
      <span className="text-sm font-medium">{displayLabel}</span>
      {isSelected && (
        <span className="ml-auto text-xs text-[var(--editor-accent)]">✓</span>
      )}
    </div>
  );
};

const PaletteSection = ({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: PaletteItem[];
  renderItem: (item: PaletteItem) => React.ReactNode;
}) => (
  <div className="mb-4">
    <div className="text-xs font-semibold uppercase tracking-wider mb-2 px-2 text-[var(--editor-text-secondary)]">
      {title}
    </div>
    {items.map(renderItem)}
  </div>
);

const PalettePanel = ({
  onDragStart,
  onNodeClick,
  selectedEdgeType,
  onEdgeTypeSelect,
}: PalettePanelProps) => {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);

    // ✨ 노드 클릭 시 실행될 래퍼 함수
  const handleNodeClick = (item: PaletteItem) => {
    // 1. 기존 노드 추가 로직 실행
    onNodeClick?.(item);

    // 2. 화면 넓이가 640px보다 작으면 패널 접기
    if (window.innerWidth < 640) {
      setCollapsed(true);
    }
  };

  const handleDragStart = (event: React.DragEvent, item: PaletteItem) => {
    event.dataTransfer.effectAllowed = "move";
    const { id, type, label, nodeType } = item;
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ id, type, label, nodeType }),
    );
    onDragStart?.(event, item);
  };

  return (
    <div
      className={`absolute top-[100px] left-4 flex flex-col max-h-[calc(100vh-130px)] rounded-xl z-10 overflow-hidden transition-all duration-300 ease-in-out border border-[var(--editor-panel-border)] shadow-[var(--editor-panel-shadow)] ${
        collapsed
          ? "w-14 bg-[var(--editor-panel-chrome)]"
          : "w-64 bg-[var(--editor-panel-chrome)]"
      }`}
    >
      {/* Header / Toggle Button */}
      <div
        className={`flex items-center cursor-pointer transition-colors flex-shrink-0 ${
          collapsed
            ? "justify-center py-3"
            : "justify-between px-4 py-3 border-b border-[var(--editor-panel-border)] bg-[var(--editor-panel-header)] hover:bg-[var(--editor-surface-hover)]"
        }`}
        onClick={() => setCollapsed(!collapsed)}
        title={
          collapsed ? "Expand Components Panel" : "Collapse Components Panel"
        }
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-1.5 py-1 text-[var(--editor-text)]">
            <Layers size={18} />
            <ChevronRight
              size={12}
              className="text-[var(--editor-text-secondary)]"
            />
          </div>
        ) : (
          <>
            <h3 className="text-sm font-semibold tracking-tight text-[var(--editor-text)]">
              Tools
            </h3>
            <button
              className="p-1.5 rounded-lg transition-colors text-[var(--editor-text-secondary)] hover:bg-[var(--editor-border)] hover:text-[var(--editor-text)]"
              aria-label="Collapse panel"
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(true);
              }}
            >
              <ChevronLeft size={18} />
            </button>
          </>
        )}
      </div>

      {/* Content Area */}
      {!collapsed && (
        <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
          {/* <PaletteSection
            title="Tools"
            items={Tools}
            renderItem={(item) => (
              <PaletteListItem
                key={item.id}
                item={item}
                displayLabel={item.label}
              />
            )}
          /> */}

          <PaletteSection
            title="Nodes"
            items={Nodes}
            renderItem={(item) => (
              <PaletteListItem
                key={item.id}
                item={item}
                displayLabel={item.label}
                isDraggable
                onDragStart={handleDragStart}
                onClick={() => handleNodeClick(item)}
              />
            )}
          />

          <PaletteSection
            title="AI Nodes"
            items={AiNodes}
            renderItem={(item) => (
              <PaletteListItem
                key={item.id}
                item={item}
                displayLabel={item.label}
                isDraggable
                onDragStart={handleDragStart}
                onClick={() => handleNodeClick(item)}
              />
            )}
          />

          <PaletteSection
            title="Edges"
            items={Edges}
            renderItem={(item) => {
              const isSelected = selectedEdgeType === item.edgeType;
              const edgeLabel = item.edgeType
                ? t(`diagram.${item.edgeType}Edge`)
                : item.label;
              return (
                <PaletteListItem
                  key={item.id}
                  item={item}
                  displayLabel={edgeLabel}
                  isSelected={isSelected}
                  onClick={() =>
                    item.edgeType && onEdgeTypeSelect?.(item.edgeType)
                  }
                />
              );
            }}
          />
        </div>
      )}
    </div>
  );
};


export default PalettePanel;