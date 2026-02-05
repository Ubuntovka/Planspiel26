'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
      setError(e instanceof Error ? e.message : 'Failed to update');
    }
  };

  const handleDelete = async (c: CommentItem) => {
    if (!confirm('Delete this comment?')) return;
    const token = getToken();
    if (!token) return;
    try {
      await deleteComment(token, diagramId, c._id);
      setComments((prev) => prev.filter((x) => x._id !== c._id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  return (
    <div
      className="fixed top-0 right-0 h-full w-full max-w-md flex flex-col z-50 shadow-lg custom-scrollbar"
      style={{
        backgroundColor: 'var(--editor-panel-bg)',
        borderLeft: '1px solid var(--editor-border)',
        color: 'var(--editor-text)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--editor-border)' }}
      >
        <h2 className="font-semibold text-lg">Comments</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded hover:bg-[var(--editor-surface-hover)] transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      {error && (
        <div
          className="mx-4 mt-2 px-3 py-2 rounded text-sm"
          style={{ backgroundColor: 'var(--editor-error)', color: 'white' }}
        >
          {error}
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loading ? (
          <p style={{ color: 'var(--editor-text-muted)' }}>Loading comments…</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li
                key={c._id}
                className="rounded-lg p-3 border"
                style={{
                  backgroundColor: 'var(--editor-surface)',
                  borderColor: c.resolved ? 'var(--editor-border-light)' : 'var(--editor-border)',
                  opacity: c.resolved ? 0.85 : 1,
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-sm">{authorDisplay(c.author)}</span>
                  <span className="text-xs" style={{ color: 'var(--editor-text-muted)' }}>
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap break-words">{c.content}</p>
                {c.mentions?.length > 0 && (
                  <p className="text-xs mt-1" style={{ color: 'var(--editor-text-muted)' }}>
                    Mentioned {c.mentions.length} user{c.mentions.length !== 1 ? 's' : ''}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  {c.userId === currentUserId && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleResolve(c)}
                        className="text-xs px-2 py-1 rounded hover:bg-[var(--editor-surface-hover)]"
                        style={{ color: 'var(--editor-accent)' }}
                      >
                        {c.resolved ? 'Reopen' : 'Resolve'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="text-xs px-2 py-1 rounded hover:bg-[var(--editor-surface-hover)]"
                        style={{ color: 'var(--editor-error)' }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        className="shrink-0 p-4 border-t"
        style={{ borderColor: 'var(--editor-border)' }}
      >
        {anchorToAttach && (
          <p className="text-xs mb-2" style={{ color: 'var(--editor-text-muted)' }}>
            Attaching to {anchorToAttach.type === 'point' ? 'canvas' : anchorToAttach.type}
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
            placeholder="Add a comment… Use @ to mention others"
            rows={3}
            className="w-full rounded border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--editor-border)',
              backgroundColor: 'var(--editor-bg)',
              color: 'var(--editor-text)',
            }}
          />
          {showMentionSuggestions && filteredCollaborators.length > 0 && (
            <div
              ref={suggestionRef}
              className="absolute left-0 right-0 bottom-full mb-1 max-h-40 overflow-y-auto rounded border shadow-lg py-1 z-10 custom-scrollbar"
              style={{
                backgroundColor: 'var(--editor-surface)',
                borderColor: 'var(--editor-border)',
              }}
            >
              {filteredCollaborators.map((u) => (
                <button
                  key={u._id}
                  type="button"
                  onClick={() => insertMention(u)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--editor-surface-hover)]"
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
          className="mt-2 px-4 py-2 rounded text-sm font-medium disabled:opacity-50 hover:enabled:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--editor-accent)', color: 'white' }}
        >
          {submitting ? 'Sending…' : 'Comment'}
        </button>
      </div>
    </div>
  );
}
