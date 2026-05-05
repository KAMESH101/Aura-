# ✦ Aura AI — Personal AI Assistant 

A fully functional, modern AI assistant built with **React + Node.js/Express + Groq API**.
**100% Free** — no credit card, no paid API keys required.

---

## 💸 Why Groq?

| Feature | Groq Free Tier |
|---|---|
| Cost | ✅ Completely FREE |
| Credit card | ❌ Not required |
| Speed | ⚡ Fastest AI API in the world |
| Daily limit | 14,400 requests/day (LLaMA 8B) |
| Models | LLaMA 3.1, LLaMA 3.3, Mixtral, Gemma2 |

---

## 📸 Features

| Feature | Details |
|---|---|
| 🤖 AI Chat | Powered by LLaMA via Groq — blazing fast responses |
| 🌤️ Live Weather | Real-time weather — auto-detected from chat |
| 💾 Persistence | Chat history saved in `localStorage` |
| 👤 Personalization | Remembers your name, greets you |
| 🎨 Dark/Light Mode | Toggle persisted across sessions |
| ⚡ Quick Actions | Summarize, Explain Simply, Ideas, Deep Dive |
| 💬 Typing Indicator | Animated dots while AI responds |
| 📱 Responsive | Works on mobile + desktop |

---

## 🗂️ Project Structure

```
aura-ai-groq/
├── package.json              ← Root: npm run dev starts everything
├── .gitignore
├── README.md
│
├── backend/
│   ├── server.js             ← Express + Groq API proxy + weather
│   ├── package.json
│   └── .env.example          ← Copy to .env, add your keys
│
└── frontend/
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.js
        ├── hooks/
        │   ├── useChat.js    ← AI + weather logic
        │   └── useTheme.js
        ├── components/
        │   ├── NameModal
        │   ├── Header
        │   ├── ChatWindow
        │   ├── MessageBubble
        │   ├── QuickActions
        │   └── InputBox
        └── utils/format.js
```

---

## 🚀 Setup (5 minutes)

### Step 1 — Install dependencies

```bash
npm run install:all
```

### Step 2 — Configure environment

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=llama-3.1-8b-instant
OPENWEATHER_API_KEY=xxxxxxxxxxxxxxxxxxxx
```

### Step 3 — Run the app

```bash
# From project root:
npm run dev
```

Open **http://localhost:3000** 🎉

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server status + model info |
| `POST` | `/api/chat` | Send message, get AI reply |
| `GET` | `/api/weather?city=Chennai` | Live weather data |

---

## 🏗️ Build for Production

```bash
npm run build
# Outputs to frontend/build/
# Deploy backend to Railway / Render / Fly.io (all have free tiers)
# Deploy frontend to Vercel / Netlify (free)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Backend | Node.js + Express |
| AI | Groq API (LLaMA 3.1 / 3.3 / Mixtral) |
| Weather | OpenWeatherMap (free tier) |
| Storage | Browser localStorage |

---

## 📄 License

MIT — free to use, modify, and share.
