'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

type Props = {
  className?: string;
};

export default function ThemeToggleButton({ className }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className={`inline-flex items-center px-2.5 py-2 rounded-full border transition-colors ${className || ''}`}
      style={{
        background: 'white',
        color: '#1f2937',
        borderColor: '#e5e7eb',
      }}
      data-theme-aware
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      <style jsx>{`
        :global([data-theme="dark"]) [data-theme-aware] {
          background: var(--editor-surface);
          color: var(--editor-text);
          border-color: var(--editor-border);
        }
        :global([data-theme="dark"]) [data-theme-aware]:hover {
          background: var(--editor-surface-hover);
        }
      `}</style>
    </button>
  );
}
