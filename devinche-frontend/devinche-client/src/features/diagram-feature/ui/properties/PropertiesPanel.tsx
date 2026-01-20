import { useState, useEffect } from 'react';
import { X, Save, Tag, DollarSign, Type as TypeIcon, Calculator } from 'lucide-react';
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

  // 1. Total Cost Calculation
  const totalCost = allNodes.reduce((sum, node) => {
    const cost = node.data?.cost;
    const numericCost = typeof cost === 'number' ? cost : parseFloat(cost || '0');
    return sum + (isNaN(numericCost) ? 0 : numericCost);
  }, 0);


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
        className="fixed inset-0 z-30 transition-opacity duration-300 ease-in-out"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-96 z-40 transition-transform duration-300 ease-in-out"
        style={{
          backgroundColor: 'var(--editor-panel-bg)',
          borderLeft: '1px solid var(--editor-border)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.12)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
      {/* Header */}
      <div
        className="flex flex-col px-6 py-5 gap-4"
        style={{
          borderBottom: '1px solid var(--editor-border)',
          backgroundColor: 'var(--editor-surface)',
        }}
      >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: 'var(--editor-accent)',
              color: 'white',
              boxShadow: '0 2px 8px rgba(13, 110, 253, 0.25)',
            }}
          >
            <Tag size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight" style={{ color: 'var(--editor-text)' }}>
              Node Properties
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--editor-text-secondary)' }}>
              Edit node details
            </p>
          </div>
        </div>
        <button
          className="p-2 rounded-lg transition-all duration-200 hover:bg-var(--editor-surface-hover)"
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
          onClick={onClose}
          aria-label="Close panel"
        >
          <X size={20} />
        </button>
      </div>

        {/* Total Cost */}
        <div 
          className="flex items-center justify-between px-4 py-2.5 rounded-lg" 
          style={{ 
            backgroundColor: 'rgba(13, 110, 253, 0.08)', 
            border: '1px dashed var(--editor-accent)' 
          }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--editor-accent)' }}>
            <Calculator size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Total Project Cost</span>
          </div>
          <span className="text-sm font-mono font-bold" style={{ color: 'var(--editor-text)' }}>
            {totalCost.toLocaleString()}
          </span>
        </div>
      </div>
      

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
        <div className="space-y-5">
          {/* Node Type Display */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-2.5" style={{ color: 'var(--editor-text-secondary)' }}>
              <TypeIcon size={14} />
              <span className="uppercase tracking-wide">Node Type</span>
            </label>
            <div
              className="px-4 py-3 rounded-lg border transition-colors"
              style={{
                backgroundColor: 'var(--editor-surface)',
                color: 'var(--editor-text)',
                fontSize: '14px',
                borderColor: 'var(--editor-border)',
              }}
            >
              <span className="font-medium">{selectedNode.type || 'Unknown'}</span>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label
              htmlFor="node-name"
              className="flex items-center gap-2 text-xs font-medium mb-2.5"
              style={{ color: 'var(--editor-text-secondary)' }}
            >
              <Tag size={14} />
              <span className="uppercase tracking-wide">Name</span>
            </label>
            <input
              id="node-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: 'var(--editor-surface)',
                color: 'var(--editor-text)',
                border: '1px solid var(--editor-border)',
                fontSize: '14px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--editor-accent)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.1)';
                e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--editor-border)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.backgroundColor = 'var(--editor-surface)';
              }}
              placeholder="Enter node name"
            />
          </div>

          {/* Type Field */}
          <div>
            <label
              htmlFor="node-type"
              className="flex items-center gap-2 text-xs font-medium mb-2.5"
              style={{ color: 'var(--editor-text-secondary)' }}
            >
              <TypeIcon size={14} />
              <span className="uppercase tracking-wide">Type</span>
            </label>
            <input
              id="node-type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: 'var(--editor-surface)',
                color: 'var(--editor-text)',
                border: '1px solid var(--editor-border)',
                fontSize: '14px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--editor-accent)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.1)';
                e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--editor-border)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.backgroundColor = 'var(--editor-surface)';
              }}
              placeholder="Enter node type"
            />
          </div>

          {/* Cost Field */}
          <div>
            <label
              htmlFor="node-cost"
              className="flex items-center gap-2 text-xs font-medium mb-2.5"
              style={{ color: 'var(--editor-text-secondary)' }}
            >
              <DollarSign size={14} />
              <span className="uppercase tracking-wide">Cost</span>
            </label>
            <input
              id="node-cost"
              type="text"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: 'var(--editor-surface)',
                color: 'var(--editor-text)',
                border: '1px solid var(--editor-border)',
                fontSize: '14px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--editor-accent)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13, 110, 253, 0.1)';
                e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--editor-border)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.backgroundColor = 'var(--editor-surface)';
              }}
              placeholder="Enter cost (number or text)"
            />
          </div>
        </div>
      </div>

      {/* Footer with Save Button */}
      <div
        className="px-6 py-5"
        style={{
          borderTop: '1px solid var(--editor-border)',
          backgroundColor: 'var(--editor-surface)',
        }}
      >
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className="w-full px-4 py-3.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            backgroundColor: isDirty ? 'var(--editor-accent)' : 'var(--editor-surface)',
            color: isDirty ? 'white' : 'var(--editor-text-secondary)',
            border: `1px solid ${isDirty ? 'var(--editor-accent)' : 'var(--editor-border)'}`,
            cursor: isDirty ? 'pointer' : 'not-allowed',
            opacity: isDirty ? 1 : 0.5,
            transform: isDirty ? 'scale(1)' : 'scale(0.98)',
            boxShadow: isDirty ? '0 4px 12px rgba(13, 110, 253, 0.25)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (isDirty) {
              e.currentTarget.style.backgroundColor = 'var(--editor-accent-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(13, 110, 253, 0.35)';
            }
          }}
          onMouseLeave={(e) => {
            if (isDirty) {
              e.currentTarget.style.backgroundColor = 'var(--editor-accent)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.25)';
            }
          }}
          onMouseDown={(e) => {
            if (isDirty) {
              e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
            }
          }}
          onMouseUp={(e) => {
            if (isDirty) {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
        >
          {isDirty ? (
            <>
              <Save size={18} />
              <span>Save Changes</span>
            </>
          ) : (
            <span>No Changes</span>
          )}
        </button>
      </div>
      </div>
    </>
  );
};

export default PropertiesPanel;