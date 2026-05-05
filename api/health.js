/**
 * Vercel Serverless Function — /api/health
 */
export default function handler(req, res) {
  res.json({
    status: "ok",
    provider: "Groq",
    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
    timestamp: new Date().toISOString(),
  });
}
