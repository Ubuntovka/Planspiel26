"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import Image from "next/image";

const PLACEHOLDER_MESSAGES = [
  {
    id: "welcome",
    role: "assistant" as const,
    content: "Hi, I'm Mona Lisa — your AI assistant. Ask me anything about your diagram or workflow.",
    timestamp: new Date(),
  },
];

export default function MonaChatFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setInputValue("");
    // UI only: no real send logic yet
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
            {PLACEHOLDER_MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className={`mona-chat-bubble mona-chat-bubble--${msg.role}`}
              >
                <div className="mona-chat-bubble__content">{msg.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="mona-chat-panel__input-wrap">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Message Mona Lisa..."
              className="mona-chat-panel__input"
              aria-label="Message input"
            />
            <button
              type="button"
              onClick={handleSend}
              className="mona-chat-panel__send"
              aria-label="Send message"
              disabled={!inputValue.trim()}
            >
              <Send size={18} strokeWidth={2.5} />
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
