import { config } from '../config/env';
import { logger } from '../utils/logger';
import {
  IMandiProvider,
  MandiFilter,
  MandiFilterOptions,
  MandiRecord,
  MandiResponse,
} from './mandi/mandiProvider.interface';
import { DemoMandiProvider } from './mandi/demoMandiProvider';
import { DataGovMandiProvider } from './mandi/dataGovMandiProvider';
import { MandiPriceModel } from '../models/MandiPrice';
import { IMandiPrice } from '../types';
import { isDbConnected } from '../config/db';

export class MandiService {
  private static demoProvider: DemoMandiProvider = new DemoMandiProvider();
  private static dataGovProvider: DataGovMandiProvider = new DataGovMandiProvider();

  /**
   * Resolves the active Mandi Rates provider dynamically.
   * If DATA_GOV_API_KEY is missing/empty: defaults to DemoMandiProvider with clear demo disclaimer.
   * If DATA_GOV_API_KEY is present: automatically activates DataGovMandiProvider.
   */
  public static getActiveProvider(): IMandiProvider {
    const key = (process.env.DATA_GOV_API_KEY || config.dataGovApiKey || '').trim();
    const explicitProvider = (process.env.MANDI_PROVIDER || config.mandiProvider || '').trim().toLowerCase();

    if (explicitProvider === 'demo') {
      return this.demoProvider;
    }

    if (key.length > 0 || explicitProvider === 'data_gov') {
      return this.dataGovProvider;
    }

    return this.demoProvider;
  }

  /**
   * Primary abstraction method: getMandiRates(filters)
   * Returns standard MandiResponse containing metadata and records.
   */
  public static async getMandiRates(filters?: MandiFilter): Promise<MandiResponse> {
    const provider = this.getActiveProvider();
    logger.info(`[MandiService] Fetching mandi rates via provider: ${provider.name}`);
    return provider.getMandiRates(filters);
  }

  /**
   * Alias for backwards compatibility.
   */
  public static async getPrices(filter?: MandiFilter): Promise<MandiResponse> {
    return this.getMandiRates(filter);
  }

  /**
   * Get single mandi price record by ID.
   */
  public static async getPriceById(id: string): Promise<MandiRecord | null> {
    const provider = this.getActiveProvider();
    return provider.getMandiRateById(id);
  }

  /**
   * Get dynamic filter options (states, districts, markets, commodities, varieties, grades)
   */
  public static async getFilterOptions(): Promise<MandiFilterOptions> {
    const provider = this.getActiveProvider();
    return provider.getFilterOptions();
  }

  /**
   * Logs or creates a new mandi price benchmark record.
   */
  public static async createPrice(data: Partial<IMandiPrice>) {
    if (isDbConnected()) {
      return MandiPriceModel.create(data);
    }

    const created: MandiRecord = {
      id: data.id || `mandi-${Date.now()}`,
      commodity: data.commodity || 'Unknown',
      variety: data.variety || 'Standard',
      grade: data.grade || 'FAQ',
      market: data.market || 'APMC Market',
      district: data.district || 'District',
      state: data.state || 'State',
      minPrice: data.minPrice || 0,
      maxPrice: data.maxPrice || 0,
      modalPrice: data.modalPrice || 0,
      priceUnit: data.priceUnit || '₹/quintal',
      date: data.date || new Date().toISOString().split('T')[0],
      trend: data.trend || 'stable',
      priceChangePercent: data.priceChangePercent || 0,
      arrivalTonnes: data.arrivalTonnes || 0,
      sourceStatus: 'DEMO DATA',
      isDemo: true,
      notes: 'Sample development benchmark record',
    };

    return created;
  }
}
