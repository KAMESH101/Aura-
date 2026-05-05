import React from "react";
import "./QuickActions.css";

const ACTIONS = [
  { label: "📋 Summarize",      prefix: "Summarize this: " },
  { label: "🧒 Explain Simply",  prefix: "Explain simply: " },
  { label: "💡 Generate Ideas",  prefix: "Generate creative ideas about: " },
  { label: "🔬 Deep Dive",       prefix: "Give me a deep dive on: " },
  { label: "✏️ Fix & Improve",   prefix: "Fix and improve this: " },
  { label: "🌤️ Weather",         prefix: "What's the weather in " },
];

export default function QuickActions({ onAction }) {
  return (
    <div className="quick-actions">
      {ACTIONS.map((a) => (
        <button key={a.label} className="qa-btn" onClick={() => onAction(a.prefix)}>
          {a.label}
        </button>
      ))}
    </div>
  );
}
