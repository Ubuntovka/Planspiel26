'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationItem,
} from '../../api';

function formatNotificationTime(d: string) {
  const date = new Date(d);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

interface NotificationBellProps {
  getToken: () => string | null;
  onNavigate?: () => void;
}

export default function NotificationBell({ getToken, onNavigate }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const { notifications: list, unreadCount: count } = await listNotifications(token, {
        limit: 30,
      });
      setNotifications(list);
      setUnreadCount(count);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleMarkRead = useCallback(
    async (n: NotificationItem) => {
      if (n.read) return;
      const token = getToken();
      if (!token) return;
      try {
        await markNotificationRead(token, n._id);
        setNotifications((prev) =>
          prev.map((x) => (x._id === n._id ? { ...x, read: true } : x))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // ignore
      }
    },
    [getToken]
  );

  const handleMarkAllRead = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      await markAllNotificationsRead(token);
      setNotifications((prev) => prev.map((x) => ({ ...x, read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }, [getToken]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded hover:bg-[var(--editor-surface-hover)] transition-colors"
        aria-label="Notifications"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: 'var(--editor-text-secondary)' }}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: 'var(--editor-error)' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-80 max-h-96 overflow-hidden rounded-lg border shadow-lg flex flex-col z-[100] custom-scrollbar"
          style={{
            backgroundColor: 'var(--editor-panel-bg)',
            borderColor: 'var(--editor-border)',
            color: 'var(--editor-text)',
          }}
        >
          <div
            className="flex items-center justify-between px-3 py-2 shrink-0"
            style={{ borderBottom: '1px solid var(--editor-border)' }}
          >
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs px-2 py-1 rounded hover:bg-[var(--editor-surface-hover)]"
                style={{ color: 'var(--editor-accent)' }}
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1 min-h-0">
            {loading ? (
              <div className="p-4 text-sm" style={{ color: 'var(--editor-text-muted)' }}>
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-sm" style={{ color: 'var(--editor-text-muted)' }}>
                No notifications
              </div>
            ) : (
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n._id}
                    className="border-b last:border-b-0"
                    style={{
                      borderColor: 'var(--editor-border)',
                      backgroundColor: n.read ? 'transparent' : 'var(--editor-surface-hover)',
                    }}
                  >
                    <Link
                      href={`/editor/${n.diagramId}`}
                      onClick={() => {
                        handleMarkRead(n);
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="block px-3 py-2 hover:bg-[var(--editor-surface-hover)] transition-colors"
                    >
                      <p className="text-sm">
                        {n.type === 'comment_mention' && (
                          <>
                            <span className="font-medium">Mentioned</span> in comment on{' '}
                            <span className="font-medium">{n.diagramName || 'diagram'}</span>
                          </>
                        )}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'var(--editor-text-muted)' }}
                      >
                        {formatNotificationTime(n.createdAt)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
