'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Locale } from '@/contexts/LanguageContext';

/**
 * Supported locales. To add a language later:
 * 1. Add an entry here (value = locale code, label = display name).
 * 2. In LanguageContext: extend Locale type, import the new locale JSON, add to messages, and handle in setLocaleState/load.
 * 3. Add src/locales/{code}.json with the same key structure as en.json.
 */
export const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'uk', label: 'Українська' },
  { value: 'ru', label: 'Русский' },
  { value: 'ko', label: '한국어' },
  { value: 'ur', label: 'اردو' },
  { value: 'ar', label: 'العربية' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
  { value: 'fr', label: 'Français' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'sq', label: 'Shqip' },
];

interface LanguageSwitcherProps {
  className?: string;
  /** For dark header (e.g. home): use light text. */
  variant?: 'default' | 'darkHeader';
}

export default function LanguageSwitcher({ className = '', variant = 'default' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isDark = variant === 'darkHeader';

  const currentLabel = LOCALE_OPTIONS.find((o) => o.value === locale)?.label ?? locale;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick, true);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onDocClick, true);
      document.removeEventListener('keydown', onKey, true);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'var(--editor-bar-border)',
          backgroundColor: open ? (isDark ? 'rgba(255,255,255,0.2)' : 'var(--editor-surface-hover)') : 'transparent',
          color: isDark ? '#fff' : 'var(--editor-text-secondary)',
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
      >
        <Globe size={14} className="flex-shrink-0 opacity-80" />
        <span className="max-w-[100px] truncate">{currentLabel}</span>
        <ChevronDown size={12} className={`flex-shrink-0 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 min-w-[140px] rounded-lg border py-1 z-50 shadow-lg"
          style={{
            backgroundColor: 'var(--editor-panel-bg)',
            borderColor: 'var(--editor-border)',
            boxShadow: '0 8px 16px var(--editor-shadow-lg)',
          }}
        >
          {LOCALE_OPTIONS.map((opt) => (
            <li key={opt.value} role="option" aria-selected={locale === opt.value}>
              <button
                type="button"
                onClick={() => {
                  setLocale(opt.value);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--editor-surface-hover)] transition-colors first:rounded-t-lg last:rounded-b-lg"
                style={{
                  color: locale === opt.value ? 'var(--editor-accent)' : 'var(--editor-text)',
                  backgroundColor: locale === opt.value ? 'var(--editor-surface-hover)' : 'transparent',
                }}
              >
                <span className={locale === opt.value ? 'font-medium' : ''}>{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
