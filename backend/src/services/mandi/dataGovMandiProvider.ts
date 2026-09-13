import { config } from '../../config/env';
import { logger } from '../../utils/logger';
import {
  IMandiProvider,
  MandiFilter,
  MandiFilterOptions,
  MandiRecord,
  MandiResponse,
} from './mandiProvider.interface';

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

export class DataGovMandiProvider implements IMandiProvider {
  public readonly name = 'DATA_GOV_IN';
  public readonly isDemo = false;

  private customApiKey?: string;

  constructor(apiKey?: string) {
    this.customApiKey = apiKey;
  }

  /**
   * Retrieves the configured API key at call time.
   */
  private getApiKey(): string {
    return (
      this.customApiKey ||
      process.env.DATA_GOV_API_KEY ||
      config.dataGovApiKey ||
      ''
    ).trim();
  }

  public get isGovernmentApiConnected(): boolean {
    const key = this.getApiKey();
    return key.length > 0;
  }

  /**
   * Fetches official daily government mandi rates from Data.gov.in (OGD India / Agmarknet).
   */
  public async getMandiRates(filters?: MandiFilter): Promise<MandiResponse> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      logger.warn('[DataGovMandiProvider] DATA_GOV_API_KEY is missing in backend/.env');
      return {
        success: false,
        provider: 'DATA_GOV_IN',
        governmentApiConnected: false,
        isDemo: false,
        disclaimer: 'Demo Data — Government API not connected (DATA_GOV_API_KEY missing in backend/.env)',
        total: 0,
        records: [],
      };
    }

    try {
      const url = new URL(BASE_URL);
      url.searchParams.append('api-key', apiKey);
      url.searchParams.append('format', 'json');

      // Enforce safe record limit (default 50, max 100 per request)
      const safeLimit = Math.min(Math.max(Number(filters?.limit) || 50, 1), 100);
      url.searchParams.append('limit', String(safeLimit));

      if (filters?.offset) {
        url.searchParams.append('offset', String(filters.offset));
      }

      // Apply required Data.gov.in filter parameters
      if (filters?.state && filters.state !== 'All') {
        url.searchParams.append('filters[state.keyword]', filters.state.trim());
      }
      if (filters?.district && filters.district !== 'All') {
        url.searchParams.append('filters[district]', filters.district.trim());
      }
      if (filters?.market && filters.market !== 'All') {
        url.searchParams.append('filters[market]', filters.market.trim());
      }
      if (filters?.commodity && filters.commodity !== 'All') {
        url.searchParams.append('filters[commodity]', filters.commodity.trim());
      }
      if (filters?.variety && filters.variety !== 'All') {
        url.searchParams.append('filters[variety]', filters.variety.trim());
      }
      if (filters?.grade && filters.grade !== 'All') {
        url.searchParams.append('filters[grade]', filters.grade.trim());
      }

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'AGRINEXT-Agritech-Platform/1.0',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10s safe timeout
      });

      // Handle HTTP status codes
      if (response.status === 400) {
        logger.error('[DataGovMandiProvider] Data.gov.in returned HTTP 400 Bad Request (invalid parameter or query format)');
        return {
          success: false,
          provider: 'DATA_GOV_IN',
          governmentApiConnected: true,
          isDemo: false,
          disclaimer: 'Data.gov.in API error: HTTP 400 Bad Request. Check filter parameters.',
          total: 0,
          records: [],
        };
      }

      if (response.status === 401 || response.status === 403) {
        logger.error('[DataGovMandiProvider] Data.gov.in returned HTTP 403/401 (Invalid, unauthorized, or inactive API key)');
        return {
          success: false,
          provider: 'DATA_GOV_IN',
          governmentApiConnected: true,
          isDemo: false,
          disclaimer: 'Data.gov.in authentication failed: Invalid or inactive DATA_GOV_API_KEY.',
          total: 0,
          records: [],
        };
      }

      if (response.status === 429) {
        logger.warn('[DataGovMandiProvider] Data.gov.in returned HTTP 429 (Rate limit exceeded)');
        return {
          success: false,
          provider: 'DATA_GOV_IN',
          governmentApiConnected: true,
          isDemo: false,
          disclaimer: 'Data.gov.in rate limit exceeded. Please try again in a few minutes.',
          total: 0,
          records: [],
        };
      }

      if (!response.ok) {
        logger.error(`[DataGovMandiProvider] Data.gov.in returned unexpected HTTP status: ${response.status} ${response.statusText}`);
        return {
          success: false,
          provider: 'DATA_GOV_IN',
          governmentApiConnected: true,
          isDemo: false,
          disclaimer: `Government Data.gov.in service returned HTTP ${response.status} (${response.statusText}).`,
          total: 0,
          records: [],
        };
      }

      let data: any;
      try {
        data = await response.json();
      } catch (parseErr: any) {
        logger.error('[DataGovMandiProvider] Failed to parse Data.gov.in JSON response');
        return {
          success: false,
          provider: 'DATA_GOV_IN',
          governmentApiConnected: true,
          isDemo: false,
          disclaimer: 'Malformed response received from Data.gov.in endpoint.',
          total: 0,
          records: [],
        };
      }

      const rawRecords: any[] = Array.isArray(data?.records) ? data.records : [];

      // Map official government Agmarknet record structure to standard AGRINEXT format
      const records: MandiRecord[] = rawRecords.map((r, index) => {
        const minPrice = parseFloat(String(r.min_price || '0')) || 0;
        const maxPrice = parseFloat(String(r.max_price || '0')) || 0;
        const modalPrice = parseFloat(String(r.modal_price || '0')) || minPrice || maxPrice || 0;

        const dateStr = r.arrival_date || r.date || new Date().toISOString().split('T')[0];

        return {
          id: `gov-mandi-${(r.state || 'st')}-${(r.market || 'mkt')}-${(r.commodity || 'cmd')}-${index}`
            .replace(/[^a-zA-Z0-9-]/g, '-')
            .toLowerCase(),
          commodity: (r.commodity || 'Unknown Commodity').trim(),
          variety: (r.variety || 'Standard Variety').trim(),
          grade: (r.grade || 'FAQ').trim(),
          market: (r.market || 'APMC Market').trim(),
          district: (r.district || 'District').trim(),
          state: (r.state || 'State').trim(),
          minPrice,
          maxPrice,
          modalPrice,
          priceUnit: '₹/quintal',
          date: dateStr,
          trend: 'stable',
          priceChangePercent: 0,
          arrivalTonnes: parseFloat(String(r.arrival_tonnes || '0')) || 0,
          sourceStatus: 'LIVE DATA',
          isDemo: false,
          notes: 'Official Government of India daily mandi market data (Agmarknet via Data.gov.in)',
        };
      });

      return {
        success: true,
        provider: 'DATA_GOV_IN',
        governmentApiConnected: true,
        isDemo: false,
        disclaimer: 'Official daily government mandi market data (Agmarknet via Data.gov.in)',
        total: typeof data.total === 'number' ? data.total : records.length,
        records,
      };
    } catch (err: any) {
      if (err.name === 'TimeoutError' || err.message?.includes('timeout')) {
        logger.error('[DataGovMandiProvider] Request to Data.gov.in timed out after 10 seconds');
        return {
          success: false,
          provider: 'DATA_GOV_IN',
          governmentApiConnected: true,
          isDemo: false,
          disclaimer: 'Request to Data.gov.in timed out. The government API took too long to respond.',
          total: 0,
          records: [],
        };
      }

      logger.error(`[DataGovMandiProvider] Network error communicating with Data.gov.in: ${err.message}`);
      return {
        success: false,
        provider: 'DATA_GOV_IN',
        governmentApiConnected: true,
        isDemo: false,
        disclaimer: `Data.gov.in connection error: ${err.message}`,
        total: 0,
        records: [],
      };
    }
  }

  public async getMandiRateById(id: string): Promise<MandiRecord | null> {
    const all = await this.getMandiRates({ limit: 100 });
    return all.records.find((r) => r.id === id) || null;
  }

  public async getFilterOptions(): Promise<MandiFilterOptions> {
    const res = await this.getMandiRates({ limit: 100 });
    const states = Array.from(new Set(res.records.map((r) => r.state))).sort();
    const commodities = Array.from(new Set(res.records.map((r) => r.commodity))).sort();
    const grades = Array.from(new Set(res.records.map((r) => r.grade))).sort();

    const districts: Record<string, string[]> = {};
    const markets: Record<string, string[]> = {};
    const varieties: Record<string, string[]> = {};

    for (const record of res.records) {
      if (!districts[record.state]) districts[record.state] = [];
      if (!districts[record.state].includes(record.district)) districts[record.state].push(record.district);

      if (!markets[record.district]) markets[record.district] = [];
      if (!markets[record.district].includes(record.market)) markets[record.district].push(record.market);

      if (!varieties[record.commodity]) varieties[record.commodity] = [];
      if (!varieties[record.commodity].includes(record.variety)) varieties[record.commodity].push(record.variety);
    }

    return { states, districts, markets, commodities, varieties, grades };
  }
}
