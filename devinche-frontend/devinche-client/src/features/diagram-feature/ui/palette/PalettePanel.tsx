import { useState } from 'react';
import { Pointer, Box, GitBranch, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface PaletteItem {
    id: string;
    type: 'cursor' | 'node' | 'edge';
    label: string;
    icon: React.ReactNode;
    nodeType?: string;
    edgeType?: string;
}

const paletteItems: PaletteItem[] = [
    {
        id: 'cursor',
        type: 'cursor',
        label: 'Cursor',
        icon: <Pointer size={18} />,
    },
    {
        id: 'application-node',
        type: 'node',
        label: 'Application',
        nodeType: 'applicationNode',
        icon: <Box size={18} />,
    },
    {
        id: 'data-provider-node',
        type: 'node',
        label: 'Data Provider',
        nodeType: 'dataProviderNode',
        icon: <Box size={18} />,
    },
    {
        id: 'identity-provider-node',
        type: 'node',
        label: 'Identity Provider',
        nodeType: 'identityProviderNode',
        icon: <Box size={18} />,
    },
    {
        id: 'process-unit-node',
        type: 'node',
        label: 'Process Unit',
        nodeType: 'processUnitNode',
        icon: <Box size={18} />,
    },
    {
        id: 'security-realm-node',
        type: 'node',
        label: 'Security Realm',
        nodeType: 'securityRealmNode',
        icon: <Box size={18} />,
    },
    {
        id: 'service-node',
        type: 'node',
        label: 'Service',
        nodeType: 'serviceNode',
        icon: <Box size={18} />,
    },
    {
        id: 'step-edge',
        type: 'edge',
        label: 'Step Edge',
        edgeType: 'step',
        icon: <GitBranch size={18} />,
    },
    {
        id: 'trust-edge',
        type: 'edge',
        label: 'Trust Edge',
        edgeType: 'trust',
        icon: <GitBranch size={18} />,
    },
    {
        id: 'invocation-edge',
        type: 'edge',
        label: 'Invocation Edge',
        edgeType: 'invocation',
        icon: <GitBranch size={18} />,
    },
    {
        id: 'legacy-edge',
        type: 'edge',
        label: 'Legacy Edge',
        edgeType: 'legacy',
        icon: <GitBranch size={18} />,
    },
];

interface PalettePanelProps {
    onDragStart?: (event: React.DragEvent, item: PaletteItem) => void;
    selectedEdgeType?: string;
    onEdgeTypeSelect?: (edgeType: string) => void;
}

const PalettePanel = ({ onDragStart, selectedEdgeType, onEdgeTypeSelect }: PalettePanelProps) => {
    const [collapsed, setCollapsed] = useState(false);

    const handleDragStart = (event: React.DragEvent, item: PaletteItem) => {
        event.dataTransfer.effectAllowed = 'move';
        const { id, type, label, nodeType } = item;
        const payload = { id, type, label, nodeType };
        event.dataTransfer.setData('application/reactflow', JSON.stringify(payload));
        onDragStart?.(event, item);
    };

    const handleEdgeTypeClick = (edgeType: string) => {
        onEdgeTypeSelect?.(edgeType);
    };

    return (
        <div
            className={`absolute top-16 left-4 backdrop-blur-sm rounded-lg shadow-2xl z-10 overflow-hidden transition-all duration-300 ease-in-out ${
                collapsed ? 'w-14' : 'w-64'
            }`}
            style={{ 
                backgroundColor: 'var(--editor-panel-bg)',
                border: '1px solid var(--editor-border)',
                boxShadow: '0 8px 16px var(--editor-shadow-lg)'
            }}
            onMouseEnter={(e) => {
                if (collapsed) {
                    e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
                }
            }}
            onMouseLeave={(e) => {
                if (collapsed) {
                    e.currentTarget.style.backgroundColor = 'var(--editor-panel-bg)';
                }
            }}
        >
            <div
                className={`flex items-center cursor-pointer transition-colors ${
                    collapsed ? 'justify-center py-3' : 'justify-between px-4 py-3'
                }`}
                style={{
                    borderBottom: collapsed ? 'none' : '1px solid var(--editor-border)',
                }}
                onMouseEnter={(e) => {
                    if (!collapsed) {
                        e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setCollapsed(!collapsed)}
                title={collapsed ? 'Expand Components Panel' : 'Collapse Components Panel'}
            >
                {collapsed ? (
                    <div className="flex flex-col items-center gap-1.5 py-1">
                        <Layers size={18} style={{ color: 'var(--editor-text)' }} />
                        <ChevronRight size={12} style={{ color: 'var(--editor-text-secondary)' }} />
                    </div>
                ) : (
                    <>
                        <h3 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--editor-text)' }}>
                            Components
                        </h3>
                        <button
                            className="p-1.5 rounded-md transition-colors"
                            style={{ 
                                color: 'var(--editor-text-secondary)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--editor-border)';
                                e.currentTarget.style.color = 'var(--editor-text)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = 'var(--editor-text-secondary)';
                            }}
                            aria-label="Collapse panel"
                            onClick={(e) => {
                                e.stopPropagation();
                                setCollapsed(true);
                            }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                    </>
                )}
            </div>

            {!collapsed && (
                <div className="p-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                    <div className="mb-4">
                        <div className="text-xs font-semibold uppercase tracking-wider mb-2 px-2" style={{ color: 'var(--editor-text-secondary)' }}>
                            Tools
                        </div>
                        {paletteItems
                            .filter((item) => item.type === 'cursor')
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className="px-3 py-2 mb-1 rounded-md cursor-pointer flex items-center gap-3 transition-all duration-150 border border-transparent"
                                    style={{
                                        color: 'var(--editor-text-secondary)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
                                        e.currentTarget.style.color = 'var(--editor-text)';
                                        e.currentTarget.style.borderColor = 'var(--editor-border)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = 'var(--editor-text-secondary)';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                >
                                    <span className="transition-colors" style={{ color: 'var(--editor-text-muted)' }}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                            ))}
                    </div>

                    <div className="mb-4">
                        <div className="text-xs font-semibold uppercase tracking-wider mb-2 px-2" style={{ color: 'var(--editor-text-secondary)' }}>
                            Nodes
                        </div>
                        {paletteItems
                            .filter((item) => item.type === 'node')
                            .map((item) => (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item)}
                                    className="px-3 py-2 mb-1 rounded-md cursor-grab active:cursor-grabbing flex items-center gap-3 transition-all duration-150 border border-transparent"
                                    style={{
                                        color: 'var(--editor-text-secondary)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
                                        e.currentTarget.style.color = 'var(--editor-text)';
                                        e.currentTarget.style.borderColor = 'var(--editor-border)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = 'var(--editor-text-secondary)';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                    onDragEnd={(e) => {
                                        e.currentTarget.style.cursor = 'grab';
                                    }}
                                >
                                    <span className="transition-colors" style={{ color: 'var(--editor-text-muted)' }}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                            ))}
                    </div>

                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider mb-2 px-2" style={{ color: 'var(--editor-text-secondary)' }}>
                            Edges
                        </div>
                        {paletteItems
                            .filter((item) => item.type === 'edge')
                            .map((item) => {
                                const isSelected = selectedEdgeType === item.edgeType;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => item.edgeType && handleEdgeTypeClick(item.edgeType)}
                                        className="px-3 py-2 mb-1 rounded-md cursor-pointer flex items-center gap-3 transition-all duration-150 border"
                                        style={{
                                            color: isSelected ? 'var(--editor-text)' : 'var(--editor-text-secondary)',
                                            backgroundColor: isSelected ? 'var(--editor-surface-hover)' : 'transparent',
                                            borderColor: isSelected ? 'var(--editor-accent)' : 'transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
                                                e.currentTarget.style.color = 'var(--editor-text)';
                                                e.currentTarget.style.borderColor = 'var(--editor-border)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = 'var(--editor-text-secondary)';
                                                e.currentTarget.style.borderColor = 'transparent';
                                            }
                                        }}
                                        title={`Select ${item.label} as default edge type`}
                                    >
                                        <span className="transition-colors" style={{ color: isSelected ? 'var(--editor-accent)' : 'var(--editor-text-muted)' }}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-medium">{item.label}</span>
                                        {isSelected && (
                                            <span className="ml-auto text-xs" style={{ color: 'var(--editor-accent)' }}>
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PalettePanel;