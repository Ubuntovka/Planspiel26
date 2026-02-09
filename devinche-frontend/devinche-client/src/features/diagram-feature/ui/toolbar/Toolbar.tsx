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
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { exportDiagramToPng } from "../exports/exportToPng";
import { DiagramNode } from "@/types/diagram";
import { useEffect, useMemo, useRef, useState } from "react";

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
  exportToRdf: () => string;
  exportToXml: () => string;
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
}

const Toolbar = ({
  onBack,
  backLabel = "Diagrams",
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
  importFromJson,
  handleValidation,
  allNodes = [],
  canShare = false,
  diagramId,
  onShareClick,
  onCommentsClick,
  commentsUnresolvedCount = 0,
}: ToolbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const [showCostDetails, setShowCostDetails] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<"idle" | "saved" | "error">(
    "idle",
  );
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const saveDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

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
    };

    if (showCostDetails || showSaveDropdown || showExportDropdown) {
      document.addEventListener("mousedown", handleClickOutside, true);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCostDetails, showSaveDropdown, showExportDropdown]);

  const handleDownloadJson = () => {
    try {
      const json = exportToJson();
      if (!json) return;

      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagram.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Problem exporting diagram JSON: ", e);
    }
  };

  const handleDownloadPng = async () => {
    if (!flowWrapperRef.current) return;
    try {
      await exportDiagramToPng(flowWrapperRef.current, "diagram.png");
    } catch (e) {
      console.error("Problem exporting diagram PNG: ", e);
    }
  };

  const handleDownloadRdf = async () => {
    try {
      const json = exportToJson();
      if (!json) {
        console.error("No diagram to export");
        return;
      }

      const diagram = JSON.parse(json);
      console.log(diagram);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/export/rdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: diagram }),
        },
      );

      if (!response.ok) {
        throw new Error(`RDF export failed: ${response.status}`);
      }

      // Backend returns plain Turtle string directly
      const ttlJson = await response.text();
      const ttl = JSON.parse(ttlJson).diagram;

      const blob = new Blob([ttl], { type: "text/turtle;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagram.ttl";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Problem exporting diagram RDF:", e);
    }
  };

  const handleDownloadXml = async () => {
    try {
      const json = exportToJson();
      if (!json) {
        console.error("No diagram to export");
        return;
      }

      const diagram = JSON.parse(json);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/export/xml`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: diagram }),
        },
      );

      if (!response.ok) {
        throw new Error(`XML export failed: ${response.status}`);
      }

      const xmlJson = await response.text();
      const xml = JSON.parse(xmlJson).diagram;

      const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagram.xml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Problem exporting diagram XML:", e);
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
      e.target.value = ""; // reset input
    }
  };

  const handleImportRdf: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    console.log("TTL import triggered");
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.size > 10 * 1024 * 1024 ||
      !file.name.toLowerCase().endsWith(".ttl")
    ) {
      e.target.value = "";
      console.error("Invalid file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/import/rdf`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Import failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log(result)
      importFromJson(JSON.stringify(result));
    } catch (err) {
      console.error("TTL import error:", err);
    } finally {
      e.target.value = "";
    }
  };

  const handleImportXml: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    console.log("XMLI ran");
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.size > 10 * 1024 * 1024 ||
      !file.name.toLowerCase().endsWith(".xml")
    ) {
      e.target.value = "";
      console.error("File too big");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/import/xml`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Import failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    try {
      importFromJson(JSON.stringify(result));
    } catch (err) {
      console.error("Problem importing diagram XML: ", err);
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
      setTimeout(() => setSaveMessage("idle"), 2000);
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
    } finally {
      setSaving(false);
    }
  };

  const btn =
    "h-8 px-2 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const btnText =
    "h-8 px-3 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const btnPrimary =
    "h-8 px-3 rounded-md text-white font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const btnStyle = { color: "var(--editor-text-secondary)" };
  const btnPrimaryStyle = { backgroundColor: "var(--editor-accent)" };
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
  const group = "flex items-center gap-1 px-1 py-1 rounded-lg";
  const groupStyle = {
    backgroundColor: "var(--editor-bg)",
    border: "1px solid var(--editor-border)",
  };

  return (
    <div
      className="absolute top-0 left-0 right-0 h-12 z-20 flex items-center px-4 gap-2"
      style={{
        backgroundColor: "var(--editor-surface)",
        borderBottom: "1px solid var(--editor-border)",
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          className={`${btnText} flex items-center gap-1.5`}
          style={{ ...btnStyle, border: "1px solid var(--editor-border)" }}
          onMouseEnter={(e) => btnHover(e, true)}
          onMouseLeave={(e) => btnHover(e, false)}
          title="Back to diagrams"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">{backLabel}</span>
        </button>
      )}

      {/* 1. Document: Save, name, Undo, Redo */}
      <div
        ref={saveDropdownRef}
        className={`${group} relative`}
        style={groupStyle}
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className={`${btnPrimary} flex items-center gap-1.5`}
          style={btnPrimaryStyle}
          onMouseEnter={(e) => {
            const t = e.currentTarget as HTMLElement;
            if (t.hasAttribute("disabled")) return;
            t.style.backgroundColor = "var(--editor-accent-hover)";
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget as HTMLElement;
            if (t.hasAttribute("disabled")) return;
            t.style.backgroundColor = "var(--editor-accent)";
          }}
          title="Save (Ctrl+S)"
        >
          <Save size={16} />
          <span className="text-sm">Save</span>
        </button>
        <div className="relative">
          <button
            onClick={() => setShowSaveDropdown(!showSaveDropdown)}
            className={`${btn} px-1`}
            style={btnStyle}
            onMouseEnter={(e) => btnHover(e, true)}
            onMouseLeave={(e) => btnHover(e, false)}
            title="More save options"
          >
            <span className="text-[10px]">▼</span>
          </button>
          {showSaveDropdown && (
            <div
              className="absolute left-0 top-full mt-1 py-1 rounded-lg shadow-lg z-50 min-w-[140px]"
              style={{
                backgroundColor: "var(--editor-panel-bg)",
                border: "1px solid var(--editor-border)",
                boxShadow: "0 8px 16px var(--editor-shadow-lg)",
              }}
            >
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--editor-surface-hover)] disabled:opacity-50"
                style={{ color: "var(--editor-text)" }}
              >
                Save
              </button>
              {isLoggedIn && onSaveAs && (
                <button
                  onClick={() => {
                    setSaveAsName(diagramName || "Untitled Diagram");
                    setShowSaveAsModal(true);
                  }}
                  disabled={saving}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--editor-surface-hover)] disabled:opacity-50"
                  style={{ color: "var(--editor-text)" }}
                >
                  Save As…
                </button>
              )}
            </div>
          )}
        </div>
        {diagramName && (
          <span
            className="text-sm ml-2 px-2 py-1 rounded-md truncate max-w-[160px]"
            style={{
              color: "var(--editor-text-muted)",
              backgroundColor: "var(--editor-surface-hover)",
            }}
            title={diagramName}
          >
            {diagramName}
          </span>
        )}
        {saveMessage === "saved" && (
          <span
            className="text-xs ml-1"
            style={{ color: "var(--editor-success)" }}
          >
            Saved
          </span>
        )}
        {saveMessage === "error" && (
          <span
            className="text-xs ml-1"
            style={{ color: "var(--editor-error)" }}
          >
            Failed
          </span>
        )}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={btn}
          style={btnStyle}
          onMouseEnter={(e) => btnHover(e, true)}
          onMouseLeave={(e) => btnHover(e, false)}
          title="Undo (Ctrl+Z)"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={btn}
          style={btnStyle}
          onMouseEnter={(e) => btnHover(e, true)}
          onMouseLeave={(e) => btnHover(e, false)}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* 2. Share (when owner) */}
      {canShare && diagramId && onShareClick && (
        <div className={group} style={groupStyle}>
          <button
            onClick={onShareClick}
            className={`${btnText} flex items-center gap-1.5`}
            style={{ ...btnStyle, border: "1px solid var(--editor-border)" }}
            onMouseEnter={(e) => btnHover(e, true)}
            onMouseLeave={(e) => btnHover(e, false)}
            title="Share diagram"
          >
            <Share2 size={16} />
            <span className="text-sm">Share</span>
          </button>
        </div>
      )}
      {onCommentsClick && diagramId && (
        <div className={group} style={groupStyle}>
          <button
            onClick={onCommentsClick}
            className={`${btnText} flex items-center gap-1.5 relative`}
            style={{ ...btnStyle, border: "1px solid var(--editor-border)" }}
            onMouseEnter={(e) => btnHover(e, true)}
            onMouseLeave={(e) => btnHover(e, false)}
            title="Comments"
          >
            <MessageSquare size={16} />
            <span className="text-sm">Comments</span>
            {commentsUnresolvedCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: "var(--editor-accent)" }}
              >
                {commentsUnresolvedCount > 99 ? "99+" : commentsUnresolvedCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* 3. View: Zoom & Fit */}
      <div className={group} style={groupStyle}>
        <button
          onClick={onZoomIn}
          className={btn}
          style={btnStyle}
          onMouseEnter={(e) => btnHover(e, true)}
          onMouseLeave={(e) => btnHover(e, false)}
          title="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={onZoomOut}
          className={btn}
          style={btnStyle}
          onMouseEnter={(e) => btnHover(e, true)}
          onMouseLeave={(e) => btnHover(e, false)}
          title="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={onFitView}
          className={btn}
          style={btnStyle}
          onMouseEnter={(e) => btnHover(e, true)}
          onMouseLeave={(e) => btnHover(e, false)}
          title="Fit view"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* 4. File: Import & Export (always visible with labels) */}
      <div className={group} style={groupStyle}>
        <div className="relative" ref={exportDropdownRef}>
          <button
            type="button"
            onClick={() => setShowImportDropdown((v) => !v)}
            className={`${btnText} flex items-center gap-1.5`}
            style={{
              ...btnStyle,
              border: "1px solid var(--editor-border)",
              backgroundColor: showImportDropdown
                ? "var(--editor-surface-hover)"
                : undefined,
            }}
            onMouseEnter={(e) => !showImportDropdown && btnHover(e, true)}
            onMouseLeave={(e) => !showImportDropdown && btnHover(e, false)}
            title="Export diagram"
          >
            <Upload size={16} />
            <span className="text-sm font-medium">Import</span>
            <ChevronDown
              size={14}
              className={showImportDropdown ? "rotate-180" : ""}
            />
          </button>
          {showImportDropdown && (
            <div
              className="absolute left-0 top-full mt-0.5 w-44 rounded-lg border py-1 z-50 font-medium text-sm"
              style={{
                backgroundColor: "var(--editor-panel-bg)",
                borderColor: "var(--editor-border)",
                boxShadow: "0 8px 16px var(--editor-shadow-lg)",
              }}
            >
              <label
                className="inline-block w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)]"
                style={{ color: "var(--editor-text)" }}
              >
                JSON
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportJson}
                  className="hidden"
                  // onClick={() => setShowImportDropdown(false)}
                />
              </label>
              <label
                className="inline-block w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)]"
                style={{ color: "var(--editor-text)" }}
              >
                RDF
                <input
                  type="file"
                  accept=".ttl"
                  onChange={handleImportRdf}
                  className="hidden"
                  // onClick={() => setShowImportDropdown(false)}
                />
              </label>
              <label
                htmlFor="import-xml"
                className="inline-block w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)]"
                style={{ color: "var(--editor-text)" }}
                // onClick={() => setShowImportDropdown(false)}
              >
                XML
                <input
                  id="import-xml"
                  type="file"
                  accept=".xml,application/xml"
                  onChange={handleImportXml}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
        <div className="relative" ref={exportDropdownRef}>
          <button
            type="button"
            onClick={() => setShowExportDropdown((v) => !v)}
            className={`${btnText} flex items-center gap-1.5`}
            style={{
              ...btnStyle,
              border: "1px solid var(--editor-border)",
              backgroundColor: showExportDropdown
                ? "var(--editor-surface-hover)"
                : undefined,
            }}
            onMouseEnter={(e) => !showExportDropdown && btnHover(e, true)}
            onMouseLeave={(e) => !showExportDropdown && btnHover(e, false)}
            title="Export diagram"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Export</span>
            <ChevronDown
              size={14}
              className={showExportDropdown ? "rotate-180" : ""}
            />
          </button>
          {showExportDropdown && (
            <div
              className="absolute left-0 top-full mt-0.5 w-44 rounded-lg border py-1 z-50 font-medium text-sm"
              style={{
                backgroundColor: "var(--editor-panel-bg)",
                borderColor: "var(--editor-border)",
                boxShadow: "0 8px 16px var(--editor-shadow-lg)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  handleDownloadJson();
                  setShowExportDropdown(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)]"
                style={{ color: "var(--editor-text)" }}
              >
                JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadPng();
                  setShowExportDropdown(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)]"
                style={{ color: "var(--editor-text)" }}
              >
                PNG
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadRdf();
                  setShowExportDropdown(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)]"
                style={{ color: "var(--editor-text)" }}
              >
                RDF
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadXml();
                  setShowExportDropdown(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-[var(--editor-surface-hover)]"
                style={{ color: "var(--editor-text)" }}
              >
                XML
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Diagram: Validate */}
      <div className={group} style={groupStyle}>
        <button
          onClick={handleValidation}
          className={`${btnText} text-sm font-medium`}
          style={{ ...btnStyle, border: "1px solid var(--editor-border)" }}
          onMouseEnter={(e) => btnHover(e, true)}
          onMouseLeave={(e) => btnHover(e, false)}
          title="Validate diagram"
        >
          Validate
        </button>
      </div>

      {/* 6. Cost */}
      <div ref={dropdownRef} className={`${group} relative`} style={groupStyle}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowCostDetails(!showCostDetails);
          }}
          className={`${btnText} flex items-center gap-1.5`}
          style={{
            ...btnStyle,
            border: "1px solid var(--editor-border)",
            backgroundColor: showCostDetails
              ? "var(--editor-surface-hover)"
              : undefined,
          }}
          onMouseEnter={(e) => !showCostDetails && btnHover(e, true)}
          onMouseLeave={(e) => !showCostDetails && btnHover(e, false)}
          title="Cost breakdown"
        >
          <Calculator size={16} />
          <span className="text-sm font-mono font-bold">
            {costSummary.total.toLocaleString()}€
          </span>
          {showCostDetails ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </button>
        {showCostDetails && (
          <div
            className="absolute top-10 left-0 w-64 rounded-lg shadow-xl z-50 p-3 flex flex-col gap-2"
            style={{
              backgroundColor: "var(--editor-panel-bg)",
              border: "1px solid var(--editor-border)",
              boxShadow: "0 8px 16px var(--editor-shadow-lg)",
            }}
          >
            <h4
              className="text-[10px] font-bold uppercase border-b pb-1"
              style={{
                color: "var(--editor-text-secondary)",
                borderColor: "var(--editor-border)",
              }}
            >
              Cost breakdown
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

      <div className="flex-1 min-w-2" />

      {/* 7. App: Theme & label */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className={btn}
          style={btnStyle}
          onMouseEnter={(e) => btnHover(e, true)}
          onMouseLeave={(e) => btnHover(e, false)}
          title={theme === "dark" ? "Light theme" : "Dark theme"}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <span
          className="text-xs font-mono ml-2 hidden sm:inline"
          style={{ color: "var(--editor-text-muted)" }}
        >
          Devinche
        </span>
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
              Save As
            </h3>
            <p
              className="text-sm mb-2"
              style={{ color: "var(--editor-text-secondary)" }}
            >
              New diagram name:
            </p>
            <input
              type="text"
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveAs();
                if (e.key === "Escape") setShowSaveAsModal(false);
              }}
              placeholder="Untitled Diagram"
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
                Cancel
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
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
