"use client";

import { useState } from "react";
import { GitCommitHorizontal, X, Loader2 } from "lucide-react";

interface CommitDialogProps {
  onClose: () => void;
  onCommit: (message: string, description: string) => Promise<void>;
}

export default function CommitDialog({ onClose, onCommit }: CommitDialogProps) {
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Commit message is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onCommit(trimmed, description.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save version.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="commit-dialog-overlay" onClick={onClose} aria-modal role="dialog">
      <div
        className="commit-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="commit-dialog__header">
          <div className="commit-dialog__title-row">
            <GitCommitHorizontal size={18} className="commit-dialog__icon" />
            <h2 className="commit-dialog__title">Save version</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="commit-dialog__close"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="commit-dialog__body">
          <div className="commit-dialog__field">
            <label htmlFor="commit-message" className="commit-dialog__label">
              Commit message <span className="commit-dialog__required">*</span>
            </label>
            <input
              id="commit-message"
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Add payment service to checkout realm"
              className="commit-dialog__input"
              maxLength={200}
              autoFocus
              disabled={loading}
            />
            <span className="commit-dialog__char-count">{message.length}/200</span>
          </div>

          <div className="commit-dialog__field">
            <label htmlFor="commit-description" className="commit-dialog__label">
              Description <span className="commit-dialog__optional">(optional)</span>
            </label>
            <textarea
              id="commit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what changed and why…"
              className="commit-dialog__textarea"
              maxLength={1000}
              rows={3}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="commit-dialog__error" role="alert">
              {error}
            </p>
          )}

          <div className="commit-dialog__actions">
            <button
              type="button"
              onClick={onClose}
              className="commit-dialog__btn commit-dialog__btn--secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="commit-dialog__btn commit-dialog__btn--primary"
              disabled={loading || !message.trim()}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="commit-dialog__spinner" />
                  Saving…
                </>
              ) : (
                <>
                  <GitCommitHorizontal size={14} />
                  Save version
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
