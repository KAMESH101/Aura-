/**
 * useChat — core hook managing messages, AI calls, weather, and localStorage.
 */
import { useState, useCallback, useRef } from "react";

const STORAGE_KEY = "aura_messages_v1";

function loadStored() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-100)));
}

function isWeatherQuery(text) {
  return /weather|temperature|forecast|rain|sunny|cloudy|hot|cold|humid|wind/i.test(text);
}

function extractCity(text) {
  const m1 = text.match(/(?:weather|temperature|forecast)\s+(?:in|at|for)?\s*([a-zA-Z\s]+?)(?:\?|$|,)/i);
  if (m1) return m1[1].trim();
  const m2 = text.match(/(?:in|at)\s+([A-Z][a-zA-Z\s]+?)(?:\?|$|,)/);
  if (m2) return m2[1].trim();
  return "London";
}

export function useChat(userName) {
  const [messages, setMessages] = useState(loadStored);
  const [isThinking, setIsThinking] = useState(false);
  const abortRef = useRef(null);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => {
      const next = [...prev, msg];
      save(next);
      return next;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isThinking) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    // Snapshot current messages for API (before state update)
    const currentMessages = loadStored();
    const history = currentMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-20)
      .map((m) => ({ role: m.role === "ai" ? "assistant" : m.role, content: m.content }));

    addMessage(userMsg);
    setIsThinking(true);

    try {
      let aiMsg;

      if (isWeatherQuery(text)) {
        // ── Weather path ──────────────────────────────────────────────────────
        const city = extractCity(text);

        const [weatherRes, aiRes] = await Promise.allSettled([
          fetch(`/api/weather?city=${encodeURIComponent(city)}`).then((r) => r.json()),
          fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [...history, { role: "user", content: text }],
              userName,
            }),
          }).then((r) => r.json()),
        ]);

        const weather = weatherRes.status === "fulfilled" && !weatherRes.value.error
          ? weatherRes.value
          : null;
        const reply = aiRes.status === "fulfilled" && aiRes.value.reply
          ? aiRes.value.reply
          : "Here's the current weather data for you!";

        aiMsg = {
          id: Date.now() + 1,
          role: "ai",
          content: reply,
          weather,
          timestamp: Date.now(),
        };
      } else {
        // ── Standard AI path ──────────────────────────────────────────────────
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...history, { role: "user", content: text }],
            userName,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "API error");

        aiMsg = {
          id: Date.now() + 1,
          role: "ai",
          content: data.reply,
          timestamp: Date.now(),
        };
      }

      addMessage(aiMsg);
    } catch (err) {
      addMessage({
        id: Date.now() + 1,
        role: "ai",
        content: `⚠️ ${err.message || "Something went wrong. Please try again."}`,
        error: true,
        timestamp: Date.now(),
      });
    } finally {
      setIsThinking(false);
    }
  }, [isThinking, userName, addMessage]);

  return { messages, isThinking, sendMessage, clearMessages };
}
