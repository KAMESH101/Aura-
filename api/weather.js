/**
 * Vercel Serverless Function — /api/weather
 * Proxies weather requests to OpenWeatherMap.
 */
module.exports = async function handler(req, res) {
  // ── CORS headers ──────────────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const city = req.query.city || "London";

  if (!process.env.OPENWEATHER_API_KEY) {
    return res.status(500).json({ error: "Weather API key not configured" });
  }

  try {
    const params = new URLSearchParams({
      q: city,
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
    });

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${params}`
    );

    const d = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: response.status === 404 ? `City "${city}" not found` : "Weather service unavailable",
      });
    }

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
    console.error("Weather API error:", err.message);
    return res.status(500).json({
      error: "Weather service unavailable",
    });
  }
};
