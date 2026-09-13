export type UserRole = 'farmer' | 'buyer' | 'expert' | 'equipment_owner' | 'admin';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertType = 'DISEASE' | 'PEST' | 'WEATHER' | 'IRRIGATION' | 'CROP_RISK';

export type CropStatus = 'planned' | 'sown' | 'growing' | 'harvest_ready' | 'harvested' | 'sold';

export interface IUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  state?: string;
  district?: string;
  village?: string;
  language?: string;
  avatar?: string;
  bio?: string;
  authMethod?: 'email' | 'aadhaar_demo';
  aadhaarHash?: string;
  aadhaarLast4?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IFarmer {
  _id?: string;
  id?: string;
  userId: string;
  farmerId: string;
  experienceYears?: number;
  totalLandAcres?: number;
  primaryCrops?: string[];
  kycStatus?: 'pending' | 'verified' | 'rejected';
  govtIdType?: string;
  govtIdNumber?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IFarm {
  _id?: string;
  id?: string;
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ICrop {
  _id?: string;
  id?: string;
  farmId: string;
  farmerId?: string;
  cropName: string;
  variety: string;
  sowingDate: string | Date;
  expectedHarvestDate: string | Date;
  growthStage: string;
  status: CropStatus;
  estimatedYieldKg?: number;
  actualYieldKg?: number;
  areaAllocated?: number;
  notes?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IDisease {
  _id?: string;
  id?: string;
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IPest {
  _id?: string;
  id?: string;
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IWeatherAlert {
  id?: string;
  type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  actionableStep: string;
}

export interface IWeatherForecastDay {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainChance: number;
  icon: string;
}

export interface IWeatherData {
  _id?: string;
  location: string;
  district: string;
  state: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  forecast: IWeatherForecastDay[];
  alerts: IWeatherAlert[];
  sourceStatus: 'LIVE DATA' | 'DEMO DATA';
  lastUpdated: string | Date;
}

export interface IAlert {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  type: AlertType;
  farmId?: string;
  cropId?: string;
  farmerId?: string;
  read: boolean;
  actionableStep?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
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

export interface IDiagnosisRequest {
  cropName?: string;
  symptoms?: string[];
  notes?: string;
  imageUrl?: string;
  imageBase64?: string;
  language?: string;
}

export interface IDiagnosisResult {
  id?: string;
  isMockDemo: boolean;
  status: VisionAnalysisStatus;
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
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  observedSymptoms: string[];
  userReportedSymptoms?: string[];
  visualEvidence?: string[];
  possibleCauses?: string[];
  generalExplanation: string;
  analysisNote?: string;
  preventiveSuggestions: string[];
  ipmAdvisory?: any;
  recommendedTreatments: {
    organic: string[];
    chemical: string[];
  };
  nextSteps: string[];
  sourceStatus: string;
  requiresLabVerification?: boolean;
  needsExpertReview?: boolean;
  timestamp?: string;
}

export interface IScanCase {
  _id?: string;
  id?: string;
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
  ipmAdvisory: {
    prevention: string[];
    cultural: string[];
    mechanical: string[];
    biological: string[];
    chemical: string[];
    monitoring: string[];
  };
  expertStatus: 'none' | 'pending' | 'verified' | 'corrected' | 'lab_referred';
  expertReview?: IExpertReview;
  followUpStatus?: 'none' | 'day0' | 'day3' | 'day7' | 'resolved';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IPestObservation {
  _id?: string;
  id?: string;
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

export interface IHotspot {
  _id?: string;
  id?: string;
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
  _id?: string;
  id?: string;
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
  _id?: string;
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
  _id?: string;
  id?: string;
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
  _id?: string;
  id?: string;
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
  _id?: string;
  id?: string;
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

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
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
  | 'LAB_REFERRAL'
  | 'RESOLVED';

export type ExpertStatus = 'none' | 'pending' | 'confirmed' | 'rejected' | 'referred_to_lab';

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
  role: string;
  previousStatus?: string;
  newStatus: string;
  details?: string;
}

export interface IDiagnosticCase {
  _id?: string;
  id?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  farmId?: string;
  cropId?: string;
  cropName: string;
  cropStage?: string;
  imageUrl: string;
  location: {
    village?: string;
    district: string;
    state: string;
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
  };
  symptoms: string[];
  aiPredictions: {
    diseaseName: string;
    scientificName?: string;
    confidenceScore: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    causes?: string[];
    ipmAdvisory?: {
      prevention: string[];
      cultural: string[];
      mechanical: string[];
      biological: string[];
      chemical: string[];
      monitoring: string[];
    };
  }[];
  topPrediction: string;
  confidenceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
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
  auditTrail: IAuditTrailEntry[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  resolvedAt?: Date | string;
}

export interface IExpertReviewPayload {
  decision: 'CONFIRM' | 'REJECT' | 'REQUEST_MORE_INFO' | 'REFER_TO_LAB';
  expertId?: string;
  expertName?: string;
  finalDiagnosis?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  notes: string;
  recommendedAction?: string;
  targetLabName?: string;
}

export interface IMandiPrice {
  _id?: string;
  id?: string;
  commodity: string;
  variety?: string;
  grade?: string;
  market: string;
  district: string;
  state: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  priceUnit: string;
  priceChangePercent?: number;
  trend?: 'up' | 'down' | 'stable';
  arrivalTonnes?: number;
  date: string;
  isDemo?: boolean;
  sourceStatus?: 'DEMO DATA' | 'LIVE DATA';
  notes?: string;
}

export interface IScheme {
  _id?: string;
  id?: string;
  title: string;
  titleHi?: string;
  category: 'direct_benefit' | 'subsidy' | 'insurance' | 'infrastructure' | 'credit';
  sponsor: 'Central Govt' | 'State Govt' | 'NABARD' | 'Joint';
  benefitSummary: string;
  benefitSummaryHi?: string;
  eligibilityCriteria: string[];
  documentsRequired: string[];
  subsidyPercentage?: number;
  maxFinancialAssistance?: string;
  applicationUrl?: string;
  applicationDeadline?: string;
  active: boolean;
}

export interface IDashboardStats {
  totalFarms: number;
  totalLandAcres: number;
  activeCropCycles: number;
  criticalAlerts: number;
  weatherOverview: {
    temp: number;
    condition: string;
    humidity: number;
    rainChance: number;
    location: string;
  };
  recentScans: any[];
  recentAlerts: any[];
  topMandiRates: any[];
}

