"use client";

import { useRef, useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Locale } from "@/contexts/LanguageContext";

export const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "uk", label: "Українська" },
  { value: "ru", label: "Русский" },
  { value: "ko", label: "한국어" },
  { value: "ur", label: "اردو" },
  { value: "ar", label: "العربية" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
  { value: "fr", label: "Français" },
  { value: "tr", label: "Türkçe" },
  { value: "sq", label: "Shqip" },
];

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "darkHeader";
}

export default function LanguageSwitcher({
  className = "",
  variant = "default",
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const isDarkHeader = variant === "darkHeader";

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDocClick, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          isDarkHeader
            ? "inline-flex items-center px-2.5 py-2 rounded-full border transition-colors"
            : `p-1.5 sm:p-2 rounded-lg transition-colors hover:cursor-pointer flex items-center justify-center ${
                open ? "bg-[var(--editor-surface-hover)]" : "hover:bg-[var(--editor-surface-hover)]"
              } text-[var(--editor-text-secondary)]`
        }
        style={
          isDarkHeader
            ? {
                background: "white",
                color: "#1f2937",
                borderColor: "#e5e7eb",
              }
            : undefined
        }
        data-lang-theme-aware={isDarkHeader ? "true" : undefined}
        title="Select Language"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={18} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 min-w-[140px] rounded-lg border py-1 z-50 shadow-lg"
          style={{
            backgroundColor: "var(--editor-panel-bg)",
            borderColor: "var(--editor-border)",
            boxShadow: "0 8px 16px var(--editor-shadow-lg)",
          }}
        >
          {LOCALE_OPTIONS.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={locale === opt.value}
            >
              <button
                type="button"
                onClick={() => {
                  setLocale(opt.value);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--editor-surface-hover)] transition-colors first:rounded-t-lg last:rounded-b-lg"
                style={{
                  color:
                    locale === opt.value
                      ? "var(--editor-accent)"
                      : "var(--editor-text)",
                  backgroundColor:
                    locale === opt.value
                      ? "var(--editor-surface-hover)"
                      : "transparent",
                }}
              >
                <span className={locale === opt.value ? "font-medium" : ""}>
                  {opt.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {isDarkHeader && (
        <style jsx>{`
          :global([data-theme="dark"]) [data-lang-theme-aware="true"] {
            background: var(--editor-surface) !important;
            color: var(--editor-text) !important;
            border-color: var(--editor-border) !important;
          }
          :global([data-theme="dark"]) [data-lang-theme-aware="true"]:hover {
            background: var(--editor-surface-hover) !important;
          }
        `}</style>
      )}
    </div>
  );
}