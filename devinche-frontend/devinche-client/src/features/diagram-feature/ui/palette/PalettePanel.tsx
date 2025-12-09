import { useState } from 'react';
import { Pointer, Box, GitBranch } from 'lucide-react';

interface PaletteItem {
    id: string;
    type: 'cursor' | 'node' | 'edge';
    label: string;
    icon: React.ReactNode;
    nodeType?: string;
}

const paletteItems: PaletteItem[] = [
    {
        id: 'cursor',
        type: 'cursor',
        label: 'Cursor',
        icon: <Pointer size={20} />,
    },
    {
        id: 'application-node',
        type: 'node',
        label: 'Application',
        nodeType: 'applicationNode',
        icon: <Box size={20} />,
    },
    {
        id: 'data-provider-node',
        type: 'node',
        label: 'Data Provider',
        nodeType: 'dataProviderNode',
        icon: <Box size={20} />,
    },
    {
        id: 'identity-provider-node',
        type: 'node',
        label: 'Identity Provider',
        nodeType: 'identityProviderNode',
        icon: <Box size={20} />,
    },
    {
        id: 'process-unit-node',
        type: 'node',
        label: 'Process Unit',
        nodeType: 'processUnitNode',
        icon: <Box size={20} />,
    },
    {
        id: 'security-realm-node',
        type: 'node',
        label: 'Security Realm',
        nodeType: 'securityRealmNode',
        icon: <Box size={20} />,
    },
    {
        id: 'service-node',
        type: 'node',
        label: 'Service',
        nodeType: 'serviceNode',
        icon: <Box size={20} />,
    },
    {
        id: 'step-edge',
        type: 'edge',
        label: 'Step Edge',
        icon: <GitBranch size={20} />,
    },
];

interface PalettePanelProps {
    onDragStart?: (event: React.DragEvent, item: PaletteItem) => void;
}

const PalettePanel = ({ onDragStart }: PalettePanelProps) => {
    const [collapsed, setCollapsed] = useState(false);

    const handleDragStart = (event: React.DragEvent, item: PaletteItem) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('application/reactflow', JSON.stringify(item));
        onDragStart?.(event, item);
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                width: collapsed ? '48px' : '240px',
                transition: 'width 0.2s ease',
                zIndex: 10,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    padding: '12px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                }}
                onClick={() => setCollapsed(!collapsed)}
            >
                {!collapsed && (
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>
            Components
          </span>
                )}
                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#6b7280',
                    }}
                >
                    {collapsed ? '→' : '←'}
                </button>
            </div>

            {!collapsed && (
                <div style={{ padding: '8px', maxHeight: '600px', overflowY: 'auto' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <div
                            style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#6b7280',
                                marginBottom: '8px',
                                paddingLeft: '4px',
                            }}
                        >
                            TOOLS
                        </div>
                        {paletteItems
                            .filter((item) => item.type === 'cursor')
                            .map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        padding: '8px 12px',
                                        marginBottom: '4px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'background 0.15s ease',
                                        background: '#f9fafb',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#f3f4f6';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#f9fafb';
                                    }}
                                >
                                    <span style={{ color: '#6b7280', display: 'flex' }}>{item.icon}</span>
                                    <span style={{ fontSize: '13px', color: '#374151' }}>{item.label}</span>
                                </div>
                            ))}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <div
                            style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#6b7280',
                                marginBottom: '8px',
                                paddingLeft: '4px',
                            }}
                        >
                            NODES
                        </div>
                        {paletteItems
                            .filter((item) => item.type === 'node')
                            .map((item) => (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item)}
                                    style={{
                                        padding: '8px 12px',
                                        marginBottom: '4px',
                                        borderRadius: '6px',
                                        cursor: 'grab',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'background 0.15s ease',
                                        background: '#f9fafb',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#f3f4f6';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#f9fafb';
                                    }}
                                    onDragEnd={(e) => {
                                        e.currentTarget.style.cursor = 'grab';
                                    }}
                                >
                                    <span style={{ color: '#6b7280', display: 'flex' }}>{item.icon}</span>
                                    <span style={{ fontSize: '13px', color: '#374151' }}>{item.label}</span>
                                </div>
                            ))}
                    </div>

                    <div>
                        <div
                            style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#6b7280',
                                marginBottom: '8px',
                                paddingLeft: '4px',
                            }}
                        >
                            EDGES
                        </div>
                        {paletteItems
                            .filter((item) => item.type === 'edge')
                            .map((item) => (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item)}
                                    style={{
                                        padding: '8px 12px',
                                        marginBottom: '4px',
                                        borderRadius: '6px',
                                        cursor: 'grab',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'background 0.15s ease',
                                        background: '#f9fafb',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#f3f4f6';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#f9fafb';
                                    }}
                                >
                                    <span style={{ color: '#6b7280', display: 'flex' }}>{item.icon}</span>
                                    <span style={{ fontSize: '13px', color: '#374151' }}>{item.label}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PalettePanel;