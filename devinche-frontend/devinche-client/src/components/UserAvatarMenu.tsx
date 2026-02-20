'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ApiUser } from '@/features/auth-feature/api';

function getInitials(user: ApiUser): string {
  const first = (user.firstName || '').trim();
  const last = (user.lastName || '').trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  if (user.email) return user.email.slice(0, 2).toUpperCase();
  return '?';
}

export default function UserAvatarMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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

  if (!isAuthenticated || !user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/80 hover:border-white transition-colors bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4a5568] hover:cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('auth.userMenu')}
      >
        {user.pictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.pictureUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold select-none">
            {getInitials(user)}
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg z-50 overflow-hidden py-1"
          style={{
            backgroundColor: 'var(--editor-panel-bg)',
            borderColor: 'var(--editor-border)',
            boxShadow: '0 8px 24px var(--editor-shadow-lg)',
          }}
          role="menu"
        >
          <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--editor-border)' }}>
            <p className="text-sm font-medium truncate" style={{ color: 'var(--editor-text)' }}>
              {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--editor-text-muted)' }}>
              {user.email}
            </p>
          </div>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--editor-surface-hover)] transition-colors"
            style={{ color: 'var(--editor-text)' }}
            role="menuitem"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            {t('auth.settings')}
          </Link>
          <button
            type="button"
            onClick={() => { setOpen(false); logout(); }}
            className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--editor-surface-hover)] transition-colors"
            style={{ color: 'var(--editor-text)' }}
            role="menuitem"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t('auth.signOut')}
          </button>
        </div>
      )}
    </div>
  );
}
