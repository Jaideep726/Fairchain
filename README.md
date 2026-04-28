<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Realtime-3FCF8E?style=flat-square&logo=supabase" />
  <img src="https://img.shields.io/badge/Gemini-1.5_Pro-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Mapbox-GL_JS-000?style=flat-square&logo=mapbox" />
</p>

# FairChain

**Real-time supply chain disruption prediction with built-in fairness auditing.**

FairChain predicts logistical disruptions on Indian national highways before they cascade — using IsolationForest anomaly detection and Prophet time-series forecasting — and generates AI-powered rerouting recommendations via Google Gemini. A built-in Fairness Auditor (AIF360) ensures equitable contract distribution to SME and women-owned carriers during crisis rerouting.

---

## Demo

https://github.com/user-attachments/assets/placeholder

> _Dashboard showing live disruption scoring across 28 highway segments, AI-generated alerts, and the fairness audit scorecard._

---

## Features

| Feature | Description |
|---|---|
| **Disruption Engine** | Two-tier ML stack — IsolationForest (real-time anomaly scoring) + Prophet (6/12/24h delay forecasting) with India-specific seasonality |
| **Live Geospatial Map** | Mapbox GL JS visualization of 28 segments across 8 national highways with risk-colored routes and shipment tracking |
| **AI Explainability** | Google Gemini 1.5 Pro generates human-impact assessments and actionable logistics advice for every prediction |
| **Fairness Auditor** | AIF360 + Fairlearn bias detection ensuring SME, women-owned, and developing-economy carriers aren't disadvantaged by AI routing |
| **Realtime Pipeline** | Supabase Postgres + Realtime WebSockets push prediction updates to the dashboard instantly |
| **Anomaly Matrix** | Sortable table of all segments ranked by risk, showing dominant anomalous features and IsolationForest raw scores |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js 14)                │
│  Dashboard ─ RouteVisualizer ─ AnomalyMatrix ─ GeminiPanel  │
│                    ↕ Supabase Realtime                      │
├─────────────────────────────────────────────────────────────┤
│                     Supabase (PostgreSQL 15)                │
│            segment_states ─ alerts ─ suppliers              │
├─────────────────────────────────────────────────────────────┤
│                        Backend (FastAPI)                     │
│  /disruptions/predict ─ /disruptions/forecast ─ /gemini     │
│  IsolationForest ─ Prophet ─ AIF360 ─ Gemini API            │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS, Mapbox GL JS |
| **Backend** | FastAPI, Python 3.10+, Scikit-Learn, Prophet, NetworkX |
| **Database** | Supabase (PostgreSQL 15) with Realtime WebSockets |
| **AI/ML** | IsolationForest, Prophet, AIF360, Fairlearn, Google Gemini 1.5 Pro |
| **Infra** | Vercel (frontend), Railway (backend), Supabase (database) |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- Supabase project (free tier works)
- Mapbox access token
- Google Gemini API key

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Fill in your keys in .env.local
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt

# Set environment variables
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_KEY=your-service-key
export GEMINI_API_KEY=your-gemini-key

uvicorn main:app --reload
```

The dashboard will be available at `http://localhost:3000` and the API at `http://localhost:8000`.

---

## Project Structure

```
FairChain/
├── frontend/                # Next.js 14 dashboard
│   └── src/
│       ├── app/dashboard/   # Main dashboard page
│       ├── components/      # Map, matrix, panels, modals
│       ├── hooks/           # Supabase realtime hook
│       └── lib/             # Utils, API client, mock data, Supabase client
├── backend/
│   ├── models/              # IsolationForest + Prophet disruption engine
│   ├── routes/              # FastAPI endpoints (disruptions, fairness, gemini)
│   └── data/                # Feature engineering, route segments, supplier DB
├── services/
│   └── gemini_explain.py    # Gemini AI explainability service
└── docs/                    # Pitch deck, fairness methodology
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/disruptions/predict` | Score a single route segment for disruption risk |
| `POST` | `/disruptions/predict/batch` | Score multiple segments in one call |
| `POST` | `/disruptions/forecast` | Prophet 6/12/24h delay probability forecast |
| `POST` | `/gemini/explain` | AI-generated human impact + actionable advice |
| `GET` | `/disruptions/demo/chennai-replay` | Stream the Nov 2023 Chennai Floods simulation |

---

## Highway Coverage

| Highway | Corridor | Segments |
|---|---|---|
| NH48 | Chennai → Bengaluru | 5 |
| NH48 | Delhi → Jaipur | 2 |
| NH16 | Kolkata → Visakhapatnam | 4 |
| NH44 | Bengaluru → Hyderabad | 3 |
| NH45 | Bengaluru → Mysuru | 2 |
| NH32 | Chennai → Pondicherry | 2 |
| NH19 | Delhi → Agra → Kanpur | 3 |
| NH58 | Delhi → Dehradun | 3 |
| NH27 | Lucknow → Varanasi | 3 |
| SH-Local | Chennai intra-city | 1 |

---

## License

MIT

---

<p align="center">
  Built for the <strong>PromptWars Solution Challenge 2026</strong>
</p>
