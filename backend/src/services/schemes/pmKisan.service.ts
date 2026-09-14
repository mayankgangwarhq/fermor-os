import { IScheme } from '../../types';
import { config } from '../../config/env';
import { logger } from '../../utils/logger';

export interface PmKisanFilter {
  state?: string;
  district?: string;
  subDistrict?: string;
  block?: string;
  village?: string;
  limit?: number;
  offset?: number;
}

export interface PmKisanBeneficiaryRecord {
  stateCode: number;
  districtCode: number;
  subDistrictCode: number;
  blockCode: number;
  villageCode: number;
  state: string;
  district: string;
  subDistrict: string;
  block: string;
  village: string;
  maleBeneficiaries: number;
  femaleBeneficiaries: number;
  transgenderBeneficiaries: number;
  totalBeneficiaries: number;
  finYearId: number;
  quadrimesterNo: number;
  installmentReleaseNo: number;
  quadFromDate: string;
  quadEndDate: string;
}

export interface PmKisanResponse {
  schemeId: string;
  name: string;
  nameHi?: string;
  category: string;
  sponsor: string;
  annualBenefit: string;
  benefitSummary: string;
  benefitSummaryHi?: string;
  eligibilityCriteria: string[];
  documentsRequired: string[];
  officialSourceUrl: string;
  datasetUrl: string;
  dbtPortal: string;
  helpline: string;
  apiConnected: boolean;
  publicApiAvailable: boolean;
  status: string;
  resourceId: string;
  sourceProvider: string;
  totalRecordsInDataset?: number;
  recordsCount?: number;
  beneficiaries?: {
    totalMale: number;
    totalFemale: number;
    totalTransgender: number;
    totalCombined: number;
    records: PmKisanBeneficiaryRecord[];
  };
  lastVerified: string;
}

/**
 * Dedicated Service for Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)
 * Official Source: https://pmkisan.gov.in/
 * Data.gov.in Catalog: https://data.gov.in/catalog/pm-kisan-scheme
 * Resource ID: 388208c6-d82a-4190-90df-91aa2c326fec
 * Dataset: Village and Gender-wise Beneficiaries Count under PM-KISAN Scheme
 * Provider: Ministry of Agriculture & Farmers Welfare, Govt of India
 */
export class PmKisanService {
  private static readonly RESOURCE_ID =
    config.pmKisanResourceId || '388208c6-d82a-4190-90df-91aa2c326fec';
  private static readonly BASE_URL = `https://api.data.gov.in/resource/${this.RESOURCE_ID}`;

  public static getOfficialMetadata() {
    return {
      schemeId: 'PM-KISAN',
      officialUrl: config.pmKisanSourceUrl || 'https://pmkisan.gov.in/',
      datasetUrl: config.pmKisanDatasetUrl || 'https://data.gov.in/catalog/pm-kisan-scheme',
      resourceId: this.RESOURCE_ID,
      dbtPortal: 'https://pfms.nic.in',
      helpline: '155261 / 011-24300606',
      publicApiAvailable: true,
      publicApiStatus: 'CONNECTED — DATA.GOV.IN API',
      annualBenefit: '₹6,000 / year (₹2,000 in 3 installments)',
    };
  }

  public static getSchemeDetails(): IScheme {
    return {
      id: 'sch-pm-kisan',
      title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      titleHi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
      category: 'direct_benefit',
      sponsor: 'Central Govt',
      benefitSummary:
        'Direct income support of ₹6,000 per year transferred in three equal 4-monthly installments of ₹2,000 directly into Aadhaar-seeded bank accounts of all landholding farmer families.',
      benefitSummaryHi:
        'सभी पात्र भूमिधारक किसान परिवारों के बैंक खातों में डीबीटी के जरिए प्रति वर्ष ₹6,000 की प्रत्यक्ष आर्थिक सहायता।',
      eligibilityCriteria: [
        'All landholding small and marginal farmer families with cultivable land',
        'Valid Aadhaar card linked with active bank account (DBT enabled)',
        'Updated land revenue records (Khatauni / e-KYC verified on pmkisan.gov.in)',
      ],
      documentsRequired: [
        'Aadhaar Card',
        'Landholding Record / Jamabandi Copy',
        'Bank Passbook photocopy with IFSC code',
        'Active Mobile Number linked with Aadhaar',
      ],
      subsidyPercentage: 100,
      maxFinancialAssistance: '₹6,000 / year',
      applicationUrl: config.pmKisanSourceUrl || 'https://pmkisan.gov.in/',
      applicationDeadline: 'Continuous / Open Year-round',
      active: true,
    };
  }

  /**
   * Fetches official PM-KISAN beneficiary count statistics from Data.gov.in
   */
  public static async fetchBeneficiaryData(filters?: PmKisanFilter): Promise<{
    apiConnected: boolean;
    total: number;
    records: PmKisanBeneficiaryRecord[];
    summary: {
      totalMale: number;
      totalFemale: number;
      totalTransgender: number;
      totalCombined: number;
    };
    rawStatus?: string;
  }> {
    const apiKey = (config.dataGovApiKey || process.env.DATA_GOV_API_KEY || '').trim();

    if (!apiKey) {
      logger.warn('[PmKisanService] DATA_GOV_API_KEY is not configured in backend/.env');
      return {
        apiConnected: false,
        total: 0,
        records: [],
        summary: { totalMale: 0, totalFemale: 0, totalTransgender: 0, totalCombined: 0 },
      };
    }

    try {
      const url = new URL(this.BASE_URL);
      url.searchParams.append('api-key', apiKey);
      url.searchParams.append('format', 'json');

      const safeLimit = Math.min(Math.max(Number(filters?.limit) || 10, 1), 100);
      url.searchParams.append('limit', String(safeLimit));

      if (filters?.offset) {
        url.searchParams.append('offset', String(filters.offset));
      }

      if (filters?.state && filters.state.trim().toLowerCase() !== 'all') {
        url.searchParams.append('filters[StateName]', filters.state.trim().toUpperCase());
      }
      if (filters?.district && filters.district.trim().toLowerCase() !== 'all') {
        url.searchParams.append('filters[DistrictName]', filters.district.trim().toUpperCase());
      }
      if (filters?.subDistrict && filters.subDistrict.trim().toLowerCase() !== 'all') {
        url.searchParams.append('filters[SubDistrictName]', filters.subDistrict.trim());
      }
      if (filters?.block && filters.block.trim().toLowerCase() !== 'all') {
        url.searchParams.append('filters[BlockName]', filters.block.trim().toUpperCase());
      }
      if (filters?.village && filters.village.trim().toLowerCase() !== 'all') {
        url.searchParams.append('filters[VillageName]', filters.village.trim());
      }

      const res = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'AGRINEXT-Agritech-Platform/1.0',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(12000),
      });

      if (!res.ok) {
        logger.error(`[PmKisanService] Data.gov.in returned HTTP ${res.status}: ${res.statusText}`);
        return {
          apiConnected: false,
          total: 0,
          records: [],
          summary: { totalMale: 0, totalFemale: 0, totalTransgender: 0, totalCombined: 0 },
          rawStatus: `HTTP_${res.status}`,
        };
      }

      const json: any = await res.json();
      const rawRecords: any[] = Array.isArray(json?.records) ? json.records : [];

      let totalMale = 0;
      let totalFemale = 0;
      let totalTransgender = 0;

      const records: PmKisanBeneficiaryRecord[] = rawRecords.map((r) => {
        const male = Number(r.MaleCount) || 0;
        const female = Number(r.FemaleCount) || 0;
        const trans = Number(r.TransGenderCount) || 0;
        const total = male + female + trans;

        totalMale += male;
        totalFemale += female;
        totalTransgender += trans;

        return {
          stateCode: Number(r.StateCode) || 0,
          districtCode: Number(r.DistrictCode) || 0,
          subDistrictCode: Number(r.SubDistrictCode) || 0,
          blockCode: Number(r.BlockCode) || 0,
          villageCode: Number(r.VillageCode) || 0,
          state: String(r.StateName || '').trim(),
          district: String(r.DistrictName || '').trim(),
          subDistrict: String(r.SubDistrictName || '').trim(),
          block: String(r.BlockName || '').trim(),
          village: String(r.VillageName || '').trim(),
          maleBeneficiaries: male,
          femaleBeneficiaries: female,
          transgenderBeneficiaries: trans,
          totalBeneficiaries: total,
          finYearId: Number(r.FinYearID) || 0,
          quadrimesterNo: Number(r.QuadrimesterNo) || 0,
          installmentReleaseNo: Number(r.InstallmentReleaseNo) || 0,
          quadFromDate: String(r.QuadFromDate || '').trim(),
          quadEndDate: String(r.QuadEndDate || '').trim(),
        };
      });

      return {
        apiConnected: true,
        total: typeof json.total === 'number' ? json.total : records.length,
        records,
        summary: {
          totalMale,
          totalFemale,
          totalTransgender,
          totalCombined: totalMale + totalFemale + totalTransgender,
        },
        rawStatus: json.status,
      };
    } catch (err: any) {
      logger.error(`[PmKisanService] Error querying PM-KISAN API: ${err.message}`);
      return {
        apiConnected: false,
        total: 0,
        records: [],
        summary: { totalMale: 0, totalFemale: 0, totalTransgender: 0, totalCombined: 0 },
        rawStatus: err.message,
      };
    }
  }

  /**
   * Returns unified PM-KISAN adapter response containing scheme details & live Data.gov.in statistics
   */
  public static async getAdapterResponse(filters?: PmKisanFilter): Promise<PmKisanResponse> {
    const meta = this.getOfficialMetadata();
    const details = this.getSchemeDetails();
    const liveData = await this.fetchBeneficiaryData(filters);

    return {
      schemeId: 'PM-KISAN',
      name: details.title,
      nameHi: details.titleHi,
      category: details.category,
      sponsor: details.sponsor,
      annualBenefit: meta.annualBenefit,
      benefitSummary: details.benefitSummary,
      benefitSummaryHi: details.benefitSummaryHi,
      eligibilityCriteria: details.eligibilityCriteria,
      documentsRequired: details.documentsRequired,
      officialSourceUrl: meta.officialUrl,
      datasetUrl: meta.datasetUrl,
      dbtPortal: meta.dbtPortal,
      helpline: meta.helpline,
      apiConnected: liveData.apiConnected,
      publicApiAvailable: true,
      status: liveData.apiConnected
        ? 'CONNECTED — DATA.GOV.IN API'
        : 'OFFICIAL SOURCE — DATA.GOV.IN NOT CONFIGURED',
      resourceId: this.RESOURCE_ID,
      sourceProvider: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
      totalRecordsInDataset: liveData.total,
      recordsCount: liveData.records.length,
      beneficiaries: {
        totalMale: liveData.summary.totalMale,
        totalFemale: liveData.summary.totalFemale,
        totalTransgender: liveData.summary.totalTransgender,
        totalCombined: liveData.summary.totalCombined,
        records: liveData.records,
      },
      lastVerified: new Date().toISOString(),
    };
  }
}
