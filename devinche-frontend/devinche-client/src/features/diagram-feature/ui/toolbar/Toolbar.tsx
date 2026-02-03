import { Save, Undo, Redo, ZoomIn, ZoomOut, Maximize2, Sun, Moon, Calculator, ChevronUp, ChevronDown, CheckCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { exportDiagramToPng } from '../exports/exportToPng';
import { Download, Upload, FileJson, Image, FileCode } from 'lucide-react';
import { DiagramNode } from '@/types/diagram';
import { useEffect, useMemo, useRef, useState } from 'react';



interface ToolbarProps {
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
}

const Toolbar = ({
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
  allNodes=[],
}: ToolbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const [showCostDetails, setShowCostDetails] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [saveAsName, setSaveAsName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<'idle' | 'saved' | 'error'>('idle');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const saveDropdownRef = useRef<HTMLDivElement>(null);


  const costSummary = useMemo(() => {
    const nodesWithCost = allNodes
      .filter(node => {
        if (!node.data?.cost) return false;
        const costValue = Number(node.data.cost);
        return !isNaN(costValue) && costValue > 0;
      })
      .map(node => ({
        id: node.id,
        name: node.data.label || node.id,
        cost: Number(node.data.cost)
      }));
    
    const total = nodesWithCost.reduce((sum, item) => sum + item.cost, 0);
    return { nodesWithCost, total };
  }, [allNodes]);

 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCostDetails(false);
      }
      if (saveDropdownRef.current && !saveDropdownRef.current.contains(event.target as Node)) {
        setShowSaveDropdown(false);
      }
    };

    if (showCostDetails || showSaveDropdown) {
      document.addEventListener('mousedown', handleClickOutside, true);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCostDetails, showSaveDropdown]);


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
              console.error("Problem exporting diagram JSON: ", e)
          }
          
      };
  
      const handleDownloadPng = async () => {
          if (!flowWrapperRef.current) return;
          try {
          await exportDiagramToPng(flowWrapperRef.current, 'diagram.png');
          } catch (e) {
          console.error('Problem exporting diagram PNG: ', e);
          }
      };
  
      const handleDownloadRdf = () => {
          try {
          const ttl = exportToRdf();
          const blob = new Blob([ttl], { type: 'text/turtle;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'diagram.ttl';
          a.click();
          URL.revokeObjectURL(url);
          } catch (e) {
          console.error('Problem exporting diagram RDF: ', e);
          }
      };
  
      const handleDownloadXml = () => {
          try {
          const xml = exportToXml();
          const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'diagram.xml';
          a.click();
          URL.revokeObjectURL(url);
          } catch (e) {
          console.error('Problem exporting diagram XML: ', e);
          }
      };
  
      const handleImportJson: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
  
          try {
          const text = await file.text();
          importFromJson(text);
          } catch (err) {
          console.error('Problem importing diagram JSON: ', err);
          } finally {
          e.target.value = ''; // reset input
          }
      };
  
  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    setSaveMessage('idle');
    try {
      const result = await onSave();
      const ok = typeof result === 'boolean' ? result : true;
      setSaveMessage(ok ? 'saved' : 'error');
      if (ok) setTimeout(() => setSaveMessage('idle'), 2000);
    } catch {
      setSaveMessage('error');
      setTimeout(() => setSaveMessage('idle'), 2000);
    } finally {
      setSaving(false);
      setShowSaveDropdown(false);
    }
  };

  const handleSaveAs = async () => {
    if (!onSaveAs || !saveAsName.trim()) return;
    setSaving(true);
    setSaveMessage('idle');
    try {
      const id = await onSaveAs(saveAsName.trim());
      setSaveMessage(id ? 'saved' : 'error');
      setShowSaveAsModal(false);
      setSaveAsName('');
      setShowSaveDropdown(false);
    } catch {
      setSaveMessage('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 h-12 z-20 flex items-center px-4 gap-1" style={{ 
      backgroundColor: 'var(--editor-surface)', 
      borderBottom: '1px solid var(--editor-border)' 
    }}>
      <div ref={saveDropdownRef} className="flex items-center gap-1 pr-3 mr-3 relative" style={{ borderRight: '1px solid var(--editor-border)' }}>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="p-2 rounded-md transition-colors cursor-pointer disabled:opacity-50"
            style={{ color: 'var(--editor-text-secondary)' }}
            onMouseEnter={(e) => {
              if (!(e.currentTarget as HTMLButtonElement).disabled) {
                e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
                e.currentTarget.style.color = 'var(--editor-text)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--editor-text-secondary)';
            }}
            title="Save (Ctrl+S)"
          >
            <Save size={16} />
          </button>
          <div className="relative group">
            <button
              onClick={() => setShowSaveDropdown(!showSaveDropdown)}
              className="p-1 rounded-md transition-colors cursor-pointer"
              style={{ color: 'var(--editor-text-muted)', fontSize: 10 }}
              title="More save options"
            >
              ▼
            </button>
            {showSaveDropdown && (
              <div
                className="absolute left-0 top-full mt-1 py-1 rounded shadow-lg z-50 min-w-[140px]"
                style={{
                  backgroundColor: 'var(--editor-panel-bg)',
                  border: '1px solid var(--editor-border)',
                  boxShadow: '0 8px 16px var(--editor-shadow-lg)',
                }}
              >
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--editor-surface-hover)] disabled:opacity-50"
                  style={{ color: 'var(--editor-text)' }}
                >
                  Save
                </button>
                {isLoggedIn && onSaveAs && (
                  <button
                    onClick={() => {
                      setSaveAsName(diagramName || 'Untitled Diagram');
                      setShowSaveAsModal(true);
                    }}
                    disabled={saving}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--editor-surface-hover)] disabled:opacity-50"
                    style={{ color: 'var(--editor-text)' }}
                  >
                    Save As...
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {diagramName && (
          <span className="text-sm ml-2 truncate max-w-[180px]" style={{ color: 'var(--editor-text-muted)' }} title={diagramName}>
            {diagramName}
          </span>
        )}
        {saveMessage === 'saved' && (
          <span className="text-xs ml-1" style={{ color: 'var(--editor-success)' }}>Saved</span>
        )}
        {saveMessage === 'error' && (
          <span className="text-xs ml-1" style={{ color: 'var(--editor-error)' }}>Failed to save</span>
        )}
        {showSaveAsModal && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setShowSaveAsModal(false)}
          >
            <div
              className="p-4 rounded-lg shadow-xl max-w-sm w-full mx-4"
              style={{
                backgroundColor: 'var(--editor-panel-bg)',
                border: '1px solid var(--editor-border)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--editor-text)' }}>
                Save As
              </h3>
              <p className="text-sm mb-2" style={{ color: 'var(--editor-text-secondary)' }}>
                Enter a name for the diagram:
              </p>
              <input
                type="text"
                value={saveAsName}
                onChange={(e) => setSaveAsName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveAs();
                  if (e.key === 'Escape') setShowSaveAsModal(false);
                }}
                placeholder="Untitled Diagram"
                className="w-full px-3 py-2 rounded border mb-4"
                style={{
                  backgroundColor: 'var(--editor-bg)',
                  borderColor: 'var(--editor-border)',
                  color: 'var(--editor-text)',
                }}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowSaveAsModal(false)}
                  className="px-3 py-2 rounded text-sm"
                  style={{
                    backgroundColor: 'var(--editor-surface)',
                    color: 'var(--editor-text)',
                    border: '1px solid var(--editor-border)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAs}
                  disabled={saving || !saveAsName.trim()}
                  className="px-3 py-2 rounded text-sm font-medium disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--editor-accent)',
                    color: 'white',
                  }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ 
            color: 'var(--editor-text-secondary)',
          }}
          onMouseEnter={(e) => {
            if ((e.currentTarget as HTMLButtonElement).disabled) return;
            e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
            e.currentTarget.style.color = 'var(--editor-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--editor-text-secondary)';
          }}
          title="Undo (Ctrl+Z)"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ 
            color: 'var(--editor-text-secondary)',
          }}
          onMouseEnter={(e) => {
            if ((e.currentTarget as HTMLButtonElement).disabled) return;
            e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
            e.currentTarget.style.color = 'var(--editor-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--editor-text-secondary)';
          }}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 pr-3 mr-3" style={{ borderRight: '1px solid var(--editor-border)' }}>
        <button
          onClick={onZoomIn}
          className="p-2 rounded-md transition-colors cursor-pointer"
          style={{ 
            color: 'var(--editor-text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
            e.currentTarget.style.color = 'var(--editor-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--editor-text-secondary)';
          }}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 rounded-md transition-colors cursor-pointer"
          style={{ 
            color: 'var(--editor-text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
            e.currentTarget.style.color = 'var(--editor-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--editor-text-secondary)';
          }}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={onFitView}
          className="p-2 rounded-md transition-colors cursor-pointer"
          style={{ 
            color: 'var(--editor-text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
            e.currentTarget.style.color = 'var(--editor-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--editor-text-secondary)';
          }}
          title="Fit View"
        >
          <Maximize2 size={16} />
        </button>
      </div>
      
      <div className="flex items-center gap-1 pr-3 mr-3" style={{ borderRight: '1px solid var(--editor-border)' }}>
      {/* Import Dropdown */}
        <div className='import-wrapper h-[100%] relative group cursor-pointer'>
          <div className='h-[100%] items-center p-2 rounded-md transition-colors'
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
              e.currentTarget.style.color = 'var(--editor-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--editor-text-secondary)';
            }}
          >
            <Upload  size={16} className='items-center' />        
          </div>
          <div className='import-dropdown absolute left-0 w-40 bg-white rounded hidden group-hover:block font-medium text-sm cursor-pointer' 
            style={{ 
                  backgroundColor: 'var(--editor-panel-bg)',
                  border: '1px solid var(--editor-border)',
                  boxShadow: '0 8px 16px var(--editor-shadow-lg)'
              }}>
            <div className='import-item hover:cursor-pointer hover:bg-[#EEE] p-3'>
              <label>                   
                  <span className="flex-1">Import JSON </span>
                  <input
                      type="file"
                      accept="application/json"
                      onChange={handleImportJson}
                      className="hidden"
                  />
              </label>
            </div>
            {/* <div className='import-item hover:cursor-pointer hover:bg-[#EEE]'>Import JSON</div> */}
          </div>
        </div>

        {/* Export Dropdown */}
        <div className='import-wrapper h-[100%] relative group cursor-pointer'>
          <div className='h-[100%] items-center p-2 rounded-md transition-colors'
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
              e.currentTarget.style.color = 'var(--editor-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--editor-text-secondary)';
            }}
          >
            <Download  size={16} style={{ color: 'var(--editor-text-muted)' }} className='h-[100%] items-center'/>
          </div>
          <div className='import-dropdown absolute left-0 w-40 bg-white border rounded hidden group-hover:block font-medium text-sm'
            style={{ 
                  backgroundColor: 'var(--editor-panel-bg)',
                  border: '1px solid var(--editor-border)',
                  boxShadow: '0 8px 16px var(--editor-shadow-lg)'
              }}>
            <div onClick={handleDownloadJson} className='import-item hover:cursor-pointer hover:bg-[#EEE] p-3'>Export JSON</div>
            <div onClick={handleDownloadPng} className='import-item hover:cursor-pointer hover:bg-[#EEE] p-3'>Export PNG</div>
            <div onClick={handleDownloadRdf} className='import-item hover:cursor-pointer hover:bg-[#EEE] p-3'>Export RDF</div>
            <div onClick={handleDownloadXml} className='import-item hover:cursor-pointer hover:bg-[#EEE] p-3'>Export XML</div>
          </div>
        </div>
      </div>

      {/* Validation Button */}
      <div className="flex items-center gap-1 pr-3 mr-3" style={{ borderRight: '1px solid var(--editor-border)' }}>
        <button
          onClick={handleValidation}
          className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer"
          style={{
            color: 'var(--editor-text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
            e.currentTarget.style.color = 'var(--editor-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--editor-text-secondary)';
          }}
          title="Validate Diagram"
        >
          VALIDATE
        </button>
      </div>

      {/* Total Cost Button */}
      <div ref={dropdownRef} className="relative flex items-center">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowCostDetails(!showCostDetails)
          }}
          className="flex items-center gap-2 p-2 rounded-md transition-colors cursor-pointer"
          style={{ 
            color: 'var(--editor-text-secondary)',
            backgroundColor: showCostDetails ? 'var(--editor-surface-hover)' : 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
            e.currentTarget.style.color = 'var(--editor-text)';
          }}
          onMouseLeave={(e) => {
            if (!showCostDetails) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--editor-text-secondary)';
            }
          }}
          title="View Cost Breakdown"
        >
          <Calculator size={16} />
          <span className="text-sm font-mono font-bold">
            {costSummary.total.toLocaleString()}€
          </span>
          {showCostDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Total Cost Dropdown */}
        {showCostDetails && (
          <div 
            className="absolute top-10 left-0 w-64 rounded-lg shadow-xl z-50 p-3 flex flex-col gap-2"
            style={{ 
              backgroundColor: 'var(--editor-panel-bg)',
              border: '1px solid var(--editor-border)',
              boxShadow: '0 8px 16px var(--editor-shadow-lg)'
            }}
          >
            <h4 className="text-[10px] font-bold uppercase border-b pb-1" style={{ color: 'var(--editor-text-secondary)', borderColor: 'var(--editor-border)' }}>
              Cost Breakdown
            </h4>
            <div className="max-h-48 overflow-y-auto custom-scrollbar">
              {costSummary.nodesWithCost.length > 0 ? (
                <ul className="space-y-1.5">
                  {costSummary.nodesWithCost.map((item) => (
                    <li key={item.id} className="flex justify-between items-center text-[11px]">
                      <span style={{ color: 'var(--editor-text-secondary)' }} className="truncate pr-2">{item.name}</span>
                      <span className="font-mono font-semibold" style={{ color: 'var(--editor-text)' }}>
                        {item.cost.toLocaleString()}€
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[11px] text-center py-2 italic" style={{ color: 'var(--editor-text-secondary)' }}>
                  No costs assigned
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md transition-colors cursor-pointer"
        style={{ 
          color: 'var(--editor-text-secondary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
          e.currentTarget.style.color = 'var(--editor-text)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--editor-text-secondary)';
        }}
        title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="text-xs font-mono ml-3" style={{ color: 'var(--editor-text-secondary)' }}>
        Devinche Diagram Editor
      </div>
    </div>
  );
};

export default Toolbar;

