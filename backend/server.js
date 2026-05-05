/**
 * Aura AI - Backend Server (Groq Edition)
 * Uses Groq's free API — ultra-fast LLaMA inference, no credit card needed.
 * Get your free key at: https://console.groq.com
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Groq Config ──────────────────────────────────────────────────────────────
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Model options (all free on Groq):
//   "llama-3.1-8b-instant"    → fastest,  14,400 req/day  ✅ default
//   "llama-3.3-70b-versatile" → smarter,   1,000 req/day
//   "mixtral-8x7b-32768"      → balanced,  1,000 req/day
//   "gemma2-9b-it"            → Google,   14,400 req/day
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "10kb" }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    provider: "Groq",
    model: GROQ_MODEL,
    timestamp: new Date().toISOString(),
  });
});

// ─── Chat Endpoint ────────────────────────────────────────────────────────────
// POST /api/chat
// Body: { messages: [{role, content}], userName: string }
app.post("/api/chat", async (req, res) => {
  const { messages, userName } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "Server misconfiguration: GROQ_API_KEY missing" });
  }

  const systemPrompt = `You are Aura, a highly intelligent personal AI assistant.${
    userName ? ` The user's name is ${userName}.` : ""
  } You are knowledgeable, concise, friendly, and helpful. You give structured, thoughtful responses. Use **bold** for important terms and \`code\` for technical terms. Keep responses clear and focused.`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        max_tokens: 1024,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-20).map((m) => ({
            role: m.role === "ai" ? "assistant" : m.role,
            content: m.content,
          })),
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    const usage = response.data.usage;

    return res.json({
      reply,
      meta: {
        model: GROQ_MODEL,
        prompt_tokens: usage?.prompt_tokens,
        completion_tokens: usage?.completion_tokens,
      },
    });
  } catch (err) {
    console.error("Groq API error:", err?.response?.data || err.message);
    const status = err?.response?.status || 500;

    if (status === 429) {
      return res.status(429).json({
        error: "Rate limit reached. Please wait a moment and try again.",
      });
    }

    return res.status(status).json({
      error: err?.response?.data?.error?.message || "Failed to get AI response.",
    });
  }
});

// ─── Weather Endpoint ─────────────────────────────────────────────────────────
// GET /api/weather?city=London
app.get("/api/weather", async (req, res) => {
  const city = req.query.city || "London";

  if (!process.env.OPENWEATHER_API_KEY) {
    return res.status(500).json({ error: "Weather API key not configured" });
  }

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    const d = response.data;
    const iconMap = {
      Clear: "☀️", Clouds: "☁️", Rain: "🌧️",
      Snow: "❄️", Thunderstorm: "⛈️", Drizzle: "🌦️",
      Mist: "🌫️", Fog: "🌫️", Haze: "🌫️",
    };

    return res.json({
      city: `${d.name}, ${d.sys.country}`,
      temp: Math.round(d.main.temp),
      feels_like: Math.round(d.main.feels_like),
      desc:
        d.weather[0].description.charAt(0).toUpperCase() +
        d.weather[0].description.slice(1),
      humidity: d.main.humidity,
      wind: Math.round(d.wind.speed * 3.6),
      icon: iconMap[d.weather[0].main] || "🌡️",
    });
  } catch (err) {
    const status = err?.response?.status || 500;
    return res.status(status).json({
      error: status === 404 ? `City "${city}" not found` : "Weather service unavailable",
    });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✦ Aura AI (Groq Edition) → http://localhost:${PORT}`);
  console.log(`  Model  : ${GROQ_MODEL}`);
  console.log(`  API Key: ${process.env.GROQ_API_KEY ? "✅ Loaded" : "❌ MISSING — check .env"}\n`);
});
