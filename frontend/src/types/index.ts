export type UserRole = 'farmer' | 'buyer' | 'expert' | 'equipment_owner' | 'admin';

export type Language =
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'mr' // Marathi (मराठी)
  | 'ur' // Urdu (اردو)
  | 'bn' // Bengali (বাংলা)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'ta' // Tamil (தமிழ்)
  | 'te' // Telugu (తెలుగు)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'as' // Assamese (অসমীয়া)
  | 'ne' // Nepali (नेपाली)
  | 'sa' // Sanskrit (संस्कृतम्)
  | 'fa' // Persian (فارسی)
  | 'ar'; // Arabic (العربية)

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  script: string;
  dir: 'ltr' | 'rtl';
  region?: string;
  sampleGreeting: string;
}

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertType = 'DISEASE' | 'PEST' | 'WEATHER' | 'IRRIGATION' | 'CROP_RISK';

export interface FarmLocation {
  latitude: number;
  longitude: number;
  village?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  formattedAddress: string;
  source: 'gps' | 'search' | 'manual';
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  state: string;
  district: string;
  village: string;
  language: Language;
  avatar?: string;
  bio?: string;
  createdDate?: string;
}

export interface Farm {
  id: string;
  _id?: string;
  farmerId: string;
  name: string;
  location: string;
  district?: string;
  state?: string;
  area: number;
  unit: 'acres' | 'bigha' | 'hectares';
  soilType: 'Alluvial' | 'Black' | 'Red' | 'Laterite' | 'Sandy';
  irrigation: 'Canal' | 'Borewell' | 'Drip' | 'Rainfed' | 'Sprinkler';
  farmingType: 'Organic' | 'Conventional' | 'Mixed';
  crops: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  status?: 'active' | 'inactive';
}

export type CropStatus = 'planned' | 'sown' | 'growing' | 'harvest_ready' | 'harvested' | 'sold';

export interface CropCycle {
  id: string;
  _id?: string;
  farmId: string;
  farmName?: string;
  farmerId?: string;
  cropName: string;
  variety: string;
  status: CropStatus;
  sowingDate: string;
  expectedHarvestDate: string;
  growthStage?: string;
  estimatedYieldKg?: number;
  actualYieldKg?: number;
  areaAllocated?: number;
  notes?: string;
}

export interface DiseaseData {
  id: string;
  _id?: string;
  cropName: string;
  diseaseName: string;
  scientificName?: string;
  symptoms: string[];
  causes: string[];
  preventiveMeasures: string[];
  chemicalTreatments: string[];
  organicTreatments: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  imageUrl?: string;
  seasonalOccurrence?: string;
}

export interface PestData {
  id: string;
  _id?: string;
  cropName: string;
  pestName: string;
  scientificName?: string;
  identification: string[];
  symptoms: string[];
  management: string[];
  organicControl: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  seasonalPeak?: string;
  imageUrl?: string;
}

export interface Alert {
  id: string;
  _id?: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  type: AlertType;
  farmId?: string;
  cropId?: string;
  farmerId?: string;
  read: boolean;
  actionableStep?: string;
  createdAt: string;
}

export type TaskCategory = 'irrigation' | 'fertilizer' | 'inspection' | 'harvest' | 'selling' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface FarmTask {
  id: string;
  farmId: string;
  title: string;
  category: TaskCategory;
  dueDate: string;
  priority: TaskPriority;
  completed: boolean;
  notes?: string;
}

export type ExpenseCategory = 'seeds' | 'fertilizer' | 'labour' | 'irrigation' | 'equipment' | 'transport' | 'other';

export interface FarmExpense {
  id: string;
  farmId: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes: string;
}

export interface FarmRevenue {
  id: string;
  farmId: string;
  cropName: string;
  quantity: number;
  unit: string;
  amount: number;
  buyerName: string;
  date: string;
}

export interface WeatherDayForecast {
  day: string;
  date?: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainChance: number;
  precipitationSum?: number;
  weatherCode?: number;
  icon: string;
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'heat' | 'wind' | 'irrigation' | 'disease';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  actionableStep: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  weatherCode?: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  precipitation?: number;
  location: string;
  district: string;
  state: string;
  latitude?: number;
  longitude?: number;
  forecast: WeatherDayForecast[];
  alerts: WeatherAlert[];
  source?: string;
  sourceStatus: 'LIVE DATA' | 'DEMO DATA' | 'UNAVAILABLE';
  isFallback?: boolean;
  lastUpdated: string;
  errorMessage?: string;
}

export interface MandiPrice {
  id: string;
  commodity: string;
  variety: string;
  grade?: string;
  state: string;
  district: string;
  market?: string;
  mandi: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  priceUnit?: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  priceChangePercent?: number;
  arrivalTonnes?: number;
  sourceStatus: 'LIVE DATA' | 'DEMO DATA';
  isDemo?: boolean;
  notes?: string;
}

export interface MandiApiResponse {
  success: boolean;
  provider: 'DEMO / MOCK' | 'DATA_GOV_IN';
  governmentApiConnected: boolean;
  isDemo: boolean;
  disclaimer: string;
  total: number;
  records: MandiPrice[];
}

export interface MandiFilterOptions {
  states: string[];
  districts: Record<string, string[]>;
  markets: Record<string, string[]>;
  commodities: string[];
  varieties: Record<string, string[]>;
  grades: string[];
}

export type ListingStatus = 'active' | 'interested' | 'sold' | 'expired';

export interface MarketplaceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  district: string;
  state: string;
  crop: string;
  variety: string;
  quantity: number;
  unit: 'Quintals' | 'Kg' | 'Tons';
  qualityGrade: 'A+' | 'A' | 'B';
  expectedPrice: number;
  harvestDate: string;
  status: ListingStatus;
  images: string[];
  description: string;
  listedDate: string;
  interestedCount: number;
}

export interface PurchaseRequest {
  id: string;
  listingId: string;
  cropName: string;
  buyerId: string;
  buyerName: string;
  buyerCompany?: string;
  buyerPhone: string;
  offeredPrice: number;
  quantity: number;
  unit: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestDate: string;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  qualification: string;
  specialization: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  location: string;
  languages: string[];
  availability: string;
  consultationFee: number;
  avatar: string;
  bio: string;
}

export interface Consultation {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  cropIssueTitle: string;
  cropName: string;
  description: string;
  image?: string;
  status: 'pending' | 'answered';
  answer?: string;
  createdAt: string;
  answeredAt?: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  hindiName: string;
  category: 'Subsidies' | 'Crop Insurance' | 'Loans' | 'Equipment' | 'Irrigation' | 'Solar' | 'Farmer Welfare';
  description: string;
  eligibility: string[];
  benefits: string;
  requiredDocs: string[];
  officialSource: string;
  lastVerifiedDate: string;
  maxBenefitAmount?: string;
}

export interface Equipment {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  title: string;
  category: 'Tractor' | 'Harvester' | 'Rotavator' | 'Seeder' | 'Sprayer' | 'Cultivator' | 'Pump';
  brandModel: string;
  dailyRate: number;
  location: string;
  district: string;
  image: string;
  specifications: string[];
  available: boolean;
  rating: number;
}

export interface EquipmentBooking {
  id: string;
  equipmentId: string;
  equipmentTitle: string;
  ownerId: string;
  ownerName: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'task' | 'mandi' | 'scheme' | 'expert' | 'marketplace' | 'equipment';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface AIDiseaseCardPayload {
  crop: string;
  disease: string;
  risk: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  confidence: number;
  environmentalFactors?: string[];
  preventiveAction?: string;
  chemicalTreatment?: string;
  biologicalTreatment?: string;
  sprayWindow?: string;
  imageUrl?: string;
}

export interface AIWeatherCardPayload {
  temp: string;
  condition: string;
  humidity: string;
  rainProb: string;
  windSpeed: string;
  sprayWindowStatus: string;
  recommendation: string;
}

export interface AIFollowUpCardPayload {
  crop: string;
  plotName: string;
  initialDate: string;
  followUpDate: string;
  recoveryPercent: number;
  recoverySummary: string;
  initialImage: string;
  followUpImage: string;
  nextCheckupDate: string;
  lesionStatus: string;
}

export interface AIHotspotCardPayload {
  district: string;
  distance: string;
  disease: string;
  affectedFarms: number;
  threatLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  advisory: string;
}

export interface AIActionButton {
  label: string;
  action: 'navigate' | 'scan' | 'upload_followup' | 'expert' | 'weather' | 'custom' | 'schemes' | 'external';
  target?: string;
  payload?: any;
}

export interface AIPestCardPayload {
  pestName: string;
  scientificName?: string;
  cropName: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  etlStatus?: string;
  symptoms?: string[];
  management?: string[];
  organicControl?: string[];
}

export interface AIMandiCardPayload {
  commodity: string;
  variety?: string;
  market: string;
  district?: string;
  state?: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  priceUnit: string;
  trend?: 'up' | 'down' | 'stable';
  date?: string;
}

export interface AISchemeCardPayload {
  title: string;
  titleHi?: string;
  sponsor: string;
  benefitSummary: string;
  maxFinancialAssistance?: string;
  subsidyPercentage?: number;
  eligibilityCriteria?: string[];
  documentsRequired?: string[];
  applicationUrl?: string;
  applicationDeadline?: string;
}

export interface AIStructuredResponse {
  understanding: string;
  information: string;
  nextSteps: string[];
  sourceStatus: 'LIVE API' | 'VERIFIED DB' | 'AI GUIDANCE' | 'DEMO DATA' | 'LIVE GEMINI API' | 'VERIFIED GOVT DB';
  diseaseCard?: AIDiseaseCardPayload;
  pestCard?: AIPestCardPayload;
  weatherCard?: AIWeatherCardPayload;
  mandiCard?: AIMandiCardPayload;
  schemeCard?: AISchemeCardPayload;
  followUpCard?: AIFollowUpCardPayload;
  hotspotCard?: AIHotspotCardPayload;
  actionButtons?: AIActionButton[];
  sources?: Array<{ name: string; url?: string; lastUpdated?: string }>;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  structuredResponse?: AIStructuredResponse;
  image?: string;
  timestamp: string;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: AIChatMessage[];
}

export interface IPMAdvisory {
  prevention: string[];
  cultural: string[];
  mechanical: string[];
  biological: string[];
  chemical: string[];
  monitoring: string[];
  whatToDoNow: string[];
  whatToAvoid: string[];
  whenToInspectAgain: string;
  whenToContactExpert: string;
}

export type VisionAnalysisStatus =
  | 'success'
  | 'uncertain'
  | 'low_quality'
  | 'invalid_image'
  | 'missing_api_key'
  | 'vision_request_failed'
  | 'model_response_invalid'
  | 'network_error'
  | 'analysis_unavailable';

export type DiagnosticType = 'disease' | 'pest' | 'healthy' | 'unknown';

export interface DiagnosticResult {
  isMockDemo?: boolean;
  status?: VisionAnalysisStatus;
  diagnosisType?: DiagnosticType;

  // Standard structured response contract
  success?: boolean;
  isPlant?: boolean;
  crop?: string;
  disease?: string;
  pathogen?: string;
  confidence?: number;
  severity?: string;
  symptoms?: string[];
  recommendations?: string[];
  reasoning?: string;

  cropName: string;
  detectedCrop?: {
    name: string;
    confidence: number;
    matchedUserSelection: boolean;
    note?: string;
  };
  suspectedIssue: string;
  scientificName?: string;
  confidenceScore: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  observedSymptoms: string[];
  visualEvidence?: string[];
  possibleCauses?: string[];
  generalExplanation: string;
  analysisNote?: string;
  preventiveSuggestions: string[];
  recommendedNextSteps?: string[];
  ipmAdvisory?: IPMAdvisory;
  recommendedTreatments?: {
    organic: string[];
    chemical: string[];
  };
  nextSteps?: string[];
  sourceStatus: string;
  requiresLabVerification?: boolean;
  needsExpertReview?: boolean;
  timestamp?: string;
}

export interface IHotspot {
  id: string;
  _id?: string;
  title: string;
  category: 'disease' | 'pest';
  pathogenOrPest: string;
  crop: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reportedCases: number;
  affectedAreaAcres: number;
  radiusKm: number;
  lastReportedDate: string;
  status: 'active' | 'contained' | 'monitored';
}

export interface IEarlyWarning {
  id?: string;
  _id?: string;
  crop: string;
  district: string;
  state: string;
  growthStage: string;
  diseaseRiskScore: number;
  pestRiskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  causalityReason: string;
  recommendedAction: string;
  forecastTrend: {
    day: string;
    riskScore: number;
    weatherFactor: string;
  }[];
  generatedAt: string;
}

export interface IExpertReview {
  id?: string;
  caseId: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  decision: 'confirmed' | 'corrected' | 'lab_referred' | 'more_info_needed';
  confirmedPathogen: string;
  notes: string;
  customPrescription?: {
    organic: string[];
    chemical: string[];
  };
  reviewDate: string;
}

export interface ILabReferral {
  id: string;
  _id?: string;
  caseId: string;
  farmerId?: string;
  farmerName: string;
  cropName: string;
  suspectedIssue: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidenceScore: number;
  reasonForReferral: string;
  targetLabName: string;
  location: string;
  status: 'Pending' | 'Under Review' | 'Referred' | 'Verified' | 'Resolved';
  createdDate: string;
}

export interface IFollowUp {
  id: string;
  _id?: string;
  caseId: string;
  cropName: string;
  initialDisease: string;
  farmerName: string;
  day0Date: string;
  day0Image?: string;
  day3Date?: string;
  day3Image?: string;
  day3Status?: 'Improving' | 'Stable' | 'Worsened';
  day3Notes?: string;
  day7Date?: string;
  day7Image?: string;
  day7Status?: 'Healed' | 'Stable' | 'Worsened';
  day7Notes?: string;
  currentStage: 'Day 0' | 'Day 3' | 'Day 7' | 'Resolved';
  overallTrend: 'Improvement' | 'Stable' | 'Worsening';
}

export interface IFieldConfirmation {
  id?: string;
  _id?: string;
  caseId: string;
  aiDiagnosis: string;
  wasAiCorrect: 'Correct' | 'Partially Correct' | 'Incorrect';
  expertConfirmedDisease: string;
  crop: string;
  district: string;
  state: string;
  finalYieldImpact: string;
  feedbackDate: string;
  notes?: string;
}

export interface IPestObservation {
  id: string;
  _id?: string;
  farmerId?: string;
  cropName: string;
  trapType: 'Sticky Trap' | 'Pheromone Trap' | 'Light Trap' | 'Field Specimen';
  pestName: string;
  estimatedCount: number;
  etlStatus: 'BELOW_ETL' | 'NEAR_ETL' | 'EXCEEDED_ETL';
  imageUrl?: string;
  location: {
    district: string;
    state: string;
    latitude?: number;
    longitude?: number;
  };
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  observationDate: string;
  notes?: string;
  recommendedAction: string;
}

export interface IScanCase {
  id: string;
  _id?: string;
  farmerId?: string;
  farmerName?: string;
  farmerPhone?: string;
  farmId?: string;
  cropName: string;
  growthStage?: string;
  imageUrl?: string;
  suspectedIssue: string;
  confidenceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  symptoms: string[];
  location?: {
    district: string;
    state: string;
    latitude?: number;
    longitude?: number;
  };
  ipmAdvisory: IPMAdvisory;
  expertStatus: 'none' | 'pending' | 'verified' | 'corrected' | 'lab_referred';
  expertReview?: IExpertReview;
  followUpStatus?: 'none' | 'day0' | 'day3' | 'day7' | 'resolved';
  createdAt?: string;
}

export interface OfficialStats {
  totalReportedCases: number;
  activeOutbreaks: number;
  highRiskDistricts: number;
  verifiedCases: number;
  pendingVerification: number;
  avgResponseTimeHours: number;
  cropDistribution: { crop: string; cases: number; risk: string }[];
  monthlyIncidentTrend: { month: string; fungal: number; insect: number; total: number }[];
  recentHotspots: IHotspot[];
  recentReferrals: ILabReferral[];
}

// --- SIH-26131 Diagnostic Confidence Engine & Expert Validation Workflow ---

export type ConfidenceTier = 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';

export type DecisionStatus =
  | 'AI_PROCESSING'
  | 'AI_ADVISORY'
  | 'CLARIFICATION_REQUIRED'
  | 'EXPERT_REVIEW'
  | 'EXPERT_CONFIRMED'
  | 'EXPERT_REJECTED'
  | 'VALIDATED_BY_EXPERT'
  | 'OVERRIDDEN_BY_EXPERT'
  | 'LAB_REFERRAL'
  | 'RESOLVED';

export type ExpertStatus =
  | 'none'
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'referred_to_lab'
  | 'NONE'
  | 'PENDING'
  | 'VALIDATED'
  | 'REFERRED_TO_LAB';

export interface IClarificationQuestion {
  id: string;
  question: string;
  options: string[];
  selectedAnswer?: string;
}

export interface IAuditTrailEntry {
  timestamp: string;
  action: string;
  performedBy: string;
  role?: string;
  previousStatus?: string;
  newStatus?: string;
  details?: string;
}

export interface DiagnosticCase {
  id: string;
  _id?: string;
  caseNumber?: string;
  farmerId?: string;
  farmerName?: string;
  farmerPhone?: string;
  farmId?: string;
  cropId?: string;
  cropName: string;
  cropStage?: string;
  imageUrl?: string;
  location?: {
    village?: string;
    district: string;
    state: string;
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
  };
  symptoms?: string[];
  initialSymptoms?: string[];
  scientificName?: string;
  aiPredictions?: {
    diseaseName: string;
    scientificName?: string;
    confidenceScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    causes?: string[];
    ipmAdvisory?: IPMAdvisory;
  }[];
  topPrediction: string;
  confidenceScore: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidenceTier: ConfidenceTier;
  decisionStatus: DecisionStatus;
  expertStatus: ExpertStatus;
  expertId?: string;
  expertName?: string;
  expertDiagnosis?: string;
  expertSeverity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  expertNotes?: string;
  expertRecommendedAction?: string;
  farmerNotes?: string;
  clarificationQuestions?: IClarificationQuestion[];
  clarificationAnswers?: Record<string, string>;
  finalDiagnosis?: string;
  finalConfidence?: number;
  expertReview?: {
    reviewedBy: string;
    reviewedAt: string;
    decision: 'CONFIRM' | 'REJECT' | 'REQUEST_MORE_INFO' | 'REFER_TO_LAB';
    verifiedDisease?: string;
    prescribedTreatments?: {
      chemical?: string[];
      organic?: string[];
    };
    notes?: string;
  };
  auditTrail: IAuditTrailEntry[];
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string;
}

export interface ExpertReviewPayload {
  decision: 'CONFIRM' | 'REJECT' | 'REQUEST_MORE_INFO' | 'REFER_TO_LAB';
  expertId?: string;
  expertName?: string;
  reviewedBy?: string;
  verifiedDisease?: string;
  finalDiagnosis?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  verifiedRiskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  notes: string;
  recommendedAction?: string;
  prescribedTreatments?: {
    chemical?: string[];
    organic?: string[];
  };
  targetLabName?: string;
}



