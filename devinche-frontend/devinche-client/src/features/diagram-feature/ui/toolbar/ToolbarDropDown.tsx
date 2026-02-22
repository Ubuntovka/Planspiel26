// Dropdown implemented using Portal to avoid being clipped in scrolling area
import { ChevronDown } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'; 
import { createPortal } from 'react-dom';

const ToolbarDropDown = ({ 
  label, isOpen, onToggle, children, icon: Icon, badgeCount 
}: { 
  label: React.ReactNode; isOpen: boolean; onToggle: () => void; children: React.ReactNode; icon?: React.ElementType; badgeCount?: number;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const updateCoords = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ 
        top: rect.bottom + 4, 
        left: rect.left 
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
    }
  }, [isOpen, updateCoords]); 

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('resize', updateCoords);
    const scrollable = buttonRef.current?.closest('.overflow-x-auto');
    if (scrollable) scrollable.addEventListener('scroll', updateCoords);

    return () => {
      window.removeEventListener('resize', updateCoords);
      if (scrollable) scrollable.removeEventListener('scroll', updateCoords);
    };
  }, [isOpen, updateCoords]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [isOpen, onToggle]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        className="px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 transition-colors hover:bg-[var(--editor-surface-hover)] text-[var(--editor-text)] hover:cursor-pointer"
        style={{ backgroundColor: isOpen ? 'var(--editor-surface-hover)' : 'transparent' }}
      >
        {Icon && <Icon size={14} />}
        {label}
        <ChevronDown size={12} className="opacity-70" />
      </button>
      
      {badgeCount ? (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-xs font-medium text-white bg-[var(--editor-accent)] pointer-events-none">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      ) : null}

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={dropdownRef}
          className="portal-dropdown-content fixed min-w-[176px] rounded-lg border py-1 z-50 text-sm bg-[var(--editor-panel-bg)] border-[var(--editor-border)] shadow-[0_8px_16px_var(--editor-shadow-lg)]"
          style={{ 
            top: coords?.top ?? 0, 
            left: coords?.left ?? 0,
            visibility: coords ? 'visible' : 'hidden' 
          }}
        >
          {children}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ToolbarDropDown;