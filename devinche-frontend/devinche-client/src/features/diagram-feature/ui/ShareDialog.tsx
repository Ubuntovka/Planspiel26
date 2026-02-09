'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, UserPlus, Trash2, Eye, Pencil, Mail } from 'lucide-react';
import type { SharedWithEntry } from '../api';
import { listSharedWith, shareDiagram, unshareDiagram, updateSharedRole, transferOwnership } from '../api';
import { useLanguage } from '@/contexts/LanguageContext';

interface ShareDialogProps {
  diagramId: string;
  getToken: () => string | null;
  onClose: () => void;
}

type Role = 'viewer' | 'editor' | 'owner';

const toolbarBtn =
  'p-2 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
const toolbarBtnHover =
  'hover:bg-[var(--editor-surface-hover)] hover:text-[var(--editor-text)]';
const toolbarStyle = {
  color: 'var(--editor-text-secondary)',
};

export default function ShareDialog({ diagramId, getToken, onClose }: ShareDialogProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('viewer');
  const [sharedWith, setSharedWith] = useState<SharedWithEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadShared = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const { sharedWith: list } = await listSharedWith(token, diagramId);
      setSharedWith(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('shareDialog.failedToLoad'));
    } finally {
      setLoading(false);
    }
  }, [diagramId, getToken]);

  useEffect(() => {
    loadShared();
  }, [loadShared]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token || !email.trim()) return;
    setSharing(true);
    setError(null);
    try {
      const { sharedWith: list } = await shareDiagram(token, diagramId, email.trim(), role);
      setSharedWith(list);
      setEmail('');
    } catch (e) {
      setError(e instanceof Error ? e.message : t('shareDialog.failedToShare'));
    } finally {
      setSharing(false);
    }
  };

  const handleUnshare = async (targetUserId: string) => {
    const token = getToken();
    if (!token) return;
    setError(null);
    try {
      const { sharedWith: list } = await unshareDiagram(token, diagramId, targetUserId);
      setSharedWith(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('shareDialog.failedToRemoveAccess'));
    }
  };

  const handleRoleChange = async (targetUserId: string, nextRole: Role) => {
    const token = getToken();
    if (!token) return;
    setError(null);
    try {
      const { sharedWith: list } = await updateSharedRole(token, diagramId, targetUserId, nextRole);
      setSharedWith(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('shareDialog.failedToUpdateAccess'));
    }
  };

  const handleTransferOwnership = async (targetUserId: string, emailLabel: string) => {
    const ok = window.confirm(t('shareDialog.transferConfirm', { email: emailLabel }));
    if (!ok) return;
    const token = getToken();
    if (!token) return;
    setError(null);
    try {
      await transferOwnership(token, diagramId, targetUserId);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('shareDialog.failedToTransferOwnership'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-labelledby="share-dialog-title"
        className="rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: 'var(--editor-panel-bg)',
          border: '1px solid var(--editor-border)',
          boxShadow: '0 28px 60px var(--editor-shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--editor-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl"
              style={{ backgroundColor: 'var(--editor-accent)', color: 'white' }}
            >
              <UserPlus size={22} strokeWidth={2} />
            </div>
            <div>
              <h2 id="share-dialog-title" className="text-lg font-semibold leading-tight" style={{ color: 'var(--editor-text)' }}>
                {t('shareDialog.title')}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--editor-text-muted)' }}>
                {t('shareDialog.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`${toolbarBtn} ${toolbarBtnHover} rounded-full`}
            style={{ ...toolbarStyle, border: '1px solid var(--editor-border)' }}
            aria-label={t('shareDialog.closeAria')}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <section>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--editor-text)' }}>
              {t('shareDialog.addPeople')}
            </label>
            <form onSubmit={handleShare} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    size={18}
                    style={{ color: 'var(--editor-text-muted)' }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('shareDialog.emailPlaceholder')}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--editor-accent)]"
                    style={{
                      backgroundColor: 'var(--editor-bg)',
                      borderColor: 'var(--editor-border)',
                      color: 'var(--editor-text)',
                    }}
                  />
                </div>
                <div
                  className="flex items-center gap-1 p-1 rounded-lg border"
                  style={{ backgroundColor: 'var(--editor-bg)', borderColor: 'var(--editor-border)' }}
                >
                  <button
                    type="button"
                    onClick={() => setRole('viewer')}
                    className="px-3 py-2 rounded-md text-sm flex items-center gap-1.5"
                    style={{
                      color: role === 'viewer' ? 'white' : 'var(--editor-text-secondary)',
                      backgroundColor: role === 'viewer' ? 'var(--editor-accent)' : 'transparent',
                    }}
                  >
                    <Eye size={14} />
                    {t('shareDialog.canView')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('editor')}
                    className="px-3 py-2 rounded-md text-sm flex items-center gap-1.5"
                    style={{
                      color: role === 'editor' ? 'white' : 'var(--editor-text-secondary)',
                      backgroundColor: role === 'editor' ? 'var(--editor-accent)' : 'transparent',
                    }}
                  >
                    <Pencil size={14} />
                    {t('shareDialog.canEdit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className="px-3 py-2 rounded-md text-sm flex items-center gap-1.5"
                    style={{
                      color: role === 'owner' ? 'white' : 'var(--editor-text-secondary)',
                      backgroundColor: role === 'owner' ? 'var(--editor-accent)' : 'transparent',
                    }}
                  >
                    <UserPlus size={14} />
                    {t('shareDialog.owner')}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: 'var(--editor-text-muted)' }}>
                  {t('shareDialog.theyNeedAccount')}
                </p>
                <button
                  type="submit"
                  disabled={sharing || !email.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                  style={{ backgroundColor: 'var(--editor-accent)', color: 'white' }}
                >
                  <UserPlus size={16} />
                  {sharing ? t('shareDialog.adding') : t('shareDialog.add')}
                </button>
              </div>
            </form>
          </section>

          {error && (
            <div
              className="px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--editor-error)', color: 'white', opacity: 0.95 }}
            >
              {error}
            </div>
          )}

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium" style={{ color: 'var(--editor-text)' }}>
                {t('shareDialog.peopleWithAccess')}
              </h3>
              {!loading && (
                <span className="text-xs" style={{ color: 'var(--editor-text-muted)' }}>
                  {t('shareDialog.total', { count: sharedWith.length })}
                </span>
              )}
            </div>
            {loading ? (
              <div className="py-6 text-center text-sm" style={{ color: 'var(--editor-text-muted)' }}>
                {t('shareDialog.loading')}
              </div>
            ) : sharedWith.length === 0 ? (
              <div
                className="py-8 px-4 rounded-xl text-center"
                style={{
                  backgroundColor: 'var(--editor-surface)',
                  border: '1px dashed var(--editor-border)',
                  color: 'var(--editor-text-muted)',
                }}
              >
                <p className="text-sm">{t('shareDialog.noOneElse')}</p>
                <p className="text-xs mt-1">{t('shareDialog.addPeopleAbove')}</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {sharedWith.map((entry) => (
                  <li
                    key={entry.userId}
                    className="flex items-center gap-3 py-3 px-3 rounded-xl"
                    style={{ backgroundColor: 'var(--editor-surface)' }}
                  >
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 text-sm font-medium"
                      style={{
                        backgroundColor: 'var(--editor-border)',
                        color: 'var(--editor-text)',
                      }}
                    >
                      {(entry.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--editor-text)' }}>
                        {entry.email}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <select
                          value={entry.role}
                          onChange={(e) => handleRoleChange(entry.userId, e.target.value as Role)}
                          className="px-2 py-1 rounded-md border text-xs"
                          style={{
                            backgroundColor: 'var(--editor-bg)',
                            borderColor: 'var(--editor-border)',
                            color: 'var(--editor-text)',
                          }}
                        >
                          <option value="viewer">{t('shareDialog.canView')}</option>
                          <option value="editor">{t('shareDialog.canEdit')}</option>
                          <option value="owner">{t('shareDialog.owner')}</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleTransferOwnership(entry.userId, entry.email)}
                          className="text-xs px-2 py-1 rounded-md border"
                          style={{
                            borderColor: 'var(--editor-border)',
                            color: 'var(--editor-text-secondary)',
                            backgroundColor: 'var(--editor-bg)',
                          }}
                        >
                          {t('shareDialog.transferOwner')}
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnshare(entry.userId)}
                      className={`${toolbarBtn} ${toolbarBtnHover} shrink-0`}
                      style={{ ...toolbarStyle, border: '1px solid var(--editor-border)' }}
                      title={t('shareDialog.removeAccess')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
