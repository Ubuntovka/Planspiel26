import {
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sun,
  Moon,
  Share2,
  MessageSquare,
  Download,
  Upload,
  ArrowLeft,
  FilePlus,
  Image,
  FileCode,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import NotificationBell from "../notifications/NotificationBell";
import { exportDiagramToPng } from "../exports/exportToPng";
import { DiagramNode } from "@/types/diagram";
import { useEffect, useMemo, useRef, useState } from "react";
import handleDownloadJson from "../exports/exportToJson";
import ToolbarDropDown from "./ToolbarDropDown";
import { CostBreakdown } from "./CostBreakdown";
import ScrollableMenuBar from "./ScrollableMenuBar";
import ToolbarDivider from "./ToolbarDivider";
import DropdownItem from "./ToolbarDropDownItem";

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

interface ToolbarProps {
  onBack?: () => void;
  backLabel?: string;
  onSave?: () => void | Promise<boolean>;
  onSaveAs?: (name: string) => Promise<string | null>;
  diagramName?: string | null;
  isLoggedIn?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  exportToJson?: () => string | null;
  exportToRdf: () => string;
  exportToXml: () => string;
  importFromJson: (json: string) => void;
  handleValidation?: () => void;
  flowWrapperRef: React.RefObject<HTMLDivElement>;
  allNodes: DiagramNode[];
  canShare?: boolean;
  diagramId?: string | null;
  onShareClick?: () => void;
  onCommentsClick?: () => void;
  commentsUnresolvedCount?: number;
  onRenameDiagram?: (name: string) => Promise<void>;
  isViewer?: boolean;
  getToken?: () => string | null;
  onNotificationNavigate?: () => void;
  activeUsers?: { id: string; displayName: string; color: string }[];
  myColor?: string;
  myDisplayName?: string;
  collaborationConnected?: boolean;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const Toolbar = ({
  onBack,
  backLabel,
  onSave,
  onSaveAs,
  diagramName,
  isLoggedIn,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
  exportToJson,
  flowWrapperRef,
  exportToRdf,
  exportToXml,
  importFromJson,
  handleValidation,
  allNodes = [],
  canShare = false,
  diagramId,
  onShareClick,
  onCommentsClick,
  commentsUnresolvedCount = 0,
  onRenameDiagram,
  isViewer = false,
  getToken,
  onNotificationNavigate,
  activeUsers = [],
  myColor,
  myDisplayName,
  collaborationConnected = false,
}: ToolbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const [showCostDetails, setShowCostDetails] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<"idle" | "saved" | "error">(
    "idle",
  );
  const [openMenu, setOpenMenu] = useState<
    "file" | "edit" | "view" | "diagram" | "share" | null
  >(null);
  const [renameInput, setRenameInput] = useState(
    diagramName ?? "Untitled Diagram",
  );

  const rightFixedAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRenameInput(diagramName ?? "Untitled Diagram");
  }, [diagramName]);

  const costSummary = useMemo(() => {
    const nodesWithCost = allNodes
      .filter((node) => {
        if (!node.data?.cost) return false;
        const costValue = Number(node.data.cost);
        return !isNaN(costValue) && costValue > 0;
      })
      .map((node) => ({
        id: node.id,
        name: node.data.label || node.id,
        cost: Number(node.data.cost),
      }));

    const total = nodesWithCost.reduce((sum, item) => sum + item.cost, 0);
    return { nodesWithCost, total };
  }, [allNodes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Prevent portal dropdowns from closing when clicked inside
      if (target.closest(".portal-dropdown-content")) return;

      // Detect clicks outside the cost dropdown
      if (
        rightFixedAreaRef.current &&
        !rightFixedAreaRef.current.contains(target)
      ) {
        setShowCostDetails(false);
      }

      // Clicking on any other area closes the menu
      setOpenMenu(null);
    };

    if (showCostDetails || openMenu) {
      document.addEventListener("mousedown", handleClickOutside, true);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, [showCostDetails, openMenu]);

  // Handlers
  const toggleMenu = (menu: "file" | "edit" | "view" | "diagram" | "share") => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const executeMenuAction = (action: () => void) => {
    action();
    setOpenMenu(null);
  };

  const handleDownloadFile = (
    exportFn: () => string,
    extension: string,
    mimeType: string,
  ) => {
    try {
      const content = exportFn();
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `diagram.${extension}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(
        `Problem exporting diagram ${extension.toUpperCase()}: `,
        e,
      );
    }
  };

  const handleImportJson: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      importFromJson(text);
    } catch (err) {
      console.error("Problem importing diagram JSON: ", err);
    } finally {
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    setSaveMessage("idle");
    try {
      const result = await onSave();
      const ok = typeof result === "boolean" ? result : true;
      setSaveMessage(ok ? "saved" : "error");
      if (ok) setTimeout(() => setSaveMessage("idle"), 2000);
    } catch {
      setSaveMessage("error");
      setTimeout(() => setSaveMessage("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAs = async () => {
    if (!onSaveAs || !saveAsName.trim()) return;
    setSaving(true);
    setSaveMessage("idle");
    try {
      const id = await onSaveAs(saveAsName.trim());
      setSaveMessage(id ? "saved" : "error");
      setShowSaveAsModal(false);
      setSaveAsName("");
    } catch {
      setSaveMessage("error");
      setTimeout(() => setSaveMessage("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex flex-col">
      {/* ----------------------------------------------------------- */}
      {/* Bar 1: Title bar */}
      {/* ----------------------------------------------------------- */}
      <div className="flex justify-between items-center h-12 bg-[var(--editor-bar-bg)] border-b border-[var(--editor-bar-border)] shadow-[var(--editor-bar-shadow)]">
        {/* Scrollable Left Area */}
        <ScrollableMenuBar className="flex-1 h-full">
          {onBack && (
            <>
              <button
                onClick={onBack}
                className="flex-shrink-0 h-8 px-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 border border-[var(--editor-bar-border)] text-[var(--editor-text-secondary)] hover:bg-[var(--editor-surface-hover)] hover:text-[var(--editor-text)]"
                title="Back to diagrams"
              >
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">
                  {backLabel ?? t("toolbar.diagrams")}
                </span>
              </button>
              <ToolbarDivider />
            </>
          )}

          {isViewer && (
            <>
              <span className="flex-shrink-0 text-xs px-2 py-1 rounded bg-[var(--editor-surface-hover)] text-[var(--editor-text-secondary)]">
                {t("toolbar.viewOnly")}
              </span>
              <ToolbarDivider />
            </>
          )}

          {onRenameDiagram ? (
            <input
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              onBlur={async () => {
                const val = renameInput.trim() || t("toolbar.untitledDiagram");
                if (val !== (diagramName ?? "Untitled Diagram"))
                  await onRenameDiagram(val);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              className="flex-shrink-0 min-w-[120px] max-w-[280px] px-2 py-1 rounded border-0 bg-transparent text-base font-semibold focus:outline-none focus:ring-1 text-[var(--editor-text)]"
            />
          ) : (
            <span
              className="flex-shrink-0 text-base font-semibold truncate max-w-[240px] text-[var(--editor-text)]"
              title={diagramName || t("toolbar.untitledDiagram")}
            >
              {diagramName || t("toolbar.untitledDiagram")}
            </span>
          )}

          {/* Save Status */}
          {onSave && (saving || saveMessage !== "idle") && (
            <>
              <ToolbarDivider />
              <span
                className="flex items-center gap-1.5 text-sm font-medium flex-shrink-0"
                style={{
                  color: saving
                    ? "var(--editor-text-secondary)"
                    : saveMessage === "saved"
                      ? "var(--editor-success)"
                      : "var(--editor-error)",
                }}
              >
                {saving ? (
                  <>
                    <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {t("toolbar.saving")}
                  </>
                ) : saveMessage === "saved" ? (
                  t("toolbar.saved")
                ) : (
                  t("toolbar.saveFailed")
                )}
              </span>
            </>
          )}

          {/* Collaboration Viewers */}
          {collaborationConnected && (activeUsers.length > 0 || myColor) && (
            <>
              <ToolbarDivider />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--editor-bg)] border border-[var(--editor-bar-border)] flex-shrink-0">
                <span className="text-[11px] font-medium uppercase tracking-wide mr-0.5 text-[var(--editor-text-muted)]">
                  {t("toolbar.viewing")}
                </span>
                {myColor && (
                  <div
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${myColor}22`,
                      border: `1.5px solid ${myColor}`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: myColor }}
                    />
                    <span className="text-[11px] font-semibold text-[var(--editor-text)]">
                      {t("toolbar.you")}
                    </span>
                  </div>
                )}
                {activeUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${u.color}22`,
                      border: `1.5px solid ${u.color}`,
                    }}
                    title={u.displayName}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: u.color }}
                    />
                    <span className="text-[11px] font-medium truncate max-w-[80px] text-[var(--editor-text)]">
                      {u.displayName}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </ScrollableMenuBar>

        {/* Fixed Right Area (Notifications, Theme, Profile) */}
        <div className="flex items-center gap-2 px-4 h-full flex-shrink-0 border-l border-[var(--editor-bar-border)] bg-[var(--editor-bar-bg)]">
          {diagramId && getToken && !isViewer && (
            <NotificationBell
              getToken={getToken}
              onNavigate={onNotificationNavigate}
            />
          )}
          <button
            onClick={toggleTheme}
            className="h-8 px-2.5 rounded-lg transition-colors cursor-pointer text-[var(--editor-text-secondary)] hover:bg-[var(--editor-surface-hover)] hover:text-[var(--editor-text)]"
            title={theme === "dark" ? "Light theme" : "Dark theme"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <UserAvatarMenu />
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* Bar 2: Menu bar */}
      {/* ----------------------------------------------------------- */}
      <div className="flex justify-between items-center h-10 bg-[var(--editor-bg)] border-b border-[var(--editor-bar-border)] shadow-[var(--editor-bar-shadow)]">
        {/* Scrollable Left Menus */}
        <ScrollableMenuBar className="flex-1 h-full">
          <ToolbarDropDown
            label={t("toolbar.file")}
            isOpen={openMenu === "file"}
            onToggle={() => toggleMenu("file")}
          >
            <DropdownItem
              onClick={() => executeMenuAction(handleSave)}
              disabled={saving}
              icon={Save}
            >
              {t("toolbar.saveMenuItem")}
            </DropdownItem>
            {isLoggedIn && onSaveAs && (
              <DropdownItem
                onClick={() => {
                  setSaveAsName(diagramName || t("toolbar.untitledDiagram"));
                  setShowSaveAsModal(true);
                  setOpenMenu(null);
                }}
                disabled={saving}
                icon={FilePlus}
              >
                {t("toolbar.saveAs")}
              </DropdownItem>
            )}
            <div className="my-1 border-t border-[var(--editor-border)]" />
            <label className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] cursor-pointer text-[var(--editor-text)]">
              <Upload size={14} />
              {t("toolbar.importJson")}
              <input
                type="file"
                accept="application/json"
                onChange={(e) => {
                  handleImportJson(e);
                  setOpenMenu(null);
                }}
                className="hidden"
              />
            </label>
            <div className="my-1 border-t border-[var(--editor-border)]" />
            <DropdownItem
              onClick={() =>
                executeMenuAction(() => {
                  if (exportToJson) handleDownloadJson(exportToJson());
                })
              }
              icon={Download}
            >
              {t("toolbar.exportJson")}
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                executeMenuAction(async () => {
                  if (flowWrapperRef.current)
                    await exportDiagramToPng(
                      flowWrapperRef.current,
                      "diagram.png",
                    );
                })
              }
              icon={Image}
            >
              {t("toolbar.exportPng")}
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                executeMenuAction(() =>
                  handleDownloadFile(
                    exportToRdf,
                    "ttl",
                    "text/turtle;charset=utf-8",
                  ),
                )
              }
              icon={FileCode}
            >
              {t("toolbar.exportRdf")}
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                executeMenuAction(() =>
                  handleDownloadFile(
                    exportToXml,
                    "xml",
                    "application/xml;charset=utf-8",
                  ),
                )
              }
              icon={FileCode}
            >
              {t("toolbar.exportXml")}
            </DropdownItem>
          </ToolbarDropDown>

          <ToolbarDropDown
            label={t("toolbar.edit")}
            isOpen={openMenu === "edit"}
            onToggle={() => toggleMenu("edit")}
          >
            <DropdownItem
              onClick={() => executeMenuAction(() => onUndo?.())}
              disabled={!canUndo}
              icon={Undo}
            >
              {t("toolbar.undo")}
            </DropdownItem>
            <DropdownItem
              onClick={() => executeMenuAction(() => onRedo?.())}
              disabled={!canRedo}
              icon={Redo}
            >
              {t("toolbar.redo")}
            </DropdownItem>
          </ToolbarDropDown>

          <ToolbarDropDown
            label={t("toolbar.view")}
            isOpen={openMenu === "view"}
            onToggle={() => toggleMenu("view")}
          >
            <DropdownItem
              onClick={() => executeMenuAction(() => onZoomIn?.())}
              icon={ZoomIn}
            >
              {t("toolbar.zoomIn")}
            </DropdownItem>
            <DropdownItem
              onClick={() => executeMenuAction(() => onZoomOut?.())}
              icon={ZoomOut}
            >
              {t("toolbar.zoomOut")}
            </DropdownItem>
            <DropdownItem
              onClick={() => executeMenuAction(() => onFitView?.())}
              icon={Maximize2}
            >
              {t("toolbar.fitView")}
            </DropdownItem>
          </ToolbarDropDown>

          <ToolbarDropDown
            label={t("toolbar.diagram")}
            isOpen={openMenu === "diagram"}
            onToggle={() => toggleMenu("diagram")}
          >
            <DropdownItem
              onClick={() => executeMenuAction(() => handleValidation?.())}
              icon={CheckCircle}
            >
              {t("toolbar.validate")}
            </DropdownItem>
          </ToolbarDropDown>

          {/* Share & Comments */}
          {((canShare && diagramId && onShareClick) ||
            (onCommentsClick && diagramId)) && (

            <ToolbarDropDown
              label={t("toolbar.share")}
              icon={Share2}
              isOpen={openMenu === "share"}
              onToggle={() => toggleMenu("share")}
            >
              {canShare && diagramId && onShareClick && (
                <DropdownItem
                  onClick={() => executeMenuAction(onShareClick)}
                  icon={Share2}
                >
                  Share diagram
                </DropdownItem>
              )}
              {onCommentsClick && diagramId && (
                <button
                  type="button"
                  onClick={() => executeMenuAction(onCommentsClick)}
                  className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2 relative text-[var(--editor-text)]"
                >
                  <MessageSquare size={14} />
                  {t("toolbar.comments")}
                  {commentsUnresolvedCount > 0 && (
                    <span className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-xs font-medium text-white bg-[var(--editor-accent)]">
                      {commentsUnresolvedCount > 99
                        ? "99+"
                        : commentsUnresolvedCount}
                    </span>
                  )}
                </button>
              )}
            </ToolbarDropDown>
        
          )} 

        </ScrollableMenuBar>

        <CostBreakdown
          total={costSummary.total}
          nodesWithCost={costSummary.nodesWithCost}
          t={t}
        />
      </div>

      {/* ----------------------------------------------------------- */}
      {/* Save As Modal */}
      {/* ----------------------------------------------------------- */}
      {showSaveAsModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
          onClick={() => setShowSaveAsModal(false)}
        >
          <div
            className="p-4 rounded-xl shadow-xl max-w-sm w-full mx-4 bg-[var(--editor-panel-bg)] border border-[var(--editor-border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3 text-[var(--editor-text)]">
              {t("toolbar.saveAs")}
            </h3>
            <p className="text-sm mb-2 text-[var(--editor-text-secondary)]">
              {t("toolbar.newDiagramName")}:
            </p>
            <input
              type="text"
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveAs();
                if (e.key === "Escape") setShowSaveAsModal(false);
              }}
              placeholder={t("toolbar.untitledDiagram")}
              autoFocus
              className="w-full px-3 py-2 rounded-lg border mb-4 focus:outline-none focus:ring-2 bg-[var(--editor-bg)] border-[var(--editor-border)] text-[var(--editor-text)]"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSaveAsModal(false)}
                className="px-3 py-2 rounded-lg text-sm border bg-[var(--editor-surface)] text-[var(--editor-text)] border-[var(--editor-border)]"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSaveAs}
                disabled={saving || !saveAsName.trim()}
                className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 bg-[var(--editor-accent)] text-white"
              >
                {saving ? t("toolbar.saving") : t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
