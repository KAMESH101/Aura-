/**
 * Vercel Serverless Function — /api/chat
 * Proxies chat requests to Groq API.
 */
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

module.exports = async function handler(req, res) {
  // ── CORS headers ──────────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, userName } = req.body;
  const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

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
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({
          error: "Rate limit reached. Please wait a moment and try again.",
        });
      }
      return res.status(response.status).json({
        error: data?.error?.message || "Failed to get AI response.",
      });
    }

    const reply = data.choices[0].message.content;
    const usage = data.usage;

    return res.json({
      reply,
      meta: {
        model: GROQ_MODEL,
        prompt_tokens: usage?.prompt_tokens,
        completion_tokens: usage?.completion_tokens,
      },
    });
  } catch (err) {
    console.error("Groq API error:", err.message);
    return res.status(500).json({
      error: "Failed to get AI response.",
    });
  }
};
