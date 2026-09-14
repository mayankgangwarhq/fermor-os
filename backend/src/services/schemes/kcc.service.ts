import { IScheme } from '../../types';

/**
 * Dedicated Service for Kisan Credit Card (KCC) Scheme
 * Official Source: https://www.myscheme.gov.in/schemes/kcc
 * Provider: NABARD / Department of Financial Services / RBI
 * Public API Status: Not publicly exposed via open REST API (Uses Official Institutional Banking Network)
 */
export class KccService {
  public static getOfficialMetadata() {
    return {
      schemeId: 'KCC',
      officialUrl: 'https://www.myscheme.gov.in/schemes/kcc',
      nabardPortal: 'https://www.nabard.org',
      publicApiAvailable: false,
      interestRate: '4% effective interest rate (with 3% prompt repayment subvention on loans up to ₹3 Lakh)',
    };
  }

  public static getSchemeDetails(): IScheme {
    return {
      id: 'sch-kcc',
      title: 'Kisan Credit Card (KCC) Scheme',
      titleHi: 'किसान क्रेडिट कार्ड (केसीसी) योजना',
      category: 'credit',
      sponsor: 'Central Govt',
      benefitSummary:
        'Concessional institutional credit for crop cultivation, post-harvest expenses, and farm asset maintenance up to ₹3,00,000 at a low effective interest rate of 4% per annum upon timely repayment.',
      benefitSummaryHi:
        'फसल बुवाई, बीज, खाद व कीटनाशक खरीदने के लिए 4% की रियायती ब्याज दर पर ₹3 लाख तक का आसान फसली ऋण।',
      eligibilityCriteria: [
        'All farmers (individual or joint cultivators, owner-cultivators)',
        'Tenant farmers, oral lessees, sharecroppers, and Self Help Groups (SHGs) of farmers',
        'Animal husbandry, dairy, and fisheries farmers are also eligible up to ₹2 Lakh',
      ],
      documentsRequired: [
        'Application Form duly filled with passport photos',
        'Identity & Address Proof (Aadhaar Card / Voter ID)',
        'Landholding Record / Khasra-Khatauni authenticated by Revenue Authority',
        'No-dues certificate from nearby financial institutions',
      ],
      subsidyPercentage: 3,
      maxFinancialAssistance: 'Up to ₹3,00,000 credit limit at 4% interest subvention',
      applicationUrl: 'https://www.myscheme.gov.in/schemes/kcc',
      applicationDeadline: 'Continuous / Open at all Commercial, Rural & Cooperative Banks',
      active: true,
    };
  }
}
