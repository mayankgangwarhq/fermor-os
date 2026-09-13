import { SchemeModel } from '../models/Scheme';
import { IScheme } from '../types';
import { isDbConnected } from '../config/db';
import { buildIdQuery } from '../utils/dbHelper';

const sampleSchemesFallback: IScheme[] = [
  {
    id: 'sch-1',
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    titleHi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
    category: 'direct_benefit',
    sponsor: 'Central Govt',
    benefitSummary: 'Direct income support of ₹6,000 per year transferred in three equal 4-monthly installments of ₹2,000 directly into the bank accounts of all landholding farmer families.',
    benefitSummaryHi: 'सभी भूमिधारक किसान परिवारों के बैंक खातों में सीधे ₹6,000 प्रति वर्ष की वित्तीय सहायता।',
    eligibilityCriteria: [
      'All landholding small and marginal farmer families having cultivable landholding in their names',
      'Valid Aadhaar card linked with active bank account (DBT enabled)',
      'Updated land revenue records (Khatauni / e-KYC verified)',
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Landholding ownership certificate / Revenue Jamabandi',
      'Bank passbook photocopy with IFSC code',
    ],
    subsidyPercentage: 100,
    maxFinancialAssistance: '₹6,000 / year',
    applicationUrl: 'https://pmkisan.gov.in',
    applicationDeadline: 'Continuous / Open Year-round',
    active: true,
  },
  {
    id: 'sch-2',
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
  {
    id: 'sch-3',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    titleHi: 'प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)',
    category: 'insurance',
    sponsor: 'Joint',
    benefitSummary: 'Comprehensive crop insurance against non-preventable natural risks with a uniform nominal premium of only 1.5% for Rabi, 2% for Kharif.',
    benefitSummaryHi: 'प्राकृतिक आपदाओं, कीटों व रोगों से फसल नुकसान पर पूर्ण बीमा सुरक्षा।',
    eligibilityCriteria: [
      'All farmers growing notified crops in notified areas (loanee and non-loanee sharecroppers)',
    ],
    documentsRequired: [
      'Land Revenue Record (ROR / Jamabandi)',
      'Sowing certificate issued by Patwari / Village Agriculture Officer',
      'Bank passbook details',
    ],
    subsidyPercentage: 85,
    maxFinancialAssistance: '100% of Sum Insured per hectare based on loss assessment',
    applicationUrl: 'https://pmfby.gov.in',
    applicationDeadline: 'Within 15 days of crop sowing',
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
