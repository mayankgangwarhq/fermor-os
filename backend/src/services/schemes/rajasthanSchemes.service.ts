import { IScheme } from '../../types';

/**
 * Dedicated Service for Rajasthan State Agricultural Schemes (RajKisan Sathi)
 * Official Source: https://kisan.rajasthan.gov.in / https://rajkisan.rajasthan.gov.in
 * Provider: Department of Agriculture, Government of Rajasthan
 * Public API Status: Not publicly exposed via open REST API (Uses SSO/RajKisan Portal)
 */
export class RajasthanSchemesService {
  public static getOfficialMetadata() {
    return {
      schemeId: 'RAJASTHAN-AGRI-SCHEMES',
      officialUrl: 'https://kisan.rajasthan.gov.in',
      rajKisanPortal: 'https://rajkisan.rajasthan.gov.in/Rajkisanweb',
      ssoPortal: 'https://sso.rajasthan.gov.in',
      helpline: '1800 180 1551 (Kisan Call Center)',
      publicApiAvailable: false,
      keyFocus: 'Farm Ponds (Khet Talai), Solar Pumps, Pipeline Subsidy, Drip Irrigation',
    };
  }

  public static getSchemeList(): IScheme[] {
    return [
      {
        id: 'sch-raj-solar-pump',
        title: 'PM-KUSUM Component-B (Rajasthan Solar Agri Pump Subsidy)',
        titleHi: 'पीएम-कुसुम कंपोनेंट-बी (राजस्थान सौर ऊर्जा कृषि पंप योजना)',
        category: 'subsidy',
        sponsor: 'Joint',
        benefitSummary:
          'Provides up to 60% capital subsidy (30% Central + 30% State Govt) for 3 HP to 10 HP solar water pumps on RajKisan Sathi portal.',
        benefitSummaryHi:
          'खेतों में सिंचाई के लिए सोलर पंप लगाने पर 60% तक का भारी सरकारी अनुदान।',
        eligibilityCriteria: [
          'Farmers in Rajasthan with cultivable land and confirmed micro-irrigation (drip/sprinkler)',
          'No grid electrical agricultural connection on the applicant plot',
        ],
        documentsRequired: [
          'Jan Aadhaar Card / Aadhaar Card',
          'Jamabandi (within 6 months) and Naksha Trace',
          'Water source certificate and Bank Passbook',
        ],
        subsidyPercentage: 60,
        maxFinancialAssistance: 'Up to ₹2,65,000 subsidy per installation',
        applicationUrl: 'https://rajkisan.rajasthan.gov.in/Rajkisanweb/KUSUMYojana',
        applicationDeadline: 'State government lottery / quota tranches',
        active: true,
      },
      {
        id: 'sch-raj-farm-pond',
        title: 'Rajasthan Farm Pond Scheme (Khet Talai Subsidy)',
        titleHi: 'राजस्थान खेत तलाई (फार्म पॉन्ड) निर्माण अनुदान योजना',
        category: 'subsidy',
        sponsor: 'State Govt',
        benefitSummary:
          'Provides up to 70% or ₹1,05,000 financial assistance for constructing plastic lined farm ponds to harvest rainwater for irrigation.',
        benefitSummaryHi:
          'वर्षा जल संचयन हेतु पक्की/प्लास्टिक लाइनिंग वाली खेत तलाई निर्माण पर ₹1.05 लाख तक का अनुदान।',
        eligibilityCriteria: [
          'Minimum 0.3 hectare agricultural landholding in Rajasthan',
          'Valid Jan Aadhaar registration',
        ],
        documentsRequired: [
          'Jan Aadhaar Card',
          'Revenue Record (Jamabandi copy)',
          'Farm plot geo-tag photo before excavation',
        ],
        subsidyPercentage: 70,
        maxFinancialAssistance: 'Up to ₹1,05,000 per farm pond',
        applicationUrl: 'https://rajkisan.rajasthan.gov.in',
        applicationDeadline: 'Open via e-Mitra / RajKisan Sathi',
        active: true,
      },
    ];
  }
}
