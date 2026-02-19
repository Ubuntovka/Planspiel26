import React, { useState, useMemo, useRef, useEffect } from "react";
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
  FileText,
  GitCommitHorizontal,
  History,
} from "lucide-react";

// Contexts & Components
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NotificationBell from "../notifications/NotificationBell";

// Imports & Exports
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

import ToolbarDropDown from "./ToolbarDropDown";
import DropdownItem from "./ToolbarDropDownItem";
import { CostBreakdown } from "./CostBreakdown";
import ScrollableMenuBar from "./ScrollableMenuBar";
import ToolbarDivider from "./ToolbarDivider";

interface ToolbarProps {
  // Navigation & Title
  onBack?: () => void;
  backLabel?: string;
  diagramName?: string | null;
  onRenameDiagram?: (name: string) => Promise<void>;
  
  // Auth & Permissions
  isLoggedIn?: boolean;
  isViewer?: boolean;
  
  // Persistence
  onSave?: () => void | Promise<boolean>;
  onSaveAs?: (name: string) => Promise<string | null>;
  
  // Editor Actions
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  
  // Diagram Data & Validation
  allNodes?: DiagramNode[];
  handleValidation?: () => void;
  exportToJson?: () => string | null;
  importFromJson?: (json: string) => void;
  flowWrapperRef?: React.RefObject<HTMLDivElement>;

  // Versioning & Documentation
  onCommitVersion?: () => void;
  onVersionHistory?: () => void;
  onGenerateDocumentation?: () => void;
  isGeneratingDocumentation?: boolean;

  // Collaboration & UI
  diagramId?: string | null;
  getToken?: () => string | null;
  onNotificationNavigate?: () => void;
  activeUsers?: { id: string; displayName: string; color: string }[];
  myColor?: string;
  myDisplayName?: string;
  collaborationConnected?: boolean;
  onShareClick?: () => void;
  onCommentsClick?: () => void;
  commentsUnresolvedCount?: number;
  canShare?: boolean;
}

const Toolbar = (props: ToolbarProps) => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // States
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Renaming State
  const [isEditingName, setIsEditingName] = useState(false);
  const [renameInput, setRenameInput] = useState(props.diagramName || "");
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const rdfInputRef = useRef<HTMLInputElement>(null);
  const xmlInputRef = useRef<HTMLInputElement>(null);

  // Sync title input with prop
  useEffect(() => {
    setRenameInput(props.diagramName || "");
  }, [props.diagramName]);

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------
  const handleRename = async () => {
    if (!props.onRenameDiagram || renameInput === props.diagramName) {
      setIsEditingName(false);
      return;
    }
    try {
      await props.onRenameDiagram(renameInput);
    } finally {
      setIsEditingName(false);
    }
  };

  const handleSave = async () => {
    if (!props.onSave) return;
    setSaving(true);
    try {
      const result = await props.onSave();
      if (result !== false) {
        setSaveMessage({ text: "Saved", type: 'success' });
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err) {
      setSaveMessage({ text: "Save Failed", type: 'error' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAs = async () => {
    if (!props.onSaveAs || !saveAsName.trim()) return;
    setSaving(true);
    try {
      await props.onSaveAs(saveAsName);
      setShowSaveAsModal(false);
    } finally {
      setSaving(false);
    }
  };

  // Import/Export Handlers (Refactored logic kept)
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>, importer: Function) => {
    try {
      const text = await importer(e);
      if (text && props.importFromJson) props.importFromJson(text);
    } catch (err) {
      console.error("Import failed:", err);
    }
    if (e.target) e.target.value = "";
    setOpenMenu(null);
  };

  const handleExport = (exporter: (json: string) => void) => {
    if (props.exportToJson) {
      const json = props.exportToJson();
      if (json) exporter(json);
    }
    setOpenMenu(null);
  };

  // Cost calculation
  const costSummary = useMemo(() => {
    if (!props.allNodes) return { nodesWithCost: [], total: 0 };
    const nodesWithCost = props.allNodes
      .filter((n) => Number(n.data?.cost) > 0)
      .map((n) => ({
        id: n.id,
        name: n.data.label || n.id,
        cost: Number(n.data.cost),
      }));
    return {
      nodesWithCost,
      total: nodesWithCost.reduce((s, i) => s + i.cost, 0),
    };
  }, [props.allNodes]);

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex flex-col bg-[var(--editor-bar-bg)] border-b border-[var(--editor-bar-border)]">
      {/* Bar 1: Title Bar & Collaboration */}
      <div className="flex justify-between items-center h-12 border-b border-[var(--editor-bar-border)] shadow-sm">
        <ScrollableMenuBar className="flex-1 h-full">
          <div className="flex items-center h-full px-2 gap-2">
            {props.onBack && (
              <>
                <button
                  onClick={props.onBack}
                  className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg transition-colors border border-[var(--editor-bar-border)] text-[var(--editor-text-secondary)] hover:bg-[var(--editor-surface-hover)]"
                  title="Back"
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm font-medium">{props.backLabel ?? t("toolbar.diagrams")}</span>
                </button>
                <ToolbarDivider />
              </>
            )}

            {/* Editable Title */}
            <div className="flex items-center gap-2 min-w-0">
              {isEditingName && !props.isViewer ? (
                <input
                  autoFocus
                  value={renameInput}
                  onChange={(e) => setRenameInput(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => e.key === "Enter" && handleRename()}
                  className="bg-[var(--editor-bg)] text-[var(--editor-text)] px-2 py-0.5 rounded border border-[var(--editor-accent)] focus:outline-none text-base font-semibold"
                />
              ) : (
                <span 
                  onClick={() => !props.isViewer && setIsEditingName(true)}
                  className={`font-semibold text-base text-[var(--editor-text)] truncate max-w-[240px] ${!props.isViewer ? 'cursor-pointer hover:bg-[var(--editor-surface-hover)] px-2 py-0.5 rounded' : ''}`}
                >
                  {props.diagramName || t("toolbar.untitledDiagram")}
                </span>
              )}

              {/* View Only Badge */}
              {props.isViewer && (
                <span className="px-2 py-0.5 rounded-full bg-[var(--editor-surface)] text-[var(--editor-text-secondary)] text-[10px] font-bold uppercase tracking-wider border border-[var(--editor-border)]">
                  View Only
                </span>
              )}

              {/* Save Feedback Message */}
              {saveMessage && (
                <span className={`text-xs font-medium px-2 ${saveMessage.type === 'error' ? 'text-red-500' : 'text-[var(--editor-accent)]'}`}>
                  {saveMessage.text}
                </span>
              )}
            </div>
          </div>
        </ScrollableMenuBar>

        {/* Top Right: Actions & Profile */}
        <div className="flex items-center gap-2 px-4 h-full flex-shrink-0">
          {/* Collaboration Avatars */}
          {props.collaborationConnected && props.activeUsers && (
            <div className="flex items-center -space-x-2 mr-2">
              {props.activeUsers.map((user) => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full border-2 border-[var(--editor-bar-bg)] flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: user.color }}
                  title={user.displayName}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}

          {/* Share & Comments */}
          {!props.isViewer && (
            <>
              {props.onCommentsClick && (
                <button
                  onClick={props.onCommentsClick}
                  className="relative p-2 rounded-lg hover:bg-[var(--editor-surface-hover)] text-[var(--editor-text-secondary)] transition-colors"
                  title="Comments"
                >
                  <MessageSquare size={18} />
                  {Number(props.commentsUnresolvedCount) > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-[var(--editor-bar-bg)]">
                      {props.commentsUnresolvedCount}
                    </span>
                  )}
                </button>
              )}
              {props.canShare && props.onShareClick && (
                <button
                  onClick={props.onShareClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--editor-accent)] text-white hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              )}
              <ToolbarDivider />
            </>
          )}

          {props.diagramId && props.getToken && !props.isViewer && (
            <NotificationBell getToken={props.getToken} onNavigate={props.onNotificationNavigate} />
          )}

          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-[var(--editor-surface-hover)] text-[var(--editor-text-secondary)] transition-colors"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <UserAvatarMenu />
        </div>
      </div>

      {/* Bar 2: Menus */}
      <div className="flex justify-between items-center h-10 bg-[var(--editor-bg)]">
        <ScrollableMenuBar className="flex-1 h-full">
          {/* File Menu */}
          <ToolbarDropDown
            label={t("toolbar.file")}
            isOpen={openMenu === "file"}
            onToggle={() => setOpenMenu(openMenu === "file" ? null : "file")}
          >
            <DropdownItem icon={Save} onClick={handleSave} disabled={saving || props.isViewer}>
              {saving ? t("toolbar.saving") : t("toolbar.saveMenuItem")}
            </DropdownItem>

            {props.isLoggedIn && props.onSaveAs && (
              <DropdownItem
                icon={FilePlus}
                onClick={() => {
                  setSaveAsName(props.diagramName || t("toolbar.untitledDiagram"));
                  setShowSaveAsModal(true);
                  setOpenMenu(null);
                }}
              >
                {t("toolbar.saveAs")}
              </DropdownItem>
            )}

            {(props.onCommitVersion || props.onVersionHistory) && (
              <>
                <div className="my-1 border-t border-[var(--editor-border)]" />
                {props.onCommitVersion && (
                  <DropdownItem icon={GitCommitHorizontal} onClick={() => { props.onCommitVersion!(); setOpenMenu(null); }} disabled={props.isViewer}>
                    Save version
                  </DropdownItem>
                )}
                {props.onVersionHistory && (
                  <DropdownItem icon={History} onClick={() => { props.onVersionHistory!(); setOpenMenu(null); }}>
                    Version history
                  </DropdownItem>
                )}
              </>
            )}

            {props.onGenerateDocumentation && (
              <>
                <div className="my-1 border-t border-[var(--editor-border)]" />
                <button
                  type="button"
                  onClick={() => { setOpenMenu(null); props.onGenerateDocumentation!(); }}
                  disabled={props.isGeneratingDocumentation}
                  className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] disabled:opacity-50 flex items-center gap-2 text-sm text-[var(--editor-text)]"
                >
                  {props.isGeneratingDocumentation ? (
                    <><span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" /> Generating...</>
                  ) : (
                    <><FileText size={14} /> Generate documentation</>
                  )}
                </button>
              </>
            )}

            <div className="my-1 border-t border-[var(--editor-border)]" />
            <DropdownItem icon={Upload} onClick={() => fileInputRef.current?.click()} disabled={props.isViewer}>
              {t("toolbar.importJson")}
            </DropdownItem>
            <DropdownItem icon={Upload} onClick={() => rdfInputRef.current?.click()} disabled={props.isViewer}>Import RDF</DropdownItem>
            <DropdownItem icon={Upload} onClick={() => xmlInputRef.current?.click()} disabled={props.isViewer}>Import XML</DropdownItem>

            <div className="my-1 border-t border-[var(--editor-border)]" />
            <DropdownItem icon={Download} onClick={() => handleExport(exportDiagramToJson)}>{t("toolbar.exportJson")}</DropdownItem>
            <DropdownItem icon={Image} onClick={() => { if(props.flowWrapperRef?.current) exportDiagramToPng(props.flowWrapperRef.current); setOpenMenu(null); }}>{t("toolbar.exportPng")}</DropdownItem>
            <DropdownItem icon={FileCode} onClick={() => handleExport(exportDiagramToRdf)}>{t("toolbar.exportRdf")}</DropdownItem>
            <DropdownItem icon={FileCode} onClick={() => handleExport(exportDiagramToXml)}>{t("toolbar.exportXml")}</DropdownItem>
          </ToolbarDropDown>

          {/* Edit Menu */}
          <ToolbarDropDown
            label={t("toolbar.edit")}
            isOpen={openMenu === "edit"}
            onToggle={() => setOpenMenu(openMenu === "edit" ? null : "edit")}
          >
            <DropdownItem icon={Undo} onClick={() => { props.onUndo?.(); setOpenMenu(null); }} disabled={!props.canUndo || props.isViewer}>
              {t("toolbar.undo")}
            </DropdownItem>
            <DropdownItem icon={Redo} onClick={() => { props.onRedo?.(); setOpenMenu(null); }} disabled={!props.canRedo || props.isViewer}>
              {t("toolbar.redo")}
            </DropdownItem>
          </ToolbarDropDown>

          {/* View Menu */}
          <ToolbarDropDown
            label={t("toolbar.view")}
            isOpen={openMenu === "view"}
            onToggle={() => setOpenMenu(openMenu === "view" ? null : "view")}
          >
            <DropdownItem icon={ZoomIn} onClick={() => { props.onZoomIn?.(); setOpenMenu(null); }}>{t("toolbar.zoomIn")}</DropdownItem>
            <DropdownItem icon={ZoomOut} onClick={() => { props.onZoomOut?.(); setOpenMenu(null); }}>{t("toolbar.zoomOut")}</DropdownItem>
            <DropdownItem icon={Maximize2} onClick={() => { props.onFitView?.(); setOpenMenu(null); }}>{t("toolbar.fitView")}</DropdownItem>
          </ToolbarDropDown>

          {/* Diagram Menu */}
          <ToolbarDropDown
            label={t("toolbar.diagram")}
            isOpen={openMenu === "diagram"}
            onToggle={() => setOpenMenu(openMenu === "diagram" ? null : "diagram")}
          >
            <DropdownItem icon={CheckCircle} onClick={() => { props.handleValidation?.(); setOpenMenu(null); }}>
              {t("toolbar.validate")}
            </DropdownItem>
          </ToolbarDropDown>
        </ScrollableMenuBar>

        {/* Cost Breakdown */}
        <CostBreakdown total={costSummary.total} nodesWithCost={costSummary.nodesWithCost} t={t} />
      </div>

      {/* Hidden File Inputs */}
      <input type="file" ref={fileInputRef} hidden accept="application/json" onChange={(e) => handleImport(e, importDiagramFromJSON)} />
      <input type="file" ref={rdfInputRef} hidden accept=".rdf,.ttl" onChange={(e) => handleImport(e, importDiagramFromRdf)} />
      <input type="file" ref={xmlInputRef} hidden accept=".xml" onChange={(e) => handleImport(e, importDiagramFromXml)} />

      {/* Save As Modal */}
      {showSaveAsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--editor-panel-bg)] border border-[var(--editor-border)] rounded-xl p-6 w-[400px] shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-[var(--editor-text)]">{t("toolbar.saveAs")}</h3>
            <input
              type="text"
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveAs();
                if (e.key === "Escape") setShowSaveAsModal(false);
              }}
              placeholder={t("toolbar.untitledDiagram")}
              className="w-full px-3 py-2 rounded-lg border mb-4 focus:outline-none focus:ring-2 bg-[var(--editor-bg)] border-[var(--editor-border)] text-[var(--editor-text)]"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowSaveAsModal(false)} className="px-3 py-2 rounded-lg text-sm border bg-[var(--editor-surface)] text-[var(--editor-text)] border-[var(--editor-border)]">
                {t("common.cancel")}
              </button>
              <button onClick={handleSaveAs} disabled={saving || !saveAsName.trim()} className="px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 bg-[var(--editor-accent)] text-white">
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