import React, { useRef, useEffect } from "react";
import "./InputBox.css";

export default function InputBox({ onSend, isThinking, prefill, onPrefillUsed }) {
  const textareaRef = useRef(null);
  const [value, setValue] = React.useState("");

  // Apply prefill from QuickActions
  useEffect(() => {
    if (prefill) {
      setValue(prefill);
      textareaRef.current?.focus();
      onPrefillUsed();
    }
  }, [prefill, onPrefillUsed]);

  const handleInput = (e) => {
    setValue(e.target.value);
    // Auto-grow textarea
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleSend = () => {
    const text = value.trim();
    if (!text || isThinking) return;
    onSend(text);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
      <div className="input-box">
        <textarea
          ref={textareaRef}
          className="chat-input"
          rows={1}
          placeholder="Ask me anything…"
          maxLength={4000}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isThinking}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!value.trim() || isThinking}
          title="Send"
        >
          ➤
        </button>
      </div>
      <div className="input-hint">Enter to send · Shift+Enter for new line</div>
    </div>
  );
}
