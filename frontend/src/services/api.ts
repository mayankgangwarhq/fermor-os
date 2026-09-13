import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {
  Farm,
  CropCycle,
  CropStatus,
  WeatherData,
  DiagnosticResult,
  Alert,
  AlertSeverity,
  AlertType,
  PestData,
  DiseaseData,
  DiagnosticCase,
  ExpertReviewPayload,
  MandiPrice,
  MandiFilterOptions,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('farmer_os_token') || localStorage.getItem('agrinext_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract data payload or handle auth expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('[API Client] Unauthorized request - 401');
    }
    return Promise.reject(error);
  }
);

// --- Domain API Services ---

export const healthApi = {
  check: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },
};

export const authApi = {
  register: async (payload: { name: string; email: string; password: string; role?: string; phone?: string }) => {
    const res = await apiClient.post('/auth/register', payload);
    return res.data;
  },
  login: async (emailOrPhone: string, password?: string, role: string = 'farmer') => {
    const res = await apiClient.post('/auth/login', { emailOrPhone, password, role });
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};

export const farmApi = {
  getAll: async (farmerId?: string): Promise<Farm[]> => {
    const params = farmerId ? { farmerId } : {};
    const res = await apiClient.get('/farms', { params });
    return res.data?.data || [];
  },
  getById: async (id: string): Promise<Farm> => {
    const res = await apiClient.get(`/farms/${id}`);
    return res.data?.data;
  },
  create: async (farmData: Partial<Farm>): Promise<Farm> => {
    const res = await apiClient.post('/farms', farmData);
    return res.data?.data;
  },
  update: async (id: string, farmData: Partial<Farm>): Promise<Farm> => {
    const res = await apiClient.put(`/farms/${id}`, farmData);
    return res.data?.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/farms/${id}`);
  },
};

export const cropApi = {
  getAll: async (filter?: { farmId?: string; status?: CropStatus }): Promise<CropCycle[]> => {
    const res = await apiClient.get('/crops', { params: filter });
    return res.data?.data || [];
  },
  getById: async (id: string): Promise<CropCycle> => {
    const res = await apiClient.get(`/crops/${id}`);
    return res.data?.data;
  },
  create: async (cropData: Partial<CropCycle>): Promise<CropCycle> => {
    const res = await apiClient.post('/crops', cropData);
    return res.data?.data;
  },
  update: async (id: string, cropData: Partial<CropCycle>): Promise<CropCycle> => {
    const res = await apiClient.put(`/crops/${id}`, cropData);
    return res.data?.data;
  },
  updateStatus: async (id: string, status: CropStatus): Promise<CropCycle> => {
    const res = await apiClient.put(`/crops/${id}/status`, { status });
    return res.data?.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/crops/${id}`);
  },
};

export const diseaseApi = {
  getAll: async (crop?: string): Promise<DiseaseData[]> => {
    const res = await apiClient.get('/diseases', { params: { crop } });
    return res.data?.data || [];
  },
  getById: async (id: string): Promise<DiseaseData> => {
    const res = await apiClient.get(`/diseases/${id}`);
    return res.data?.data;
  },
  detect: async (data: { cropName?: string; symptoms?: string[]; notes?: string; imageUrl?: string; imageBase64?: string; language?: string }): Promise<DiagnosticResult> => {
    const res = await apiClient.post('/diseases/detect', data, { timeout: 60000 });
    return res.data?.data;
  },
};

export const pestApi = {
  getAll: async (crop?: string): Promise<PestData[]> => {
    const res = await apiClient.get('/pests', { params: { crop } });
    return res.data?.data || [];
  },
  getById: async (id: string): Promise<PestData> => {
    const res = await apiClient.get(`/pests/${id}`);
    return res.data?.data;
  },
};

export const weatherApi = {
  getWeather: async (params?: { lat?: number; lon?: number; district?: string; state?: string }): Promise<WeatherData> => {
    const res = await apiClient.get('/weather', { params });
    return res.data?.data;
  },
  getForecast: async (params?: { lat?: number; lon?: number; district?: string }) => {
    const res = await apiClient.get('/weather/forecast', { params });
    return res.data?.data;
  },
};

export const alertApi = {
  getAll: async (filter?: { severity?: AlertSeverity; type?: AlertType; unreadOnly?: boolean; farmId?: string }): Promise<Alert[]> => {
    const res = await apiClient.get('/alerts', { params: filter });
    return res.data?.data || [];
  },
  getById: async (id: string): Promise<Alert> => {
    const res = await apiClient.get(`/alerts/${id}`);
    return res.data?.data;
  },
  create: async (alertData: Partial<Alert>): Promise<Alert> => {
    const res = await apiClient.post('/alerts', alertData);
    return res.data?.data;
  },
  markRead: async (id: string): Promise<Alert> => {
    const res = await apiClient.put(`/alerts/${id}/read`);
    return res.data?.data;
  },
  markAllRead: async (): Promise<void> => {
    await apiClient.put('/alerts/read-all');
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/alerts/${id}`);
  },
};

export const sihApi = {
  // Hotspots
  getHotspots: async (filter?: { crop?: string; category?: string; severity?: string; district?: string }) => {
    const res = await apiClient.get('/sih/hotspots', { params: filter });
    return res.data?.data;
  },
  createHotspot: async (data: any) => {
    const res = await apiClient.post('/sih/hotspots', data);
    return res.data?.data;
  },

  // Early Warning
  getEarlyWarning: async (params?: { crop?: string; district?: string; stage?: string; humidity?: number; temp?: number; rainfall?: number }) => {
    const res = await apiClient.get('/sih/early-warning', { params });
    return res.data?.data;
  },

  // Scan Cases
  getScanCases: async () => {
    const res = await apiClient.get('/sih/scan-cases');
    return res.data?.data;
  },
  createScanCase: async (data: any) => {
    const res = await apiClient.post('/sih/scan-cases', data);
    return res.data?.data;
  },

  // Expert Review
  submitExpertReview: async (data: any) => {
    const res = await apiClient.post('/sih/expert-review', data);
    return res.data?.data;
  },

  // Lab Referrals
  getReferrals: async () => {
    const res = await apiClient.get('/sih/referrals');
    return res.data?.data;
  },
  createReferral: async (data: any) => {
    const res = await apiClient.post('/sih/referrals', data);
    return res.data?.data;
  },

  // Follow-ups
  getFollowUps: async () => {
    const res = await apiClient.get('/sih/follow-ups');
    return res.data?.data;
  },
  updateFollowUp: async (data: any) => {
    const res = await apiClient.post('/sih/follow-ups', data);
    return res.data?.data;
  },

  // Field Confirmations
  getFieldConfirmations: async () => {
    const res = await apiClient.get('/sih/field-confirmations');
    return res.data?.data;
  },
  submitFieldConfirmation: async (data: any) => {
    const res = await apiClient.post('/sih/field-confirmations', data);
    return res.data?.data;
  },

  // Pest Observations
  getPestObservations: async () => {
    const res = await apiClient.get('/sih/pest-observations');
    return res.data?.data;
  },
  createPestObservation: async (data: any) => {
    const res = await apiClient.post('/sih/pest-observations', data);
    return res.data?.data;
  },

  // Official Stats
  getOfficialStats: async () => {
    const res = await apiClient.get('/sih/official-stats');
    return res.data?.data;
  },
};

export const diagnosisCaseApi = {
  createCase: async (payload: {
    cropName: string;
    cropStage?: string;
    imageUrl?: string;
    symptoms?: string[];
    initialSymptoms?: string[];
    initialConfidence?: number;
    topPrediction?: string;
    scientificName?: string;
    riskLevel?: string;
    ipmAdvisory?: any;
    notes?: string;
    location?: any;
    farmerId?: string;
    farmerName?: string;
    farmId?: string;
    requestedConfidence?: number;
  }): Promise<DiagnosticCase> => {
    const res = await apiClient.post('/diagnosis/cases', payload);
    return res.data?.data;
  },

  getCases: async (filter?: {
    farmerId?: string;
    status?: string;
    riskLevel?: string;
    cropName?: string;
    expertStatus?: string;
  }): Promise<DiagnosticCase[]> => {
    const res = await apiClient.get('/diagnosis/cases', { params: filter });
    return res.data?.data || [];
  },

  getCaseById: async (id: string): Promise<DiagnosticCase> => {
    const res = await apiClient.get(`/diagnosis/cases/${id}`);
    return res.data?.data;
  },

  submitClarification: async (
    caseId: string,
    answers: Record<string, string>
  ): Promise<DiagnosticCase> => {
    const res = await apiClient.post(`/diagnosis/cases/${caseId}/clarify`, { answers });
    return res.data?.data;
  },

  requestExpert: async (caseId: string, notes?: string): Promise<DiagnosticCase> => {
    const res = await apiClient.post(`/diagnosis/cases/${caseId}/request-expert`, { notes });
    return res.data?.data;
  },

  submitExpertReview: async (
    caseId: string,
    payload: ExpertReviewPayload
  ): Promise<DiagnosticCase> => {
    const res = await apiClient.post(`/diagnosis/cases/${caseId}/expert-review`, payload);
    return res.data?.data;
  },
};

export const mandiApi = {
  getPrices: async (params?: {
    commodity?: string;
    state?: string;
    district?: string;
    market?: string;
    variety?: string;
    grade?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    records: MandiPrice[];
    provider: string;
    governmentApiConnected: boolean;
    isDemo: boolean;
    disclaimer: string;
    total: number;
  }> => {
    try {
      const res = await apiClient.get('/mandi', { params });
      const data = res.data?.data;
      if (data && Array.isArray(data.records)) {
        const normalized = data.records.map((r: any) => ({
          ...r,
          mandi: r.mandi || r.market || 'APMC Mandi',
          market: r.market || r.mandi || 'APMC Mandi',
          unit: r.unit || r.priceUnit || '₹/quintal',
          changePercent: r.changePercent ?? r.priceChangePercent ?? 0,
        }));
        return {
          records: normalized,
          provider: data.provider || 'DEMO / MOCK',
          governmentApiConnected: Boolean(data.governmentApiConnected),
          isDemo: data.isDemo !== false,
          disclaimer: data.disclaimer || 'Demo Data — Government API not connected',
          total: data.total ?? normalized.length,
        };
      }
      // Direct array fallback
      if (Array.isArray(data)) {
        const normalized = data.map((r: any) => ({
          ...r,
          mandi: r.mandi || r.market || 'APMC Mandi',
          market: r.market || r.mandi || 'APMC Mandi',
          unit: r.unit || r.priceUnit || '₹/quintal',
          changePercent: r.changePercent ?? r.priceChangePercent ?? 0,
        }));
        return {
          records: normalized,
          provider: 'DEMO / MOCK',
          governmentApiConnected: false,
          isDemo: true,
          disclaimer: 'Demo Data — Government API not connected',
          total: normalized.length,
        };
      }
      return {
        records: [],
        provider: 'DEMO / MOCK',
        governmentApiConnected: false,
        isDemo: true,
        disclaimer: 'Demo Data — Government API not connected',
        total: 0,
      };
    } catch {
      return {
        records: [],
        provider: 'DEMO / MOCK',
        governmentApiConnected: false,
        isDemo: true,
        disclaimer: 'Demo Data — Government API not connected',
        total: 0,
      };
    }
  },
  getFilterOptions: async (): Promise<MandiFilterOptions | null> => {
    try {
      const res = await apiClient.get('/mandi/filter-options');
      return res.data?.data || null;
    } catch {
      return null;
    }
  },
  getTrends: async (commodity?: string) => {
    const res = await apiClient.get('/mandi/trends', { params: { commodity } });
    return res.data?.data || [];
  },
  getById: async (id: string): Promise<MandiPrice | null> => {
    const res = await apiClient.get(`/mandi/${id}`);
    const item = res.data?.data;
    if (item) {
      return {
        ...item,
        mandi: item.mandi || item.market || 'APMC Mandi',
        market: item.market || item.mandi || 'APMC Mandi',
        unit: item.unit || item.priceUnit || '₹/quintal',
        changePercent: item.changePercent ?? item.priceChangePercent ?? 0,
      };
    }
    return null;
  },
};

export const schemeApi = {
  getAll: async (params?: { category?: string; state?: string; search?: string }) => {
    const res = await apiClient.get('/schemes', { params });
    return res.data?.data || [];
  },
  getById: async (id: string) => {
    const res = await apiClient.get(`/schemes/${id}`);
    return res.data?.data;
  },
};

export const dashboardApi = {
  getFarmerStats: async (farmerId?: string) => {
    const res = await apiClient.get('/dashboard/farmer', { params: { farmerId } });
    return res.data?.data;
  },
  getOfficerStats: async () => {
    const res = await apiClient.get('/dashboard/officer');
    return res.data?.data;
  },
};

export const assistantApi = {
  query: async (payload: {
    query: string;
    language?: string;
    farmContext?: any;
    conversationHistory?: any[];
    imageBase64?: string;
  }) => {
    const res = await apiClient.post('/assistant/query', payload);
    return res.data?.data;
  },
};

export default apiClient;


