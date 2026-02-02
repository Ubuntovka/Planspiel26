import { useState, useEffect } from 'react';
import { X, Save, Tag, Euro, Type as TypeIcon, Calculator, Info } from 'lucide-react';
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
                type={field.type}     
                options={field.options} 
                value={extraData[field.key] || ''}
                onChange={(val: string) => handleExtraChange(field.key, val)}
                onSave={handleSave}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                description={field.description}
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

const PropertyInput = ({ label, icon, value, onChange, onSave, placeholder, type, options, description }: any) => (
  <div className="group relative">
    <div className="flex items-center justify-between">
    <label className="flex items-center gap-2 text-xs font-medium mb-2.5 text-(--editor-text-secondary)">
      {icon}
      <span className="uppercase tracking-wide">{label}</span>
    </label>
    {description && (
        <div className="relative flex items-center group/tooltip">
          <Info size={13} className="text-(--editor-text-secondary) opacity-50 hover:opacity-100 transition-opacity cursor-help" />
          
          {/* Tooltip Popup */}
          <div className="absolute bottom-full right-0 mb-2 w-56 p-2 bg-gray-900 text-white text-[11px] leading-relaxed rounded-md shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none border border-white/10">
            {description}
            <div className="absolute top-full right-1.5 border-[5px] border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
    {type === 'select' ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-(--editor-border) bg-(--editor-surface) text-sm text-(--editor-text) appearance-none focus:border-(--editor-accent) focus:outline-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,...")' }} // 화살표 아이콘 추가 가능
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSave()}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-(--editor-border) bg-(--editor-surface) text-sm text-(--editor-text) transition-all focus:border-(--editor-accent) focus:ring-4 focus:ring-(--editor-accent)/10 focus:outline-none"
      />
    )}
  </div>
);

// Additional Fields Configuration Based on Node Type
const ADDITIONAL_FIELDS: Record<string, { 
  label: string; 
  key: string; 
  icon: any; 
  placeholder?: string; 
  type?: 'select' | 'text'; 
  options?: string[]; 
  description?: string;
}[]> = {
  applicationNode: [
    { label: 'Location', key: 'location', icon: <TypeIcon size={14} />, placeholder: 'Base URL (e.g. https://...)', description: 'The root URL where the application is hosted.' },
    { label: 'Certificate ID', key: 'certificateId', icon: <Tag size={14} />, placeholder: 'X509 key identifier', description: 'The unique identifier for the SSL/TLS certificate used by this application.' },
    { label: 'Sign-In Support', key: 'signInSupport', icon: <Calculator size={14} />, placeholder: 'Boolean (true/false)', description: 'Indicates if the application supports user authentication.' },
    { label: 'Session Timeout', key: 'sessionTimeout', icon: <Calculator size={14} />, placeholder: 'Minutes before invalid', description: 'The duration of inactivity before a user session expires.' }
  ],
  
  serviceNode: [
    { label: 'Location', key: 'location', icon: <TypeIcon size={14} />, placeholder: 'Service endpoint URL', description: 'The specific API endpoint URL for this service.' },
    { label: 'Certificate ID', key: 'certificateId', icon: <Tag size={14} />, placeholder: 'Service certificate ID', description: 'The certificate ID required for secure service-to-service communication.' },
    { label: 'Valid protocols', key: 'protocols', icon: <Tag size={14} />, placeholder: 'Valid service protocol', description: 'Supported communication protocols (e.g., REST, SOAP, gRPC).' },
    { label: 'Authentication Type', key: 'authenticationType', icon: <Tag size={14} />, placeholder: 'Authentication type', description: 'The method used to authenticate requests (e.g., Bearer Token, API Key).' }
  ],

  datasetNode: [
    { label: 'Format', key: 'format', icon: <TypeIcon size={14} />, placeholder: 'e.g., CSV, JSON', description: 'The data structure format of the dataset.' },
    { label: 'Size', key: 'size', icon: <Calculator size={14} />, placeholder: 'e.g., 500MB', description: 'The total storage size or estimated volume of the data.' },
    { label: 'Source', key: 'source', icon: <Tag size={14} />, placeholder: 'Data source description', description: 'The origin or system from which this data is collected.' }
  ],

  aiProcessNode: [
    { label: 'Algorithm', key: 'algorithm', icon: <TypeIcon size={14} />, placeholder: 'e.g., Neural Network', description: 'The specific machine learning algorithm or logic used in this process.' },
    { label: 'Accuracy', key: 'accuracy', icon: <Calculator size={14} />, placeholder: 'e.g., 95%', description: 'The measured or target performance accuracy for this model.' }
  ],

  securityRealmNode: [
    { label: 'Location', key: 'location', icon: <TypeIcon size={14} />, placeholder: 'STS base URL', description: 'The base URL for the Security Token Service (STS).' },
    { label: 'Allocate IP', key: 'allocateIP', icon: <TypeIcon size={14} />, placeholder: 'IDP redirect URL', description: 'The endpoint for the Identity Provider (IDP) redirection.' },
    { label: 'Encryption Type', key: 'encryptionType', icon: <TypeIcon size={14} />, placeholder: 'e.g., AES, RSA', description: 'The cryptographic algorithm used for securing data within this realm.' }
  ],

  aiApplicationNode: [
    { label: 'Model Family', key: 'modelFamily', icon: <Tag size={14} />, placeholder: 'e.g., GPT-4, Claude 3.5', description: 'The broader category or lineage of the AI model being used.' },
    { label: 'Specific Version', key: 'modelVersion', icon: <Calculator size={14} />, placeholder: 'e.g., turbo-preview', description: 'The exact version or snapshot of the model to ensure reproducibility.' },
    { label: 'System Prompt', key: 'systemPrompt', icon: <TypeIcon size={14} />, placeholder: 'Define AI role...', description: 'The core instructions that guide the AI behavior and persona.' },
    { label: 'Temperature', key: 'temperature', icon: <Calculator size={14} />, placeholder: '0.0 to 1.0', description: 'Controls randomness: 0 is deterministic, 1 is highly creative.' },
    { label: 'Max Tokens', key: 'maxTokens', icon: <Calculator size={14} />, placeholder: 'Max response length', description: 'The maximum limit of tokens allowed in the generated response.' },
    { label: 'Knowledge Base', key: 'knowledgeBase', icon: <Tag size={14} />, placeholder: 'RAG source or Vector DB ID', description: 'Reference to the external data used for Retrieval Augmented Generation (RAG).' }
  ],

  aiServiceNode: [
    { label: 'Provider', key: 'provider', icon: <Tag size={14} />, type: 'select', options: ['OpenAI', 'Anthropic', 'Google Cloud', 'AWS Bedrock', 'Azure OpenAI', 'Self-Hosted'], placeholder: 'Select a provider', description: 'The platform or company providing the AI infrastructure.' },
    { label: 'Model Version', key: 'modelVersion', icon: <Tag size={14} />, placeholder: 'Active version info', description: 'The version of the service API currently in use.' },
    { label: 'Endpoint URL', key: 'location', icon: <TypeIcon size={14} />, placeholder: 'https://api...', description: 'The dedicated API gateway URL for the AI service.' },
    { label: 'API Quota', key: 'apiQuota', icon: <Calculator size={14} />, placeholder: 'RPM limit', description: 'The maximum number of requests permitted per minute (RPM).' },
    { label: 'Latency Target', key: 'latencyTarget', icon: <Calculator size={14} />, placeholder: 'e.g., 200ms', description: 'The desired response time threshold for the service.' }
  ],
    identityProviderNode: [
    // { label: 'Accounts', key: 'accounts', icon: <Tag size={14} />, placeholder: 'Set of accounts' },
    // { label: 'Session Timeout', key: 'sessionTimeout', icon: <Calculator size={14} />, placeholder: 'Minutes at IP' }
  ]
};


export default PropertiesPanel;