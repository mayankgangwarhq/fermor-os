# 🌱 AGRINEXT — Full-Stack Agricultural Intelligence Platform

> **AI-Powered Intelligence for Every Farm**
> 🌐 Live Demo
https://agrinextfrontend69.vercel.app/

AGRINEXT is a full-stack agricultural platform designed to help farmers with **crop disease identification, farm management, weather intelligence, pest monitoring, early warnings, crop tracking, and agricultural market information** through a simple and farmer-friendly web interface.

---

## 🏗️ System Architecture

```text
                  ┌──────────────────────────────┐
                  │        AGRINEXT Web UI       │
                  │ React + TypeScript + Vite    │
                  └──────────────┬───────────────┘
                                 │
                                 │ REST API / JSON
                                 ▼
                  ┌──────────────────────────────┐
                  │      AGRINEXT Backend        │
                  │ Node.js + Express + TypeScript│
                  └──────────────┬───────────────┘
                                 │
             ┌───────────────────┼───────────────────┐
             ▼                   ▼                   ▼
      ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
      │   MongoDB   │    │ Disease      │    │ Weather      │
      │   Database  │    │ Detection    │    │ Open-Meteo   │
      └─────────────┘    │ Vision API   │    └──────────────┘
                         └──────────────┘
                                 │
                                 ▼
                       ┌──────────────────┐
                       │ Mandi / Market   │
                       │ Data Integration │
                       └──────────────────┘
```

---

## 🌾 Core Features

### 1. Farmer Dashboard

The dashboard provides a single place to view:

* Active crops
* Farm information
* Weather conditions
* Disease-related results
* Pest risks
* Important alerts
* Crop-cycle information
* Market-related information

---

### 2. Farm Management

Farmers can maintain information about their agricultural plots, including:

* Farm/plot details
* Area and location
* Soil type
* Irrigation method
* Crop allocation
* Multiple farm plots

Supported examples include:

**Soil Types**

* Black
* Alluvial
* Red
* Sandy

**Irrigation**

* Drip
* Borewell
* Canal
* Sprinkler

---

### 3. Crop Management

AGRINEXT allows farmers to track crop activities throughout the crop cycle.

```text
Planned
   ↓
Sown
   ↓
Growing
   ↓
Harvest Ready
   ↓
Harvested
   ↓
Sold
```

Crop records can include:

* Crop name
* Variety
* Farm/plot
* Sowing date
* Growth stage
* Expected harvest information
* Crop status

---

## 🔬 4. Crop Disease Detection

AGRINEXT provides an image-based crop disease analysis workflow.

```text
Crop / Leaf Image
       ↓
Image Upload
       ↓
Image Processing
       ↓
Vision Analysis
       ↓
Possible Disease Identification
       ↓
Confidence / Risk Information
       ↓
Farmer-Friendly Guidance
       ↓
Follow-up Monitoring
```

The system is designed to make disease information easier for farmers to understand.

> **Important:** AI-generated results are intended as decision-support information and should not replace qualified agricultural expert advice in uncertain or high-risk cases.

---

## 🐛 5. Pest Monitoring

The platform includes pest-related information and monitoring support.

It can organize:

* Pest identification information
* Visible symptoms
* Crop affected
* Risk level
* Monitoring status
* Suggested intervention categories

The system can also support **Integrated Pest Management (IPM)** workflows.

---

## 🌦️ 6. Weather Intelligence

AGRINEXT uses weather data to provide agricultural context.

Weather information can include:

* Current conditions
* Temperature
* Humidity
* Rain probability
* Wind conditions
* Multi-day forecast

Weather information can support decisions such as:

* Crop monitoring
* Irrigation planning
* Spray timing
* Weather-related risk awareness

---

## 🚨 7. Early Warning & Alerts

AGRINEXT can organize important farm alerts into categories such as:

```text
DISEASE
   │
PEST
   │
WEATHER
   │
IRRIGATION
   │
CROP RISK
```

Each alert can have a severity level so that important information is easier to identify.

Example:

```text
Farm Alert
   ↓
Risk Detected
   ↓
Severity Assessment
   ↓
Farmer Notification
   ↓
Recommended Next Step
```

---

## 🛒 8. Mandi & Market Information

AGRINEXT can integrate agricultural market information to help farmers explore:

* Commodity prices
* Mandi information
* State
* District
* Market
* Commodity
* Variety

Market data is intended to provide farmers with better access to available market information.

---

## 🤖 9. Farmer Assistant

The platform can provide a conversational assistant for agriculture-related queries.

Example workflow:

```text
Farmer Question
      ↓
Context / Query Processing
      ↓
Agricultural Assistant
      ↓
Simple Explanation
      ↓
Actionable Guidance
```

The goal is to communicate information in a **simple and understandable format** rather than using complex technical terminology.

---

## 🌐 10. Language Support

AGRINEXT supports a bilingual interface:

* English
* हिन्दी

The architecture can be extended to additional Indian languages in future versions.

---

# 🛠️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Lucide React
* Recharts

The frontend provides the farmer-facing web interface and communicates with backend services through REST APIs.

---

## Backend

* Node.js
* Express.js
* TypeScript
* JWT Authentication
* bcryptjs
* Helmet
* CORS
* Centralized error handling

The backend manages application logic, authentication, data processing, and communication with external services.

---

## Database

### MongoDB

MongoDB can store application data such as:

* User profiles
* Farm records
* Crop cycles
* Disease analysis records
* Alerts
* Pest information
* Follow-up records

---

# 🔌 External Integrations

AGRINEXT is designed to connect with external data/services where required.

### Weather

**Open-Meteo**

Used for weather and forecast information.

### Agricultural Market Data

Market/mandi data integration can provide:

* Commodity
* Market
* District
* State
* Price-related information

### Vision Analysis

The disease-analysis module provides an interface for connecting a vision-based model/API for crop image analysis.

---

# 📂 Project Structure

```text
farmer-os/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── contexts/
│   │   ├── i18n/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
├── .gitignore
└── package.json
```

---

# 📡 REST API Structure

AGRINEXT follows a REST-based backend architecture.

| Method | Endpoint                | Purpose                      |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/api/health`           | Check backend/service status |
| POST   | `/api/auth/register`    | Register user                |
| POST   | `/api/auth/login`       | User authentication          |
| GET    | `/api/auth/me`          | Get authenticated user       |
| GET    | `/api/farms`            | Get farm records             |
| POST   | `/api/farms`            | Create farm                  |
| GET    | `/api/farms/:id`        | Get farm details             |
| PUT    | `/api/farms/:id`        | Update farm                  |
| DELETE | `/api/farms/:id`        | Delete farm                  |
| GET    | `/api/crops`            | Get crop records             |
| POST   | `/api/crops`            | Create crop cycle            |
| PUT    | `/api/crops/:id/status` | Update crop status           |
| POST   | `/api/diseases/detect`  | Analyze crop image           |
| GET    | `/api/diseases`         | Disease information          |
| GET    | `/api/pests`            | Pest information             |
| GET    | `/api/weather`          | Current weather              |
| GET    | `/api/weather/forecast` | Weather forecast             |
| GET    | `/api/alerts`           | Farm alerts                  |
| PUT    | `/api/alerts/:id/read`  | Mark alert as read           |

---

# ⚙️ Environment Configuration

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> Production secrets and API keys should be stored in environment variables and should never be committed to GitHub.

---

# 🚀 Local Setup

### 1. Install Dependencies

```bash
npm run install:all
```

Or separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create:

```text
frontend/.env
backend/.env
```

and configure the required values.

### 3. Start Backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 4. Start Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔐 Security

AGRINEXT follows basic application-security practices:

* JWT-based authentication
* Password hashing using bcryptjs
* Environment-based secret management
* CORS configuration
* Helmet security headers
* Backend-side API credentials
* Centralized error handling
* Input validation where required

Sensitive credentials such as database passwords, JWT secrets, and API keys should remain on the backend.

---

# 🧠 Future Development

The current architecture can be extended with:

* Custom crop-disease CV models
* TensorFlow / PyTorch / ONNX model integration
* Offline/low-connectivity support
* More Indian languages
* Expert consultation workflow
* Farm-level risk prediction
* IoT soil sensors
* Drone-based crop monitoring
* Satellite imagery
* Advanced crop yield analytics
* More agricultural market integrations

---

# 🌱 Vision

AGRINEXT aims to bring important agricultural information into one accessible platform:

```text
             FARMER
                │
       ┌────────┼────────┐
       ▼        ▼        ▼
     FARM     CROP    WEATHER
       │        │        │
       └────────┼────────┘
                ▼
       DISEASE + PEST
                │
                ▼
        EARLY WARNINGS
                │
                ▼
       MARKET INFORMATION
                │
                ▼
        BETTER DECISIONS
```

**AGRINEXT — AI-Powered Intelligence for Every Farm**

