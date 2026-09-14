import { config } from './env';

export interface ApiIntegrationEntry {
  id: string;
  name: string;
  module: string;
  provider: string;
  officialBaseUrl: string;
  officialDocumentationUrl?: string;
  publicApiAvailable: boolean;
  authentication: 'NONE' | 'API_KEY' | 'OAUTH2' | 'OFFICIAL_PORTAL_SOURCE';
  envKey: string;
  backendService: string;
  backendEndpoint: string;
  frontendPage: string;
  description: string;
  notes?: string;
}

export const API_REGISTRY: Record<string, ApiIntegrationEntry> = {
  weather: {
    id: 'weather',
    name: 'Open-Meteo Weather Forecast API',
    module: 'Weather Advisory & Microclimate',
    provider: 'Open-Meteo',
    officialBaseUrl: 'https://api.open-meteo.com/v1/forecast',
    officialDocumentationUrl: 'https://open-meteo.com/en/docs',
    publicApiAvailable: true,
    authentication: 'NONE',
    envKey: 'NONE (Keyless Public API)',
    backendService: 'src/services/weather/openMeteo.service.ts',
    backendEndpoint: '/api/weather',
    frontendPage: 'WeatherPage.tsx',
    description: 'High-resolution global weather forecast using WMO weather interpretation codes, hourly & daily agricultural parameters.',
  },

  mandi: {
    id: 'mandi',
    name: 'Data.gov.in Agmarknet Mandi Commodity Arrivals API',
    module: 'Mandi Rates & Market Intelligence',
    provider: 'Data.gov.in (Ministry of Agriculture & Farmers Welfare)',
    officialBaseUrl: 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
    officialDocumentationUrl: 'https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi',
    publicApiAvailable: true,
    authentication: 'API_KEY',
    envKey: 'DATA_GOV_API_KEY',
    backendService: 'src/services/mandi/dataGovMandi.service.ts',
    backendEndpoint: '/api/mandi',
    frontendPage: 'MandiPage.tsx',
    description: 'Real-time daily modal, minimum, and maximum prices for agricultural commodities across APMC mandis in India.',
  },

  pmKisan: {
    id: 'pmKisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    module: 'Government Schemes',
    provider: 'Data.gov.in / Ministry of Agriculture & Farmers Welfare, Govt of India',
    officialBaseUrl: 'https://api.data.gov.in/resource/388208c6-d82a-4190-90df-91aa2c326fec',
    officialDocumentationUrl: 'https://data.gov.in/catalog/pm-kisan-scheme',
    publicApiAvailable: true,
    authentication: 'API_KEY',
    envKey: 'DATA_GOV_API_KEY',
    backendService: 'src/services/schemes/pmKisan.service.ts',
    backendEndpoint: '/api/schemes/pm-kisan',
    frontendPage: 'SchemesPage.tsx',
    description: 'Direct income support of ₹6,000/year to landholding farmer families via DBT. Live statistics queried from official Data.gov.in machine-readable API.',
    notes: 'Resource ID 388208c6-d82a-4190-90df-91aa2c326fec: Village and Gender-wise Beneficiaries Count under PM-KISAN Scheme.',
  },

  pmfby: {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    module: 'Government Schemes',
    provider: 'Ministry of Agriculture & Farmers Welfare / AIC of India',
    officialBaseUrl: 'https://pmfby.gov.in',
    officialDocumentationUrl: 'https://pmfby.gov.in/guidelines',
    publicApiAvailable: false,
    authentication: 'OFFICIAL_PORTAL_SOURCE',
    envKey: 'NONE (Verified Government Scheme Database)',
    backendService: 'src/services/schemes/pmfby.service.ts',
    backendEndpoint: '/api/schemes/pmfby',
    frontendPage: 'SchemesPage.tsx',
    description: 'Comprehensive crop insurance against non-preventable natural risks with uniform 1.5% - 2% premium rates.',
    notes: 'Official public REST API is not exposed for direct query; verified database scheme profile is maintained.',
  },

  kcc: {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    module: 'Government Schemes & Agri Finance',
    provider: 'NABARD / Ministry of Finance / RBI',
    officialBaseUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    officialDocumentationUrl: 'https://www.nabard.org/content.aspx?id=594',
    publicApiAvailable: false,
    authentication: 'OFFICIAL_PORTAL_SOURCE',
    envKey: 'NONE (Verified Government Scheme Database)',
    backendService: 'src/services/schemes/kcc.service.ts',
    backendEndpoint: '/api/schemes/kcc',
    frontendPage: 'SchemesPage.tsx',
    description: 'Concessional institutional short-term credit for crop cultivation at 4% effective interest rate with prompt repayment incentive.',
    notes: 'Official public REST API is not exposed for direct query; verified database scheme profile is maintained.',
  },

  rajasthanSchemes: {
    id: 'rajasthanSchemes',
    name: 'RajKisan Sathi / Rajasthan State Agricultural Schemes',
    module: 'Government Schemes (State Specific)',
    provider: 'Department of Agriculture, Govt of Rajasthan',
    officialBaseUrl: 'https://kisan.rajasthan.gov.in',
    officialDocumentationUrl: 'https://rajkisan.rajasthan.gov.in/Rajkisanweb',
    publicApiAvailable: false,
    authentication: 'OFFICIAL_PORTAL_SOURCE',
    envKey: 'NONE (Verified State Scheme Database)',
    backendService: 'src/services/schemes/rajasthanSchemes.service.ts',
    backendEndpoint: '/api/schemes/rajasthan',
    frontendPage: 'SchemesPage.tsx',
    description: 'Subsidies on farm ponds, solar pumps (PM-KUSUM Component B), drip irrigation, and micro-nutrients in Rajasthan.',
    notes: 'State portal uses SSO authentication for applications; scheme definitions served from verified state dataset.',
  },

  cropDiseaseAi: {
    id: 'cropDiseaseAi',
    name: 'Google Gemini Vision AI Crop Disease Diagnostic Engine',
    module: 'Crop Disease Scanner & Diagnostics',
    provider: 'Google AI (Gemini Multimodal API)',
    officialBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    officialDocumentationUrl: 'https://ai.google.dev/docs/gemini_api',
    publicApiAvailable: true,
    authentication: 'API_KEY',
    envKey: 'GEMINI_API_KEY (or CROP_DISEASE_API_KEY)',
    backendService: 'src/services/cropDiseaseVision.service.ts',
    backendEndpoint: '/api/diagnosis/scan',
    frontendPage: 'DiseaseScannerPage.tsx',
    description: 'Multimodal computer vision model analyzing crop leaf symptoms, pathogen patterns, and agronomic management.',
  },
};

/**
 * Generates a SAFE status report of all integrations without exposing any secrets or keys.
 */
export const getSafeIntegrationsStatus = () => {
  const isDataGovConfigured = Boolean(config.dataGovApiKey && config.dataGovApiKey.trim().length > 0);
  const isGeminiConfigured = Boolean(config.geminiApiKey && config.geminiApiKey.trim().length > 0);

  return {
    weather: {
      provider: API_REGISTRY.weather.provider,
      module: API_REGISTRY.weather.module,
      status: 'CONNECTED',
      authentication: 'NONE',
      apiKeyRequired: false,
      apiKeyConfigured: true,
      officialBaseUrl: API_REGISTRY.weather.officialBaseUrl,
      backendService: API_REGISTRY.weather.backendService,
      backendEndpoint: API_REGISTRY.weather.backendEndpoint,
      frontendPage: API_REGISTRY.weather.frontendPage,
    },
    mandi: {
      provider: API_REGISTRY.mandi.provider,
      module: API_REGISTRY.mandi.module,
      status: isDataGovConfigured ? 'CONNECTED' : 'FALLBACK_DEMO_MODE',
      authentication: 'API_KEY',
      apiKeyRequired: true,
      apiKeyConfigured: isDataGovConfigured,
      officialBaseUrl: API_REGISTRY.mandi.officialBaseUrl,
      backendService: API_REGISTRY.mandi.backendService,
      backendEndpoint: API_REGISTRY.mandi.backendEndpoint,
      frontendPage: API_REGISTRY.mandi.frontendPage,
    },
    schemes: {
      pmKisan: {
        provider: API_REGISTRY.pmKisan.provider,
        module: API_REGISTRY.pmKisan.module,
        status: isDataGovConfigured ? 'CONNECTED' : 'STANDBY_API_KEY_REQUIRED',
        publicApiAvailable: true,
        authentication: 'API_KEY',
        apiKeyRequired: true,
        apiKeyConfigured: isDataGovConfigured,
        officialBaseUrl: API_REGISTRY.pmKisan.officialBaseUrl,
        officialDocumentationUrl: API_REGISTRY.pmKisan.officialDocumentationUrl,
        backendService: API_REGISTRY.pmKisan.backendService,
      },
      pmfby: {
        provider: API_REGISTRY.pmfby.provider,
        module: API_REGISTRY.pmfby.module,
        status: 'OFFICIAL_SOURCE_ACTIVE',
        publicApiAvailable: false,
        authentication: 'OFFICIAL_PORTAL_SOURCE',
        officialBaseUrl: API_REGISTRY.pmfby.officialBaseUrl,
        backendService: API_REGISTRY.pmfby.backendService,
      },
      kcc: {
        provider: API_REGISTRY.kcc.provider,
        module: API_REGISTRY.kcc.module,
        status: 'OFFICIAL_SOURCE_ACTIVE',
        publicApiAvailable: false,
        authentication: 'OFFICIAL_PORTAL_SOURCE',
        officialBaseUrl: API_REGISTRY.kcc.officialBaseUrl,
        backendService: API_REGISTRY.kcc.backendService,
      },
      rajasthanSchemes: {
        provider: API_REGISTRY.rajasthanSchemes.provider,
        module: API_REGISTRY.rajasthanSchemes.module,
        status: 'OFFICIAL_SOURCE_ACTIVE',
        publicApiAvailable: false,
        authentication: 'OFFICIAL_PORTAL_SOURCE',
        officialBaseUrl: API_REGISTRY.rajasthanSchemes.officialBaseUrl,
        backendService: API_REGISTRY.rajasthanSchemes.backendService,
      },
    },
    ai: {
      cropDiseaseScanner: {
        provider: API_REGISTRY.cropDiseaseAi.provider,
        module: API_REGISTRY.cropDiseaseAi.module,
        status: isGeminiConfigured ? 'CONNECTED' : 'STANDBY',
        authentication: 'API_KEY',
        apiKeyRequired: true,
        apiKeyConfigured: isGeminiConfigured,
        officialBaseUrl: API_REGISTRY.cropDiseaseAi.officialBaseUrl,
        backendService: API_REGISTRY.cropDiseaseAi.backendService,
      },
    },
    meta: {
      generatedAt: new Date().toISOString(),
      architectureVersion: '2.0.0',
      totalIntegrations: Object.keys(API_REGISTRY).length,
    },
  };
};
