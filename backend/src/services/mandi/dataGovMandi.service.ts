import { DataGovMandiProvider } from './dataGovMandiProvider';
import { MandiFilter, MandiResponse, MandiRecord, MandiFilterOptions } from './mandiProvider.interface';

/**
 * Dedicated Data.gov.in Agmarknet Mandi Integration Service
 * Official API: https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
 * Authentication: DATA_GOV_API_KEY
 */
export class DataGovMandiService {
  private static provider: DataGovMandiProvider = new DataGovMandiProvider();

  /**
   * Fetches real government mandi price records with filtering support
   */
  public static async getMandiRates(filters?: MandiFilter): Promise<MandiResponse> {
    return this.provider.getMandiRates(filters);
  }

  /**
   * Gets specific record by ID
   */
  public static async getMandiRateById(id: string): Promise<MandiRecord | null> {
    return this.provider.getMandiRateById(id);
  }

  /**
   * Returns available filter options from the government dataset
   */
  public static async getFilterOptions(): Promise<MandiFilterOptions> {
    return this.provider.getFilterOptions();
  }
}
