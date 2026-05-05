import React from "react";
import "./Header.css";

export default function Header({ isThinking, isDark, onToggleTheme, onClear }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className={`logo-orb ${isThinking ? "spinning" : ""}`}>✦</div>
        <div>
          <div className="header-title">Aura AI</div>
          <div className="header-subtitle">
            <span className="online-dot" />
            {isThinking ? "Thinking..." : "Online & Ready"}
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button
          className={`icon-btn ${!isDark ? "active" : ""}`}
          onClick={onToggleTheme}
          title="Toggle theme"
        >
          {isDark ? "🌙" : "☀️"}
        </button>
        <button className="icon-btn" onClick={onClear} title="Clear chat">
          🗑️
        </button>
      </div>
    </header>
  );
}
