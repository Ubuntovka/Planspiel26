"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { explainDiagram as apiExplainDiagram } from "../api";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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

export interface MonaChatFabProps {
  /** Generate diagram from prompt. Resolves with diagram JSON string and optional validation errors. */
  onGenerateDiagram: (prompt: string) => Promise<{ diagramJson: string; validationErrors?: string[] }>;
  /** Apply diagram by loading this JSON string into the editor. */
  onApplyDiagram: (diagramJson: string) => void;
  /** Returns the current diagram object from canvas, or null if unavailable. */
  getCurrentDiagram: () => { nodes: any[]; edges: any[]; viewport?: { x: number; y: number; zoom: number } } | null;
}

export default function MonaChatFab({
  onGenerateDiagram,
  onApplyDiagram,
  getCurrentDiagram,
}: MonaChatFabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(PLACEHOLDER_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showExplainChips, setShowExplainChips] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages]);

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

      const summaryLine = `\n\n— Validation: ${resp.validation.valid ? "valid ✅" : `invalid ❌ (${resp.validation.errors.length} issues)`} • ${resp.summary.nodeCount} nodes, ${resp.summary.edgeCount} edges, ${resp.summary.realmCount} security realms`;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `${resp.explanation}${summaryLine}` }
            : m
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
              <div
                key={msg.id}
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
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
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
