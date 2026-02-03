"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Save, Tag, Euro, Type as TypeIcon, Calculator, LinkIcon, Info } from "lucide-react";
import type { DiagramNode, NodeData } from "@/types/diagram";

interface PropertiesPanelProps {
  selectedNode: DiagramNode | null;
  onUpdateNode: (nodeId: string, data: Partial<NodeData>) => void;
  onClose: () => void;
  isOpen: boolean;
  allNodes?: DiagramNode[];
}

const PropertiesPanel = ({ 
  selectedNode, 
  selectedEdge, 
  onUpdateNode, 
  onUpdateEdge, 
  onClose, 
  isOpen,
  top,
  left,
  right,
  bottom 
}: PropertiesPanelProps & { top?: number; left?: number; right?: number; bottom?: number }) => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [cost, setCost] = useState<string>('');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [extraData, setExtraData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedEdge) {
      setName(selectedEdge.label?.toString() || '');
      setType('');
      setCost('');
      setExtraData((selectedEdge.data?.extra ?? {}) as Record<string, string>);
      setIsDirty(false);
    } else if (selectedNode) {
      setName(selectedNode.data.name || '');
      setType(selectedNode.data.type || '');
      setCost(selectedNode.data.cost?.toString() || '');
      setExtraData(selectedNode.data.extra || {});
      setIsDirty(false);
    }
  }, [selectedNode, selectedEdge]);

  useEffect(() => {
    if (!selectedNode && !selectedEdge) {
      setIsDirty(false);
      return;
    }
    
    let changed = false;
    if (selectedEdge) {
      const currentName = name.trim() || undefined;
      changed = currentName !== (selectedEdge.label || undefined) ||
                JSON.stringify(extraData) !== JSON.stringify(selectedEdge.data?.extra || {});
    } else if (selectedNode) {
      const currentName = name.trim() || undefined;
      const currentType = type.trim() || undefined;
      const currentCost = cost.trim() ? (isNaN(Number(cost)) ? cost : Number(cost)) : undefined;

      changed = currentName !== (selectedNode.data.name || undefined) ||
                currentType !== (selectedNode.data.type || undefined) ||
                JSON.stringify(currentCost) !== JSON.stringify(selectedNode.data.cost || undefined) ||
                JSON.stringify(extraData) !== JSON.stringify(selectedNode.data.extra || {});
    }
    setIsDirty(changed);
  }, [name, type, cost, extraData, selectedNode, selectedEdge]);

  const handleExtraChange = (key: string, value: string) => {
    setExtraData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!isDirty) return;
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { 
        label: name.trim() || undefined,
        data: { ...selectedEdge.data, extra: extraData } 
      });
    } else if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        name: name.trim() || undefined,
        type: type.trim() || undefined,
        cost: cost.trim() ? (isNaN(Number(cost)) ? cost : Number(cost)) : undefined,
        extra: extraData,
      });
    }
    setIsDirty(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen || (!selectedNode && !selectedEdge)) return null;

  const isEdge = !!selectedEdge;
  const nodeTypeLabel = isEdge 
    ? (selectedEdge.type || 'Connection') 
    : (selectedNode?.type?.replace(/([A-Z])/g, " $1").trim() || "Unknown");

  return (
    <div
      className="properties-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="properties-modal relative flex flex-col" 
        style={{ 
          top, left, right, bottom,
          position: (top || left) ? 'absolute' : 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="properties-modal__header">
          <span className="properties-modal__header-icon">
            {isEdge ? <LinkIcon size={22} /> : <Tag size={22} />}
          </span>
          <div className="properties-modal__title-wrap">
            <h2 className="properties-modal__title">
              {isEdge ? 'Edge properties' : 'Node properties'}
            </h2>
            <span className="properties-modal__subtitle">{nodeTypeLabel}</span>
          </div>
          <button type="button" className="properties-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <div className="properties-modal__body custom-scrollbar">
          <PropertyInput 
            label={isEdge ? "Label" : "Name"} 
            icon={<Tag size={14} />} 
            value={name} 
            onChange={setName} 
            onSave={handleSave} 
            placeholder={isEdge ? "Connection label" : "Enter node name"} 
          />

          {!isEdge && (
            <>
              <PropertyInput label="Category" icon={<TypeIcon size={14} />} value={type} onChange={setType} onSave={handleSave} />
              <PropertyInput label="Cost" icon={<Euro size={14} />} value={cost} onChange={setCost} onSave={handleSave} />
              
              {selectedNode && ADDITIONAL_FIELDS[selectedNode.type]?.map((field) => {

                const { key, ...fieldProps } = field;
                
                return (
                  <PropertyInput
                    key={key}          
                    {...fieldProps}   
                    value={extraData[key] || ""}
                    onChange={(val) => handleExtraChange(key, val)}
                    onSave={handleSave}
                  />
                );
              })}
            </>
          )}

          {isEdge && selectedEdge?.type && EDGE_ADDITIONAL_FIELDS[selectedEdge.type]?.map((field) => {
            const { key, condition, ...rest } = field;
            if (condition && !condition(extraData)) return null;
            return (
              <PropertyInput
                key={key} 
                {...rest}
                value={extraData[key] || ''}
                onChange={(val: string) => handleExtraChange(key, val)}
                onSave={handleSave}
              />
            );
          })}
        </div>

        <footer className="properties-modal__footer">
          <button
            type="button"
            className="properties-modal__save"
            onClick={handleSave}
            disabled={!isDirty}
          >
            <Save size={18} />
            <span>{isDirty ? "Save changes" : "No changes"}</span>
          </button>
        </footer>
      </div>
    </div>
  );
};


interface PropertyInputProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  placeholder?: string;
  type?: 'text' | 'select';
  options?: string[];     
  description?: string;
}
const PropertyInput = ({ label, icon, value, onChange, onSave, placeholder, type='text', options=[], description }: PropertyInputProps) => (
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
        style={{ backgroundImage: 'url("data:image/svg+xml,...")' }} 
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

const EDGE_ADDITIONAL_FIELDS: Record<string, any[]> = {
  invocation: [
    { 
      label: 'Protocol', 
      key: 'protocol', 
      icon: <TypeIcon size={14} />, 
      type: 'select', 
      options: ['REST API', 'SOAP', 'gRPC', 'GraphQL', 'WebSocket', 'Webhook', 'Other'], 
      placeholder: 'Select protocol type',
      description: 'The communication standard or architectural style used for this connection.' 
    },
    { 
      label: 'Custom Protocol', 
      key: 'customProtocol', 
      icon: <TypeIcon size={14} />, 
      placeholder: 'e.g. MQTT, AMQP, Thrift',
      condition: (data: any) => data.protocol === 'Other' 
    },
    { 
      label: 'Endpoint Path', 
      key: 'path', 
      icon: <LinkIcon size={14} />, 
      placeholder: 'e.g. /api/v1/resource',
      description: 'The target URI path, resource identifier, or action name.' 
    },
    { 
      label: 'Method', 
      key: 'method', 
      type: 'select', 
      options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
      icon: <Tag size={14} />,
      condition: (data: any) => data.protocol === 'REST API'
    },
    { 
      label: 'SOAP Action', 
      key: 'soapAction', 
      icon: <Tag size={14} />, 
      placeholder: 'e.g. GetUserDetails',
      description: 'The specific operation defined in the SOAP message header.',
      condition: (data: any) => data.protocol === 'SOAP'
    },
    { 
      label: 'WSDL URL', 
      key: 'wsdl', 
      icon: <LinkIcon size={14} />, 
      placeholder: 'https://example.com/service?wsdl',
      description: 'The location of the Web Services Description Language file.',
      condition: (data: any) => data.protocol === 'SOAP'
    },
    { 
      label: 'Event Type', 
      key: 'eventType', 
      icon: <Tag size={14} />, 
      placeholder: 'e.g. subscribe, publish, message',
      description: 'The specific event or message type for full-duplex communication.',
      condition: (data: any) => data.protocol === 'WebSocket'
    },
    { 
      label: 'Trigger Event', 
      key: 'triggerEvent', 
      icon: <Tag size={14} />, 
      placeholder: 'e.g. payment.captured, order.created',
      description: 'The external event that initiates this callback or webhook.',
      condition: (data: any) => data.protocol === 'Webhook'
    },
    { 
      label: 'Timeout (ms)', 
      key: 'timeout', 
      icon: <Calculator size={14} />, 
      placeholder: 'e.g. 5000',
      description: 'Maximum time in milliseconds to wait for a response.'
    }
  ],
  trust: [
    { 
      label: 'Auth Strategy', 
      key: 'authStrategy', 
      icon: <Tag size={14} />, 
      type: 'select', 
      options: ['OAuth2/OIDC', 'JWT', 'mTLS', 'API Key', 'SAML 2.0'],
      description: 'The mechanism used to establish a trusted identity between services.' 
    },
    { 
      label: 'Token Issuer', 
      key: 'issuer', 
      icon: <LinkIcon size={14} />, 
      placeholder: 'https://auth.example.com',
      description: 'The authority (IdP/STS) that issues and signs the security tokens.' 
    },
    { 
      label: 'Allowed Scopes', 
      key: 'scopes', 
      icon: <Tag size={14} />, 
      placeholder: 'e.g. openid, profile, read:user',
      description: 'The specific permissions or scopes granted via this trust relationship.' 
    },
    { 
      label: 'Verification Info', 
      key: 'verification', 
      icon: <Info size={14} />, 
      placeholder: 'e.g. JWKS URL or Public Key ID',
      description: 'How the receiving service verifies the authenticity of the token.' 
    }
  ],
  legacy: [
    { 
      label: 'Legacy System Type', 
      key: 'legacyProtocol', 
      icon: <TypeIcon size={14} />, 
      type: 'select', 
      options: ['SOAP (Legacy)', 'FTP/SFTP', 'Telnet', 'Direct DB Link', 'Custom'],
      description: 'An outdated or proprietary protocol used for connecting to legacy environments.'
    },
    { 
      label: 'Custom Type', 
      key: 'customLegacyProtocol', 
      icon: <TypeIcon size={14} />, 
      placeholder: 'Specify protocol name',
      condition: (data: any) => data.legacyProtocol === 'Custom' 
    },
    { 
      label: 'Certificate ID', 
      key: 'certificateId', 
      icon: <Tag size={14} />, 
      placeholder: 'X.509 Thumbprint or ID',
      description: 'The unique identifier for the digital certificate required for secure handshake.' 
    },
    { 
      label: 'Connection Method', 
      key: 'connectionMethod', 
      type: 'select', 
      options: ['VPN Tunnel', 'Direct Connect', 'Reverse Proxy', 'IP Whitelist'],
      icon: <LinkIcon size={14} />,
      description: 'The network-level connection strategy used to bridge the environments.'
    },
    { 
      label: 'Maintenance Window', 
      key: 'maintenance', 
      icon: <Calculator size={14} />, 
      placeholder: 'e.g. Sun 01:00-05:00 UTC',
      description: 'Scheduled downtime or synchronization cycles of the legacy system.' 
    }
  ]
};


export default PropertiesPanel;
