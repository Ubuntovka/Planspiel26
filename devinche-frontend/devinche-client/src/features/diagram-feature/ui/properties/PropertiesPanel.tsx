"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Save, Tag, Euro, Type as TypeIcon, Calculator } from "lucide-react";
import type { DiagramNode, NodeData } from "@/types/diagram";

interface PropertiesPanelProps {
  selectedNode: DiagramNode | null;
  onUpdateNode: (nodeId: string, data: Partial<NodeData>) => void;
  onClose: () => void;
  isOpen: boolean;
  allNodes?: DiagramNode[];
}

const PropertiesPanel = ({ selectedNode, onUpdateNode, onClose, isOpen }: PropertiesPanelProps) => {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [extraData, setExtraData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedNode) {
      setName(selectedNode.data.name || "");
      setType(selectedNode.data.type || "");
      setCost(selectedNode.data.cost?.toString() || "");
      setExtraData(selectedNode.data.extra || {});
      setIsDirty(false);
    } else {
      setName("");
      setType("");
      setCost("");
      setExtraData({});
      setIsDirty(false);
    }
  }, [selectedNode]);

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
    setIsDirty(!!(nameChanged || typeChanged || costChanged));
  }, [name, type, cost, selectedNode]);

  const handleExtraChange = (key: string, value: string) => {
    setExtraData((prev) => ({ ...prev, [key]: value }));
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!selectedNode || !isOpen) return null;

  const nodeTypeLabel = selectedNode.type?.replace(/([A-Z])/g, " $1").trim() || "Unknown";
  const addlFields = ADDITIONAL_FIELDS[selectedNode.type];

  return (
    <div
      className="properties-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="properties-modal-title"
    >
      <div
        className="properties-modal relative"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="properties-modal__header">
          <span className="properties-modal__header-icon">
            <Tag size={22} strokeWidth={2} />
          </span>
          <div className="properties-modal__title-wrap">
            <h2 id="properties-modal-title" className="properties-modal__title">
              Node properties
            </h2>
            <span className="properties-modal__subtitle">{nodeTypeLabel}</span>
          </div>
          <button
            type="button"
            className="properties-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>

        <div className="properties-modal__body custom-scrollbar">
          <PropertyInput label="Name" icon={<Tag size={14} />} value={name} onChange={setName} onSave={handleSave} placeholder="Enter node name" />
          <PropertyInput label="Category / type" icon={<TypeIcon size={14} />} value={type} onChange={setType} onSave={handleSave} placeholder="Enter custom type" />
          <PropertyInput label="Cost" icon={<Euro size={14} />} value={cost} onChange={setCost} onSave={handleSave} placeholder="e.g. 500" />

          {addlFields && addlFields.length > 0 && (
            <>
              <div className="prop-field__divider" />
              <div className="prop-field__section-label">Additional details</div>
              {addlFields.map((field) => (
                <PropertyInput
                  key={field.key}
                  label={field.label}
                  icon={field.icon}
                  value={extraData[field.key] || ""}
                  onChange={(val) => handleExtraChange(field.key, val)}
                  onSave={handleSave}
                  placeholder={field.placeholder ?? `${field.label}…`}
                />
              ))}
            </>
          )}
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
}

const PropertyInput = ({ label, icon, value, onChange, onSave, placeholder }: PropertyInputProps) => (
  <div className="prop-field">
    <label className="prop-field__label">
      {icon}
      {label}
    </label>
    <input
      type="text"
      className="prop-field__input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSave()}
      placeholder={placeholder}
    />
  </div>
);

const ADDITIONAL_FIELDS: Record<string, { label: string; key: string; icon: React.ReactNode; placeholder?: string }[]> = {
  applicationNode: [
    { label: "Location", key: "location", icon: <TypeIcon size={14} />, placeholder: "Base URL (e.g. https://…)" },
    { label: "Certificate ID", key: "certificateId", icon: <Tag size={14} />, placeholder: "X509 key identifier" },
    { label: "Sign-in support", key: "signInSupport", icon: <Calculator size={14} />, placeholder: "true / false" },
    { label: "Session timeout", key: "sessionTimeout", icon: <Calculator size={14} />, placeholder: "Minutes" },
  ],
  serviceNode: [
    { label: "Location", key: "location", icon: <TypeIcon size={14} />, placeholder: "Service endpoint URL" },
    { label: "Certificate ID", key: "certificateId", icon: <Tag size={14} />, placeholder: "Certificate ID" },
    { label: "Valid protocols", key: "protocols", icon: <Tag size={14} />, placeholder: "Protocols" },
    { label: "Authentication type", key: "authenticationType", icon: <Tag size={14} />, placeholder: "Auth type" },
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
    { label: "Location", key: "location", icon: <TypeIcon size={14} />, placeholder: "STS base URL" },
    { label: "Allocate IP", key: "allocateIP", icon: <TypeIcon size={14} />, placeholder: "IDP redirect URL" },
    { label: "Encryption type", key: "encryptionType", icon: <TypeIcon size={14} />, placeholder: "e.g. AES, RSA" },
  ],
  identityProviderNode: [],
};

export default PropertiesPanel;
