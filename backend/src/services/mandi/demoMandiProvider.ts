import {
  IMandiProvider,
  MandiFilter,
  MandiFilterOptions,
  MandiRecord,
  MandiResponse,
} from './mandiProvider.interface';

export const SAMPLE_DEMO_MANDI_RECORDS: MandiRecord[] = [
  {
    id: 'demo-mandi-001',
    commodity: 'Wheat',
    variety: 'Sharbati Gold (C-306)',
    grade: 'Grade A',
    market: 'Indore Mandi (APMC)',
    district: 'Indore',
    state: 'Madhya Pradesh',
    minPrice: 2450,
    maxPrice: 2850,
    modalPrice: 2680,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    priceChangePercent: 2.8,
    arrivalTonnes: 450,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-002',
    commodity: 'Wheat',
    variety: 'Mill Quality (Lokwan)',
    grade: 'FAQ',
    market: 'Khanna Grain Market',
    district: 'Ludhiana',
    state: 'Punjab',
    minPrice: 2275,
    maxPrice: 2375,
    modalPrice: 2325,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'stable',
    priceChangePercent: 0.5,
    arrivalTonnes: 820,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-003',
    commodity: 'Wheat',
    variety: 'HD 2967 (Faq)',
    grade: 'FAQ',
    market: 'Lucknow (Naveen Mandi)',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    minPrice: 2420,
    maxPrice: 2650,
    modalPrice: 2540,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    priceChangePercent: 1.8,
    arrivalTonnes: 540,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-004',
    commodity: 'Soybean',
    variety: 'Yellow (JS-335)',
    grade: 'Grade A',
    market: 'Ujjain Krishi Upaj Mandi',
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    minPrice: 4400,
    maxPrice: 4950,
    modalPrice: 4720,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    priceChangePercent: 3.4,
    arrivalTonnes: 320,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-005',
    commodity: 'Mustard',
    variety: 'Pusa Bold (Black)',
    grade: 'Grade A',
    market: 'Jaipur APMC Terminal Market',
    district: 'Jaipur',
    state: 'Rajasthan',
    minPrice: 5100,
    maxPrice: 5700,
    modalPrice: 5450,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'down',
    priceChangePercent: -1.2,
    arrivalTonnes: 210,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-006',
    commodity: 'Mustard',
    variety: 'Pusa Bold',
    grade: 'FAQ',
    market: 'Jaipur (Surajpole)',
    district: 'Jaipur',
    state: 'Rajasthan',
    minPrice: 5800,
    maxPrice: 6350,
    modalPrice: 6150,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'down',
    priceChangePercent: -0.9,
    arrivalTonnes: 180,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-007',
    commodity: 'Tomato',
    variety: 'Hybrid Red (Abhinav)',
    grade: 'Medium',
    market: 'Kolar Mandi',
    district: 'Kolar',
    state: 'Karnataka',
    minPrice: 1400,
    maxPrice: 2200,
    modalPrice: 1850,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    priceChangePercent: 6.2,
    arrivalTonnes: 680,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-008',
    commodity: 'Tomato',
    variety: 'Hybrid Red',
    grade: 'Grade A',
    market: 'Lucknow Subzi Mandi',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    minPrice: 1800,
    maxPrice: 2500,
    modalPrice: 2200,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    priceChangePercent: 5.2,
    arrivalTonnes: 410,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-009',
    commodity: 'Cotton',
    variety: 'Medium Staple (Bt Cotton)',
    grade: 'Grade A',
    market: 'Bathinda Cotton Yard',
    district: 'Bathinda',
    state: 'Punjab',
    minPrice: 6800,
    maxPrice: 7450,
    modalPrice: 7100,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    priceChangePercent: 1.8,
    arrivalTonnes: 190,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-010',
    commodity: 'Paddy',
    variety: 'Basmati 1121',
    grade: 'Super',
    market: 'Ludhiana Mandi',
    district: 'Ludhiana',
    state: 'Punjab',
    minPrice: 4200,
    maxPrice: 4850,
    modalPrice: 4600,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'stable',
    priceChangePercent: 0.0,
    arrivalTonnes: 750,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-011',
    commodity: 'Paddy',
    variety: 'Common (PR 126)',
    grade: 'FAQ',
    market: 'Karnal Grain Market',
    district: 'Karnal',
    state: 'Haryana',
    minPrice: 2180,
    maxPrice: 2320,
    modalPrice: 2250,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    priceChangePercent: 1.1,
    arrivalTonnes: 890,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-012',
    commodity: 'Potato',
    variety: 'Kufri Jyoti',
    grade: 'FAQ',
    market: 'Agra Mandi',
    district: 'Agra',
    state: 'Uttar Pradesh',
    minPrice: 1350,
    maxPrice: 1650,
    modalPrice: 1500,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'down',
    priceChangePercent: -1.2,
    arrivalTonnes: 620,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-013',
    commodity: 'Onion',
    variety: 'Red (Nasik Special)',
    grade: 'Medium',
    market: 'Lasalgaon Mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    minPrice: 1650,
    maxPrice: 2450,
    modalPrice: 2100,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    priceChangePercent: 4.5,
    arrivalTonnes: 1200,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-014',
    commodity: 'Maize',
    variety: 'Yellow Feed Quality',
    grade: 'FAQ',
    market: 'Chhindwara APMC',
    district: 'Chhindwara',
    state: 'Madhya Pradesh',
    minPrice: 1950,
    maxPrice: 2280,
    modalPrice: 2120,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'stable',
    priceChangePercent: 0.2,
    arrivalTonnes: 340,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-015',
    commodity: 'Gram',
    variety: 'Desi Chana (JG 11)',
    grade: 'Grade A',
    market: 'Kota Mandi',
    district: 'Kota',
    state: 'Rajasthan',
    minPrice: 5600,
    maxPrice: 6250,
    modalPrice: 5950,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    priceChangePercent: 1.5,
    arrivalTonnes: 260,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
  {
    id: 'demo-mandi-016',
    commodity: 'Cotton',
    variety: 'Shankar 6',
    grade: 'Super',
    market: 'Rajkot APMC',
    district: 'Rajkot',
    state: 'Gujarat',
    minPrice: 6900,
    maxPrice: 7600,
    modalPrice: 7250,
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    priceChangePercent: 2.1,
    arrivalTonnes: 380,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected',
  },
];

export class DemoMandiProvider implements IMandiProvider {
  public readonly name = 'DEMO / MOCK';
  public readonly isDemo = true;
  public readonly isGovernmentApiConnected = false;

  private records: MandiRecord[] = [...SAMPLE_DEMO_MANDI_RECORDS];

  public async getMandiRates(filters?: MandiFilter): Promise<MandiResponse> {
    let filtered = [...this.records];

    if (filters) {
      // 1. State Filter
      if (filters.state && filters.state !== 'All') {
        const stateLower = filters.state.trim().toLowerCase();
        filtered = filtered.filter((r) => r.state.toLowerCase() === stateLower || r.state.toLowerCase().includes(stateLower));
      }

      // 2. District Filter
      if (filters.district && filters.district !== 'All') {
        const districtLower = filters.district.trim().toLowerCase();
        filtered = filtered.filter((r) => r.district.toLowerCase() === districtLower || r.district.toLowerCase().includes(districtLower));
      }

      // 3. Market / Mandi Filter
      if (filters.market && filters.market !== 'All') {
        const marketLower = filters.market.trim().toLowerCase();
        filtered = filtered.filter((r) => r.market.toLowerCase() === marketLower || r.market.toLowerCase().includes(marketLower));
      }

      // 4. Commodity Filter
      if (filters.commodity && filters.commodity !== 'All') {
        const commodityLower = filters.commodity.trim().toLowerCase();
        filtered = filtered.filter((r) => r.commodity.toLowerCase() === commodityLower || r.commodity.toLowerCase().includes(commodityLower));
      }

      // 5. Variety Filter
      if (filters.variety && filters.variety !== 'All') {
        const varietyLower = filters.variety.trim().toLowerCase();
        filtered = filtered.filter((r) => r.variety.toLowerCase() === varietyLower || r.variety.toLowerCase().includes(varietyLower));
      }

      // 6. Grade Filter
      if (filters.grade && filters.grade !== 'All') {
        const gradeLower = filters.grade.trim().toLowerCase();
        filtered = filtered.filter((r) => r.grade.toLowerCase() === gradeLower || r.grade.toLowerCase().includes(gradeLower));
      }

      // Quick Search across commodity, market, district, variety, state
      if (filters.search && filters.search.trim()) {
        const query = filters.search.trim().toLowerCase();
        filtered = filtered.filter((r) =>
          r.commodity.toLowerCase().includes(query) ||
          r.market.toLowerCase().includes(query) ||
          r.district.toLowerCase().includes(query) ||
          r.variety.toLowerCase().includes(query) ||
          r.state.toLowerCase().includes(query) ||
          r.grade.toLowerCase().includes(query)
        );
      }
    }

    // Sort by modalPrice descending by default
    filtered.sort((a, b) => b.modalPrice - a.modalPrice);

    return {
      success: true,
      provider: 'DEMO / MOCK',
      governmentApiConnected: false,
      isDemo: true,
      disclaimer: 'Demo Data — Government API not connected',
      total: filtered.length,
      records: filtered,
    };
  }

  public async getMandiRateById(id: string): Promise<MandiRecord | null> {
    const found = this.records.find((r) => r.id === id);
    return found || null;
  }

  public async getFilterOptions(): Promise<MandiFilterOptions> {
    const states = Array.from(new Set(this.records.map((r) => r.state))).sort();
    const commodities = Array.from(new Set(this.records.map((r) => r.commodity))).sort();
    const grades = Array.from(new Set(this.records.map((r) => r.grade))).sort();

    const districts: Record<string, string[]> = {};
    const markets: Record<string, string[]> = {};
    const varieties: Record<string, string[]> = {};

    for (const record of this.records) {
      // Districts per state
      if (!districts[record.state]) {
        districts[record.state] = [];
      }
      if (!districts[record.state].includes(record.district)) {
        districts[record.state].push(record.district);
      }

      // Markets per district
      if (!markets[record.district]) {
        markets[record.district] = [];
      }
      if (!markets[record.district].includes(record.market)) {
        markets[record.district].push(record.market);
      }

      // Varieties per commodity
      if (!varieties[record.commodity]) {
        varieties[record.commodity] = [];
      }
      if (!varieties[record.commodity].includes(record.variety)) {
        varieties[record.commodity].push(record.variety);
      }
    }

    // Sort lists inside maps
    Object.keys(districts).forEach((k) => districts[k].sort());
    Object.keys(markets).forEach((k) => markets[k].sort());
    Object.keys(varieties).forEach((k) => varieties[k].sort());

    return {
      states,
      districts,
      markets,
      commodities,
      varieties,
      grades,
    };
  }
}
