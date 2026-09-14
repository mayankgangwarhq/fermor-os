# AGRINEXT — API & Data Source Architecture & Integration Map

This document serves as the official, completely transparent registry of all external APIs, meteorological feeds, government datasets, and AI vision services integrated into the **AGRINEXT** platform.

---

## 🗺️ API Integration Summary Table

| Module | Provider / Agency | Official API / Portal URL | Public REST API | Key Required | ENV Variable | Backend Service File | Frontend Page | Live Status |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- | :---: |
| **Weather & Microclimate** | Open-Meteo | [https://api.open-meteo.com/v1/forecast](https://api.open-meteo.com/v1/forecast) | **YES** | **No** | `NONE` (Keyless) | [`openMeteo.service.ts`](file:///c:/Users/Manyank%20Gangwar/Downloads/fermor-os-main/backend/src/services/weather/openMeteo.service.ts) | `WeatherPage.tsx` | **CONNECTED — KEYLESS PUBLIC API** |
| **Mandi Rates** | Data.gov.in (Agmarknet / Ministry of Agriculture) | [https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070](https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070) | **YES** | **Yes** | `DATA_GOV_API_KEY` | [`dataGovMandi.service.ts`](file:///c:/Users/Manyank%20Gangwar/Downloads/fermor-os-main/backend/src/services/mandi/dataGovMandi.service.ts) | `MandiPage.tsx` | **CONNECTED — DATA.GOV.IN API** |
| **PM-KISAN Scheme** | Ministry of Agriculture & Farmers Welfare, GoI | [https://pmkisan.gov.in/](https://pmkisan.gov.in/) | **NO** | **No** | `NONE` (Verified DB) | [`pmKisan.service.ts`](file:///c:/Users/Manyank%20Gangwar/Downloads/fermor-os-main/backend/src/services/schemes/pmKisan.service.ts) | `SchemesPage.tsx` | **OFFICIAL SOURCE — API NOT VERIFIED** |
| **PMFBY Crop Insurance** | Ministry of Agriculture & Farmers Welfare / AIC | [https://pmfby.gov.in/](https://pmfby.gov.in/) | **NO** | **No** | `NONE` (Verified DB) | [`pmfby.service.ts`](file:///c:/Users/Manyank%20Gangwar/Downloads/fermor-os-main/backend/src/services/schemes/pmfby.service.ts) | `SchemesPage.tsx` | **OFFICIAL SOURCE ADAPTER** |
| **Kisan Credit Card (KCC)** | NABARD / Dept of Financial Services / RBI | [https://www.myscheme.gov.in/schemes/kcc](https://www.myscheme.gov.in/schemes/kcc) | **NO** | **No** | `NONE` (Verified DB) | [`kcc.service.ts`](file:///c:/Users/Manyank%20Gangwar/Downloads/fermor-os-main/backend/src/services/schemes/kcc.service.ts) | `SchemesPage.tsx` | **OFFICIAL SOURCE ADAPTER** |
| **Rajasthan State Schemes** | Department of Agriculture, Govt of Rajasthan | [https://kisan.rajasthan.gov.in/](https://kisan.rajasthan.gov.in/) | **NO** | **No** | `NONE` (Verified DB) | [`rajasthanSchemes.service.ts`](file:///c:/Users/Manyank%20Gangwar/Downloads/fermor-os-main/backend/src/services/schemes/rajasthanSchemes.service.ts) | `SchemesPage.tsx` | **OFFICIAL SOURCE ADAPTER** |
| **Crop Disease Scanner** | Google AI (Gemini Multimodal API) | [https://generativelanguage.googleapis.com/v1beta/models](https://generativelanguage.googleapis.com/v1beta/models) | **YES** | **Yes** | `GEMINI_API_KEY` | [`cropDiseaseVision.service.ts`](file:///c:/Users/Manyank%20Gangwar/Downloads/fermor-os-main/backend/src/services/cropDiseaseVision.service.ts) | `DiseaseScannerPage.tsx` | **CONNECTED — GEMINI VISION AI** |

---

## 🔍 Module-by-Module Technical Architecture

### 1. 🌦️ Weather & Microclimate Module
- **Official Provider**: [Open-Meteo](https://open-meteo.com)
- **Official Base URL**: [https://api.open-meteo.com/v1/forecast](https://api.open-meteo.com/v1/forecast)
- **Status**: **CONNECTED — KEYLESS PUBLIC API**
- **Authentication**: `NONE` (Public, keyless meteorological API)
- **Backend Service**: `backend/src/services/weather/openMeteo.service.ts`
- **Backend REST Endpoint**: `GET /api/weather?lat=<lat>&lon=<lon>&district=<district>&state=<state>`
- **Frontend Page**: `frontend/src/pages/WeatherPage.tsx`
- **Key Parameters**:
  - `current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,surface_pressure`
  - `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max`
- **Agronomic Output**: Real temperature, relative humidity, wind speed, rain probability %, expected precipitation mm, and dynamic alerts for spray windows and disease risk.

---

### 2. 🌾 Mandi Rates & Market Intelligence Module
- **Official Provider**: [Data.gov.in (Agmarknet)](https://api.data.gov.in)
- **Official Resource URL**: [https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070](https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070)
- **Status**: **CONNECTED — DATA.GOV.IN API**
- **Authentication**: `API_KEY`
- **Environment Variable**: `DATA_GOV_API_KEY` in `backend/.env`
- **Backend Service**: `backend/src/services/mandi/dataGovMandi.service.ts`
- **Backend REST Endpoint**: `GET /api/mandi?state=<State>&commodity=<Commodity>&district=<District>`
- **Frontend Page**: `frontend/src/pages/MandiPage.tsx`
- **Data Returned**: Official APMC daily arrivals, min price, max price, modal price (₹/quintal), and arrival dates.

---

### 3. 🏛️ Government Schemes Modules
> [!NOTE]
> Government welfare schemes like PM-KISAN, PMFBY, KCC, and RajKisan Sathi do not operate public unrestricted REST APIs. AGRINEXT maintains dedicated, officially verified database scheme adapters for each program to ensure accurate policy criteria and eliminate simulated endpoints.

#### A. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)
- **Official Portal**: [https://pmkisan.gov.in/](https://pmkisan.gov.in/)
- **Data.gov.in Catalog**: [https://data.gov.in/catalog/pm-kisan-scheme](https://data.gov.in/catalog/pm-kisan-scheme)
- **Official Resource URL**: [https://api.data.gov.in/resource/388208c6-d82a-4190-90df-91aa2c326fec](https://api.data.gov.in/resource/388208c6-d82a-4190-90df-91aa2c326fec)
- **DBT Gateway**: [https://pfms.nic.in](https://pfms.nic.in)
- **Status**: **CONNECTED — DATA.GOV.IN API**
- **Public API Available**: `YES` (Resource ID: `388208c6-d82a-4190-90df-91aa2c326fec` — Village and Gender-wise Beneficiaries Count under PM-KISAN)
- **Authentication**: `API_KEY` (`DATA_GOV_API_KEY` in `backend/.env`)
- **Backend Service**: `backend/src/services/schemes/pmKisan.service.ts`
- **Backend REST Endpoint**: `GET /api/schemes/pm-kisan`
- **Frontend Page**: `frontend/src/pages/SchemesPage.tsx`
- **Scope**: Direct income benefit of ₹6,000/year (3 installments of ₹2,000) for landholding farmers, with live village/gender-wise beneficiary distributions from Data.gov.in.

#### B. PMFBY (Pradhan Mantri Fasal Bima Yojana)
- **Official Portal**: [https://pmfby.gov.in/](https://pmfby.gov.in/)
- **Status**: **OFFICIAL SOURCE ADAPTER** (Official Source — No Public API Verified)
- **Public API Available**: `NO`
- **Backend Service**: `backend/src/services/schemes/pmfby.service.ts`
- **Scope**: Crop damage insurance covering natural calamities with 1.5% - 2.0% nominal premium.

#### C. KCC (Kisan Credit Card Scheme)
- **Official Portal**: [https://www.myscheme.gov.in/schemes/kcc](https://www.myscheme.gov.in/schemes/kcc)
- **Status**: **OFFICIAL SOURCE ADAPTER** (Official Source — No Public API Verified)
- **Public API Available**: `NO`
- **Backend Service**: `backend/src/services/schemes/kcc.service.ts`
- **Scope**: Concessional institutional credit up to ₹3,00,000 at 4% effective interest rate.

#### D. Rajasthan State Schemes (RajKisan Sathi)
- **Official Portal**: [https://kisan.rajasthan.gov.in/](https://kisan.rajasthan.gov.in/)
- **Status**: **OFFICIAL SOURCE ADAPTER** (Official Source — No Public API Verified)
- **Public API Available**: `NO`
- **Backend Service**: `backend/src/services/schemes/rajasthanSchemes.service.ts`
- **Scope**: Subsidies for Solar Pumps (PM-KUSUM Component B), Farm Ponds (Khet Talai), and Drip Irrigation.

---

### 4. 🦠 Crop Disease Scanner & Computer Vision AI
- **Official Provider**: [Google AI](https://ai.google.dev)
- **Official Base URL**: [https://generativelanguage.googleapis.com/v1beta/models](https://generativelanguage.googleapis.com/v1beta/models)
- **Status**: **CONNECTED — GEMINI VISION AI**
- **Model**: `gemini-1.5-flash` / `gemini-2.0-flash`
- **Authentication**: `API_KEY`
- **Environment Variable**: `GEMINI_API_KEY` in `backend/.env`
- **Backend Service**: `backend/src/services/cropDiseaseVision.service.ts`
- **Backend REST Endpoint**: `POST /api/diagnosis/scan`
- **Frontend Page**: `frontend/src/pages/DiseaseScannerPage.tsx`
- **Scope**: Leaf lesion analysis, pathogen categorization (fungal, bacterial, viral, pest), and organic/chemical curative treatment.

---

## 🔒 Security & Privacy Standard
- **Zero Secret Exposure**: The `GET /api/integrations` endpoint and UI return only metadata and boolean flags (`apiKeyConfigured: true`). Secret keys are never serialized in responses.
- **Single-Source Data Isolation**: No module silently proxies or reuses another module's credentials.
