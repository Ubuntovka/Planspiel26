import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calculator, ChevronUp, ChevronDown } from 'lucide-react';

interface CostItem {
  id: string;
  name: string;
  cost: number;
}

interface CostBreakdownProps {
  total: number;
  nodesWithCost: CostItem[];
  t: (key: string) => string;
}

const formatCompactNumber = (number: number) => {
  if (number < 1000) return number.toLocaleString(); 
  
  const formatter = (value: number, divisor: number, unit: string) => {
    const formatted = value / divisor;
    return formatted.toFixed(1).replace(/\.0$/, '') + unit;
  };

  if (number >= 1_000_000_000) return formatter(number, 1_000_000_000, 'bil');
  if (number >= 1_000_000) return formatter(number, 1_000_000, 'mil');
  if (number >= 1_000) return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; 

  return number.toLocaleString();
};

export const CostBreakdown = ({ total, nodesWithCost, t }: CostBreakdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);

  const updateCoords = () => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right + window.scrollX,
      });
    }
  };

  useLayoutEffect(() => {
    updateCoords();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('resize', updateCoords);
    window.addEventListener('scroll', updateCoords, true);
    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords, true);
    };
  }, [isOpen]);

  return (
    <div className="flex items-center">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 transition-colors text-[var(--editor-text)] hover:bg-[var(--editor-surface-hover)]"
        style={{ backgroundColor: isOpen ? 'var(--editor-surface-hover)' : 'transparent' }}
        title={t('toolbar.costBreakdown')}
      >
        <Calculator size={14} />
        {formatCompactNumber(total)}€
        {isOpen ? <ChevronUp size={12} className="opacity-70" /> : <ChevronDown size={12} className="opacity-70" />}
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="fixed z-50 w-64 rounded-lg border py-3 px-3 bg-[var(--editor-panel-bg)] border-[var(--editor-border)] shadow-[0_8px_16px_var(--editor-shadow-lg)]"
            style={{
              top: coords?.top ?? 0,
              right: coords?.right ?? 0,
              visibility: coords ? 'visible' : 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-[10px] font-bold uppercase border-b pb-1 mb-2 text-[var(--editor-text-secondary)] border-[var(--editor-border)]">
              {t('toolbar.costBreakdown')}
            </h4>
            <div className="max-h-48 overflow-y-auto custom-scrollbar">
              {nodesWithCost.length > 0 ? (
                <ul className="space-y-1.5">
                  {nodesWithCost.map((item) => (
                    <li key={item.id} className="flex justify-between items-center text-[11px]">
                      <span className="text-[var(--editor-text-secondary)] truncate pr-2">{item.name}</span>
                      <span className="font-mono font-semibold text-[var(--editor-text)]">
                        {formatCompactNumber(item.cost)}€
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[11px] text-center py-2 italic text-[var(--editor-text-secondary)]">
                  No costs assigned
                </div>
              )}
            </div>
            {total >= 1000 && (
              <div className="mt-2 pt-2 border-t border-[var(--editor-border)] text-[10px] text-right text-[var(--editor-text-secondary)]">
                Total: {total.toLocaleString()}€
              </div>
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};