import React from "react";
import { formatAIText, formatTime } from "../utils/format";
import "./MessageBubble.css";

function WeatherCard({ weather }) {
  return (
    <div className="weather-card">
      <div className="weather-icon">{weather.icon}</div>
      <div className="weather-info">
        <div className="weather-temp">{weather.temp}°C</div>
        <div className="weather-city">{weather.city}</div>
        <div className="weather-desc">{weather.desc}</div>
        <div className="weather-tags">
          <span className="weather-tag">💧 {weather.humidity}%</span>
          <span className="weather-tag">💨 {weather.wind} km/h</span>
          <span className="weather-tag">🌡️ Feels {weather.feels_like}°C</span>
        </div>
      </div>
    </div>
  );
}

export default function MessageBubble({ message, userName }) {
  const isUser = message.role === "user";
  const initial = isUser
    ? userName ? userName[0].toUpperCase() : "U"
    : "✦";

  return (
    <div className={`message-row ${isUser ? "user" : "ai"}`}>
      <div className={`avatar ${isUser ? "user" : "ai"}`}>{initial}</div>

      <div className="bubble-wrap">
        <div
          className={`bubble ${isUser ? "user" : message.error ? "error" : message.weather ? "weather" : "ai"}`}
        >
          {/* Weather card before text */}
          {message.weather && <WeatherCard weather={message.weather} />}

          {/* Message content */}
          {isUser ? (
            <span>{message.content}</span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: formatAIText(message.content) }} />
          )}
        </div>

        <div className="msg-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}
