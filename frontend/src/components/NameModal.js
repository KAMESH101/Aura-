import React, { useState, useEffect, useRef } from "react";
import "./NameModal.css";

export default function NameModal({ onSubmit }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) { inputRef.current?.focus(); return; }
    onSubmit(trimmed);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <span className="modal-emoji">👋</span>
        <h2 className="modal-title">Welcome! I'm Aura</h2>
        <p className="modal-sub">Your personal AI assistant. What should I call you?</p>
        <input
          ref={inputRef}
          className="modal-input"
          type="text"
          placeholder="Your name..."
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button className="modal-btn" onClick={handleSubmit}>
          Let's Go →
        </button>
      </div>
    </div>
  );
}
