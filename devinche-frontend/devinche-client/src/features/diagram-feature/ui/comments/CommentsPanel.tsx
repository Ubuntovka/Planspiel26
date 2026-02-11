'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send, Check, RotateCcw, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  listComments,
  createComment,
  updateComment,
  deleteComment,
  getDiagramCollaborators,
  type CommentItem,
  type CommentAnchor,
  type CollaboratorUser,
} from '../../api';

function formatDate(d: string) {
  const date = new Date(d);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

function authorDisplay(author?: { email: string; firstName?: string; lastName?: string }) {
  if (!author) return 'Unknown';
  const name = [author.firstName, author.lastName].filter(Boolean).join(' ');
  return name || author.email || 'Unknown';
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
}

interface CommentsPanelProps {
  diagramId: string;
  getToken: () => string | null;
  currentUserId: string;
  onClose: () => void;
  anchorToAttach?: CommentAnchor | null;
  onClearAnchor?: () => void;
  /** When provided, panel uses this list and updates it (for sync with diagram markers). */
  comments?: CommentItem[];
  setComments?: React.Dispatch<React.SetStateAction<CommentItem[]>>;
}

export default function CommentsPanel({
  diagramId,
  getToken,
  currentUserId,
  onClose,
  anchorToAttach,
  onClearAnchor,
  comments: externalComments,
  setComments: externalSetComments,
}: CommentsPanelProps) {
  const { t } = useLanguage();
  const [internalComments, setInternalComments] = useState<CommentItem[]>([]);
  const comments = externalComments ?? internalComments;
  const setComments = externalSetComments ?? setInternalComments;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<CollaboratorUser[]>([]);
  const [newContent, setNewContent] = useState('');
  const [newMentions, setNewMentions] = useState<string[]>([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionStartIndex, setMentionStartIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const loadComments = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const { comments: list } = await listComments(token, diagramId);
      setComments(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [diagramId, getToken]);

  const loadCollaborators = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const { users } = await getDiagramCollaborators(token, diagramId);
      setCollaborators(users);
    } catch {
      setCollaborators([]);
    }
  }, [diagramId, getToken]);

  useEffect(() => {
    loadComments();
    loadCollaborators();
  }, [loadComments, loadCollaborators]);

  const filteredCollaborators = collaborators.filter((u) => {
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email;
    const q = mentionQuery.toLowerCase();
    return name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursor = e.target.selectionStart ?? 0;
    const beforeCursor = value.slice(0, cursor);
    const lastAt = beforeCursor.lastIndexOf('@');
    if (lastAt !== -1) {
      const afterAt = beforeCursor.slice(lastAt + 1);
      if (!/\s/.test(afterAt)) {
        setMentionQuery(afterAt);
        setMentionStartIndex(lastAt);
        setShowMentionSuggestions(true);
        setNewContent(value);
        return;
      }
    }
    setShowMentionSuggestions(false);
    setNewContent(value);
  };

  const insertMention = (user: CollaboratorUser) => {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
    const before = newContent.slice(0, mentionStartIndex);
    const after = newContent.slice(textareaRef.current?.selectionStart ?? newContent.length);
    setNewContent(`${before}@${name} ${after}`);
    setNewMentions((prev) => (prev.includes(user._id) ? prev : [...prev, user._id]));
    setShowMentionSuggestions(false);
    setMentionQuery('');
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSubmit = async () => {
    const content = newContent.trim();
    if (!content) return;
    const token = getToken();
    if (!token) return;
    setSubmitting(true);
    try {
      const { comment } = await createComment(token, diagramId, {
        content,
        anchor: anchorToAttach ?? undefined,
        mentions: newMentions.length ? newMentions : undefined,
      });
      setComments((prev) => [...prev, comment]);
      setNewContent('');
      setNewMentions([]);
      onClearAnchor?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (c: CommentItem) => {
    const token = getToken();
    if (!token) return;
    try {
      const { comment } = await updateComment(token, diagramId, c._id, { resolved: !c.resolved });
      setComments((prev) => prev.map((x) => (x._id === comment._id ? comment : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('comments.failedToUpdate'));
    }
  };

  const handleDelete = async (c: CommentItem) => {
    if (!confirm(t('comments.deleteCommentConfirm'))) return;
    const token = getToken();
    if (!token) return;
    try {
      await deleteComment(token, diagramId, c._id);
      setComments((prev) => prev.filter((x) => x._id !== c._id));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('comments.failedToDelete'));
    }
  };

  return (
    <>
      {/* Backdrop – above toolbar so drawer is clearly on top */}
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 z-[90] transition-opacity duration-200"
        style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
        aria-label={t('comments.closePanel')}
      />
      {/* Drawer – below toolbar with gap so avatar doesn’t overlap; high z so nothing overlaps it */}
      <div
        className="fixed right-0 w-full max-w-[380px] flex flex-col z-[91] custom-scrollbar rounded-l-xl comments-drawer-enter isolate"
        style={{
          top: 92,
          height: 'calc(100vh - 92px)',
          backgroundColor: 'var(--editor-panel-bg)',
          borderLeft: '1px solid var(--editor-panel-border)',
          boxShadow: 'var(--editor-panel-shadow)',
          color: 'var(--editor-text)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between gap-3 px-5 py-4 shrink-0 rounded-tl-xl"
          style={{
            backgroundColor: 'var(--editor-panel-header)',
            borderBottom: '1px solid var(--editor-panel-border)',
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ backgroundColor: 'var(--editor-accent)', color: 'white' }}
            >
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-base tracking-tight" style={{ color: 'var(--editor-text)' }}>
                {t('comments.title')}
              </h2>
              <p className="text-xs" style={{ color: 'var(--editor-text-muted)' }}>
                {t('comments.commentCount', { count: comments.length })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--editor-surface-hover)] transition-colors"
            style={{ color: 'var(--editor-text-secondary)' }}
            aria-label={t('common.close')}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div
            className="mx-4 mt-3 px-3 py-2.5 rounded-xl text-sm border"
            style={{
              backgroundColor: 'var(--editor-error)',
              borderColor: 'var(--editor-error)',
              color: 'white',
              opacity: 0.95,
            }}
          >
            {error}
          </div>
        )}

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12" style={{ color: 'var(--editor-text-muted)' }}>
              <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm">{t('comments.loading')}</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center" style={{ color: 'var(--editor-text-muted)' }}>
              <MessageSquare size={40} className="opacity-40 mb-2" />
              <p className="text-sm">{t('comments.noCommentsYet')}</p>
              <p className="text-xs mt-1">{t('comments.noCommentsHint')}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => {
                const authorName = authorDisplay(c.author);
                return (
                  <li
                    key={c._id}
                    className="rounded-xl p-4 border transition-colors"
                    style={{
                      backgroundColor: 'var(--editor-surface)',
                      borderColor: c.resolved ? 'var(--editor-border-light)' : 'var(--editor-border)',
                      opacity: c.resolved ? 0.9 : 1,
                    }}
                  >
                    <div className="flex gap-3">
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold"
                        style={{ backgroundColor: 'var(--editor-surface-hover)', color: 'var(--editor-text-secondary)' }}
                      >
                        {initials(authorName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-medium text-sm" style={{ color: 'var(--editor-text)' }}>
                            {authorName}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--editor-text-muted)' }}>
                            {formatDate(c.createdAt)}
                          </span>
                        </div>
                        <p
                          className={`text-sm whitespace-pre-wrap break-words mt-1 ${c.resolved ? 'line-through' : ''}`}
                          style={{ color: c.resolved ? 'var(--editor-text-muted)' : 'var(--editor-text-secondary)' }}
                        >
                          {c.content}
                        </p>
                        {c.mentions?.length > 0 && (
                          <p className="text-xs mt-1.5" style={{ color: 'var(--editor-text-muted)' }}>
                            {t('comments.mentionedUsers', { count: c.mentions.length })}
                          </p>
                        )}
                        {c.userId === currentUserId && (
                          <div className="flex gap-1.5 mt-3">
                            <button
                              type="button"
                              onClick={() => handleResolve(c)}
                              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg hover:bg-[var(--editor-surface-hover)] transition-colors"
                              style={{ color: 'var(--editor-accent)' }}
                            >
                              {c.resolved ? <RotateCcw size={12} /> : <Check size={12} />}
                              {c.resolved ? t('comments.reopen') : t('comments.resolve')}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(c)}
                              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg hover:bg-[var(--editor-surface-hover)] transition-colors"
                              style={{ color: 'var(--editor-error)' }}
                            >
                              <Trash2 size={12} />
                              {t('comments.delete')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Composer – own stacking context so toolbar/avatar never overlap button */}
        <div
          className="relative z-10 shrink-0 p-4 rounded-bl-xl border-t"
          style={{ borderColor: 'var(--editor-panel-border)', backgroundColor: 'var(--editor-panel-header)' }}
        >
          {anchorToAttach && (
            <p className="text-xs mb-2 px-1" style={{ color: 'var(--editor-text-muted)' }}>
              {t('comments.attachingTo', { type: anchorToAttach.type === 'point' ? t('comments.canvas') : anchorToAttach.type })}
            </p>
          )}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={newContent}
              onChange={handleTextChange}
              onKeyDown={(e) => {
                if (showMentionSuggestions && (e.key === 'Escape' || e.key === 'Tab')) {
                  setShowMentionSuggestions(false);
                }
              }}
              placeholder={t('comments.addComment')}
              rows={3}
              className="w-full rounded-xl border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{
                borderColor: 'var(--editor-border)',
                backgroundColor: 'var(--editor-bg)',
                color: 'var(--editor-text)',
              }}
            />
            {showMentionSuggestions && filteredCollaborators.length > 0 && (
              <div
                ref={suggestionRef}
                className="absolute left-0 right-0 bottom-full mb-2 max-h-40 overflow-y-auto rounded-xl border py-1 z-10 custom-scrollbar"
                style={{
                  backgroundColor: 'var(--editor-surface)',
                  borderColor: 'var(--editor-border)',
                  boxShadow: 'var(--editor-panel-shadow)',
                }}
              >
                {filteredCollaborators.map((u) => (
                  <button
                    key={u._id}
                    type="button"
                    onClick={() => insertMention(u)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--editor-surface-hover)] transition-colors rounded-lg mx-1"
                    style={{ color: 'var(--editor-text)' }}
                  >
                    {[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email}
                    <span className="ml-2 text-xs" style={{ color: 'var(--editor-text-muted)' }}>
                      {u.email}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!newContent.trim() || submitting}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all shadow-sm"
            style={{ backgroundColor: 'var(--editor-accent)', color: 'white' }}
          >
            <Send size={16} />
            {submitting ? t('common.sending') : t('comments.comment')}
          </button>
        </div>
      </div>
    </>
  );
}
