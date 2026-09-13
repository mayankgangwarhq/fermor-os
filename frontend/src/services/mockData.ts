import type {
  User, Farm, CropCycle, FarmTask, FarmExpense, FarmRevenue,
  WeatherData, MandiPrice, MarketplaceListing, PurchaseRequest,
  Expert, Consultation, GovernmentScheme, Equipment, EquipmentBooking,
  Notification, IHotspot, IEarlyWarning, ILabReferral, IFollowUp,
  IFieldConfirmation, IPestObservation, OfficialStats
} from '../types';


export const initialUser: User = {
  id: 'usr-farmer-01',
  name: 'Rajesh Kumar Patel',
  phone: '+91 98765 43210',
  email: 'rajesh.patel@agrinext.in',
  role: 'farmer',
  state: 'Rajasthan',
  district: 'Jaipur',
  village: 'Jagatpura (VGU)',
  language: 'en',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  createdDate: '2025-11-10'
};

export const sampleUsers: User[] = [
  initialUser,
  {
    id: 'usr-buyer-02',
    name: 'Anil Gupta (AgriProcure Pvt Ltd)',
    phone: '+91 98222 11000',
    email: 'anil@agriprocure.com',
    role: 'buyer',
    state: 'Haryana',
    district: 'Karnal',
    village: 'Sector 4',
    language: 'en',
    createdDate: '2025-12-01'
  },
  {
    id: 'usr-expert-03',
    name: 'Dr. Ramesh Sharma',
    phone: '+91 94111 88990',
    email: 'dr.ramesh@agrinext.in',
    role: 'expert',
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'PAU Campus',
    language: 'hi',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
    createdDate: '2025-08-15'
  },
  {
    id: 'usr-eq-04',
    name: 'Sardar Gurpreet Singh',
    phone: '+91 97666 44332',
    email: 'gurpreet.farmmachinery@gmail.com',
    role: 'equipment_owner',
    state: 'Punjab',
    district: 'Patiala',
    village: 'Nabaha',
    language: 'en',
    createdDate: '2025-09-20'
  },
  {
    id: 'usr-admin-05',
    name: 'AGRINEXT Systems Admin',
    phone: '+91 80000 00001',
    email: 'admin@agrinext.in',
    role: 'admin',
    state: 'Delhi',
    district: 'New Delhi',
    village: 'Central HQ',
    language: 'en',
    createdDate: '2025-01-01'
  }
];

export const sampleFarms: Farm[] = [
  {
    id: 'farm-101',
    farmerId: 'usr-farmer-01',
    name: 'Surya Ganga Green Field',
    location: 'Plot #14, Jagatpura (VGU), Jaipur',
    area: 5.5,
    unit: 'acres',
    soilType: 'Sandy',
    irrigation: 'Borewell',
    farmingType: 'Conventional',
    crops: ['Wheat (HD 2967)', 'Mustard (Pusa Bold)']
  },
  {
    id: 'farm-102',
    farmerId: 'usr-farmer-01',
    name: 'Jagatpura Organic Farm',
    location: 'Plot #08, VGU Road, Jaipur',
    area: 3.0,
    unit: 'acres',
    soilType: 'Sandy',
    irrigation: 'Drip',
    farmingType: 'Organic',
    crops: ['Tomato (Vaishnavi)', 'Mustard']
  }
];

export const sampleCropCycles: CropCycle[] = [
  {
    id: 'crop-1001',
    farmId: 'farm-101',
    farmName: 'Surya Ganga Green Field',
    cropName: 'Wheat',
    variety: 'HD 2967',
    status: 'growing',
    sowingDate: '2025-11-15',
    expectedHarvestDate: '2026-04-10',
    estimatedYieldKg: 12500
  },
  {
    id: 'crop-1002',
    farmId: 'farm-101',
    farmName: 'Surya Ganga Green Field',
    cropName: 'Mustard',
    variety: 'Pusa Bold',
    status: 'harvest_ready',
    sowingDate: '2025-10-20',
    expectedHarvestDate: '2026-03-01',
    estimatedYieldKg: 4200
  },
  {
    id: 'crop-1003',
    farmId: 'farm-102',
    farmName: 'Mango & Vegetable Orchard',
    cropName: 'Tomato',
    variety: 'Vaishnavi Hybrid',
    status: 'growing',
    sowingDate: '2025-12-05',
    expectedHarvestDate: '2026-03-25',
    estimatedYieldKg: 8000
  }
];

export const sampleTasks: FarmTask[] = [
  {
    id: 'task-1',
    farmId: 'farm-101',
    title: 'Top dressing of Urea fertilizer (Wheat plot)',
    category: 'fertilizer',
    dueDate: '2026-08-20',
    priority: 'high',
    completed: false,
    notes: 'Apply 45kg/acre before expected light rainfall.'
  },
  {
    id: 'task-2',
    farmId: 'farm-101',
    title: 'Inspect leaf tips for Yellow Rust symptoms',
    category: 'inspection',
    dueDate: '2026-08-21',
    priority: 'medium',
    completed: false,
    notes: 'Use AGRINEXT Crop Health scanner if yellow pustules are detected.'
  },
  {
    id: 'task-3',
    farmId: 'farm-102',
    title: 'Run drip irrigation for 2 hours',
    category: 'irrigation',
    dueDate: '2026-08-19',
    priority: 'high',
    completed: true,
    notes: 'Checked water filter and valve 3 pressure.'
  },
  {
    id: 'task-4',
    farmId: 'farm-101',
    title: 'Schedule Harvester booking for Mustard harvest',
    category: 'harvest',
    dueDate: '2026-08-25',
    priority: 'high',
    completed: false,
    notes: 'Book via AGRINEXT Equipment module.'
  }
];

export const sampleExpenses: FarmExpense[] = [
  {
    id: 'exp-01',
    farmId: 'farm-101',
    category: 'seeds',
    amount: 14500,
    date: '2025-11-10',
    notes: 'Certified HD 2967 Wheat seeds (110 kg)'
  },
  {
    id: 'exp-02',
    farmId: 'farm-101',
    category: 'fertilizer',
    amount: 18200,
    date: '2025-11-14',
    notes: 'DAP (4 bags) & Neem Coated Urea (8 bags)'
  },
  {
    id: 'exp-03',
    farmId: 'farm-101',
    category: 'labour',
    amount: 22000,
    date: '2025-11-16',
    notes: 'Land preparation and sowing labour charges'
  },
  {
    id: 'exp-04',
    farmId: 'farm-102',
    category: 'irrigation',
    amount: 8500,
    date: '2025-12-01',
    notes: 'Electricity bill & drip lateral maintenance'
  },
  {
    id: 'exp-05',
    farmId: 'farm-101',
    category: 'equipment',
    amount: 12000,
    date: '2025-11-12',
    notes: 'Tractor rotavator rental (10 hours)'
  }
];

export const sampleRevenues: FarmRevenue[] = [
  {
    id: 'rev-01',
    farmId: 'farm-101',
    cropName: 'Paddy (Basmati 1509)',
    quantity: 115,
    unit: 'Quintals',
    amount: 385250,
    buyerName: 'Karnal Grain Merchants',
    date: '2025-10-28'
  },
  {
    id: 'rev-02',
    farmId: 'farm-102',
    cropName: 'Early Green Peas',
    quantity: 35,
    unit: 'Quintals',
    amount: 122500,
    buyerName: 'Lucknow Subzi Mandi Buyer',
    date: '2025-12-18'
  }
];

export const sampleWeather: WeatherData = {
  temperature: 29.5,
  condition: 'Clear & Sunny',
  humidity: 50,
  windSpeed: 12.0,
  rainProbability: 20,
  location: 'Jagatpura (VGU)',
  district: 'Jaipur',
  state: 'Rajasthan',
  sourceStatus: 'LIVE DATA',
  lastUpdated: 'Just now',
  forecast: [
    { day: 'Today', tempMax: 31, tempMin: 23, condition: 'Partly Cloudy', rainChance: 35, icon: 'cloud-sun' },
    { day: 'Tomorrow', tempMax: 29, tempMin: 22, condition: 'Moderate Rain', rainChance: 70, icon: 'cloud-rain' },
    { day: 'Thu', tempMax: 30, tempMin: 21, condition: 'Thunderstorm', rainChance: 80, icon: 'cloud-lightning' },
    { day: 'Fri', tempMax: 32, tempMin: 23, condition: 'Clear Sunny', rainChance: 10, icon: 'sun' },
    { day: 'Sat', tempMax: 33, tempMin: 24, condition: 'Sunny', rainChance: 5, icon: 'sun' },
    { day: 'Sun', tempMax: 32, tempMin: 23, condition: 'Partly Cloudy', rainChance: 20, icon: 'cloud-sun' },
    { day: 'Mon', tempMax: 31, tempMin: 22, condition: 'Light Shower', rainChance: 45, icon: 'cloud-rain' }
  ],
  alerts: [
    {
      id: 'w-alert-1',
      type: 'rain',
      severity: 'warning',
      title: 'Rain Expected in Next 36 Hours',
      description: 'Moderate rainfall (15-25mm) projected across Lucknow & Unnao districts on Wednesday evening.',
      actionableStep: 'Hold pesticide/foliar spray until rain passes. Ensure drainage channels are clear.'
    },
    {
      id: 'w-alert-2',
      type: 'irrigation',
      severity: 'info',
      title: 'Optimum Soil Moisture Window',
      description: 'Current humidity levels and mild breeze present optimal window for top-dressing fertilizer.',
      actionableStep: 'Apply Nitrogen top-dress before tomorrow evening rain.'
    }
  ]
};

export const sampleMandiPrices: MandiPrice[] = [
  {
    id: 'mandi-1',
    commodity: 'Wheat',
    variety: 'HD 2967 (Faq)',
    grade: 'FAQ',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    market: 'Lucknow (Naveen Mandi)',
    mandi: 'Lucknow (Naveen Mandi)',
    minPrice: 2420,
    maxPrice: 2650,
    modalPrice: 2540,
    unit: '₹ / Quintal',
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    changePercent: 1.8,
    priceChangePercent: 1.8,
    arrivalTonnes: 540,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected'
  },
  {
    id: 'mandi-2',
    commodity: 'Wheat',
    variety: 'Sharbati Gold (C-306)',
    grade: 'Grade A',
    state: 'Madhya Pradesh',
    district: 'Indore',
    market: 'Indore Mandi (APMC)',
    mandi: 'Indore Mandi (APMC)',
    minPrice: 2450,
    maxPrice: 2850,
    modalPrice: 2680,
    unit: '₹ / Quintal',
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    changePercent: 2.8,
    priceChangePercent: 2.8,
    arrivalTonnes: 450,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected'
  },
  {
    id: 'mandi-3',
    commodity: 'Mustard',
    variety: 'Pusa Bold (Black)',
    grade: 'Grade A',
    state: 'Rajasthan',
    district: 'Jaipur',
    market: 'Jaipur (Surajpole)',
    mandi: 'Jaipur (Surajpole)',
    minPrice: 5800,
    maxPrice: 6350,
    modalPrice: 6150,
    unit: '₹ / Quintal',
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'down',
    changePercent: -0.9,
    priceChangePercent: -0.9,
    arrivalTonnes: 210,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected'
  },
  {
    id: 'mandi-4',
    commodity: 'Paddy',
    variety: 'Basmati 1121',
    grade: 'Super',
    state: 'Punjab',
    district: 'Ludhiana',
    market: 'Ludhiana Mandi',
    mandi: 'Ludhiana Mandi',
    minPrice: 4200,
    maxPrice: 4850,
    modalPrice: 4600,
    unit: '₹ / Quintal',
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'stable',
    changePercent: 0.0,
    priceChangePercent: 0.0,
    arrivalTonnes: 750,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected'
  },
  {
    id: 'mandi-5',
    commodity: 'Tomato',
    variety: 'Hybrid Red (Abhinav)',
    grade: 'Medium',
    state: 'Karnataka',
    district: 'Kolar',
    market: 'Kolar Mandi',
    mandi: 'Kolar Mandi',
    minPrice: 1400,
    maxPrice: 2200,
    modalPrice: 1850,
    unit: '₹ / Quintal',
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    changePercent: 6.2,
    priceChangePercent: 6.2,
    arrivalTonnes: 680,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected'
  },
  {
    id: 'mandi-6',
    commodity: 'Potato',
    variety: 'Kufri Jyoti',
    grade: 'FAQ',
    state: 'Uttar Pradesh',
    district: 'Agra',
    market: 'Agra Mandi',
    mandi: 'Agra Mandi',
    minPrice: 1350,
    maxPrice: 1650,
    modalPrice: 1500,
    unit: '₹ / Quintal',
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'down',
    changePercent: -1.2,
    priceChangePercent: -1.2,
    arrivalTonnes: 620,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected'
  },
  {
    id: 'mandi-7',
    commodity: 'Soybean',
    variety: 'Yellow (JS-335)',
    grade: 'Grade A',
    state: 'Madhya Pradesh',
    district: 'Ujjain',
    market: 'Ujjain Krishi Upaj Mandi',
    mandi: 'Ujjain Krishi Upaj Mandi',
    minPrice: 4400,
    maxPrice: 4950,
    modalPrice: 4720,
    unit: '₹ / Quintal',
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    changePercent: 3.4,
    priceChangePercent: 3.4,
    arrivalTonnes: 320,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected'
  },
  {
    id: 'mandi-8',
    commodity: 'Cotton',
    variety: 'Medium Staple (Bt Cotton)',
    grade: 'Grade A',
    state: 'Punjab',
    district: 'Bathinda',
    market: 'Bathinda Cotton Yard',
    mandi: 'Bathinda Cotton Yard',
    minPrice: 6800,
    maxPrice: 7450,
    modalPrice: 7100,
    unit: '₹ / Quintal',
    priceUnit: '₹/quintal',
    date: '2026-08-18',
    trend: 'up',
    changePercent: 1.8,
    priceChangePercent: 1.8,
    arrivalTonnes: 190,
    sourceStatus: 'DEMO DATA',
    isDemo: true,
    notes: 'Sample development benchmark record — Government API not connected'
  }
];

export const sampleMarketplaceListings: MarketplaceListing[] = [
  {
    id: 'list-501',
    farmerId: 'usr-farmer-01',
    farmerName: 'Rajesh Kumar Patel',
    farmerPhone: '+91 98765 43210',
    farmerLocation: 'Jagatpura (VGU), Jaipur',
    district: 'Jaipur',
    state: 'Rajasthan',
    crop: 'Mustard',
    variety: 'Pusa Bold Oilseed',
    quantity: 40,
    unit: 'Quintals',
    qualityGrade: 'A+',
    expectedPrice: 6200,
    harvestDate: '2026-03-05',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Cleaned, high-oil content Pusa Bold mustard seeds directly harvested from our Jagatpura (VGU) Jaipur farm. Sun-dried to 8% moisture.',
    listedDate: '2026-08-15',
    interestedCount: 3
  },
  {
    id: 'list-502',
    farmerId: 'usr-farmer-88',
    farmerName: 'Harpreet Singh Sandhu',
    farmerPhone: '+91 98123 99887',
    farmerLocation: 'Karnal Outer Road',
    district: 'Karnal',
    state: 'Haryana',
    crop: 'Wheat',
    variety: 'HD 3086 Premium',
    quantity: 120,
    unit: 'Quintals',
    qualityGrade: 'A+',
    expectedPrice: 2600,
    harvestDate: '2026-04-12',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Grade A1 HD 3086 Milling wheat. Machine harvested, zero weed mixture, stored in moisture-controlled godown.',
    listedDate: '2026-08-10',
    interestedCount: 7
  },
  {
    id: 'list-503',
    farmerId: 'usr-farmer-99',
    farmerName: 'Rameshwar Lal Meena',
    farmerPhone: '+91 94140 77654',
    farmerLocation: 'Chaksu Tehsil',
    district: 'Jaipur',
    state: 'Rajasthan',
    crop: 'Cumin (Jeera)',
    variety: 'GC 4 Organic',
    quantity: 15,
    unit: 'Quintals',
    qualityGrade: 'A',
    expectedPrice: 28500,
    harvestDate: '2026-03-20',
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'Organically grown GC-4 Cumin with high essential oil aromatic fragrance. Tested pesticide residue free.',
    listedDate: '2026-08-12',
    interestedCount: 5
  }
];

export const samplePurchaseRequests: PurchaseRequest[] = [
  {
    id: 'pr-1',
    listingId: 'list-501',
    cropName: 'Mustard (Pusa Bold)',
    buyerId: 'usr-buyer-02',
    buyerName: 'Anil Gupta (AgriProcure Pvt Ltd)',
    buyerCompany: 'AgriProcure Oil Mills',
    buyerPhone: '+91 98222 11000',
    offeredPrice: 6150,
    quantity: 40,
    unit: 'Quintals',
    message: 'We can lift the entire 40 quintal lot directly from your farm. Payment via NEFT within 24 hours of weighing.',
    status: 'pending',
    requestDate: '2026-08-17'
  }
];

export const sampleExperts: Expert[] = [
  {
    id: 'exp-1',
    name: 'Dr. Ramesh Sharma',
    title: 'Senior Agronomist & Cereal Crop Specialist',
    qualification: 'Ph.D. Agronomy (PAU Ludhiana), Ex-ICAR Scientist',
    specialization: ['Wheat & Paddy Management', 'Soil Fertility', 'Pest Control'],
    experienceYears: 18,
    rating: 4.9,
    reviewCount: 340,
    location: 'Ludhiana, Punjab',
    languages: ['Hindi', 'Punjabi', 'English'],
    availability: 'Mon - Sat (9:00 AM - 6:00 PM)',
    consultationFee: 0, // Free on AGRINEXT MVP
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
    bio: '18+ years experience guiding over 40,000 North Indian farmers in crop productivity enhancement, balanced fertilization and Integrated Pest Management.'
  },
  {
    id: 'exp-2',
    name: 'Dr. Sunita Patel',
    title: 'Plant Pathologist & Disease Diagnostics Expert',
    qualification: 'M.Sc., Ph.D. Plant Pathology (GBPUAT Pantnagar)',
    specialization: ['Vegetable Disease Diagnosis', 'Fungal Blight Control', 'Biological Control'],
    experienceYears: 12,
    rating: 4.8,
    reviewCount: 215,
    location: 'Pantnagar, Uttarakhand',
    languages: ['Hindi', 'English'],
    availability: 'Mon - Fri (10:00 AM - 5:00 PM)',
    consultationFee: 0,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    bio: 'Specialist in rapid field diagnosis of tomato late blight, chili leaf curl virus, and pulse wilt diseases.'
  },
  {
    id: 'exp-3',
    name: 'Er. Vikramjeet Singh',
    title: 'Precision Irrigation & Soil Nutrient Consultant',
    qualification: 'B.Tech Ag Engineering (IIT Kharagpur)',
    specialization: ['Drip & Micro Irrigation', 'Soil Sensor Tech', 'Polyhouse Farming'],
    experienceYears: 9,
    rating: 4.7,
    reviewCount: 160,
    location: 'Jaipur, Rajasthan',
    languages: ['Hindi', 'Rajasthani', 'English'],
    availability: 'Tue - Sun (8:00 AM - 4:00 PM)',
    consultationFee: 0,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    bio: 'Helping farmers transition to water-efficient drip systems and precision fertigation to save up to 40% input cost.'
  }
];

export const sampleConsultations: Consultation[] = [
  {
    id: 'cons-1',
    farmerId: 'usr-farmer-01',
    farmerName: 'Rajesh Kumar Patel',
    farmerPhone: '+91 98765 43210',
    expertId: 'exp-1',
    expertName: 'Dr. Ramesh Sharma',
    expertTitle: 'Senior Agronomist',
    cropIssueTitle: 'Yellow spots appearing on Wheat leaves in plot #1',
    cropName: 'Wheat (HD 2967)',
    description: 'During my morning round, I noticed yellow powder-like spots on middle leaves. Is this Yellow Rust?',
    status: 'answered',
    answer: 'Based on your photo and description, this is early stage Yellow Rust (Puccinia striiformis). Spray Propiconazole 25% EC @ 1ml/liter of water immediately. Repeat after 15 days if cloudy weather persists.',
    createdAt: '2026-08-14 10:30 AM',
    answeredAt: '2026-08-14 02:15 PM'
  }
];

export const sampleSchemes: GovernmentScheme[] = [
  {
    id: 'sch-1',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    hindiName: 'पीएम-किसान सम्मान निधि योजना',
    category: 'Farmer Welfare',
    description: 'Direct income support of ₹6,000 per year in 3 equal installments of ₹2,000 directly into bank accounts of eligible landholding farmer families across India.',
    eligibility: [
      'All landholding farmer families with cultivable land in their name',
      'Small and marginal farmers holding up to 2 hectares land',
      'Excludes institutional landholders and high income tax payers'
    ],
    benefits: '₹6,000 per year direct benefit transfer (DBT)',
    requiredDocs: ['Aadhaar Card', 'Land Ownership Records (Khatauni/Khasra)', 'Bank Account Passbook'],
    officialSource: 'https://pmkisan.gov.in',
    lastVerifiedDate: '2026-08-01',
    maxBenefitAmount: '₹6,000 / year'
  },
  {
    id: 'sch-2',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    hindiName: 'प्रधानमंत्री फसल बीमा योजना',
    category: 'Crop Insurance',
    description: 'Comprehensive crop insurance coverage against non-preventable natural risks from pre-sowing to post-harvest stages at extremely low premium rates (1.5% for Rabi, 2.0% for Kharif).',
    eligibility: [
      'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers',
      'Both loanee and non-loanee farmers eligible'
    ],
    benefits: '100% loss compensation based on crop cutting experiments (CCE) and satellite assessment',
    requiredDocs: ['Aadhaar', 'Land Record / Tenant Agreement', 'Sowing Certificate from Sarpanch/Lekhpal', 'Bank Details'],
    officialSource: 'https://pmfby.gov.in',
    lastVerifiedDate: '2026-08-05',
    maxBenefitAmount: 'Full Crop Value'
  },
  {
    id: 'sch-3',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    hindiName: 'कृषि यांत्रीकरण पर उप-मिशन (सब्सिडी योजना)',
    category: 'Subsidies',
    description: 'Financial assistance of 40% to 50% subsidy for purchasing tractors, rotavators, power tillers, laser land levelers, and custom hiring center machinery.',
    eligibility: [
      'Small and marginal farmers, women farmers, SC/ST farmers given priority',
      'Registered farmer groups / FPOs eligible for up to 80% Custom Hiring Center subsidy'
    ],
    benefits: '40% to 50% capital cost subsidy on agricultural equipment purchase',
    requiredDocs: ['Aadhaar Card', 'Land Proof', 'Quotation from authorized machinery dealer', 'Caste Certificate (if applicable)'],
    officialSource: 'https://agrimachinery.nic.in',
    lastVerifiedDate: '2026-07-20',
    maxBenefitAmount: 'Up to 50% Subsidy'
  },
  {
    id: 'sch-4',
    name: 'PM-KUSUM Solar Pump Scheme',
    hindiName: 'पीएम-कुसुम सोलर पंप योजना',
    category: 'Solar',
    description: 'Standalone solar powered agriculture pumps subsidy. Central and State government provide 60% subsidy, 30% bank loan, farmer pays only 10% upfront cost.',
    eligibility: [
      'Farmers with agricultural land having surface water or borewell requirement',
      'Farmers replacing existing diesel pumps or new grid-disconnected pumps'
    ],
    benefits: '90% financial support (60% subsidy + 30% soft loan) for 3HP to 10HP solar pumps',
    requiredDocs: ['Aadhaar', 'Electricity bill / NOC (if applicable)', 'Land document', 'Bank passbook'],
    officialSource: 'https://pmkusum.mnre.gov.in',
    lastVerifiedDate: '2026-08-10',
    maxBenefitAmount: '60% Govt Subsidy'
  },
  {
    id: 'sch-5',
    name: 'Soil Health Card Scheme',
    hindiName: 'मृदा स्वास्थ्य कार्ड योजना',
    category: 'Irrigation',
    description: 'Provides free soil testing report card analyzing 12 parameters (N, P, K, S, Zinc, Fe, Cu, Mn, Bo, pH, EC, OC) with tailored fertilizer dose recommendations.',
    eligibility: ['All farmers across India free of charge every 3 years.'],
    benefits: 'Free soil testing and targeted nutrient management advice saving up to ₹2,500/acre fertilizer waste.',
    requiredDocs: ['Aadhaar', 'Farm Plot Location / Khasra number'],
    officialSource: 'https://soilhealth.dac.gov.in',
    lastVerifiedDate: '2026-08-12',
    maxBenefitAmount: 'Free Soil Testing'
  }
];

export const sampleEquipment: Equipment[] = [
  {
    id: 'eq-1',
    ownerId: 'usr-eq-04',
    ownerName: 'Gurpreet Farm Machinery Services',
    ownerPhone: '+91 97666 44332',
    title: 'Mahindra 575 DI SP Plus Tractor (47 HP)',
    category: 'Tractor',
    brandModel: 'Mahindra 575 DI (2024 Model)',
    dailyRate: 1800,
    location: 'Patiala / Jaipur',
    district: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=600&q=80',
    specifications: ['47 HP Engine', 'Power Steering', 'Dual Clutch', 'Includes Driver'],
    available: true,
    rating: 4.9
  },
  {
    id: 'eq-2',
    ownerId: 'usr-eq-04',
    ownerName: 'Gurpreet Farm Machinery Services',
    ownerPhone: '+91 97666 44332',
    title: 'CLAAS Crop Tiger 40 Combine Harvester',
    category: 'Harvester',
    brandModel: 'CLAAS Crop Tiger 40 Tracked',
    dailyRate: 3500,
    location: 'Ludhiana / Lucknow',
    district: 'Lucknow',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
    specifications: ['76 HP Turbocharged', 'Grain Tank 1200L', 'Rubber Tracks for Wet Soil', 'Fuel Included'],
    available: true,
    rating: 4.95
  },
  {
    id: 'eq-3',
    ownerId: 'usr-eq-04',
    ownerName: 'Kisan Kranti Custom Hiring',
    ownerPhone: '+91 94150 22334',
    title: 'Shaktiman 7-Feet Heavy Duty Rotavator',
    category: 'Rotavator',
    brandModel: 'Shaktiman Champion Series',
    dailyRate: 900,
    location: 'Unnao / Lucknow',
    district: 'Lucknow',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    specifications: ['48 Boron Steel Blades', 'Multi-Speed Gearbox', 'Ideal for Paddy stubble mixing'],
    available: true,
    rating: 4.8
  },
  {
    id: 'eq-4',
    ownerId: 'usr-eq-08',
    ownerName: 'AgriFly Drone Spray Solutions',
    ownerPhone: '+91 98888 77766',
    title: 'AGRINEXT Agriculture Spraying Drone (10L Tank)',
    category: 'Sprayer',
    brandModel: 'AgriFly Precision Drone X10',
    dailyRate: 2200,
    location: 'Lucknow Region',
    district: 'Lucknow',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    specifications: ['10 Liters Payload', 'Covers 1 Acre in 7 Mins', 'Radar Obstacle Avoidance', 'Licensed Operator included'],
    available: true,
    rating: 5.0
  }
];

export const sampleEquipmentBookings: EquipmentBooking[] = [
  {
    id: 'bk-101',
    equipmentId: 'eq-1',
    equipmentTitle: 'Mahindra 575 DI SP Plus Tractor',
    ownerId: 'usr-eq-04',
    ownerName: 'Gurpreet Farm Machinery Services',
    farmerId: 'usr-farmer-01',
    farmerName: 'Rajesh Kumar Patel',
    farmerPhone: '+91 98765 43210',
    startDate: '2026-08-22',
    endDate: '2026-08-23',
    totalCost: 3600,
    status: 'confirmed',
    bookedAt: '2026-08-16'
  }
];

export const sampleNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Rainfall Alert for Lucknow District',
    message: 'Moderate rain expected tomorrow evening. Pause pesticide spray & ensure proper drainage in low lying plots.',
    type: 'weather',
    read: false,
    timestamp: '10 mins ago',
    link: 'weather'
  },
  {
    id: 'notif-2',
    title: 'New Offer on your Mustard Listing',
    message: 'AgriProcure Oil Mills sent a purchase request of ₹6,150/quintal for 40 Quintals of Mustard.',
    type: 'marketplace',
    read: false,
    timestamp: '2 hours ago',
    link: 'marketplace'
  },
  {
    id: 'notif-3',
    title: 'Wheat Mandi Price Rose by 1.8%',
    message: 'Modal wheat price in Lucknow Naveen Mandi increased to ₹2,540 / Quintal today.',
    type: 'mandi',
    read: true,
    timestamp: '5 hours ago',
    link: 'mandi'
  },
  {
    id: 'notif-4',
    title: 'Task Reminder: Urea Fertilizer Application',
    message: 'Scheduled top-dressing of Urea for Surya Ganga Green Field is due tomorrow.',
    type: 'task',
    read: true,
    timestamp: '1 day ago',
    link: 'farm'
  }
];

export const sampleHotspots: IHotspot[] = [
  {
    id: 'hs-1',
    title: 'Yellow Rust Outbreak Corridor',
    category: 'disease',
    pathogenOrPest: 'Yellow Rust (Puccinia striiformis)',
    crop: 'Wheat',
    state: 'Punjab',
    district: 'Ludhiana',
    latitude: 30.901,
    longitude: 75.8573,
    severity: 'CRITICAL',
    reportedCases: 42,
    affectedAreaAcres: 120,
    radiusKm: 12,
    lastReportedDate: '2026-09-05',
    status: 'active',
  },
  {
    id: 'hs-2',
    title: 'Whitefly Surge Belt',
    category: 'pest',
    pathogenOrPest: 'Whitefly (Bemisia tabaci)',
    crop: 'Cotton',
    state: 'Punjab',
    district: 'Bathinda',
    latitude: 30.211,
    longitude: 74.9455,
    severity: 'HIGH',
    reportedCases: 29,
    affectedAreaAcres: 85,
    radiusKm: 15,
    lastReportedDate: '2026-09-04',
    status: 'active',
  },
  {
    id: 'hs-3',
    title: 'Tomato Early Blight Cluster',
    category: 'disease',
    pathogenOrPest: 'Early Blight (Alternaria solani)',
    crop: 'Tomato',
    state: 'Haryana',
    district: 'Karnal',
    latitude: 29.6857,
    longitude: 76.9905,
    severity: 'MEDIUM',
    reportedCases: 18,
    affectedAreaAcres: 35,
    radiusKm: 8,
    lastReportedDate: '2026-09-03',
    status: 'monitored',
  },
  {
    id: 'hs-4',
    title: 'Fall Armyworm Infestation',
    category: 'pest',
    pathogenOrPest: 'Fall Armyworm (Spodoptera frugiperda)',
    crop: 'Maize',
    state: 'Madhya Pradesh',
    district: 'Chhindwara',
    latitude: 22.0574,
    longitude: 78.9382,
    severity: 'HIGH',
    reportedCases: 34,
    affectedAreaAcres: 95,
    radiusKm: 18,
    lastReportedDate: '2026-09-02',
    status: 'active',
  },
  {
    id: 'hs-5',
    title: 'Rice Blast Focus Zone',
    category: 'disease',
    pathogenOrPest: 'Rice Leaf Blast (Magnaporthe oryzae)',
    crop: 'Paddy',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    latitude: 25.3176,
    longitude: 82.9739,
    severity: 'HIGH',
    reportedCases: 26,
    affectedAreaAcres: 70,
    radiusKm: 10,
    lastReportedDate: '2026-09-01',
    status: 'active',
  },
  {
    id: 'hs-6',
    title: 'Mustard Aphid Cluster',
    category: 'pest',
    pathogenOrPest: 'Mustard Aphid (Lipaphis erysimi)',
    crop: 'Mustard',
    state: 'Rajasthan',
    district: 'Bharatpur',
    latitude: 27.2152,
    longitude: 77.503,
    severity: 'LOW',
    reportedCases: 9,
    affectedAreaAcres: 22,
    radiusKm: 6,
    lastReportedDate: '2026-08-30',
    status: 'monitored',
  },
];

export const sampleEarlyWarning: IEarlyWarning = {
  crop: 'Wheat',
  district: 'Ludhiana',
  state: 'Punjab',
  growthStage: 'Tillering & Flag Leaf Stage',
  diseaseRiskScore: 82,
  pestRiskScore: 44,
  riskLevel: 'HIGH',
  causalityReason: 'High relative humidity (86%) paired with moderate night temperature (16°C) and recent rainfall (14mm) creates an optimal environment for airborne Yellow Rust fungal sporulation.',
  recommendedAction: 'Inspect leaf undersides within 24 hours. Postpone overhead sprinkler irrigation and prepare prophylactic bio-fungicide (Trichoderma viride foliar spray @ 5g/L).',
  forecastTrend: [
    { day: 'Today (Day 1)', riskScore: 82, weatherFactor: '86% RH, 19°C, 14mm rain' },
    { day: 'Tomorrow (Day 2)', riskScore: 88, weatherFactor: 'Overcast, heavy morning dew' },
    { day: 'Day 3', riskScore: 65, weatherFactor: 'Partly cloudy, moderate wind' },
    { day: 'Day 4', riskScore: 42, weatherFactor: 'Dry westerly breeze, 24°C' },
    { day: 'Day 5', riskScore: 28, weatherFactor: 'Bright sunlight, low humidity' },
  ],
  generatedAt: new Date().toISOString(),
};

export const sampleLabReferrals: ILabReferral[] = [
  {
    id: 'ref-101',
    caseId: 'case-103',
    farmerId: 'farmer-103',
    farmerName: 'Surjit Singh Dhillon',
    cropName: 'Wheat (PBW-550)',
    suspectedIssue: 'Unidentified Stripe Necrosis (Suspected Novel Pathotype)',
    severity: 'CRITICAL',
    confidenceScore: 64,
    reasonForReferral: 'AI Confidence is below 70% confidence threshold with atypical necrotic margins. Lab spore PCR verification required.',
    targetLabName: 'Regional Plant Pathology Research Station & KVK Lab, PAU Ludhiana',
    location: 'PAU Campus, Ludhiana, Punjab',
    status: 'Referred',
    createdDate: '2026-09-04',
  },
  {
    id: 'ref-102',
    caseId: 'case-104',
    farmerId: 'farmer-104',
    farmerName: 'Rameshwar Lal',
    cropName: 'Cotton (BT Rasi)',
    suspectedIssue: 'Suspected CLCuV Viral Pathogen with Extreme Stunting',
    severity: 'HIGH',
    confidenceScore: 71,
    reasonForReferral: 'High vector pressure with severe vein thickening. Molecular diagnostic confirmation recommended.',
    targetLabName: 'Central Institute for Cotton Research (CICR) Regional Extension Lab',
    location: 'Sirsa, Haryana',
    status: 'Under Review',
    createdDate: '2026-09-02',
  },
];

export const sampleFollowUps: IFollowUp[] = [
  {
    id: 'fol-101',
    caseId: 'case-101',
    cropName: 'Wheat',
    initialDisease: 'Yellow Rust (Puccinia striiformis)',
    farmerName: 'Gurpreet Singh',
    day0Date: '2026-09-02',
    day0Image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    day3Date: '2026-09-05',
    day3Image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    day3Status: 'Improving',
    day3Notes: 'Trichoderma bio-spray applied on Day 1. Orange-yellow pustules have dried into dark brown lesions, active sporulation arrested.',
    currentStage: 'Day 3',
    overallTrend: 'Improvement',
  },
  {
    id: 'fol-102',
    caseId: 'case-102',
    cropName: 'Tomato',
    initialDisease: 'Early Blight (Alternaria solani)',
    farmerName: 'Balwinder Kaur',
    day0Date: '2026-09-04',
    day0Image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
    currentStage: 'Day 0',
    overallTrend: 'Stable',
  },
];

export const sampleFieldConfirmations: IFieldConfirmation[] = [
  {
    id: 'fc-101',
    caseId: 'case-101',
    aiDiagnosis: 'Yellow Rust (Puccinia striiformis)',
    wasAiCorrect: 'Correct',
    expertConfirmedDisease: 'Puccinia striiformis f. sp. tritici',
    crop: 'Wheat',
    district: 'Ludhiana',
    state: 'Punjab',
    finalYieldImpact: 'Negligible (< 2% loss due to prompt bio-spray application)',
    feedbackDate: '2026-09-05',
    notes: 'Model successfully diagnosed stripe rust at early vegetative onset.',
  },
];

export const samplePestObservations: IPestObservation[] = [
  {
    id: 'pest-obs-1',
    farmerId: 'farmer-101',
    cropName: 'Cotton',
    trapType: 'Sticky Trap',
    pestName: 'Whitefly (Bemisia tabaci)',
    estimatedCount: 28,
    etlStatus: 'EXCEEDED_ETL',
    imageUrl: 'https://images.unsplash.com/photo-1599818816933-4f9958ebc072?auto=format&fit=crop&w=600&q=80',
    location: { district: 'Bathinda', state: 'Punjab', latitude: 30.211, longitude: 74.9455 },
    severity: 'HIGH',
    observationDate: '2026-09-05',
    notes: '28 adult whiteflies counted on 10x15cm sticky trap. Threshold is 8 adults/leaf.',
    recommendedAction: 'Install yellow sticky traps @ 20 traps/acre and apply 5% Neem Seed Kernel Extract.',
  },
  {
    id: 'pest-obs-2',
    farmerId: 'farmer-102',
    cropName: 'Maize',
    trapType: 'Pheromone Trap',
    pestName: 'Fall Armyworm (Spodoptera frugiperda)',
    estimatedCount: 14,
    etlStatus: 'NEAR_ETL',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    location: { district: 'Chhindwara', state: 'Madhya Pradesh', latitude: 22.0574, longitude: 78.9382 },
    severity: 'MEDIUM',
    observationDate: '2026-09-04',
    notes: '14 adult moths per pheromone lure. Weekly catch trending upward.',
    recommendedAction: 'Release egg parasitoid Trichogramma @ 50,000/acre and check whorls.',
  },
];

export const sampleOfficialStats: OfficialStats = {
  totalReportedCases: 1482,
  activeOutbreaks: 6,
  highRiskDistricts: 4,
  verifiedCases: 1240,
  pendingVerification: 42,
  avgResponseTimeHours: 2.8,
  cropDistribution: [
    { crop: 'Wheat', cases: 560, risk: 'HIGH' },
    { crop: 'Cotton', cases: 395, risk: 'HIGH' },
    { crop: 'Paddy', cases: 310, risk: 'MEDIUM' },
    { crop: 'Tomato', cases: 145, risk: 'MEDIUM' },
    { crop: 'Mustard', cases: 72, risk: 'LOW' },
  ],
  monthlyIncidentTrend: [
    { month: 'Oct', fungal: 120, insect: 90, total: 210 },
    { month: 'Nov', fungal: 180, insect: 140, total: 320 },
    { month: 'Dec', fungal: 290, insect: 110, total: 400 },
    { month: 'Jan', fungal: 450, insect: 130, total: 580 },
    { month: 'Feb', fungal: 510, insect: 180, total: 690 },
  ],
  recentHotspots: sampleHotspots.slice(0, 5),
  recentReferrals: sampleLabReferrals.slice(0, 5),
};

