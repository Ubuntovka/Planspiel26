import {
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sun,
  Moon,
  Calculator,
  ChevronUp,
  ChevronDown,
  Share2,
  MessageSquare,
  Download,
  Upload,
  ArrowLeft,
  FilePlus,
  Image,
  FileCode,
  CheckCircle,
  GitCommitHorizontal,
  History,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NotificationBell from "../notifications/NotificationBell";
import {
  exportDiagramToJson,
  exportDiagramToPng,
  exportDiagramToRdf,
  exportDiagramToXml,
} from "../../imports-exports/exports";
import {
  importDiagramFromJSON,
  importDiagramFromRdf,
  importDiagramFromXml,
} from "../../imports-exports/imports";
import { DiagramNode } from "@/types/diagram";
import { ReactHTMLElement, useEffect, useMemo, useRef, useState } from "react";

const ToolbarDivider = () => (
  <div
    className="w-px h-6 flex-shrink-0"
    style={{ backgroundColor: "var(--editor-bar-border)" }}
    aria-hidden
  />
);

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
  exportToJson: () => string | null;
  importFromJson: (json: string) => void;
  handleValidation?: () => void;
  flowWrapperRef: React.RefObject<HTMLDivElement>;
  allNodes: DiagramNode[];
  /** Only owner can share; show Share button when true and diagramId is set. */
  canShare?: boolean;
  diagramId?: string | null;
  onShareClick?: () => void;
  /** Open comments panel (when diagram is open and user can comment). */
  onCommentsClick?: () => void;
  /** Unresolved comment count for badge. */
  commentsUnresolvedCount?: number;
  /** Rename diagram (when set, title in bar 1 is editable). */
  onRenameDiagram?: (name: string) => Promise<void>;
  /** View-only mode: show "View only" badge and disable editing. */
  isViewer?: boolean;
  /** For NotificationBell in bar 1 (when diagram is open). */
  getToken?: () => string | null;
  /** Called when user follows a notification (e.g. close comments panel). */
  onNotificationNavigate?: () => void;
  /** Real-time: other users currently viewing this diagram (for "Active viewers" in bar). */
  activeUsers?: { id: string; displayName: string; color: string }[];
  /** Current user's collaboration color (shown as "You" in active viewers). */
  myColor?: string;
  /** Current user's display name for "You" label. */
  myDisplayName?: string;
  /** Whether collaboration socket is connected. */
  collaborationConnected?: boolean;
  /** Called when user clicks "Save version" in the File menu. */
  onCommitVersion?: () => void;
  /** Called when user clicks "Version history" in the File menu. */
  onVersionHistory?: () => void;
}

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
  flowWrapperRef,
  handleValidation,
  exportToJson,
  importFromJson,
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
  onCommitVersion,
  onVersionHistory,
}: ToolbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [showCostDetails, setShowCostDetails] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<"idle" | "saved" | "error">(
    "idle",
  );
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState<
    "file" | "edit" | "view" | "diagram" | "share" | null
  >(null);
  const [renameInput, setRenameInput] = useState(
    diagramName ?? "Untitled Diagram",
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const saveDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

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
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target))
        setShowCostDetails(false);
      if (saveDropdownRef.current && !saveDropdownRef.current.contains(target))
        setShowSaveDropdown(false);
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(target)
      )
        setShowExportDropdown(false);
      if (menuBarRef.current && !menuBarRef.current.contains(target))
        setOpenMenu(null);
    };

    if (showCostDetails || showSaveDropdown || showExportDropdown || openMenu) {
      document.addEventListener("mousedown", handleClickOutside, true);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCostDetails, showSaveDropdown, showExportDropdown, openMenu]);

  const handleJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const text = await importDiagramFromJSON(e);
      if (text) {
        importFromJson(text);
      }
    } catch (err) {
      console.error("Import failed:", err);
    }
    setOpenMenu(null);
  };
  const handleRdfImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const text = await importDiagramFromRdf(e);
      if (text) {
        importFromJson(text);
      }
    } catch (err) {
      console.error("Import failed:", err);
    }
    setOpenMenu(null);
  };
  const handleXmlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const text = await importDiagramFromXml(e);
      if (text) {
        importFromJson(text);
      }
    } catch (err) {
      console.error("Import failed:", err);
    }
    setOpenMenu(null);
  };

  const handleJsonExport = () => {
    const json = exportToJson()
    exportDiagramToJson(json)
  }
  const handlePngExport = () => {
    exportDiagramToPng(flowWrapperRef.current)
  }
  const handleRdfExport = () => {
    const json = exportToJson()
    exportDiagramToRdf(json)
  }
  const handleXmlExport = () => {
    const json = exportToJson()
    exportDiagramToXml(json)
  }

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
      setShowSaveDropdown(false);
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
      setShowSaveDropdown(false);
    } catch {
      setSaveMessage("error");
      setTimeout(() => setSaveMessage("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  const btn =
    "h-8 px-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const btnText =
    "h-8 px-3.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const btnPrimary =
    "h-8 px-4 rounded-lg text-white font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";
  const btnStyle = { color: "var(--editor-text-secondary)" };
  const btnPrimaryStyle = {
    backgroundColor: "var(--editor-accent)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
  };
  const btnHover = (e: React.MouseEvent<HTMLElement>, over: boolean) => {
    const t = e.currentTarget as HTMLElement;
    if (t.hasAttribute("disabled")) return;
    t.style.backgroundColor = over
      ? "var(--editor-surface-hover)"
      : "transparent";
    t.style.color = over
      ? "var(--editor-text)"
      : "var(--editor-text-secondary)";
  };
  const group = "flex items-center gap-1 px-1.5 py-1 rounded-xl";
  const groupStyle = {
    backgroundColor: "var(--editor-bg)",
    border: "1px solid var(--editor-bar-border)",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  };

  const barBase = "flex items-center gap-2 px-4";
  const bar1Style = {
    backgroundColor: "var(--editor-bar-bg)",
    borderBottom: "1px solid var(--editor-bar-border)",
    boxShadow: "var(--editor-bar-shadow)",
  };
  const bar2Style = {
    backgroundColor: "var(--editor-bg)",
    borderBottom: "1px solid var(--editor-bar-border)",
    boxShadow: "var(--editor-bar-shadow)",
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex flex-col">
      {/* Bar 1: Title bar (draw.io style – document name left, actions right) */}
      <div className={barBase + " h-12"} style={bar1Style}>
        {onBack && (
          <>
            <button
              onClick={onBack}
              className={`${btnText} flex items-center gap-1.5`}
              style={{
                ...btnStyle,
                border: "1px solid var(--editor-bar-border)",
              }}
              onMouseEnter={(e) => btnHover(e, true)}
              onMouseLeave={(e) => btnHover(e, false)}
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
        {/* Diagram name – prominent like draw.io; editable when onRenameDiagram */}
        {isViewer && (
          <>
            <span
              className="text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: "var(--editor-surface-hover)",
                color: "var(--editor-text-secondary)",
              }}
            >
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
            className="flex-1 min-w-0 max-w-[280px] px-2 py-1 rounded border-0 bg-transparent text-base font-semibold focus:outline-none focus:ring-1"
            style={{ color: "var(--editor-text)" }}
          />
        ) : (
          <span
            className="text-base font-semibold truncate max-w-[240px] min-w-0"
            style={{ color: "var(--editor-text)" }}
            title={diagramName || t("toolbar.untitledDiagram")}
          >
            {diagramName || t("toolbar.untitledDiagram")}
          </span>
        )}

        <div className="flex-1 min-w-4" />

        {/* Save status (when using File → Save) + Document actions */}
        <div className="flex items-center gap-2">
          {onSave && (saving || saveMessage !== "idle") && (
            <>
              <span
                className="flex items-center gap-1.5 text-sm font-medium min-w-[72px]"
                style={{
                  color: saving
                    ? "var(--editor-text-secondary)"
                    : saveMessage === "saved"
                      ? "var(--editor-success)"
                      : "var(--editor-error)",
                }}
                aria-live="polite"
              >
                {saving ? (
                  <>
                    <span
                      className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"
                      aria-hidden
                    />
                    {t("toolbar.saving")}
                  </>
                ) : saveMessage === "saved" ? (
                  t("toolbar.saved")
                ) : (
                  t("toolbar.saveFailed")
                )}
              </span>
              <ToolbarDivider />
            </>
          )}
        </div>

        {/* Notifications, Viewing, Theme, User (same right block as actions above) */}
        {diagramId && getToken && !isViewer && (
          <>
            <ToolbarDivider />
            <NotificationBell
              getToken={getToken}
              onNavigate={onNotificationNavigate}
            />
          </>
        )}
        {collaborationConnected && (activeUsers.length > 0 || myColor) && (
          <>
            <ToolbarDivider />
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
              style={{
                backgroundColor: "var(--editor-bg)",
                border: "1px solid var(--editor-bar-border)",
              }}
              title="People viewing this diagram"
            >
              <span
                className="text-[11px] font-medium uppercase tracking-wide mr-0.5"
                style={{ color: "var(--editor-text-muted)" }}
              >
                {t("toolbar.viewing")}
              </span>
              {myColor && (
                <div
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full min-w-0 max-w-[100px]"
                  style={{
                    backgroundColor: `${myColor}22`,
                    border: `1.5px solid ${myColor}`,
                  }}
                  title={`${t("toolbar.you")} (${myDisplayName ?? t("toolbar.you")})`}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: myColor }}
                  />
                  <span
                    className="text-[11px] font-semibold truncate"
                    style={{ color: "var(--editor-text)" }}
                  >
                    {t("toolbar.you")}
                  </span>
                </div>
              )}
              {activeUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full min-w-0 max-w-[110px]"
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
                  <span
                    className="text-[11px] font-medium truncate"
                    style={{ color: "var(--editor-text)" }}
                  >
                    {u.displayName}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        <ToolbarDivider />
        {/* <LanguageSwitcher /> */}
        <button
          onClick={toggleTheme}
          className={btn}
          style={btnStyle}
          onMouseEnter={(e) => btnHover(e, true)}
          onMouseLeave={(e) => btnHover(e, false)}
          title={theme === "dark" ? "Light theme" : "Dark theme"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <UserAvatarMenu />
      </div>

      {/* Bar 2: Menu bar (draw.io style – File | Edit | View | Diagram) */}
      <div ref={menuBarRef} className={barBase + " h-10"} style={bar2Style}>
        {/* File */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === "file" ? null : "file")}
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{
              color: "var(--editor-text)",
              backgroundColor:
                openMenu === "file"
                  ? "var(--editor-surface-hover)"
                  : "transparent",
            }}
            onMouseEnter={(e) => {
              if (openMenu !== "file")
                e.currentTarget.style.backgroundColor =
                  "var(--editor-surface-hover)";
            }}
            onMouseLeave={(e) => {
              if (openMenu !== "file")
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {t("toolbar.file")}{" "}
            <ChevronDown size={12} className="inline ml-0.5 opacity-70" />
          </button>
          {openMenu === "file" && (
            <div
              className="absolute left-0 top-full mt-0.5 w-52 rounded-lg border py-1 z-50 text-sm"
              style={{
                backgroundColor: "var(--editor-panel-bg)",
                borderColor: "var(--editor-border)",
                boxShadow: "0 8px 16px var(--editor-shadow-lg)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  handleSave();
                  setOpenMenu(null);
                }}
                disabled={saving}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] disabled:opacity-50 flex items-center gap-2"
                style={{ color: "var(--editor-text)" }}
              >
                <Save size={14} /> {t("toolbar.saveMenuItem")}
              </button>
              {isLoggedIn && onSaveAs && (
                <button
                  type="button"
                  onClick={() => {
                    setSaveAsName(diagramName || t("toolbar.untitledDiagram"));
                    setShowSaveAsModal(true);
                    setOpenMenu(null);
                  }}
                  disabled={saving}
                  className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] disabled:opacity-50 flex items-center gap-2"
                  style={{ color: "var(--editor-text)" }}
                >
                  <FilePlus size={14} /> {t("toolbar.saveAs")}
                </button>
              )}
              {isLoggedIn && !isViewer && onCommitVersion && (
                <>
                  <div
                    className="my-1 border-t"
                    style={{ borderColor: "var(--editor-border)" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onCommitVersion();
                      setOpenMenu(null);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2"
                    style={{ color: "var(--editor-text)" }}
                  >
                    <GitCommitHorizontal size={14} /> Save version
                  </button>
                  {onVersionHistory && (
                    <button
                      type="button"
                      onClick={() => {
                        onVersionHistory();
                        setOpenMenu(null);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2"
                      style={{ color: "var(--editor-text)" }}
                    >
                      <History size={14} /> Version history
                    </button>
                  )}
                </>
              )}
              <div
                className="my-1 border-t"
                style={{ borderColor: "var(--editor-border)" }}
              />
              <label
                className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] cursor-pointer"
                style={{ color: "var(--editor-text)" }}
              >
                <Upload size={14} />
                {t("toolbar.importJson")}
                <input
                  type="file"
                  accept="application/json"
                  onChange={(e) => {
                    handleJsonImport(e);
                    setOpenMenu(null);
                  }}
                  className="hidden"
                />
              </label>
              <label
                className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] cursor-pointer"
                style={{ color: "var(--editor-text)" }}
              >
                <Upload size={14} />
                Import RDF{/* {t("toolbar.importJson")} */}
                <input
                  type="file"
                  accept=".ttl"
                  onChange={(e) => {
                    handleRdfImport(e);
                    setOpenMenu(null);
                  }}
                  className="hidden"
                />
              </label>
              <label
                className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] cursor-pointer"
                style={{ color: "var(--editor-text)" }}
              >
                <Upload size={14} />
                Import XML{/* {t("toolbar.importJson")} */}
                <input
                  type="file"
                  accept=".xml"
                  onChange={(e) => {
                    handleXmlImport(e);
                    setOpenMenu(null);
                  }}
                  className="hidden"
                />
              </label>
              <div
                className="my-1 border-t"
                style={{ borderColor: "var(--editor-border)" }}
              />
              <button
                type="button"
                onClick={() => {
                  handleJsonExport();
                  setOpenMenu(null);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2"
                style={{ color: "var(--editor-text)" }}
              >
                <Download size={14} /> {t("toolbar.exportJson")}
              </button>
              <button
                type="button"
                onClick={() => {
                  handlePngExport();
                  setOpenMenu(null);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2"
                style={{ color: "var(--editor-text)" }}
              >
                <Image size={14} /> {t("toolbar.exportPng")}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRdfExport();
                  setOpenMenu(null);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2"
                style={{ color: "var(--editor-text)" }}
              >
                <FileCode size={14} /> {t("toolbar.exportRdf")}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleXmlExport();
                  setOpenMenu(null);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2"
                style={{ color: "var(--editor-text)" }}
              >
                <FileCode size={14} /> {t("toolbar.exportXml")}
              </button>
            </div>
          )}
        </div>

        {/* Edit */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === "edit" ? null : "edit")}
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{
              color: "var(--editor-text)",
              backgroundColor:
                openMenu === "edit"
                  ? "var(--editor-surface-hover)"
                  : "transparent",
            }}
            onMouseEnter={(e) => {
              if (openMenu !== "edit")
                e.currentTarget.style.backgroundColor =
                  "var(--editor-surface-hover)";
            }}
            onMouseLeave={(e) => {
              if (openMenu !== "edit")
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {t("toolbar.edit")}{" "}
            <ChevronDown size={12} className="inline ml-0.5 opacity-70" />
          </button>
          {openMenu === "edit" && (
            <div
              className="absolute left-0 top-full mt-0.5 w-40 rounded-lg border py-1 z-50 text-sm"
              style={{
                backgroundColor: "var(--editor-panel-bg)",
                borderColor: "var(--editor-border)",
                boxShadow: "0 8px 16px var(--editor-shadow-lg)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  onUndo?.();
                  setOpenMenu(null);
                }}
                disabled={!canUndo}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] disabled:opacity-50 flex items-center gap-2"
                style={{ color: "var(--editor-text)" }}
              >
                <Undo size={14} /> {t("toolbar.undo")}
              </button>
              <button
                type="button"
                onClick={() => {
                  onRedo?.();
                  setOpenMenu(null);
                }}
                disabled={!canRedo}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] disabled:opacity-50 flex items-center gap-2"
                style={{ color: "var(--editor-text)" }}
              >
                <Redo size={14} /> {t("toolbar.redo")}
              </button>
            </div>
          )}
        </div>

        {/* View */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === "view" ? null : "view")}
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{
              color: "var(--editor-text)",
              backgroundColor:
                openMenu === "view"
                  ? "var(--editor-surface-hover)"
                  : "transparent",
            }}
            onMouseEnter={(e) => {
              if (openMenu !== "view")
                e.currentTarget.style.backgroundColor =
                  "var(--editor-surface-hover)";
            }}
            onMouseLeave={(e) => {
              if (openMenu !== "view")
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {t("toolbar.view")}{" "}
            <ChevronDown size={12} className="inline ml-0.5 opacity-70" />
          </button>
          {openMenu === "view" && (
            <div
              className="absolute left-0 top-full mt-0.5 w-40 rounded-lg border py-1 z-50 text-sm"
              style={{
                backgroundColor: "var(--editor-panel-bg)",
                borderColor: "var(--editor-border)",
                boxShadow: "0 8px 16px var(--editor-shadow-lg)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  onZoomIn?.();
                  setOpenMenu(null);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2"
                style={{ color: "var(--editor-text)" }}
              >
                <ZoomIn size={14} /> {t("toolbar.zoomIn")}
              </button>
              <button
                type="button"
                onClick={() => {
                  onZoomOut?.();
                  setOpenMenu(null);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2"
                style={{ color: "var(--editor-text)" }}
              >
                <ZoomOut size={14} /> {t("toolbar.zoomOut")}
              </button>
              <button
                type="button"
                onClick={() => {
                  onFitView?.();
                  setOpenMenu(null);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2"
                style={{ color: "var(--editor-text)" }}
              >
                <Maximize2 size={14} /> {t("toolbar.fitView")}
              </button>
            </div>
          )}
        </div>

        {/* Diagram */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenMenu(openMenu === "diagram" ? null : "diagram")
            }
            className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
            style={{
              color: "var(--editor-text)",
              backgroundColor:
                openMenu === "diagram"
                  ? "var(--editor-surface-hover)"
                  : "transparent",
            }}
            onMouseEnter={(e) => {
              if (openMenu !== "diagram")
                e.currentTarget.style.backgroundColor =
                  "var(--editor-surface-hover)";
            }}
            onMouseLeave={(e) => {
              if (openMenu !== "diagram")
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {t("toolbar.diagram")}{" "}
            <ChevronDown size={12} className="inline ml-0.5 opacity-70" />
          </button>
          {openMenu === "diagram" && (
            <div
              className="absolute left-0 top-full mt-0.5 w-44 rounded-lg border py-1 z-50 text-sm"
              style={{
                backgroundColor: "var(--editor-panel-bg)",
                borderColor: "var(--editor-border)",
                boxShadow: "0 8px 16px var(--editor-shadow-lg)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  handleValidation?.();
                  setOpenMenu(null);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2"
                style={{ color: "var(--editor-text)" }}
              >
                <CheckCircle size={14} /> {t("toolbar.validate")}
              </button>
            </div>
          )}
        </div>

        {/* Share (Share diagram + Comments) – only when diagram is open */}
        {(canShare && diagramId && onShareClick) ||
        (onCommentsClick && diagramId) ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === "share" ? null : "share")}
              className="px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 transition-colors"
              style={{
                color: "var(--editor-text)",
                backgroundColor:
                  openMenu === "share"
                    ? "var(--editor-surface-hover)"
                    : "transparent",
              }}
              onMouseEnter={(e) => {
                if (openMenu !== "share")
                  e.currentTarget.style.backgroundColor =
                    "var(--editor-surface-hover)";
              }}
              onMouseLeave={(e) => {
                if (openMenu !== "share")
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
              title={t("toolbar.shareAndComments")}
            >
              <Share2 size={14} />
              {t("toolbar.share")}{" "}
              <ChevronDown size={12} className="opacity-70" />
            </button>
            {openMenu === "share" && (
              <div
                className="absolute left-0 top-full mt-0.5 w-44 rounded-lg border py-1 z-50 text-sm"
                style={{
                  backgroundColor: "var(--editor-panel-bg)",
                  borderColor: "var(--editor-border)",
                  boxShadow: "0 8px 16px var(--editor-shadow-lg)",
                }}
              >
                {canShare && diagramId && onShareClick && (
                  <button
                    type="button"
                    onClick={() => {
                      onShareClick();
                      setOpenMenu(null);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2"
                    style={{ color: "var(--editor-text)" }}
                  >
                    <Share2 size={14} /> Share diagram
                  </button>
                )}
                {onCommentsClick && diagramId && (
                  <button
                    type="button"
                    onClick={() => {
                      onCommentsClick();
                      setOpenMenu(null);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] flex items-center gap-2 relative"
                    style={{ color: "var(--editor-text)" }}
                  >
                    <MessageSquare size={14} />
                    {t("toolbar.comments")}
                    {commentsUnresolvedCount > 0 && (
                      <span
                        className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: "var(--editor-accent)" }}
                      >
                        {commentsUnresolvedCount > 99
                          ? "99+"
                          : commentsUnresolvedCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : null}

        <ToolbarDivider />

        {/* Cost */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowCostDetails(!showCostDetails);
              setOpenMenu(null);
            }}
            className="px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 transition-colors"
            style={{
              color: "var(--editor-text)",
              backgroundColor: showCostDetails
                ? "var(--editor-surface-hover)"
                : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!showCostDetails)
                e.currentTarget.style.backgroundColor =
                  "var(--editor-surface-hover)";
            }}
            onMouseLeave={(e) => {
              if (!showCostDetails)
                e.currentTarget.style.backgroundColor = "transparent";
            }}
            title={t("toolbar.costBreakdown")}
          >
            <Calculator size={14} />
            {costSummary.total.toLocaleString()}€
            {showCostDetails ? (
              <ChevronUp size={12} className="opacity-70" />
            ) : (
              <ChevronDown size={12} className="opacity-70" />
            )}
          </button>
          {showCostDetails && (
            <div
              className="absolute left-0 top-full mt-0.5 w-64 rounded-lg border py-3 px-3 z-50"
              style={{
                backgroundColor: "var(--editor-panel-bg)",
                borderColor: "var(--editor-border)",
                boxShadow: "0 8px 16px var(--editor-shadow-lg)",
              }}
            >
              <h4
                className="text-[10px] font-bold uppercase border-b pb-1 mb-2"
                style={{
                  color: "var(--editor-text-secondary)",
                  borderColor: "var(--editor-border)",
                }}
              >
                {t("toolbar.costBreakdown")}
              </h4>
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {costSummary.nodesWithCost.length > 0 ? (
                  <ul className="space-y-1.5">
                    {costSummary.nodesWithCost.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center text-[11px]"
                      >
                        <span
                          style={{ color: "var(--editor-text-secondary)" }}
                          className="truncate pr-2"
                        >
                          {item.name}
                        </span>
                        <span
                          className="font-mono font-semibold"
                          style={{ color: "var(--editor-text)" }}
                        >
                          {item.cost.toLocaleString()}€
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div
                    className="text-[11px] text-center py-2 italic"
                    style={{ color: "var(--editor-text-secondary)" }}
                  >
                    No costs assigned
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showSaveAsModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowSaveAsModal(false)}
        >
          <div
            className="p-4 rounded-xl shadow-xl max-w-sm w-full mx-4"
            style={{
              backgroundColor: "var(--editor-panel-bg)",
              border: "1px solid var(--editor-border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--editor-text)" }}
            >
              {t("toolbar.saveAs")}
            </h3>
            <p
              className="text-sm mb-2"
              style={{ color: "var(--editor-text-secondary)" }}
            >
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
              className="w-full px-3 py-2 rounded-lg border mb-4 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--editor-bg)",
                borderColor: "var(--editor-border)",
                color: "var(--editor-text)",
              }}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSaveAsModal(false)}
                className="px-3 py-2 rounded-lg text-sm border"
                style={{
                  backgroundColor: "var(--editor-surface)",
                  color: "var(--editor-text)",
                  borderColor: "var(--editor-border)",
                }}
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSaveAs}
                disabled={saving || !saveAsName.trim()}
                className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                style={{
                  backgroundColor: "var(--editor-accent)",
                  color: "white",
                }}
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
