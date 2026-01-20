import { useState, useEffect, useMemo } from 'react';
import { X, Save, Tag, Euro, Type as TypeIcon, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import type { DiagramNode, NodeData } from '@/types/diagram';

interface PropertiesPanelProps {
  selectedNode: DiagramNode | null;
  onUpdateNode: (nodeId: string, data: Partial<NodeData>) => void;
  onClose: () => void;
  isOpen: boolean;
  allNodes: DiagramNode[];
}

const PropertiesPanel = ({ selectedNode, onUpdateNode, onClose, isOpen, allNodes }: PropertiesPanelProps) => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [cost, setCost] = useState<string>('');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Total Cost Calculation
  const costSummary = useMemo(() => {
    const nodesWithCost = allNodes
      .map(node => {
        const rawCost = node.data?.cost;
        const numericCost = typeof rawCost === 'number' 
          ? rawCost 
          : parseFloat(String(rawCost || '0').replaceAll(',', ''));
        
        return {
          id: node.id,
          name: node.data?.name || 'Unnamed Node',
          cost: numericCost
        };
      })
      .filter(item => !isNaN(item.cost) && item.cost > 0);

    const total = nodesWithCost.reduce((sum, item) => sum + item.cost, 0);
    return { nodesWithCost, total };
  }, [allNodes]);

  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.data.name || '');
      setType(selectedNode.data.type || '');
      setCost(selectedNode.data.cost?.toString() || '');
      setIsDirty(false);
    } else {
      setName('');
      setType('');
      setCost('');
      setIsDirty(false);
    }
  }, [selectedNode]);

  // Check if form is dirty (has unsaved changes)
  useEffect(() => {
    if (!selectedNode) {
      setIsDirty(false);
      return;
    }

    const currentName = name.trim() || undefined;
    const currentType = type.trim() || undefined;
    const currentCost = cost.trim() ? (isNaN(Number(cost)) ? cost : Number(cost)) : undefined;

    const nameChanged = currentName !== (selectedNode.data.name || undefined);
    const typeChanged = currentType !== (selectedNode.data.type || undefined);
    const costChanged = JSON.stringify(currentCost) !== JSON.stringify(selectedNode.data.cost || undefined);

    setIsDirty(nameChanged || typeChanged || costChanged);
  }, [name, type, cost, selectedNode]);

  const handleSave = () => {
    if (!selectedNode || !isDirty) return;
    
    const updatedData: Partial<NodeData> = {
      name: name.trim() || undefined,
      type: type.trim() || undefined,
      cost: cost.trim() ? (isNaN(Number(cost)) ? cost : Number(cost)) : undefined,
    };

    onUpdateNode(selectedNode.id, updatedData);
    setIsDirty(false);
  };

  if (!selectedNode || !isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-30 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
      />

      <div
        className="fixed top-0 right-0 h-full w-96 z-40 transition-transform duration-300 ease-in-out flex flex-col"
        style={{
          backgroundColor: 'var(--editor-panel-bg)',
          borderLeft: '1px solid var(--editor-border)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.12)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header Section */}
        <div className="flex flex-col px-6 py-5 gap-4 border-b border-(--editor-border) bg-(--editor-surface)">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-(--editor-accent) text-white shadow-md">
                <Tag size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-(--editor-text)">Node Properties</h3>
                <p className="text-xs text-(--editor-text-secondary)">Edit node details</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-(--editor-text-secondary) hover:bg-(--editor-surface-hover) cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Total Project Cost Section */}
          <div 
  className={`flex flex-col overflow-hidden rounded-lg border transition-all duration-200 ${
    showDetails 
      ? 'border-(--editor-accent) bg-[rgba(13,110,253,0.05)]' 
      : 'border-(--editor-border) bg-(--editor-surface)'
  }`}
>
  <button 
    onClick={() => setShowDetails(!showDetails)}
    className={`flex items-center justify-between px-4 py-3 transition-colors w-full cursor-pointer ${
      showDetails 
        ? 'hover:bg-[rgba(13,110,253,0.08)]' 
        : 'hover:bg-(--editor-surface-hover)'
    }`}
  >
    <div className={`flex items-center gap-2 transition-colors ${
      showDetails ? 'text-(--editor-accent)' : 'text-(--editor-text)'
    }`}>
      <Calculator size={14} />
      <span className="text-xs font-bold uppercase tracking-wider">Total Project Cost</span>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-sm font-mono font-bold transition-colors ${
        showDetails ? 'text-(--editor-text)' : 'text-(--editor-text-secondary)'
      }`}>
        {costSummary.total.toLocaleString()}€
      </span>
      <div className={showDetails ? 'text-(--editor-accent)' : 'text-(--editor-text-secondary)'}>
        {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>
    </div>
  </button>

  {/* Toggle Cost Detail */}
  {showDetails && (
    <div className="px-4 pb-3 max-h-48 overflow-y-auto custom-scrollbar border-t border-(--editor-accent)/20">
      <ul className="pt-2 space-y-2">
        {costSummary.nodesWithCost.length > 0 ? (
          costSummary.nodesWithCost.map((item) => (
            <li key={item.id} className="flex justify-between items-center text-[11px]">
              <span className="text-(--editor-text-secondary) truncate pr-2 max-w-[180px]">
                {item.name}
              </span>
              <span className="font-mono text-(--editor-text) shrink-0">
                {item.cost.toLocaleString()}€
              </span>
            </li>
          ))
        ) : (
          <li className="text-[11px] text-center py-2 text-(--editor-text-secondary) italic">
            No costs assigned yet
          </li>
        )}
      </ul>
    </div>
  )}
</div>
        </div>

        {/* Content Section (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar">
          {/* Node Type (Read-only) */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-2.5 text-(--editor-text-secondary)">
              <TypeIcon size={14} />
              <span className="uppercase tracking-wide">Node Type</span>
            </label>
            <div className="px-4 py-3 rounded-lg border border---editor-border) bg-(--editor-surface) text-sm font-medium text-(--editor-text)">
              {selectedNode.type || 'Unknown'}
            </div>
          </div>

          {/* Name Input */}
          <PropertyInput 
            label="Name" 
            icon={<Tag size={14} />} 
            value={name} 
            onChange={setName} 
            onSave={handleSave} 
            placeholder="Enter node name" 
          />

          {/* Type Input */}
          <PropertyInput 
            label="Category/Type" 
            icon={<TypeIcon size={14} />} 
            value={type} 
            onChange={setType} 
            onSave={handleSave} 
            placeholder="Enter custom type" 
          />

          {/* Cost Input */}
          <PropertyInput 
            label="Cost" 
            icon={<Euro size={14} />} 
            value={cost} 
            onChange={setCost} 
            onSave={handleSave} 
            placeholder="Enter amount (e.g. 500)" 
          />
        </div>

        {/* Footer Section */}
        <div className="px-6 py-5 border-t border-(--editor-border) bg-(--editor-surface)">
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={`w-full px-4 py-3.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 
              ${isDirty 
                ? 'bg-(--editor-accent) text-white shadow-lg -translate-y-px active:translate-y-0 shadow-(--editor-accent)/20' 
                : 'bg-(--editor-surface) text-(--editor-text-secondary) border border-(--editor-border) opacity-50 cursor-not-allowed'
              }`}
          >
            {isDirty ? <><Save size={18} /><span>Save Changes</span></> : <span>No Changes</span>}
          </button>
        </div>
      </div>
    </>
  );
};

// Reusable Property Input Component
const PropertyInput = ({ label, icon, value, onChange, onSave, placeholder }: any) => (
  <div>
    <label className="flex items-center gap-2 text-xs font-medium mb-2.5 text-(--editor-text-secondary)">
      {icon}
      <span className="uppercase tracking-wide">{label}</span>
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onSave()}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg border border-(--editor-border) bg-(--editor-surface) text-sm text-(--editor-text) transition-all focus:border-(--editor-accent) focus:ring-4 focus:ring-(--editor-accent)/10 focus:outline-none"
    />
  </div>
);

export default PropertiesPanel;