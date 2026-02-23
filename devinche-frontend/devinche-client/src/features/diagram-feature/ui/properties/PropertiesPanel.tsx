"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Save,
  Tag,
  Euro,
  Type as TypeIcon,
  LinkIcon,
} from "lucide-react";
import type { DiagramEdge, DiagramNode, NodeData } from "@/types/diagram";
import { useIsMobile } from "../../hooks/useMobile";
import { PropertyInput } from "./PropertyInput";
import { ADDITIONAL_FIELDS, EDGE_ADDITIONAL_FIELDS } from "./propertiesData";

interface PropertiesPanelProps {
  selectedNode: DiagramNode | null;
  selectedEdge: DiagramEdge | null;
  onUpdateNode: (nodeId: string, data: Partial<NodeData>) => void;
  onUpdateEdge: (edgeId: string, data: any) => void;
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
  bottom,
}: PropertiesPanelProps & {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [extraData, setExtraData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedEdge) {
      setName(selectedEdge.label?.toString() || "");
      setType("");
      setCost("");
      setExtraData((selectedEdge.data?.extra ?? {}) as Record<string, string>);
      setIsDirty(false);
    } else if (selectedNode) {
      setName(selectedNode.data.name || "");
      setType(selectedNode.data.type || "");
      setCost(selectedNode.data.cost?.toString() || "");
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
      changed =
        currentName !== (selectedEdge.label || undefined) ||
        JSON.stringify(extraData) !==
          JSON.stringify(selectedEdge.data?.extra || {});
    } else if (selectedNode) {
      const currentName = name.trim() || undefined;
      const currentType = type.trim() || undefined;
      const currentCost = cost.trim()
        ? isNaN(Number(cost))
          ? cost
          : Number(cost)
        : undefined;

      changed =
        currentName !== (selectedNode.data.name || undefined) ||
        currentType !== (selectedNode.data.type || undefined) ||
        JSON.stringify(currentCost) !==
          JSON.stringify(selectedNode.data.cost || undefined) ||
        JSON.stringify(extraData) !==
          JSON.stringify(selectedNode.data.extra || {});
    }
    setIsDirty(changed);
  }, [name, type, cost, extraData, selectedNode, selectedEdge]);

  const handleExtraChange = (key: string, value: string) => {
    setExtraData((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!isDirty) {
      onClose();
      return;
    }
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, {
        label: name.trim() || undefined,
        data: { ...selectedEdge.data, extra: extraData },
      });
    } else if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        name: name.trim() || undefined,
        type: type.trim() || undefined,
        cost: cost.trim()
          ? isNaN(Number(cost))
            ? cost
            : Number(cost)
          : undefined,
        extra: extraData,
      });
    }
    setIsDirty(false);
    onClose();
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen || (!selectedNode && !selectedEdge)) return null;

  const isEdge = !!selectedEdge;
  const nodeTypeLabel = isEdge
    ? selectedEdge.type || "Connection"
    : selectedNode?.type?.replace(/([A-Z])/g, " $1").trim() || "Unknown";

  const mobileContainerStyle: React.CSSProperties = {
    position: "relative",
    width: "90%",
    maxWidth: "400px",
    margin: "auto",
    borderRadius: "20px",
    maxHeight: "85vh",
    zIndex: 2000,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
  };

  const desktopContainerStyle: React.CSSProperties = {
    top,
    left,
    right,
    bottom,
    position: top || left ? "absolute" : "relative",
    zIndex: 1100,
  };
  return (
    <div
      className={`properties-modal-backdrop ${isMobile ? "flex items-end" : ""}`}
      style={{ zIndex: 1100 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`properties-modal relative flex flex-col ${
          isMobile ? "w-full animate-in slide-in-from-bottom duration-300" : ""
        }`}
        style={isMobile ? mobileContainerStyle : desktopContainerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="properties-modal__header">
          <span className="properties-modal__header-icon">
            {isEdge ? <LinkIcon size={22} /> : <Tag size={22} />}
          </span>
          <div className="properties-modal__title-wrap">
            <h2 className="properties-modal__title">
              {isEdge ? "Edge properties" : "Node properties"}
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

        <div
          className={`properties-modal__body custom-scrollbar ${isMobile ? "pb-10" : ""}`}
        >
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
              <PropertyInput
                label="Category"
                icon={<TypeIcon size={14} />}
                value={type}
                onChange={setType}
                onSave={handleSave}
              />
              <PropertyInput
                label="Cost"
                icon={<Euro size={14} />}
                value={cost}
                onChange={setCost}
                onSave={handleSave}
              />

              {selectedNode?.type &&
                ADDITIONAL_FIELDS[selectedNode.type]?.map((field) => {
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

          {isEdge &&
            selectedEdge?.type &&
            EDGE_ADDITIONAL_FIELDS[selectedEdge.type]?.map((field) => {
              const { key, condition, ...rest } = field;
              if (condition && !condition(extraData)) return null;
              return (
                <PropertyInput
                  key={key}
                  {...rest}
                  value={extraData[key] || ""}
                  onChange={(val: string) => handleExtraChange(key, val)}
                  onSave={handleSave}
                />
              );
            })}
        </div>

        <footer
          className={`properties-modal__footer ${isMobile ? "pb-8" : ""}`}
        >
          <button
            type="button"
            className="properties-modal__save w-full flex justify-center py-4"
            onClick={handleSave}
            disabled={!isDirty}
          >
            <Save size={18} />
            <span className="ml-2">
              {isDirty ? "Save changes" : "No changes"}
            </span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PropertiesPanel;
