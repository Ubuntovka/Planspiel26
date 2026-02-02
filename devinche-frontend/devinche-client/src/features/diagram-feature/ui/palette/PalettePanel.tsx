import { useState } from 'react';
import {Pointer, ChevronLeft, ChevronRight, Layers, ArrowUpIcon} from 'lucide-react';

interface PaletteItem {
    id: string;
    type: 'cursor' | 'node' | 'edge' | 'ai-node';
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
        icon: (
            <svg width="18" height="18" viewBox="0 0 87 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1.94713 15.1788C1.94713 8.03705 7.73668 2.24748 14.8785 2.24748H72.351C79.4928 2.24748 85.2823 8.03704 85.2823 15.1788V72.6513C85.2823 79.7931 79.4928 85.5827 72.351 85.5827H14.8785C7.73669 85.5827 1.94713 79.7931 1.94713 72.6513V15.1788Z"
                    stroke="currentColor"
                    strokeWidth="2.87363"
                />
            </svg>
        ),
    },
    {
        id: 'data-provider-node',
        type: 'node',
        label: 'Data Provider',
        nodeType: 'dataProviderNode',
        icon: (
            <svg
                width="18"
                height="18"
                viewBox="0 0 87 88"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M74.5476 74.7956C74.5476 75.9572 73.8791 77.2888 72.1596 78.7125C70.4501 80.1278 67.881 81.4735 64.5665 82.6342C57.9522 84.9504 48.7112 86.4124 38.4288 86.4124C28.1464 86.4124 18.9053 84.9504 12.291 82.6342C8.97658 81.4735 6.40748 80.1278 4.698 78.7125C2.9785 77.2888 2.30999 75.9572 2.30999 74.7956C2.30999 73.634 2.9785 72.3023 4.698 70.8787C6.40748 69.4633 8.97658 68.1177 12.291 66.957C18.9053 64.6407 28.1464 63.1787 38.4288 63.1787C48.7112 63.1787 57.9522 64.6407 64.5665 66.957C67.881 68.1177 70.4501 69.4633 72.1596 70.8787C73.8791 72.3023 74.5476 73.634 74.5476 74.7956Z"
                    stroke="currentColor"
                    strokeWidth="3.17528"
                />
                <mask id="path-2-inside-1_129_16" fill="white">
                    <path d="M0.722351 13.0325H76.1352V75.2215H0.722351V13.0325Z" />
                </mask>
                <path
                    d="M72.9599 13.0325V75.2215H79.3105V13.0325H72.9599ZM3.89763 75.2215V13.0325H-2.45293V75.2215H3.89763Z"
                    fill="currentColor"
                    mask="url(#path-2-inside-1_129_16)"
                />
                <path
                    d="M74.5476 13.8844C74.5476 15.046 73.8791 16.3776 72.1596 17.8013C70.4501 19.2166 67.881 20.5623 64.5665 21.723C57.9522 24.0392 48.7112 25.5013 38.4288 25.5013C28.1464 25.5013 18.9053 24.0392 12.291 21.723C8.97658 20.5623 6.40748 19.2166 4.698 17.8013C2.9785 16.3776 2.30999 15.046 2.30999 13.8844C2.30999 12.7228 2.9785 11.3911 4.698 9.96748C6.40748 8.55212 8.97658 7.2065 12.291 6.0458C18.9053 3.72952 28.1464 2.26751 38.4288 2.26751C48.7112 2.26751 57.9522 3.72952 64.5665 6.0458C67.881 7.2065 70.4501 8.55212 72.1596 9.96748C73.8791 11.3911 74.5476 12.7228 74.5476 13.8844Z"
                    stroke="currentColor"
                    strokeWidth="3.17528"
                />
            </svg>
        ),
    },
    {
    id: 'dataset-node',
    type: 'ai-node',
    label: 'Dataset',
    nodeType: 'datasetNode',
    icon: (
        <svg
        width="18"
        height="18"
        viewBox="0 0 87 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <path
            d="M74.5476 74.7956C74.5476 75.9572 73.8791 77.2888 72.1596 78.7125C70.4501 80.1278 67.881 81.4735 64.5665 82.6342C57.9522 84.9504 48.7112 86.4124 38.4288 86.4124C28.1464 86.4124 18.9053 84.9504 12.291 82.6342C8.97658 81.4735 6.40748 80.1278 4.698 78.7125C2.9785 77.2888 2.30999 75.9572 2.30999 74.7956C2.30999 73.634 2.9785 72.3023 4.698 70.8787C6.40748 69.4633 8.97658 68.1177 12.291 66.957C18.9053 64.6407 28.1464 63.1787 38.4288 63.1787C48.7112 63.1787 57.9522 64.6407 64.5665 66.957C67.881 68.1177 70.4501 69.4633 72.1596 70.8787C73.8791 72.3023 74.5476 73.634 74.5476 74.7956Z"
            stroke="currentColor"
            strokeWidth="3.17528"
        />
        <mask id="path-2-inside-1_129_16" fill="white">
            <path d="M0.722351 13.0325H76.1352V75.2215H0.722351V13.0325Z" />
        </mask>
        <path
            d="M72.9599 13.0325V75.2215H79.3105V13.0325H72.9599ZM3.89763 75.2215V13.0325H-2.45293V75.2215H3.89763Z"
            fill="currentColor"
            mask="url(#path-2-inside-1_129_16)"
        />
        <path
            d="M74.5476 13.8844C74.5476 15.046 73.8791 16.3776 72.1596 17.8013C70.4501 19.2166 67.881 20.5623 64.5665 21.723C57.9522 24.0392 48.7112 25.5013 38.4288 25.5013C28.1464 25.5013 18.9053 24.0392 12.291 21.723C8.97658 20.5623 6.40748 19.2166 4.698 17.8013C2.9785 16.3776 2.30999 15.046 2.30999 13.8844C2.30999 12.7228 2.9785 11.3911 4.698 9.96748C6.40748 8.55212 8.97658 7.2065 12.291 6.0458C18.9053 3.72952 28.1464 2.26751 38.4288 2.26751C48.7112 2.26751 57.9522 3.72952 64.5665 6.0458C67.881 7.2065 70.4501 8.55212 72.1596 9.96748C73.8791 11.3911 74.5476 12.7228 74.5476 13.8844Z"
            stroke="currentColor"
            strokeWidth="3.17528"
        />
        {/* Black Dot in Center */}
        <circle
            cx="38.5"
            cy="44"
            r="12"
            fill="#000000"
        />
        </svg>
    ),
    },
    {
        id: 'identity-provider-node',
        type: 'node',
        label: 'Identity Provider',
        nodeType: 'identityProviderNode',
        icon: (
            <svg
                width="18"
                height="18"
                viewBox="0 0 87 88"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M74.3946 65.3453V11.8404C74.3946 3.30662 64.0769 -0.967114 58.0426 5.06717L4.53775 58.5721C-1.49653 64.6063 2.77722 74.924 11.311 74.924H64.8158C70.106 74.924 74.3946 70.6355 74.3946 65.3453Z"
                    stroke="currentColor"
                    strokeWidth="2.87363"
                />
            </svg>
        ),
    },
    {
        id: 'process-unit-node',
        type: 'node',
        label: 'Process Unit',
        nodeType: 'processUnitNode',
        icon: (
            <svg
                width="18"
                height="18"
                viewBox="0 0 87 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="43.6147" cy="43.7823" r="41.6676"
                        stroke="currentColor"
                        strokeWidth="2.87363"/>
            </svg>

        ),
    },
    {
        id: 'ai-process-unit-node',
        type: 'ai-node',
        label: 'AI Process Unit',
        nodeType: 'aiProcessNode',
        icon: (
            <svg
                width="18"
                height="18"
                viewBox="0 0 87 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="43.6147" cy="43.7823" r="41.6676"
                        stroke="currentColor"
                        strokeWidth="2.87363"/>
                <circle
                    cx="43.6147"
                    cy="43.7823"
                    r="12"
                    fill="#000000"
                    stroke="none"
                />
            </svg>

        ),
    },
    {
        id: 'security-realm-node',
        type: 'node',
        label: 'Security Realm',
        nodeType: 'securityRealmNode',
        icon: (
            <svg
                width="18"
                height="18"
                viewBox="0 0 87 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                <path d="M63.2898 1.50571L89.0742 25.048" stroke="currentColor" strokeWidth="2.9895" />
                <rect x="2.00506" y="1.87939" width="86.6955" height="86.6955" rx="13.4528" stroke="currentColor" strokeWidth="3.9895" />
            </svg>
        ),
    },
    {
        id: 'service-node',
        type: 'node',
        label: 'Service',
        nodeType: 'serviceNode',
        icon: (
            <svg
                width="18"
                height="18"
                viewBox="0 0 86 78"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M31.7544 8.43415C36.7317 -0.186735 49.1748 -0.186749 54.1521 8.43413L82.1492 56.9266C87.1265 65.5475 80.9049 76.3236 70.9504 76.3236H14.9561C5.0016 76.3236 -1.22 65.5475 3.75727 56.9266L31.7544 8.43415Z" stroke="currentColor" strokeWidth="2.87363"/>
            </svg>
        ),
    },
    {
        id: 'step-edge',
        type: 'edge',
        label: 'Step Edge',
        edgeType: 'step',
        icon: <ArrowUpIcon size={18} />,
    },
    {
        id: 'trust-edge',
        type: 'edge',
        label: 'Trust Edge',
        edgeType: 'trust',
        icon: <ArrowUpIcon size={18} />,
    },
    {
        id: 'invocation-edge',
        type: 'edge',
        label: 'Invocation Edge',
        edgeType: 'invocation',
        icon: <ArrowUpIcon size={18} />,
    },
    {
        id: 'legacy-edge',
        type: 'edge',
        label: 'Legacy Edge',
        edgeType: 'legacy',
        icon: <ArrowUpIcon size={18} />,
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

                    <div className="mb-4">
                        <div className="text-xs font-semibold uppercase tracking-wider mb-2 px-2" style={{ color: 'var(--editor-text-secondary)' }}>
                            AI Nodes
                        </div>
                        {paletteItems
                            .filter((item) => item.type === 'ai-node')
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