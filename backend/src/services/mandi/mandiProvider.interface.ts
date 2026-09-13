export interface MandiFilter {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  grade?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface MandiRecord {
  id: string;
  commodity: string;
  variety: string;
  grade: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceUnit: string;
  date: string;
  trend?: 'up' | 'down' | 'stable';
  priceChangePercent?: number;
  arrivalTonnes?: number;
  sourceStatus: 'DEMO DATA' | 'LIVE DATA';
  isDemo: boolean;
  notes?: string;
}

export interface MandiFilterOptions {
  states: string[];
  districts: Record<string, string[]>;
  markets: Record<string, string[]>;
  commodities: string[];
  varieties: Record<string, string[]>;
  grades: string[];
}

export interface MandiResponse {
  success: boolean;
  provider: 'DEMO / MOCK' | 'DATA_GOV_IN';
  governmentApiConnected: boolean;
  isDemo: boolean;
  disclaimer: string;
  total: number;
  records: MandiRecord[];
}

export interface IMandiProvider {
  name: string;
  isDemo: boolean;
  isGovernmentApiConnected: boolean;
  getMandiRates(filters?: MandiFilter): Promise<MandiResponse>;
  getMandiRateById(id: string): Promise<MandiRecord | null>;
  getFilterOptions(): Promise<MandiFilterOptions>;
}
