import React, { useState, useCallback } from "react";
import { useChat } from "./hooks/useChat";
import { useTheme } from "./hooks/useTheme";
import { getGreeting } from "./utils/format";
import NameModal from "./components/NameModal";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import QuickActions from "./components/QuickActions";
import InputBox from "./components/InputBox";
import "./styles/App.css";

const NAME_KEY = "aura_user_name";

export default function App() {
  const [userName, setUserName] = useState(() => localStorage.getItem(NAME_KEY) || "");
  const [showModal, setShowModal] = useState(() => !localStorage.getItem(NAME_KEY));
  const [prefill, setPrefill] = useState("");

  const { isDark, toggle: toggleTheme } = useTheme();
  const { messages, isThinking, sendMessage, clearMessages } = useChat(userName);

  // Called when user submits their name
  const handleNameSubmit = useCallback((name) => {
    setUserName(name);
    localStorage.setItem(NAME_KEY, name);
    setShowModal(false);
  }, []);

  // QuickAction → prefill the input
  const handleQuickAction = useCallback((prefix) => {
    setPrefill(prefix);
  }, []);

  // Suggestion chip → send directly
  const handleSuggestion = useCallback((prompt) => {
    sendMessage(prompt);
  }, [sendMessage]);

  const handleClear = () => {
    if (messages.length === 0 || window.confirm("Clear all messages?")) {
      clearMessages();
    }
  };

  const greeting = userName
    ? `${getGreeting()}, ${userName}! ${messages.length > 0 ? "Welcome back." : "What shall we tackle today?"}`
    : `${getGreeting()}! I'm Aura — your personal AI. What shall we tackle today?`;

  return (
    <div className="app-shell">
      {showModal && <NameModal onSubmit={handleNameSubmit} />}

      <Header
        isThinking={isThinking}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onClear={handleClear}
      />

      {/* Greeting banner */}
      <div className="greeting-banner">
        <span>👋</span>
        <span>{greeting}</span>
      </div>

      <ChatWindow
        messages={messages}
        isThinking={isThinking}
        userName={userName}
        onSuggestion={handleSuggestion}
      />

      <QuickActions onAction={handleQuickAction} />

      <InputBox
        onSend={sendMessage}
        isThinking={isThinking}
        prefill={prefill}
        onPrefillUsed={() => setPrefill("")}
      />
    </div>
  );
}
