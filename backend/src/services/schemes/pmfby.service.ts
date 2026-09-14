import { IScheme } from '../../types';

/**
 * Dedicated Service for Pradhan Mantri Fasal Bima Yojana (PMFBY)
 * Official Source: https://pmfby.gov.in
 * Provider: Ministry of Agriculture & Farmers Welfare / Agriculture Insurance Company of India
 * Public API Status: Not publicly exposed via open REST API (Uses Official National Crop Insurance Portal)
 */
export class PmfbyService {
  public static getOfficialMetadata() {
    return {
      schemeId: 'PMFBY',
      officialUrl: 'https://pmfby.gov.in',
      claimPortal: 'https://pmfby.gov.in/farmerRegistrationForm',
      helpline: '1800 180 1551',
      publicApiAvailable: false,
      premiumRate: '1.5% (Rabi) / 2.0% (Kharif) / 5% (Commercial/Horticultural)',
    };
  }

  public static getSchemeDetails(): IScheme {
    return {
      id: 'sch-pmfby',
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      titleHi: 'प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)',
      category: 'insurance',
      sponsor: 'Joint',
      benefitSummary:
        'Comprehensive crop insurance against non-preventable natural risks (drought, flood, unseasonal rain, pests) with a uniform nominal premium of only 1.5% for Rabi and 2% for Kharif crops.',
      benefitSummaryHi:
        'प्राकृतिक आपदाओं, ओलावृष्टि, कीटों व बेमौसम बारिश से फसल नुकसान पर व्यापक बीमा सुरक्षा।',
      eligibilityCriteria: [
        'All farmers growing notified crops in notified areas (loanee and non-loanee sharecroppers)',
        'Crop must be insured within notified cut-off dates before/after sowing',
      ],
      documentsRequired: [
        'Land Revenue Record (ROR / Jamabandi)',
        'Sowing certificate / declaration issued by Patwari or Agriculture Supervisor',
        'Aadhaar Card and Bank passbook details',
      ],
      subsidyPercentage: 85,
      maxFinancialAssistance: '100% of Sum Insured per hectare based on loss assessment',
      applicationUrl: 'https://pmfby.gov.in',
      applicationDeadline: 'Within 15 days of crop sowing cut-off',
      active: true,
    };
  }
}
