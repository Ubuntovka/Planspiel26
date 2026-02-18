"use client";

import { useEffect, useState, useCallback } from "react";
import {
  GitCommitHorizontal,
  RotateCcw,
  X,
  Loader2,
  ChevronDown,
  ChevronRight,
  History,
} from "lucide-react";
import {
  listDiagramVersions,
  getDiagramVersion,
  restoreDiagramVersion,
  type DiagramVersionSummary,
  type DiagramVersionFull,
} from "../api";

interface VersionHistoryPanelProps {
  diagramId: string;
  getToken: () => string | null;
  onClose: () => void;
  /** Called after a successful restore so the canvas reloads */
  onRestore: (version: DiagramVersionFull) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VersionHistoryPanel({
  diagramId,
  getToken,
  onClose,
  onRestore,
}: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<DiagramVersionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const { versions: list } = await listDiagramVersions(token, diagramId);
      setVersions(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history.");
    } finally {
      setLoading(false);
    }
  }, [diagramId, getToken]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRestore = async (versionId: string) => {
    const token = getToken();
    if (!token) return;
    setRestoring(versionId);
    setRestoreError(null);
    try {
      await restoreDiagramVersion(token, diagramId, versionId);
      const { version } = await getDiagramVersion(token, diagramId, versionId);
      onRestore(version);
      setConfirmId(null);
    } catch (err) {
      setRestoreError(err instanceof Error ? err.message : "Failed to restore.");
    } finally {
      setRestoring(null);
    }
  };

  return (
    <div className="version-panel">
      <div className="version-panel__header">
        <div className="version-panel__title-row">
          <History size={16} className="version-panel__icon" />
          <h2 className="version-panel__title">Version history</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="version-panel__close"
          aria-label="Close history"
        >
          <X size={16} />
        </button>
      </div>

      <div className="version-panel__body custom-scrollbar">
        {loading && (
          <div className="version-panel__empty">
            <Loader2 size={20} className="version-panel__spinner" />
            Loading history…
          </div>
        )}

        {!loading && error && (
          <p className="version-panel__error">{error}</p>
        )}

        {!loading && !error && versions.length === 0 && (
          <div className="version-panel__empty">
            <GitCommitHorizontal size={32} style={{ opacity: 0.3 }} />
            <p>No versions saved yet.</p>
            <p className="version-panel__hint">
              Use <strong>File → Save version</strong> to create a snapshot.
            </p>
          </div>
        )}

        {restoreError && (
          <p className="version-panel__error" role="alert">
            {restoreError}
          </p>
        )}

        {!loading && !error && versions.length > 0 && (
          <ul className="version-panel__list">
            {versions.map((v, idx) => {
              const isExpanded = expandedId === v._id;
              const isConfirming = confirmId === v._id;
              const isRestoring = restoring === v._id;

              return (
                <li key={v._id} className="version-panel__item">
                  <div
                    className="version-panel__item-header"
                    onClick={() => setExpandedId(isExpanded ? null : v._id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setExpandedId(isExpanded ? null : v._id)
                    }
                  >
                    <span className="version-panel__chevron">
                      {isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </span>
                    <GitCommitHorizontal size={15} className="version-panel__commit-icon" />
                    <div className="version-panel__item-info">
                      <span className="version-panel__commit-msg">{v.message}</span>
                      <span className="version-panel__meta">
                        {formatDate(v.createdAt)} · {v.nodeCount} nodes · {v.edgeCount} edges
                        {idx === 0 && (
                          <span className="version-panel__latest-badge">latest</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="version-panel__item-body">
                      {v.description && (
                        <p className="version-panel__description">{v.description}</p>
                      )}

                      {isConfirming ? (
                        <div className="version-panel__confirm">
                          <p className="version-panel__confirm-text">
                            Restore to this version? Unsaved changes will be overwritten.
                          </p>
                          <div className="version-panel__confirm-actions">
                            <button
                              type="button"
                              className="version-panel__btn version-panel__btn--danger"
                              onClick={() => handleRestore(v._id)}
                              disabled={isRestoring}
                            >
                              {isRestoring ? (
                                <Loader2 size={13} className="version-panel__spinner" />
                              ) : (
                                <RotateCcw size={13} />
                              )}
                              {isRestoring ? "Restoring…" : "Yes, restore"}
                            </button>
                            <button
                              type="button"
                              className="version-panel__btn version-panel__btn--secondary"
                              onClick={() => setConfirmId(null)}
                              disabled={isRestoring}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="version-panel__btn version-panel__btn--restore"
                          onClick={() => setConfirmId(v._id)}
                        >
                          <RotateCcw size={13} />
                          Restore this version
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {!loading && versions.length > 0 && (
          <p className="version-panel__footer-note">
            Up to 10 versions are kept per diagram. Older ones are removed automatically.
          </p>
        )}
      </div>
    </div>
  );
}
