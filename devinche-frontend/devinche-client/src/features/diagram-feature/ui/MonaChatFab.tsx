"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";

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
      "Hi, I'm Mona Lisa — your AI assistant. Describe the WAM diagram you want (e.g. \"Two security realms that trust each other; one has an app that invokes a service\") and I'll generate it on the canvas.",
    timestamp: new Date(),
  },
];

export interface MonaChatFabProps {
  /** Generate diagram from prompt. Resolves with diagram JSON string and optional validation errors. */
  onGenerateDiagram: (prompt: string) => Promise<{ diagramJson: string; validationErrors?: string[] }>;
  /** Apply diagram by loading this JSON string into the editor. */
  onApplyDiagram: (diagramJson: string) => void;
}

export default function MonaChatFab({
  onGenerateDiagram,
  onApplyDiagram,
}: MonaChatFabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(PLACEHOLDER_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    setInputValue("");
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
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
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mona-chat-panel__close"
              aria-label="Close chat"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </header>

          <div className="mona-chat-panel__messages custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mona-chat-bubble mona-chat-bubble--${msg.role}`}
              >
                {msg.role === "assistant" && msg.content === "Generating your diagram…" && (
                  <span className="mona-chat-bubble__loading">
                    <Loader2
                      size={18}
                      className="mona-chat-bubble__spinner"
                      aria-hidden
                    />
                    {msg.content}
                  </span>
                )}
                {!(msg.role === "assistant" && msg.content === "Generating your diagram…") && (
                  <div className="mona-chat-bubble__content">{msg.content}</div>
                )}
              </div>
            ))}
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
              placeholder="Describe the WAM diagram you want..."
              className="mona-chat-panel__input"
              aria-label="Message input"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleSend}
              className="mona-chat-panel__send"
              aria-label="Send message"
              disabled={!inputValue.trim() || isLoading}
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
