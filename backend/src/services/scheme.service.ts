import { SchemeModel } from '../models/Scheme';
import { IScheme } from '../types';
import { isDbConnected } from '../config/db';
import { buildIdQuery } from '../utils/dbHelper';
import { PmKisanService } from './schemes/pmKisan.service';
import { PmfbyService } from './schemes/pmfby.service';
import { KccService } from './schemes/kcc.service';
import { RajasthanSchemesService } from './schemes/rajasthanSchemes.service';

export { PmKisanService, PmfbyService, KccService, RajasthanSchemesService };

const sampleSchemesFallback: IScheme[] = [
  PmKisanService.getSchemeDetails(),
  PmfbyService.getSchemeDetails(),
  KccService.getSchemeDetails(),
  ...RajasthanSchemesService.getSchemeList(),
  {
    id: 'sch-pm-kusum',
    title: 'PM-KUSUM (Solar Agricultural Pump Scheme)',
    titleHi: 'पीएम-कुसुम सौर ऊर्जा पंप योजना',
    category: 'subsidy',
    sponsor: 'Central Govt',
    benefitSummary: 'Provides 60% direct capital subsidy for standalone off-grid solar agricultural water pumping systems (3 HP to 10 HP). Farmer pays only 10% upfront.',
    benefitSummaryHi: 'खेतों में 3 से 10 HP तक के सोलर पंप लगवाने के लिए 60% तक सरकारी अनुदान।',
    eligibilityCriteria: [
      'Individual farmers, Water User Associations, and FPOs',
      'Cultivable farm plot with confirmed water source without grid electricity connection',
    ],
    documentsRequired: [
      'Aadhaar Card and Farmer Registration ID',
      'Land ownership records (Khasra/Khatauni copy)',
      'Groundwater NOC and Bank guarantee / declaration',
    ],
    subsidyPercentage: 60,
    maxFinancialAssistance: 'Up to ₹2,50,000 per pump',
    applicationUrl: 'https://pmkusum.mnre.gov.in',
    applicationDeadline: 'State-wise seasonal tranches',
    active: true,
  },
];

let inMemorySchemes = [...sampleSchemesFallback];

export class SchemeService {
  public static async getSchemes(filter?: {
    category?: string;
    sponsor?: string;
  }) {
    if (!isDbConnected()) {
      let filtered = [...inMemorySchemes];
      if (filter?.category) {
        filtered = filtered.filter((s) => s.category === filter.category);
      }
      if (filter?.sponsor) {
        filtered = filtered.filter((s) => s.sponsor === filter.sponsor);
      }
      return filtered;
    }

    const query: any = { active: true };
    if (filter?.category) query.category = filter.category;
    if (filter?.sponsor) query.sponsor = filter.sponsor;

    return SchemeModel.find(query).sort({ category: 1 });
  }

  public static async getPmKisanDetails(filters?: {
    state?: string;
    district?: string;
    subDistrict?: string;
    block?: string;
    village?: string;
    limit?: number;
    offset?: number;
  }) {
    return PmKisanService.getAdapterResponse(filters);
  }

  public static async getSchemeById(id: string) {
    if (!isDbConnected()) {
      return inMemorySchemes.find((s) => s.id === id || (s as any)._id === id) || null;
    }

    const query = buildIdQuery(id);
    return SchemeModel.findOne(query);
  }

  public static async createScheme(data: IScheme) {
    if (!isDbConnected()) {
      const created: IScheme = {
        ...data,
        id: `sch-${Date.now()}`,
        active: true,
      };
      inMemorySchemes.unshift(created);
      return created;
    }

    return SchemeModel.create(data);
  }
}
