# 🌱 Farmer OS — Full-Stack Agricultural Operating System

> An enterprise-grade, scalable full-stack platform designed to power precision farming, crop lifecycle telemetry, AI disease diagnostics, early warning alerts, and direct agricultural market access.

---

## 🏗️ Architecture Overview

```text
               +-------------------------------------------------+
               |                    Farmer UI                    |
               |       (React 19 + TypeScript + Vite + Router)   |
               +-------------------------------------------------+
                                        │
                                        │ REST API (JSON / JWT)
                                        ▼
               +-------------------------------------------------+
               |                Farmer OS Backend                |
               |         (Node.js + Express + TypeScript)        |
               +-------------------------------------------------+
                                        │
     ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
     ▼                  ▼                               ▼                  ▼
+──────────+   +──────────────────+           +──────────────────+   +───────────+
| MongoDB  |   | AI Diagnostic    |           | Weather Service  |   | Mandi     |
| Database |   | Engine (Vision)  |           | (Open-Meteo)     |   | Stream    |
+──────────+   +──────────────────+           +──────────────────+   +───────────+
```

---

## 🌟 Core Features

- **Farmer Dashboard**: Real-time telemetry prioritizing critical alerts, active crop lifecycles, weather advisories, farm plot summaries, and risk indexes.
- **Farm Management**: Multi-plot acreage tracking, soil classification (Black, Alluvial, Red, Sandy), irrigation grid types (Drip, Borewell, Canal, Sprinkler), and crop allocation.
- **Crop Management**: Variety tracking, sowing date milestones, stage progression (`planned`, `sown`, `growing`, `harvest_ready`, `harvested`, `sold`), and yield projections.
- **AI Disease Detection Pipeline**: Leaf specimen image analysis, confidence score computation, risk level evaluation (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and treatment prescription.
- **Pest Monitoring & IPM**: Comprehensive pest catalog, morphological keys, damage symptoms, and threshold-based organic/chemical interventions.
- **Hyper-Local Weather Intelligence**: Multi-day forecast, precipitation probability, humidity, wind velocity, and automated spray window advisories.
- **Early Warning Alert Engine**: Real-time farm alerts across `DISEASE`, `PEST`, `WEATHER`, `IRRIGATION`, and `CROP_RISK` categories with severity levels.
- **Dual Localization**: Seamless toggle between **English** and **हिन्दी (Hindi)**.

---

## 📂 Project Structure

```text
farmer-os/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Common & Layout UI components
│   │   ├── pages/            # View pages (Dashboard, Farms, Crops, Disease, etc.)
│   │   ├── layouts/          # MainLayout & AuthLayout
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # Central API client (api.ts) & domain connectors
│   │   ├── contexts/         # AuthContext, DataContext, LanguageContext, etc.
│   │   ├── i18n/             # Translations (English & Hindi)
│   │   ├── utils/            # Helper utilities
│   │   ├── types/            # TypeScript domain interfaces
│   │   ├── assets/           # Static assets & icons
│   │   ├── App.tsx           # React Router declarative routes
│   │   └── main.tsx          # Frontend bootstrap entrypoint
│   │
│   ├── public/               # Public assets
│   ├── .env.example          # Frontend environment variables template
│   ├── package.json          # Frontend dependencies & build scripts
│   ├── tsconfig.json         # Frontend TypeScript config
│   └── vite.config.ts        # Vite bundler configuration
│
├── backend/
│   ├── src/
│   │   ├── config/           # Database (db.ts) & Env (env.ts) configuration
│   │   ├── controllers/      # REST API route controllers
│   │   ├── middleware/       # Auth (JWT), Validation, Error handling middleware
│   │   ├── models/           # Mongoose schemas (User, Farmer, Farm, Crop, etc.)
│   │   ├── routes/           # Express router endpoints
│   │   ├── services/         # Business logic & AI/ML abstractions
│   │   ├── utils/            # ApiResponse, ApiError, Logger utilities
│   │   ├── types/            # Backend domain types & interfaces
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server bootstrap & connection manager
│   │
│   ├── .env.example          # Backend environment variables template
│   ├── package.json          # Backend dependencies & scripts
│   └── tsconfig.json         # Backend TypeScript config
│
├── README.md                 # Complete system documentation
├── .gitignore                # Root gitignore rules
└── package.json              # Root script coordinator
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for optimized HMR and bundling
- **React Router v7** for declarative SPA navigation
- **Lucide React** for modern agricultural icons
- **Axios** for centralized HTTP API communication
- **Recharts** for agricultural data visualizations

### Backend
- **Node.js** with **Express** & **TypeScript**
- **MongoDB** with **Mongoose** ORM
- **JWT (jsonwebtoken)** & **bcryptjs** for authentication
- **Helmet** & **CORS** for HTTP security
- **Morgan** for request logging
- **Centralized Error Handling** & standardized JSON responses

---

## ⚙️ Environment Configuration

### Frontend (`frontend/.env.example`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env.example`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/farmer_os
JWT_SECRET=farmer_os_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
WEATHER_API_KEY=
```

---

## 🚀 Quick Start & Installation

### 1. Clone & Install All Dependencies
From the root directory:
```bash
npm run install:all
```
*Or install separately:*
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Configure Environment Files
```bash
# In frontend/
cp .env.example .env

# In backend/
cp .env.example .env
```

### 3. Run Both Servers Concurrently
From root directory:
```bash
npm run dev
```

*Or run individually in separate terminals:*
```bash
# Terminal 1 (Backend - Port 5000)
npm run dev:backend

# Terminal 2 (Frontend - Port 5173)
npm run dev:frontend
```

---

## 📡 REST API Reference

All responses follow the standard JSON envelope:
```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

### Core Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health, uptime & DB status | No |
| `POST` | `/api/auth/register` | Register a new farmer/user | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | No |
| `GET` | `/api/auth/me` | Retrieve authenticated profile | Yes (Bearer) |
| `GET` | `/api/farms` | List farmer's land plots | Optional |
| `POST` | `/api/farms` | Register a new farm plot | Optional |
| `GET` | `/api/farms/:id` | Get specific farm details | No |
| `PUT` | `/api/farms/:id` | Update farm parameters | No |
| `DELETE` | `/api/farms/:id` | Delete farm & associated cycles | No |
| `GET` | `/api/crops` | List crop cycles with filters | Optional |
| `POST` | `/api/crops` | Create new crop cycle | Optional |
| `PUT` | `/api/crops/:id/status` | Update crop growth status | No |
| `GET` | `/api/diseases` | Browse disease catalog | No |
| `POST` | `/api/diseases/detect` | AI disease detection & diagnosis | Optional |
| `GET` | `/api/pests` | List pest identification profiles | No |
| `GET` | `/api/weather` | Current weather & alerts | No |
| `GET` | `/api/weather/forecast` | 7-day weather forecast | No |
| `GET` | `/api/alerts` | Query active farm alerts | Optional |
| `PUT` | `/api/alerts/:id/read` | Mark alert as acknowledged | No |
| `PUT` | `/api/alerts/read-all` | Mark all alerts read | Optional |

---

## 🧠 Future AI/ML Vision Model Integration

The `backend/src/services/diseaseDetection.service.ts` module provides a clean interface for integrating custom Computer Vision (CV) models (PyTorch, TensorFlow, ONNX Runtime, or Vertex AI).

```text
Image Input (Base64 / Multipart)
      ↓
Preprocessing & Normalization (224x224 RGB)
      ↓
Deep CNN / Vision Transformer (e.g. ResNet50 / EfficientNet)
      ↓
Softmax Multi-Class Probability
      ↓
Pathology Matching & Recommendation Rule Engine
      ↓
Diagnostic Result (Confidence %, Organic & Chemical Protocol)
```

---

## 🔒 Security Best Practices

- **Zero Secret Exposure**: All database URIs, JWT secrets, and third-party API keys remain exclusively on the backend.
- **Helmet Headers**: Protects against common web vulnerabilities (XSS, clickjacking, MIME sniffing).
- **Password Hashing**: Industry-standard `bcryptjs` salted hashing.
- **CORS Restricted**: Backend restricts origin access strictly to configured frontend domains.

---

## 📄 License

MIT © 2026 Farmer OS. Built for modern agricultural enterprises.
