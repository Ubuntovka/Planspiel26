import { useState, useEffect } from 'react';
import { X, Save, Tag, Euro, Type as TypeIcon, Calculator } from 'lucide-react';
import type { DiagramNode, NodeData } from '@/types/diagram';

interface PropertiesPanelProps {
  selectedNode: DiagramNode | null;
  onUpdateNode: (nodeId: string, data: Partial<NodeData>) => void;
  onClose: () => void;
  isOpen: boolean;
}

const PropertiesPanel = ({ selectedNode, onUpdateNode, onClose, isOpen }: PropertiesPanelProps) => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [cost, setCost] = useState<string>('');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [extraData, setExtraData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.data.name || '');
      setType(selectedNode.data.type || '');
      setCost(selectedNode.data.cost?.toString() || '');
      setExtraData(selectedNode.data.extra || {});
      setIsDirty(false);
    } else {
      setName('');
      setType('');
      setCost('');
      setExtraData({});
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

  const handleExtraChange = (key: string, value: string) => {
    setExtraData(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!selectedNode || !isDirty) return;
    
    const updatedData: Partial<NodeData> = {
      name: name.trim() || undefined,
      type: type.trim() || undefined,
      cost: cost.trim() ? (isNaN(Number(cost)) ? cost : Number(cost)) : undefined,
      extra: extraData,
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

          {ADDITIONAL_FIELDS[selectedNode.type] && (
          <div className="pt-5 space-y-5 border-t border-(--editor-border)">
            {ADDITIONAL_FIELDS[selectedNode.type].map((field) => (
              <PropertyInput
                key={field.key}
                label={field.label}
                icon={field.icon}
                value={extraData[field.key] || ''}
                onChange={(val: string) => handleExtraChange(field.key, val)}
                onSave={handleSave}
                placeholder={`${field.label}...`}
              />
            ))}
          </div>
        )}

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

// Additional Fields Configuration Based on Node Type
const ADDITIONAL_FIELDS: Record<string, { label: string; key: string; icon: any; placeholder?: string }[]> = {
  // Application Context
  applicationNode: [
    { label: 'Location', key: 'location', icon: <TypeIcon size={14} />, placeholder: 'Base URL (e.g. https://...)' },
    { label: 'Certificate ID', key: 'certificateId', icon: <Tag size={14} />, placeholder: 'X509 key identifier' },
    { label: 'Sign-In Support', key: 'signInSupport', icon: <Calculator size={14} />, placeholder: 'Boolean (true/false)' },
    { label: 'Session Timeout', key: 'sessionTimeout', icon: <Calculator size={14} />, placeholder: 'Minutes before invalid' }
  ],
  
  // Web Service Context
  serviceNode: [
    { label: 'Location', key: 'location', icon: <TypeIcon size={14} />, placeholder: 'Service endpoint URL' },
    { label: 'Certificate ID', key: 'certificateId', icon: <Tag size={14} />, placeholder: 'Service certificate ID' },
    { label: 'Valid protocols', key: 'protocols', icon: <Tag size={14} />, placeholder: 'Valid service protocol' },
    { label: 'Authentication Type', key: 'authenticationType', icon: <Tag size={14} />, placeholder: 'Authentication type for service' }
  ],
  // Dataset Context
  datasetNode: [
    { label: 'Format', key: 'format', icon: <TypeIcon size={14} />, placeholder: 'e.g., CSV, JSON' },
    { label: 'Size', key: 'size', icon: <Calculator size={14} />, placeholder: 'e.g., 500MB' },
    { label: 'Source', key: 'source', icon: <Tag size={14} />, placeholder: 'Data source description' }
  ],
  // AI Process Context
  aiProcessNode: [
    { label: 'Algorithm', key: 'algorithm', icon: <TypeIcon size={14} />, placeholder: 'e.g., Neural Network' },
    { label: 'Accuracy', key: 'accuracy', icon: <Calculator size={14} />, placeholder: 'e.g., 95%' }
  ],
  // Realm Context
  securityRealmNode: [
    { label: 'Location', key: 'location', icon: <TypeIcon size={14} />, placeholder: 'STS base URL' },
    { label: 'Allocate IP', key: 'allocateIP', icon: <TypeIcon size={14} />, placeholder: 'IDP redirect URL' },
    { label: 'Encryption Type', key: 'encryptionType', icon: <TypeIcon size={14} />, placeholder: 'e.g., AES, RSA' }
  ],
  aiApplicationNode: [
    { label: 'Model Name', key: 'modelName', icon: <TypeIcon size={14} />, placeholder: 'e.g., GPT-4, Claude-3' },
    { label: 'Temperature', key: 'temperature', icon: <Calculator size={14} />, placeholder: '0.0 ~ 1.0 (Creativity control)' },
    { label: 'System Prompt', key: 'systemPrompt', icon: <Tag size={14} />, placeholder: 'Define AI personality/role' },
    { label: 'Max Tokens', key: 'maxTokens', icon: <Calculator size={14} />, placeholder: 'Max response length' },
    { label: 'Knowledge Base', key: 'knowledgeBase', icon: <Tag size={14} />, placeholder: 'RAG source identifier' }
  ],
  // AI Service Context (LLM API 또는 추론 엔진 서비스)
  aiServiceNode: [
    { label: 'Endpoint URL', key: 'location', icon: <TypeIcon size={14} />, placeholder: 'Inference API endpoint' },
    { label: 'Provider', key: 'provider', icon: <Tag size={14} />, placeholder: 'e.g., OpenAI, Anthropic, Local' },
    { label: 'API Quota', key: 'apiQuota', icon: <Calculator size={14} />, placeholder: 'Requests per minute (RPM)' },
    { label: 'Latency Target', key: 'latencyTarget', icon: <Calculator size={14} />, placeholder: 'Target response time (ms)' },
    { label: 'Streaming', key: 'streamingSupport', icon: <Tag size={14} />, placeholder: 'Boolean (true/false)' }
  ],
  // Identity Provider Context
  identityProviderNode: [
    // { label: 'Accounts', key: 'accounts', icon: <Tag size={14} />, placeholder: 'Set of accounts' },
    // { label: 'Session Timeout', key: 'sessionTimeout', icon: <Calculator size={14} />, placeholder: 'Minutes at IP' }
  ]
};

export default PropertiesPanel;