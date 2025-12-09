import { exportDiagramToPng } from './exportToPng';
import { Download, Upload, FileJson, Image, FileCode } from 'lucide-react';

interface ExportsPropsType {
    exportToJson: () => string | null;
    exportToRdf: () => string;
    importFromJson: (json: string) => void;
    flowWrapperRef: React.RefObject<HTMLDivElement>
}

const Exports = ({ exportToJson, flowWrapperRef, exportToRdf, importFromJson }: ExportsPropsType) => {

    const handleDownloadJson = () => {
        try {
            const json = exportToJson();
            if (!json) return;

            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "diagram.json";
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Problem exporting diagram JSON: ", e)
        }
        
    };

    const handleDownloadPng = async () => {
        if (!flowWrapperRef.current) return;
        try {
        await exportDiagramToPng(flowWrapperRef.current, 'diagram.png');
        } catch (e) {
        console.error('Problem exporting diagram PNG: ', e);
        }
    };

    const handleDownloadRdf = () => {
        try {
        const ttl = exportToRdf();
        const blob = new Blob([ttl], { type: 'text/turtle;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.ttl';
        a.click();
        URL.revokeObjectURL(url);
        } catch (e) {
        console.error('Problem exporting diagram RDF: ', e);
        }
    };

    const handleImportJson: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
        const text = await file.text();
        importFromJson(text);
        } catch (err) {
        console.error('Problem importing diagram JSON: ', err);
        } finally {
        e.target.value = ''; // reset input
        }
    };

    return (
        <div 
            className="absolute top-16 right-4 z-10 backdrop-blur-sm rounded-lg shadow-2xl p-3 flex flex-col gap-2 min-w-[200px]"
            style={{ 
                backgroundColor: 'var(--editor-panel-bg)',
                border: '1px solid var(--editor-border)',
                boxShadow: '0 8px 16px var(--editor-shadow-lg)'
            }}
        >
            <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider mb-1" style={{ 
                color: 'var(--editor-text-secondary)',
                borderBottom: '1px solid var(--editor-border)'
            }}>
                Export / Import
            </div>
            
            <button 
                onClick={handleDownloadJson}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 border border-transparent"
                style={{ color: 'var(--editor-text)' }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
                    e.currentTarget.style.color = 'var(--editor-accent)';
                    e.currentTarget.style.borderColor = 'var(--editor-accent)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--editor-text)';
                    e.currentTarget.style.borderColor = 'transparent';
                }}
            >
                <FileJson size={16} style={{ color: 'var(--editor-text-muted)' }} />
                <span>Export JSON</span>
            </button>
            
            <button 
                onClick={handleDownloadPng}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 border border-transparent"
                style={{ color: 'var(--editor-text)' }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
                    e.currentTarget.style.color = 'var(--editor-success)';
                    e.currentTarget.style.borderColor = 'var(--editor-success)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--editor-text)';
                    e.currentTarget.style.borderColor = 'transparent';
                }}
            >
                <Image size={16} style={{ color: 'var(--editor-text-muted)' }} />
                <span>Export PNG</span>
            </button>
            
            <button 
                onClick={handleDownloadRdf}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 border border-transparent"
                style={{ color: 'var(--editor-text)' }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
                    e.currentTarget.style.color = 'var(--editor-info)';
                    e.currentTarget.style.borderColor = 'var(--editor-info)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--editor-text)';
                    e.currentTarget.style.borderColor = 'transparent';
                }}
            >
                <FileCode size={16} style={{ color: 'var(--editor-text-muted)' }} />
                <span>Export RDF</span>
            </button>

            <div className="pt-2 mt-1" style={{ borderTop: '1px solid var(--editor-border)' }}>
                <label 
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 border border-transparent cursor-pointer"
                    style={{ color: 'var(--editor-text)' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--editor-surface-hover)';
                        e.currentTarget.style.color = 'var(--editor-warning)';
                        e.currentTarget.style.borderColor = 'var(--editor-warning)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--editor-text)';
                        e.currentTarget.style.borderColor = 'transparent';
                    }}
                >
                    <Upload size={16} style={{ color: 'var(--editor-text-muted)' }} />
                    <span className="flex-1">Import JSON</span>
                    <input
                        type="file"
                        accept="application/json"
                        onChange={handleImportJson}
                        className="hidden"
                    />
                </label>
            </div>
        </div>
    )
}

export default Exports;

