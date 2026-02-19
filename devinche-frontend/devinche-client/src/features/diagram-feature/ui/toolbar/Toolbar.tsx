import React, { useState, useMemo, useRef } from "react";
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
  onBack?: () => void;
  backLabel?: string;
  onSave?: () => void | Promise<boolean>;
  onSaveAs?: (name: string) => Promise<string | null>;
  diagramName?: string | null;
  isLoggedIn?: boolean;
  isViewer?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  allNodes?: DiagramNode[];
  handleValidation?: () => void;
  exportToJson?: () => string | null;
  importFromJson?: (json: string) => void;
  flowWrapperRef?: React.RefObject<HTMLDivElement>;

  onCommitVersion?: () => void;
  onVersionHistory?: () => void;
  onGenerateDocumentation?: () => void;
  isGeneratingDocumentation?: boolean;

  diagramId?: string | null;
  getToken?: () => string | null;
  onNotificationNavigate?: () => void;
}

const Toolbar = (props: ToolbarProps) => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const rdfInputRef = useRef<HTMLInputElement>(null);
  const xmlInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // Import Handlers
  // ----------------------------------------------------
  const handleJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const text = await importDiagramFromJSON(e);
      if (text && props.importFromJson) props.importFromJson(text);
    } catch (err) {
      console.error("Import failed:", err);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setOpenMenu(null);
  };

  const handleRdfImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const text = await importDiagramFromRdf(e);
      if (text && props.importFromJson) props.importFromJson(text);
    } catch (err) {
      console.error("Import failed:", err);
    }
    if (rdfInputRef.current) rdfInputRef.current.value = "";
    setOpenMenu(null);
  };

  const handleXmlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const text = await importDiagramFromXml(e);
      if (text && props.importFromJson) props.importFromJson(text);
    } catch (err) {
      console.error("Import failed:", err);
    }
    if (xmlInputRef.current) xmlInputRef.current.value = "";
    setOpenMenu(null);
  };

  // ----------------------------------------------------
  // Export Handlers
  // ----------------------------------------------------
  const handleJsonExport = () => {
    if (props.exportToJson) {
      const json = props.exportToJson();
      if (json) exportDiagramToJson(json);
    }
  };
  const handlePngExport = () => {
    if (props.flowWrapperRef?.current)
      exportDiagramToPng(props.flowWrapperRef.current);
  };
  const handleRdfExport = () => {
    if (props.exportToJson) {
      const json = props.exportToJson();
      if (json) exportDiagramToRdf(json);
    }
  };
  const handleXmlExport = () => {
    if (props.exportToJson) {
      const json = props.exportToJson();
      if (json) exportDiagramToXml(json);
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

  // Cost calculation logic
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
      {/* Bar 1: Title Bar */}
      <div className="flex justify-between items-center h-12 border-b border-[var(--editor-bar-border)] shadow-sm">
        <ScrollableMenuBar className="flex-1 h-full">
          <div className="flex items-center h-full px-2">
            {props.onBack && (
              <>
                <button
                  onClick={props.onBack}
                  className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg transition-colors cursor-pointer border border-[var(--editor-bar-border)] text-[var(--editor-text-secondary)] hover:bg-[var(--editor-surface-hover)] hover:text-[var(--editor-text)]"
                  title="Back to diagrams"
                >
                  <ArrowLeft size={16} />
                  <span className="text-sm font-medium">
                    {props.backLabel ?? t("toolbar.diagrams")}
                  </span>
                </button>
                <ToolbarDivider />
              </>
            )}
            <span className="font-semibold text-base text-[var(--editor-text)] truncate max-w-[240px]">
              {props.diagramName || t("toolbar.untitledDiagram")}
            </span>
          </div>
        </ScrollableMenuBar>

        {/* Pinned top right (notifications, language, theme, profile) */}
        <div className="flex items-center gap-2 px-4 h-full flex-shrink-0">
          {props.diagramId && props.getToken && !props.isViewer && (
            <NotificationBell
              getToken={props.getToken}
              onNavigate={props.onNotificationNavigate}
            />
          )}

          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-[var(--editor-surface-hover)] text-[var(--editor-text-secondary)] transition-colors"
            title={theme === "dark" ? "Light theme" : "Dark theme"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <UserAvatarMenu />
        </div>
      </div>

      {/* Bar 2: Menu Bar */}
      <div className="flex justify-between items-center h-10 bg-[var(--editor-bg)]">
        <ScrollableMenuBar className="flex-1 h-full">
          {/* 1. File Menu */}
          <ToolbarDropDown
            label={t("toolbar.file")}
            isOpen={openMenu === "file"}
            onToggle={() => setOpenMenu(openMenu === "file" ? null : "file")}
          >
            <DropdownItem icon={Save} onClick={props.onSave} disabled={saving}>
              {saving ? t("toolbar.saving") : t("toolbar.saveMenuItem")}
            </DropdownItem>

            {props.isLoggedIn && props.onSaveAs && (
              <DropdownItem
                icon={FilePlus}
                onClick={() => {
                  setSaveAsName(
                    props.diagramName || t("toolbar.untitledDiagram"),
                  );
                  setShowSaveAsModal(true);
                  setOpenMenu(null);
                }}
              >
                {t("toolbar.saveAs")}
              </DropdownItem>
            )}

            {props.isLoggedIn && !props.isViewer && props.onCommitVersion && (
              <>
                <div className="my-1 border-t border-[var(--editor-border)]" />
                <DropdownItem
                  icon={GitCommitHorizontal}
                  onClick={() => {
                    props.onCommitVersion!();
                    setOpenMenu(null);
                  }}
                >
                  Save version
                </DropdownItem>
                {props.onVersionHistory && (
                  <DropdownItem
                    icon={History}
                    onClick={() => {
                      props.onVersionHistory!();
                      setOpenMenu(null);
                    }}
                  >
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
                  onClick={() => {
                    setOpenMenu(null);
                    props.onGenerateDocumentation!();
                  }}
                  disabled={props.isGeneratingDocumentation}
                  className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)] disabled:opacity-50 flex items-center gap-2 text-sm text-[var(--editor-text)]"
                >
                  {props.isGeneratingDocumentation ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <FileText size={14} /> Generate documentation
                    </>
                  )}
                </button>
              </>
            )}

            <div className="my-1 border-t border-[var(--editor-border)]" />

            {/* Import/Export */}
            <DropdownItem
              icon={Upload}
              onClick={() => fileInputRef.current?.click()}
            >
              {t("toolbar.importJson")}
            </DropdownItem>
            <DropdownItem
              icon={Upload}
              onClick={() => rdfInputRef.current?.click()}
            >
              Import RDF
            </DropdownItem>
            <DropdownItem
              icon={Upload}
              onClick={() => xmlInputRef.current?.click()}
            >
              Import XML
            </DropdownItem>

            <div className="my-1 border-t border-[var(--editor-border)]" />

            <DropdownItem
              icon={Download}
              onClick={() => {
                handleJsonExport();
                setOpenMenu(null);
              }}
            >
              {t("toolbar.exportJson")}
            </DropdownItem>
            <DropdownItem
              icon={Image}
              onClick={() => {
                handlePngExport();
                setOpenMenu(null);
              }}
            >
              {t("toolbar.exportPng")}
            </DropdownItem>
            <DropdownItem
              icon={FileCode}
              onClick={() => {
                handleRdfExport();
                setOpenMenu(null);
              }}
            >
              {t("toolbar.exportRdf")}
            </DropdownItem>
            <DropdownItem
              icon={FileCode}
              onClick={() => {
                handleXmlExport();
                setOpenMenu(null);
              }}
            >
              {t("toolbar.exportXml")}
            </DropdownItem>
          </ToolbarDropDown>

          {/* 2. Edit */}
          <ToolbarDropDown
            label={t("toolbar.edit")}
            isOpen={openMenu === "edit"}
            onToggle={() => setOpenMenu(openMenu === "edit" ? null : "edit")}
          >
            <DropdownItem
              icon={Undo}
              onClick={() => {
                props.onUndo?.();
                setOpenMenu(null);
              }}
              disabled={!props.canUndo}
            >
              {t("toolbar.undo")}
            </DropdownItem>
            <DropdownItem
              icon={Redo}
              onClick={() => {
                props.onRedo?.();
                setOpenMenu(null);
              }}
              disabled={!props.canRedo}
            >
              {t("toolbar.redo")}
            </DropdownItem>
          </ToolbarDropDown>

          {/* 3. View */}
          <ToolbarDropDown
            label={t("toolbar.view")}
            isOpen={openMenu === "view"}
            onToggle={() => setOpenMenu(openMenu === "view" ? null : "view")}
          >
            <DropdownItem
              icon={ZoomIn}
              onClick={() => {
                props.onZoomIn?.();
                setOpenMenu(null);
              }}
            >
              {t("toolbar.zoomIn")}
            </DropdownItem>
            <DropdownItem
              icon={ZoomOut}
              onClick={() => {
                props.onZoomOut?.();
                setOpenMenu(null);
              }}
            >
              {t("toolbar.zoomOut")}
            </DropdownItem>
            <DropdownItem
              icon={Maximize2}
              onClick={() => {
                props.onFitView?.();
                setOpenMenu(null);
              }}
            >
              {t("toolbar.fitView")}
            </DropdownItem>
          </ToolbarDropDown>

          {/* 4. Diagram */}
          <ToolbarDropDown
            label={t("toolbar.diagram")}
            isOpen={openMenu === "diagram"}
            onToggle={() =>
              setOpenMenu(openMenu === "diagram" ? null : "diagram")
            }
          >
            <DropdownItem
              icon={CheckCircle}
              onClick={() => {
                props.handleValidation?.();
                setOpenMenu(null);
              }}
            >
              {t("toolbar.validate")}
            </DropdownItem>
          </ToolbarDropDown>
        </ScrollableMenuBar>

        {/* 5. Cost Breakdown */}
        <CostBreakdown
          total={costSummary.total}
          nodesWithCost={costSummary.nodesWithCost}
          t={t}
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="application/json"
        onChange={handleJsonImport}
      />
      <input
        type="file"
        ref={rdfInputRef}
        hidden
        accept=".rdf,.ttl"
        onChange={handleRdfImport}
      />
      <input
        type="file"
        ref={xmlInputRef}
        hidden
        accept=".xml"
        onChange={handleXmlImport}
      />

      {/* Save As Modal */}
      {showSaveAsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--editor-panel-bg)] border border-[var(--editor-border)] rounded-xl p-6 w-[400px] shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-[var(--editor-text)]">
              {t("toolbar.saveAs")}
            </h3>
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
