import React, { useState, useMemo, useRef, ChangeEvent } from "react";
import {
  Save, Undo, Redo, ZoomIn, ZoomOut, Maximize2, Sun, Moon,
  Share2, MessageSquare, Download, Upload, ArrowLeft, FilePlus,
  Image, FileCode, CheckCircle, FileText, GitCommitHorizontal, History
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import NotificationBell from "../notifications/NotificationBell";

// 팀원이 추가한 Import & Export 기능들 유지
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

// 질문자님이 모듈화한 UI 컴포넌트들 유지
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
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  allNodes?: DiagramNode[];
}

const Toolbar = (props: ToolbarProps) => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const [saving, setSaving] = useState(false);

  // 팀원이 추가한 File Upload 용 Ref 유지
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rdfInputRef = useRef<HTMLInputElement>(null);
  const xmlInputRef = useRef<HTMLInputElement>(null);

  // 팀원이 추가한 기능 핸들러
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await importDiagramFromJSON(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setOpenMenu(null);
  };

  const handleRdfUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await importDiagramFromRdf(file);
    if (rdfInputRef.current) rdfInputRef.current.value = "";
    setOpenMenu(null);
  };

  const handleXmlUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await importDiagramFromXml(file);
    if (xmlInputRef.current) xmlInputRef.current.value = "";
    setOpenMenu(null);
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

  // 비용 계산 로직 (질문자님 로직 유지)
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
      
      {/* 1. 상단 타이틀 및 설정 영역 */}
      <div className="flex justify-between items-center h-12 border-b border-[var(--editor-bar-border)]">
        <ScrollableMenuBar className="flex-1 h-full">
          <div className="flex items-center h-full px-2">
            {props.onBack && (
              <button
                onClick={props.onBack}
                className="p-2 mr-2 rounded-lg hover:bg-[var(--editor-surface-hover)] text-[var(--editor-text-secondary)] transition-colors"
                title={props.backLabel || t("common.back")}
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <span className="font-semibold text-sm text-[var(--editor-text)] truncate max-w-[200px]">
              {props.diagramName || t("toolbar.untitledDiagram")}
            </span>
          </div>
        </ScrollableMenuBar>
        
        <div className="flex items-center gap-2 px-4 h-full flex-shrink-0">
          {props.isLoggedIn && <NotificationBell />}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-[var(--editor-surface-hover)] text-[var(--editor-text-secondary)] transition-colors"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <UserAvatarMenu />
        </div>
      </div>

      {/* 2. 하단 툴바 메뉴 영역 */}
      <div className="flex justify-between items-center h-10 bg-[var(--editor-bg)]">
        <ScrollableMenuBar className="flex-1 h-full">
          {/* File Menu (팀원의 Import/Export를 DropdownItem으로 통합) */}
          <ToolbarDropDown
            label={t("toolbar.file")}
            isOpen={openMenu === "file"}
            onToggle={() => setOpenMenu(openMenu === "file" ? null : "file")}
          >
            <DropdownItem icon={FilePlus}>{t("toolbar.new")}</DropdownItem>
            <DropdownItem icon={Save} onClick={props.onSave}>{t("toolbar.save")}</DropdownItem>
            <DropdownItem icon={Save} onClick={() => { setSaveAsName(props.diagramName || ""); setShowSaveAsModal(true); }}>
              {t("toolbar.saveAs")}
            </DropdownItem>
            
            <ToolbarDivider />
            
            {/* Import Group */}
            <DropdownItem icon={Upload} onClick={() => fileInputRef.current?.click()}>Import JSON</DropdownItem>
            <DropdownItem icon={Upload} onClick={() => rdfInputRef.current?.click()}>Import RDF</DropdownItem>
            <DropdownItem icon={Upload} onClick={() => xmlInputRef.current?.click()}>Import XML</DropdownItem>
            
            <ToolbarDivider />
            
            {/* Export Group */}
            <DropdownItem icon={Download} onClick={() => { exportDiagramToJson(); setOpenMenu(null); }}>Export JSON</DropdownItem>
            <DropdownItem icon={Download} onClick={() => { exportDiagramToRdf(); setOpenMenu(null); }}>Export RDF</DropdownItem>
            <DropdownItem icon={Download} onClick={() => { exportDiagramToXml(); setOpenMenu(null); }}>Export XML</DropdownItem>
            <DropdownItem icon={Image} onClick={() => { exportDiagramToPng(); setOpenMenu(null); }}>Export PNG</DropdownItem>
          </ToolbarDropDown>

          {/* Edit Menu */}
          <ToolbarDropDown
            label={t("toolbar.edit")}
            isOpen={openMenu === "edit"}
            onToggle={() => setOpenMenu(openMenu === "edit" ? null : "edit")}
          >
            <DropdownItem icon={Undo} onClick={props.onUndo} disabled={!props.canUndo}>{t("toolbar.undo")}</DropdownItem>
            <DropdownItem icon={Redo} onClick={props.onRedo} disabled={!props.canRedo}>{t("toolbar.redo")}</DropdownItem>
          </ToolbarDropDown>

          {/* View Menu */}
          <ToolbarDropDown
            label={t("toolbar.view")}
            isOpen={openMenu === "view"}
            onToggle={() => setOpenMenu(openMenu === "view" ? null : "view")}
          >
            <DropdownItem icon={ZoomIn} onClick={props.onZoomIn}>{t("toolbar.zoomIn")}</DropdownItem>
            <DropdownItem icon={ZoomOut} onClick={props.onZoomOut}>{t("toolbar.zoomOut")}</DropdownItem>
            <DropdownItem icon={Maximize2} onClick={props.onFitView}>{t("toolbar.fitToScreen")}</DropdownItem>
          </ToolbarDropDown>
        </ScrollableMenuBar>

        {/* 3. 우측 고정 비용 계산기 (질문자님 모듈 유지) */}
        <CostBreakdown 
          total={costSummary.total} 
          nodesWithCost={costSummary.nodesWithCost} 
          t={t} 
        />
      </div>

      {/* 팀원이 추가한 숨겨진 Input 필드 (Import용) */}
      <input type="file" ref={fileInputRef} hidden accept=".json" onChange={handleFileUpload} />
      <input type="file" ref={rdfInputRef} hidden accept=".rdf,.ttl" onChange={handleRdfUpload} />
      <input type="file" ref={xmlInputRef} hidden accept=".xml" onChange={handleXmlUpload} />

      {/* Save As Modal (질문자님의 Tailwind CSS 스타일로 병합) */}
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