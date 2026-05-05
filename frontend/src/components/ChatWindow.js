import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import "./ChatWindow.css";

const SUGGESTIONS = [
  { label: "What can you do?",      prompt: "What can you help me with?" },
  { label: "Explain AI simply",     prompt: "Explain artificial intelligence like I'm 10" },
  { label: "Productivity tips",     prompt: "Give me 3 powerful productivity tips" },
  { label: "Weather in London?",    prompt: "What's the weather in London?" },
];

function TypingIndicator() {
  return (
    <div className="message-row ai">
      <div className="avatar ai">✦</div>
      <div className="bubble-wrap">
        <div className="typing-bubble">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onSuggestion }) {
  return (
    <div className="empty-state">
      <div className="empty-orb">✦</div>
      <h2 className="empty-title">How can I help?</h2>
      <p className="empty-sub">Ask me anything — I think, reason, and adapt to your needs.</p>
      <div className="suggestion-chips">
        {SUGGESTIONS.map((s) => (
          <button key={s.prompt} className="chip" onClick={() => onSuggestion(s.prompt)}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, isThinking, userName, onSuggestion }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    <div className="chat-area">
      {messages.length === 0 ? (
        <EmptyState onSuggestion={onSuggestion} />
      ) : (
        <>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} userName={userName} />
          ))}
          {isThinking && <TypingIndicator />}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
