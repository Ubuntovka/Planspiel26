'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import en from '@/locales/en.json';
import de from '@/locales/de.json';
import uk from '@/locales/uk.json';
import ru from '@/locales/ru.json';
import ko from '@/locales/ko.json';
import ur from '@/locales/ur.json';
import ar from '@/locales/ar.json';
import ja from '@/locales/ja.json';
import zh from '@/locales/zh.json';
import fr from '@/locales/fr.json';
import tr from '@/locales/tr.json';
import sq from '@/locales/sq.json';

const LOCALE_STORAGE_KEY = 'devinche-locale';

export type Locale = 'en' | 'de' | 'uk' | 'ru' | 'ko' | 'ur' | 'ar' | 'ja' | 'zh' | 'fr' | 'tr' | 'sq';

const VALID_LOCALES: Locale[] = ['en', 'de', 'uk', 'ru', 'ko', 'ur', 'ar', 'ja', 'zh', 'fr', 'tr', 'sq'];

const messages: Record<Locale, Record<string, unknown>> = { en, de, uk, ru, ko, ur, ar, ja, zh, fr, tr, sq };

function getNested(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    str
  );
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (stored && VALID_LOCALES.includes(stored)) setLocaleState(stored);
    else if (typeof navigator !== 'undefined') {
      const lang = navigator.language?.toLowerCase().slice(0, 2);
      if (lang === 'de') setLocaleState('de');
      else if (lang === 'uk') setLocaleState('uk');
      else if (lang === 'ru') setLocaleState('ru');
      else if (lang === 'ko') setLocaleState('ko');
      else if (lang === 'ur') setLocaleState('ur');
      else if (lang === 'ar') setLocaleState('ar');
      else if (lang === 'ja') setLocaleState('ja');
      else if (lang === 'zh') setLocaleState('zh');
      else if (lang === 'fr') setLocaleState('fr');
      else if (lang === 'tr') setLocaleState('tr');
      else if (lang === 'sq') setLocaleState('sq');
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = (mounted ? messages[locale] : messages.en) as Record<string, unknown>;
      const fallbackDict = messages.en as Record<string, unknown>;
      const count = params?.count;
      const lookupKey = count !== undefined && count !== 1 ? key + '_other' : key;
      let value = getNested(dict, lookupKey);
      if (value == null) value = getNested(fallbackDict, lookupKey);
      if (value == null) value = getNested(dict, key) ?? getNested(fallbackDict, key);
      if (value == null) return key;
      const str = typeof value === 'string' ? value : String(value);
      return interpolate(str, params);
    },
    [locale, mounted]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
