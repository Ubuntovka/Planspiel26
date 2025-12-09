import { Save, Undo, Redo, ZoomIn, ZoomOut, Maximize2, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ToolbarProps {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
}

const Toolbar = ({
  onSave,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
}: ToolbarProps) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="absolute top-0 left-0 right-0 h-12 z-20 flex items-center px-4 gap-1" style={{ 
      backgroundColor: 'var(--editor-surface)', 
      borderBottom: '1px solid var(--editor-border)' 
    }}>
      <div className="flex items-center gap-1 pr-3 mr-3" style={{ borderRight: '1px solid var(--editor-border)' }}>
        <button
          onClick={onSave}
          className="p-2 rounded-md transition-colors"
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
          title="Save (Ctrl+S)"
        >
          <Save size={16} />
        </button>
        <button
          onClick={onUndo}
          className="p-2 rounded-md transition-colors"
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
          title="Undo (Ctrl+Z)"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={onRedo}
          className="p-2 rounded-md transition-colors"
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
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 pr-3 mr-3" style={{ borderRight: '1px solid var(--editor-border)' }}>
        <button
          onClick={onZoomIn}
          className="p-2 rounded-md transition-colors"
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
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 rounded-md transition-colors"
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
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={onFitView}
          className="p-2 rounded-md transition-colors"
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
          title="Fit View"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="flex-1" />

      <button
        onClick={toggleTheme}
        className="p-2 rounded-md transition-colors"
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
        title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="text-xs font-mono ml-3" style={{ color: 'var(--editor-text-secondary)' }}>
        Devinche Diagram Editor
      </div>
    </div>
  );
};

export default Toolbar;

