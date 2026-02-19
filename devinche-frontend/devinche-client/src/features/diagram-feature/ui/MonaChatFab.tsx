"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Loader2, Download } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { explainDiagram as apiExplainDiagram, type ExplainDiagramResponse } from "../api";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  /** True when this is an explain-diagram response (show Download PDF chip). */
  isExplainResponse?: boolean;
}

const PLACEHOLDER_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi, I'm Mona Lisa — your AI assistant. Describe the WAM diagram you want (e.g. \"Two security realms that trust each other; one has an app that invokes a service\") and I'll generate it on the canvas. You can also type \"explain the diagram\" to analyze the current canvas with validation and a cost breakdown.",
    timestamp: new Date(),
  },
];

/** Remove encoding artifacts that appear after # in API explanation (e.g. Ø<ß¯, Ø=Üæ, Ø=Ý). */
function sanitizeExplainHeadings(text: string): string {
  return text
    .replace(/#\s*Ø<ß¯\s*/g, "# ")
    .replace(/#\s*Ø=Üæ\s*/g, "# ")
    .replace(/#\s*Ø=Ý\s*/g, "# ")
    .replace(/#\s*[^\x20-\x7E]+(?=\s*[A-Za-z])/g, "# "); // strip any non-ASCII run before title
}

/** Ensure a newline after each heading line so markdown parses them as block headings. */
function ensureHeadingNewlines(content: string): string {
  return content.replace(/^(#+\s+.+)\n(?!\n)/gm, "$1\n\n");
}

/** Convert # heading lines to **bold** so the hash is not shown and the line is bold in chat/PDF. */
function headingLinesToBold(content: string): string {
  return content.replace(/^\s*#+\s*(.+)$/gm, "**$1**");
}

/** Turn standalone title-like lines (no #, short, no period) into ### headings so they render bold. */
function ensureTitleLinesAreHeadings(content: string): string {
  return content.replace(/^(?!#)([A-Z][^\n:.]{2,50})\n\n/gm, "### $1\n\n");
}

/** Format the full explain API response as a single chat message (explanation + validation + summary). */
function formatExplainResponseForChat(resp: ExplainDiagramResponse): string {
  const parts: string[] = [];
  parts.push(sanitizeExplainHeadings(resp.explanation.trim()));
  parts.push("\n\n---\n\n**Validation**\n\n");
  parts.push(
    resp.validation.valid
      ? "✅ Diagram is valid (WAM rules satisfied)."
      : `❌ ${resp.validation.errors.length} issue(s):\n${resp.validation.errors.map((e) => `- ${e}`).join("\n")}`
  );
  parts.push("\n\n**Summary**\n\n");
  parts.push(`- Nodes: ${resp.summary.nodeCount} • Edges: ${resp.summary.edgeCount} • Security realms: ${resp.summary.realmCount}`);
  return parts.join("");
}

export interface MonaChatFabProps {
  /** Generate diagram from prompt. Resolves with diagram JSON string and optional validation errors. */
  onGenerateDiagram: (prompt: string) => Promise<{ diagramJson: string; validationErrors?: string[] }>;
  /** Apply diagram by loading this JSON string into the editor. */
  onApplyDiagram: (diagramJson: string) => void;
  /** Returns the current diagram object from canvas, or null if unavailable. */
  getCurrentDiagram: () => { nodes: any[]; edges: any[]; viewport?: { x: number; y: number; zoom: number } } | null;
  /** Returns the current diagram as PNG data URL for embedding in PDF, or null. */
  getDiagramImage?: () => Promise<string | null>;
}

export default function MonaChatFab({
  onGenerateDiagram,
  onApplyDiagram,
  getCurrentDiagram,
  getDiagramImage,
}: MonaChatFabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(PLACEHOLDER_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showExplainChips, setShowExplainChips] = useState(false);
  const [downloadingPdfForId, setDownloadingPdfForId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages]);

  /** Export a single explain response to PDF (diagram image + explain content). Well-formatted document style with bold headings and clear structure. */
  const downloadExplainAsPdf = async (messageId: string, content: string) => {
    if (downloadingPdfForId) return;
    setDownloadingPdfForId(messageId);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 20;
      const bulletIndent = 4;
      const maxW = pageW - margin * 2;
      const maxWBullet = maxW - bulletIndent;
      const lineHeight = 5.5;
      const lineHeightTight = 4.8;
      const bottomMargin = 22;
      let y = margin;

      const pushNewPage = () => {
        doc.addPage();
        y = margin;
      };

      const drawText = (text: string, opts: { bold?: boolean; size?: number; indent?: number; isBullet?: boolean } = {}) => {
        doc.setFont("helvetica", opts.bold ? "bold" : "normal");
        doc.setFontSize(opts.size ?? 10);
        const w = opts.indent ? maxWBullet : maxW;
        const lines = doc.splitTextToSize(text, w);
        const left = margin + (opts.indent ?? 0);
        const bulletLeft = margin;
        for (let i = 0; i < lines.length; i++) {
          if (y > pageH - bottomMargin) pushNewPage();
          if (opts.isBullet && i === 0) {
            doc.text("\u2022", bulletLeft, y);
            doc.text(lines[i], left, y);
          } else if (opts.isBullet) {
            doc.text(lines[i], left, y);
          } else {
            doc.text(lines[i], margin, y);
          }
          y += opts.size && opts.size > 10 ? lineHeight : lineHeightTight;
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
      };

      // ---- Title ----
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Diagram Explanation", margin, y);
      y += lineHeight * 1.8;

      // ---- Diagram image ----
      const imageDataUrl = getDiagramImage ? await getDiagramImage() : null;
      if (imageDataUrl) {
        const maxImgH = 120;
        try {
          const img = document.createElement("img");
          img.src = imageDataUrl;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Image load failed"));
          });
          const scale = Math.min(maxW / img.naturalWidth, maxImgH / img.naturalHeight);
          const imgW = img.naturalWidth * scale;
          const imgH = img.naturalHeight * scale;
          doc.addImage(imageDataUrl, "PNG", margin, y, imgW, imgH);
          y += imgH + lineHeight;
        } catch {
          /* skip image on error */
        }
      }

      // ---- Body: sanitize and normalize content for PDF ----
      const raw = sanitizeExplainHeadings(content);
      const normalized = raw
        .replace(/\u00A0/g, " ")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/__([^_]+)__/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/_([^_]+)_/g, "$1");
      const paragraphs = normalized.split(/\n\n/).map((p) => p.trim()).filter(Boolean);

      for (const p of paragraphs) {
        if (!p) continue;

        // Section labels (Validation, Summary) -> bold, slightly larger
        const sectionMatch = p.match(/^(Validation|Summary)\s*$/i);
        if (sectionMatch) {
          y += lineHeightTight * 0.5;
          drawText(sectionMatch[1], { bold: true, size: 11 });
          y += lineHeightTight * 0.3;
          continue;
        }

        // Markdown heading (# or ## or ###); allow leading whitespace, never draw the #
        const headingMatch = p.match(/^\s*#+\s*(.*)$/);
        if (headingMatch) {
          const title = headingMatch[1].replace(/^[^\x20-\x7E]+/, "").trim(); // strip leading garbage
          if (title) {
            y += lineHeightTight * 0.5;
            drawText(title, { bold: true, size: 12 });
            y += lineHeightTight * 0.4;
          }
          continue;
        }

        // Horizontal rule (---) -> skip, add space
        if (/^---+$/.test(p)) {
          y += lineHeightTight;
          continue;
        }

        // Bullet list: lines starting with - or *
        const bulletLine = /^[-*]\s+(.+)$/;
        if (bulletLine.test(p)) {
          const bulletText = p.replace(bulletLine, "$1").trim();
          drawText(bulletText, { indent: bulletIndent, isBullet: true });
          y += lineHeightTight * 0.2;
          continue;
        }

        // Single paragraph possibly containing multiple bullets (e.g. "- Item1\n- Item2")
        const bulletItems = p.split(/\n/).filter((line) => /^[-*]\s+/.test(line));
        if (bulletItems.length > 0) {
          for (const line of bulletItems) {
            const bulletText = line.replace(/^[-*]\s+/, "").trim();
            drawText(bulletText, { indent: bulletIndent, isBullet: true });
            y += lineHeightTight * 0.2;
          }
          y += lineHeightTight * 0.3;
          continue;
        }

        // Plain paragraph (if it looks like a heading with #, strip # and draw as bold so # never appears)
        const fallbackHeading = p.match(/^\s*#+\s*(.+)$/);
        if (fallbackHeading) {
          const title = fallbackHeading[1].replace(/^[^\x20-\x7E]+/, "").trim();
          if (title) {
            y += lineHeightTight * 0.5;
            drawText(title, { bold: true, size: 12 });
            y += lineHeightTight * 0.4;
          }
          continue;
        }
        drawText(p);
        y += lineHeightTight * 0.4;
      }

      doc.save(`diagram-explanation-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setDownloadingPdfForId(null);
    }
  };

  const isExplainIntent = (text: string): boolean => {
    const t = text.toLowerCase();
    // cover common phrasings
    const hasExplainVerb = /(explain|analy[sz]e|summari[sz]e|describe|break ?down|review|assess)/.test(t);
    const mentionsDiagram = /(diagram|architecture|canvas|this|current)/.test(t);
    // direct short forms: "explain", "explain it", "explain this"
    if (/^\s*(explain|analy[sz]e|summari[sz]e)\b/.test(t) && !/how to|how do/.test(t)) return true;
    return hasExplainVerb && mentionsDiagram;
  };

  const handleExplain = async (level: 'simple' | 'technical') => {
    if (isExplaining) return;
    setShowExplainChips(false);
    const diagram = getCurrentDiagram?.();
    if (!diagram) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "I couldn't read the current diagram. Make sure the canvas is loaded.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setIsExplaining(true);
    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "Explaining the current diagram…",
        timestamp: new Date(),
      },
    ]);

    try {
      const resp = await apiExplainDiagram({
        nodes: diagram.nodes ?? [],
        edges: diagram.edges ?? [],
        viewport: diagram.viewport ?? { x: 0, y: 0, zoom: 1 },
      }, level);

      const content = formatExplainResponseForChat(resp);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content, isExplainResponse: true } : m
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: `Sorry, ${message}` } : m
        )
      );
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading || isExplaining) return;

    setInputValue("");
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // If the user asked to explain/analyze, show chips to choose explanation level
    if (isExplainIntent(text)) {
      setShowExplainChips(true);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "What kind of explanation would you like?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      return;
    }

    setIsLoading(true);

    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "Generating your diagram…",
        timestamp: new Date(),
      },
    ]);

    try {
      const { diagramJson, validationErrors } = await onGenerateDiagram(text);
      onApplyDiagram(diagramJson);
      const successMsg =
        validationErrors && validationErrors.length > 0
          ? `I've created the diagram. Some WAM validation issues remain — run "Validate" in the toolbar to see them:\n${validationErrors.slice(0, 5).join("\n")}${validationErrors.length > 5 ? `\n... and ${validationErrors.length - 5} more` : ""}`
          : "I've created the diagram on the canvas. You can move nodes, add edges, and run validation to check WAM rules.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: successMsg } : m
        )
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: `Sorry, ${message}` } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat panel */}
      <div
        className="mona-chat-panel"
        data-open={isOpen}
        aria-hidden={!isOpen}
        role="dialog"
        aria-label="Mona Lisa chat"
      >
        <div className="mona-chat-panel__inner">
          <header className="mona-chat-panel__header">
            <div className="mona-chat-panel__avatar-wrap">
              <Image
                src="/mona_2.svg"
                alt="Mona Lisa"
                width={40}
                height={40}
                className="mona-chat-panel__avatar"
              />
              <span className="mona-chat-panel__status" aria-hidden />
            </div>
            <div className="mona-chat-panel__title-wrap">
              <h2 className="mona-chat-panel__title">Mona Lisa</h2>
              <span className="mona-chat-panel__subtitle">
                <Sparkles className="mona-chat-panel__sparkle" aria-hidden />
                AI Assistant
              </span>
            </div>
          </header>

          <div className="mona-chat-panel__messages custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className="mona-chat-message-row">
                <div
                  className={`mona-chat-bubble mona-chat-bubble--${msg.role}`}
                >
                  {msg.role === "assistant" && (msg.content === "Generating your diagram…" || msg.content === "Explaining the current diagram…") && (
                    <span className="mona-chat-bubble__loading">
                      <Loader2
                        size={18}
                        className="mona-chat-bubble__spinner"
                        aria-hidden
                      />
                      {msg.content}
                    </span>
                  )}
                  {!(msg.role === "assistant" && (msg.content === "Generating your diagram…" || msg.content === "Explaining the current diagram…")) && (
                    <div className="mona-chat-bubble__content">
                      {msg.role === "assistant" ? (
                        <ReactMarkdown
                          components={{
                            h1: ({ children, ...props }) => <h1 {...props} style={{ fontWeight: 700 }}>{children}</h1>,
                            h2: ({ children, ...props }) => <h2 {...props} style={{ fontWeight: 700 }}>{children}</h2>,
                            h3: ({ children, ...props }) => <h3 {...props} style={{ fontWeight: 700 }}>{children}</h3>,
                            h4: ({ children, ...props }) => <h4 {...props} style={{ fontWeight: 700 }}>{children}</h4>,
                            h5: ({ children, ...props }) => <h5 {...props} style={{ fontWeight: 700 }}>{children}</h5>,
                            h6: ({ children, ...props }) => <h6 {...props} style={{ fontWeight: 700 }}>{children}</h6>,
                          }}
                        >
                          {headingLinesToBold(ensureHeadingNewlines(ensureTitleLinesAreHeadings(msg.content)))}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  )}
                </div>
                {msg.role === "assistant" && msg.isExplainResponse && (
                  <div className="mona-chat-chip-wrap">
                    <button
                      type="button"
                      onClick={() => downloadExplainAsPdf(msg.id, msg.content)}
                      disabled={downloadingPdfForId !== null}
                      className="mona-chat-chip mona-chat-chip--pdf"
                      aria-label="Download this explanation as PDF"
                      title="Download this explanation as PDF"
                    >
                      <span className="mona-chat-chip__icon">
                        {downloadingPdfForId === msg.id ? (
                          <Loader2 size={16} className="mona-chat-panel__download-spinner" />
                        ) : (
                          <Download size={16} strokeWidth={2.25} />
                        )}
                      </span>
                      <span className="mona-chat-chip__label">
                        {downloadingPdfForId === msg.id ? "Creating PDF…" : "Download as PDF"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            {showExplainChips && (
              <div className="mona-chat-chips">
                <button
                  type="button"
                  onClick={() => handleExplain('simple')}
                  className="mona-chat-chip"
                  disabled={isExplaining}
                >
                  <Sparkles size={16} />
                  Simple (easy to understand)
                </button>
                <button
                  type="button"
                  onClick={() => handleExplain('technical')}
                  className="mona-chat-chip"
                  disabled={isExplaining}
                >
                  <Sparkles size={16} />
                  Technical (for developers)
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mona-chat-panel__input-wrap">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              placeholder="Type a prompt (e.g., “two realms with an app and a service”) or say “explain the diagram”"
              className="mona-chat-panel__input"
              aria-label="Message input"
              disabled={isLoading || isExplaining}
            />
            <button
              type="button"
              onClick={handleSend}
              className="mona-chat-panel__send"
              aria-label="Send message"
              disabled={!inputValue.trim() || isLoading || isExplaining}
            >
              {isLoading ? (
                <Loader2 size={18} strokeWidth={2.5} className="mona-chat-bubble__spinner" />
              ) : (
                <Send size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="mona-chat-fab"
        aria-label={isOpen ? "Close chat" : "Open Mona Lisa chat"}
        aria-expanded={isOpen}
        data-open={isOpen}
      >
        <span className="mona-chat-fab__tooltip">Chat with Mona</span>
        <span className="mona-chat-fab__icon-wrap">
          {isOpen ? (
            <X size={20} strokeWidth={2.5} className="mona-chat-fab__icon" />
          ) : (
            <Image
              src="/mona_2.svg"
              alt="Mona Lisa"
              width={28}
              height={28}
              className="mona-chat-fab__avatar"
            />
          )}
        </span>
      </button>
    </>
  );
}
