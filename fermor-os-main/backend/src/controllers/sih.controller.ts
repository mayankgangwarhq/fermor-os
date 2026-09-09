import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { isDbConnected } from '../config/db';
import { HotspotModel } from '../models/Hotspot';
import { ScanCaseModel } from '../models/ScanCase';
import { PestObservationModel } from '../models/PestObservation';
import { EarlyWarningModel } from '../models/EarlyWarning';
import { LabReferralModel } from '../models/LabReferral';
import { FollowUpModel } from '../models/FollowUp';
import { FieldConfirmationModel } from '../models/FieldConfirmation';
import { IHotspot, IScanCase, IPestObservation, IEarlyWarning, ILabReferral, IFollowUp, IFieldConfirmation } from '../types';

// In-Memory Fallback Store for Standalone / Demo / Offline Mode
let inMemoryHotspots: IHotspot[] = [
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
    lastReportedDate: new Date().toISOString().split('T')[0],
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
    lastReportedDate: new Date().toISOString().split('T')[0],
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
    lastReportedDate: new Date().toISOString().split('T')[0],
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
    lastReportedDate: new Date().toISOString().split('T')[0],
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
    lastReportedDate: new Date().toISOString().split('T')[0],
    status: 'active',
  },
];

let inMemoryScanCases: IScanCase[] = [
  {
    id: 'case-101',
    farmerId: 'farmer-101',
    farmerName: 'Gurpreet Singh',
    farmerPhone: '+91 98765 12345',
    cropName: 'Wheat',
    growthStage: 'Tillering / Flag Leaf',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    suspectedIssue: 'Yellow Rust (Puccinia striiformis)',
    confidenceScore: 94,
    riskLevel: 'HIGH',
    symptoms: ['Yellow powdery pustules in parallel lines', 'Chlorotic leaf streaks', 'Premature leaf drying'],
    location: { district: 'Ludhiana', state: 'Punjab', latitude: 30.901, longitude: 75.8573 },
    ipmAdvisory: {
      prevention: ['Use resistant varieties HD-2967, DBW-187', 'Avoid late sowing beyond November'],
      cultural: ['Avoid excessive urea application', 'Provide proper drainage to prevent waterlogging'],
      mechanical: ['Eradicate alternate weed hosts on bunds'],
      biological: ['Foliar bio-spray of Trichoderma viride @ 5g/L', 'Neem Seed Kernel Extract 5%'],
      chemical: ['Spray Propiconazole 25% EC @ 1ml/L only if ETL > 5% leaves infected'],
      monitoring: ['Inspect leaf undersides every 48 hours during humid morning spells'],
    },
    expertStatus: 'verified',
    expertReview: {
      caseId: 'case-101',
      expertId: 'exp-1',
      expertName: 'Dr. Ramesh Sharma',
      expertTitle: 'Chief Agronomist & Plant Pathologist',
      decision: 'confirmed',
      confirmedPathogen: 'Puccinia striiformis f. sp. tritici',
      notes: 'Characteristic stripe uredinia confirmed. Follow bio-spray protocol immediately.',
      reviewDate: new Date().toISOString().split('T')[0],
    },
    followUpStatus: 'day3',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'case-102',
    farmerId: 'farmer-102',
    farmerName: 'Balwinder Kaur',
    farmerPhone: '+91 98765 67890',
    cropName: 'Tomato',
    growthStage: 'Flowering & Early Fruiting',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
    suspectedIssue: 'Early Blight (Alternaria solani)',
    confidenceScore: 91,
    riskLevel: 'MEDIUM',
    symptoms: ['Concentric dark brown rings on lower leaves', 'Yellow margin around lesions'],
    location: { district: 'Karnal', state: 'Haryana', latitude: 29.6857, longitude: 76.9905 },
    ipmAdvisory: {
      prevention: ['Mulch beds to block soil spore splash', 'Rotate with non-solanaceous crops'],
      cultural: ['Use drip irrigation rather than overhead sprinklers', 'Prune infected lower foliage'],
      mechanical: ['Stake plants to improve air circulation'],
      biological: ['Bacillus subtilis bio-fungicide foliar spray @ 3g/L', 'Copper Oxychloride 50 WP @ 2.5g/L'],
      chemical: ['Spray Mancozeb 75% WP @ 2.5g/L if lesions spread above 3rd node'],
      monitoring: ['Re-evaluate after 3 days; check new flush for spot formation'],
    },
    expertStatus: 'pending',
    followUpStatus: 'day0',
    createdAt: new Date().toISOString(),
  },
];

let inMemoryPestObservations: IPestObservation[] = [
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
    observationDate: new Date().toISOString().split('T')[0],
    notes: '28 whiteflies counted on 10x15cm yellow trap within 48 hours. Exceeds ETL of 8 adults/leaf.',
    recommendedAction: 'Apply Neem Formulation 10,000 PPM @ 3ml/L or Diafenthiuron 50 WP @ 1.2g/L.',
  },
  {
    id: 'pest-obs-2',
    farmerId: 'farmer-102',
    cropName: 'Maize',
    trapType: 'Pheromone Trap',
    pestName: 'Fall Armyworm (Spodoptera frugiperda)',
    estimatedCount: 12,
    etlStatus: 'NEAR_ETL',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    location: { district: 'Chhindwara', state: 'Madhya Pradesh', latitude: 22.0574, longitude: 78.9382 },
    severity: 'MEDIUM',
    observationDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    notes: '12 adult moths caught per trap per week. Approaching critical threshold.',
    recommendedAction: 'Release egg parasitoid Trichogramma pretiosum @ 50,000/acre.',
  },
];

let inMemoryReferrals: ILabReferral[] = [
  {
    id: 'ref-1',
    caseId: 'case-103',
    farmerId: 'farmer-103',
    farmerName: 'Surjit Singh',
    cropName: 'Wheat',
    suspectedIssue: 'Unidentified Stripe Necrosis (Suspected Novel Pathotype)',
    severity: 'CRITICAL',
    confidenceScore: 64,
    reasonForReferral: 'AI Confidence below 70% threshold with atypical necrotic margins. Lab spore PCR verification required.',
    targetLabName: 'Regional Plant Pathology Research Station & KVK Lab, PAU Ludhiana',
    location: 'Ludhiana, Punjab',
    status: 'Referred',
    createdDate: new Date().toISOString().split('T')[0],
  },
];

let inMemoryFollowUps: IFollowUp[] = [
  {
    id: 'fol-1',
    caseId: 'case-101',
    cropName: 'Wheat',
    initialDisease: 'Yellow Rust',
    farmerName: 'Gurpreet Singh',
    day0Date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    day0Image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    day3Date: new Date().toISOString().split('T')[0],
    day3Image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    day3Status: 'Improving',
    day3Notes: 'Bio-fungicide spray applied on Day 1. Rust pustules have turned dry and dark brown, sporulation halted.',
    currentStage: 'Day 3',
    overallTrend: 'Improvement',
  },
];

let inMemoryConfirmations: IFieldConfirmation[] = [
  {
    id: 'fc-1',
    caseId: 'case-101',
    aiDiagnosis: 'Yellow Rust (Puccinia striiformis)',
    wasAiCorrect: 'Correct',
    expertConfirmedDisease: 'Puccinia striiformis f. sp. tritici',
    crop: 'Wheat',
    district: 'Ludhiana',
    state: 'Punjab',
    finalYieldImpact: 'Negligible (< 2% loss due to timely bio-spray)',
    feedbackDate: new Date().toISOString().split('T')[0],
    notes: 'Model successfully predicted stripe rust 4 days before widespread epidemic.',
  },
];

export class SihController {
  // 1. Hotspots
  public static async getHotspots(req: Request, res: Response, next: NextFunction) {
    try {
      const { crop, category, severity, district } = req.query;
      let list = inMemoryHotspots;

      if (isDbConnected()) {
        const query: any = {};
        if (crop) query.crop = new RegExp(crop as string, 'i');
        if (category) query.category = category;
        if (severity) query.severity = severity;
        if (district) query.district = new RegExp(district as string, 'i');
        list = await HotspotModel.find(query).sort({ reportedCases: -1 });
      } else {
        if (crop) list = list.filter((h) => h.crop.toLowerCase().includes((crop as string).toLowerCase()));
        if (category) list = list.filter((h) => h.category === category);
        if (severity) list = list.filter((h) => h.severity === severity);
        if (district) list = list.filter((h) => h.district.toLowerCase().includes((district as string).toLowerCase()));
      }

      return sendSuccess(res, list, 'Geospatial disease and pest hotspots retrieved');
    } catch (err) {
      next(err);
    }
  }

  public static async createHotspot(req: Request, res: Response, next: NextFunction) {
    try {
      const newHotspot: IHotspot = {
        ...req.body,
        id: `hs-${Date.now()}`,
        lastReportedDate: new Date().toISOString().split('T')[0],
      };
      if (isDbConnected()) {
        await HotspotModel.create(newHotspot);
      } else {
        inMemoryHotspots.unshift(newHotspot);
      }
      return sendCreated(res, newHotspot, 'Hotspot registered successfully');
    } catch (err) {
      next(err);
    }
  }

  // 2. Weather-Based Early Warning Engine
  public static async getEarlyWarning(req: Request, res: Response, next: NextFunction) {
    try {
      const crop = (req.query.crop as string) || 'Wheat';
      const district = (req.query.district as string) || 'Ludhiana';
      const growthStage = (req.query.stage as string) || 'Flowering & Grain Filling';
      const humidity = Number(req.query.humidity) || 84;
      const temp = Number(req.query.temp) || 19;
      const rainfall = Number(req.query.rainfall) || 12;

      // Agronomic Risk Calculation Engine
      let diseaseRisk = 30;
      let pestRisk = 25;
      let causality = '';

      if (humidity > 75 && temp >= 12 && temp <= 24) {
        diseaseRisk += 45; // Fungal sporulation sweet-spot
        causality += `High relative humidity (${humidity}%) paired with moderate temperature (${temp}°C) creates high fungal spore germination risk. `;
      }

      if (rainfall > 5) {
        diseaseRisk += 15;
        causality += `Recent rainfall (${rainfall}mm) prolongs leaf wetness duration. `;
      }

      if (temp > 28 && humidity > 60) {
        pestRisk += 50; // Sucking pests & bollworms flourish
        causality += `Warm humid conditions accelerate insect pest reproduction cycles. `;
      } else {
        pestRisk += 15;
      }

      diseaseRisk = Math.min(96, Math.max(15, diseaseRisk));
      pestRisk = Math.min(92, Math.max(10, pestRisk));

      const overallMax = Math.max(diseaseRisk, pestRisk);
      const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' =
        overallMax >= 80 ? 'HIGH' : overallMax >= 55 ? 'MEDIUM' : 'LOW';

      const forecastTrend = [
        { day: 'Day 1 (Today)', riskScore: diseaseRisk, weatherFactor: `${humidity}% RH, ${temp}°C` },
        { day: 'Day 2 (+24h)', riskScore: Math.min(98, diseaseRisk + 4), weatherFactor: 'Overcast, high dew' },
        { day: 'Day 3 (+48h)', riskScore: Math.max(20, diseaseRisk - 5), weatherFactor: 'Sunny, clearing winds' },
        { day: 'Day 4 (+72h)', riskScore: Math.max(15, diseaseRisk - 18), weatherFactor: 'Dry westerly breeze' },
        { day: 'Day 5 (+96h)', riskScore: Math.max(15, diseaseRisk - 25), weatherFactor: 'Optimal sunlight' },
      ];

      const earlyWarning: IEarlyWarning = {
        crop,
        district,
        state: 'Punjab',
        growthStage,
        diseaseRiskScore: diseaseRisk,
        pestRiskScore: pestRisk,
        riskLevel,
        causalityReason: causality || 'Normal environmental parameters within safe agronomic baseline.',
        recommendedAction:
          riskLevel === 'HIGH'
            ? 'Inspect leaf undersides within 24h. Postpone overhead irrigation and prepare prophylactic bio-fungicide (Trichoderma @ 5g/L).'
            : 'Continue standard IPM field scouting schedule.',
        forecastTrend,
        generatedAt: new Date().toISOString(),
      };

      return sendSuccess(res, earlyWarning, 'Microclimate early warning risk assessment computed');
    } catch (err) {
      next(err);
    }
  }

  // 3. Scan Cases
  public static async getScanCases(req: Request, res: Response, next: NextFunction) {
    try {
      let list = inMemoryScanCases;
      if (isDbConnected()) {
        list = await ScanCaseModel.find().sort({ createdAt: -1 });
      }
      return sendSuccess(res, list, 'Diagnostic scan cases retrieved');
    } catch (err) {
      next(err);
    }
  }

  public static async createScanCase(req: Request, res: Response, next: NextFunction) {
    try {
      const newCase: IScanCase = {
        ...req.body,
        id: `case-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      if (isDbConnected()) {
        await ScanCaseModel.create(newCase);
      } else {
        inMemoryScanCases.unshift(newCase);
      }
      return sendCreated(res, newCase, 'Scan case logged successfully');
    } catch (err) {
      next(err);
    }
  }

  // 4. Expert Validation Review
  public static async submitExpertReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId, decision, confirmedPathogen, notes, customPrescription } = req.body;
      const target = inMemoryScanCases.find((c) => c.id === caseId || c._id === caseId);

      if (target) {
        target.expertStatus = decision === 'confirmed' ? 'verified' : decision === 'corrected' ? 'corrected' : 'lab_referred';
        target.expertReview = {
          caseId,
          expertId: req.body.expertId || 'exp-1',
          expertName: req.body.expertName || 'Dr. Ramesh Sharma',
          expertTitle: req.body.expertTitle || 'Senior Plant Pathologist',
          decision,
          confirmedPathogen: confirmedPathogen || target.suspectedIssue,
          notes: notes || 'Clinical assessment concluded.',
          customPrescription,
          reviewDate: new Date().toISOString().split('T')[0],
        };
      }

      if (isDbConnected()) {
        await ScanCaseModel.findOneAndUpdate(
          { $or: [{ id: caseId }, { _id: caseId }] },
          {
            expertStatus: target?.expertStatus,
            expertReview: target?.expertReview,
          }
        );
      }

      return sendSuccess(res, target?.expertReview, 'Expert clinical validation recorded');
    } catch (err) {
      next(err);
    }
  }

  // 5. Extension / Lab Referrals
  public static async getReferrals(req: Request, res: Response, next: NextFunction) {
    try {
      let list = inMemoryReferrals;
      if (isDbConnected()) {
        list = await LabReferralModel.find().sort({ createdAt: -1 });
      }
      return sendSuccess(res, list, 'Lab and extension referrals retrieved');
    } catch (err) {
      next(err);
    }
  }

  public static async createReferral(req: Request, res: Response, next: NextFunction) {
    try {
      const newRef: ILabReferral = {
        ...req.body,
        id: `ref-${Date.now()}`,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Referred',
      };
      if (isDbConnected()) {
        await LabReferralModel.create(newRef);
      } else {
        inMemoryReferrals.unshift(newRef);
      }
      return sendCreated(res, newRef, 'Extension laboratory referral created');
    } catch (err) {
      next(err);
    }
  }

  // 6. Follow-up Recovery Monitoring
  public static async getFollowUps(req: Request, res: Response, next: NextFunction) {
    try {
      let list = inMemoryFollowUps;
      if (isDbConnected()) {
        list = await FollowUpModel.find().sort({ createdAt: -1 });
      }
      return sendSuccess(res, list, 'Follow-up monitoring trackers retrieved');
    } catch (err) {
      next(err);
    }
  }

  public static async updateFollowUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId, stage, image, status, notes, cropName, initialDisease, farmerName } = req.body;
      let existing = inMemoryFollowUps.find((f) => f.caseId === caseId);

      if (!existing) {
        existing = {
          id: `fol-${Date.now()}`,
          caseId: caseId || `case-${Date.now()}`,
          cropName: cropName || 'Wheat',
          initialDisease: initialDisease || 'Yellow Rust',
          farmerName: farmerName || 'Ram Kumar',
          day0Date: new Date().toISOString().split('T')[0],
          currentStage: 'Day 0',
          overallTrend: 'Stable',
        };
        inMemoryFollowUps.unshift(existing);
      }

      if (stage === 'Day 3') {
        existing.day3Date = new Date().toISOString().split('T')[0];
        existing.day3Image = image || existing.day3Image;
        existing.day3Status = status || 'Improving';
        existing.day3Notes = notes;
        existing.currentStage = 'Day 3';
        existing.overallTrend = status === 'Improving' ? 'Improvement' : status === 'Worsened' ? 'Worsening' : 'Stable';
      } else if (stage === 'Day 7') {
        existing.day7Date = new Date().toISOString().split('T')[0];
        existing.day7Image = image || existing.day7Image;
        existing.day7Status = status || 'Healed';
        existing.day7Notes = notes;
        existing.currentStage = 'Day 7';
        existing.overallTrend = status === 'Healed' ? 'Improvement' : status === 'Worsened' ? 'Worsening' : 'Stable';
      }

      if (isDbConnected()) {
        await FollowUpModel.findOneAndUpdate({ caseId }, existing, { upsert: true, new: true });
      }

      return sendSuccess(res, existing, 'Follow-up monitoring record updated');
    } catch (err) {
      next(err);
    }
  }

  // 7. Field Confirmation & AI Feedback
  public static async submitFieldConfirmation(req: Request, res: Response, next: NextFunction) {
    try {
      const newConfirmation: IFieldConfirmation = {
        ...req.body,
        id: `fc-${Date.now()}`,
        feedbackDate: new Date().toISOString().split('T')[0],
      };
      if (isDbConnected()) {
        await FieldConfirmationModel.create(newConfirmation);
      } else {
        inMemoryConfirmations.unshift(newConfirmation);
      }
      return sendCreated(res, newConfirmation, 'Field confirmation logged for model training pipeline');
    } catch (err) {
      next(err);
    }
  }

  public static async getFieldConfirmations(req: Request, res: Response, next: NextFunction) {
    try {
      let list = inMemoryConfirmations;
      if (isDbConnected()) {
        list = await FieldConfirmationModel.find().sort({ createdAt: -1 });
      }
      return sendSuccess(res, list, 'Field confirmation and feedback records retrieved');
    } catch (err) {
      next(err);
    }
  }

  // 8. Pest Trap Observations
  public static async getPestObservations(req: Request, res: Response, next: NextFunction) {
    try {
      let list = inMemoryPestObservations;
      if (isDbConnected()) {
        list = await PestObservationModel.find().sort({ createdAt: -1 });
      }
      return sendSuccess(res, list, 'Pest trap observations retrieved');
    } catch (err) {
      next(err);
    }
  }

  public static async createPestObservation(req: Request, res: Response, next: NextFunction) {
    try {
      const newObs: IPestObservation = {
        ...req.body,
        id: `pest-obs-${Date.now()}`,
        observationDate: new Date().toISOString().split('T')[0],
      };
      if (isDbConnected()) {
        await PestObservationModel.create(newObs);
      } else {
        inMemoryPestObservations.unshift(newObs);
      }
      return sendCreated(res, newObs, 'Pest observation recorded');
    } catch (err) {
      next(err);
    }
  }

  // 9. Agriculture Official Department Telemetry
  public static async getOfficialStats(req: Request, res: Response, next: NextFunction) {
    try {
      const totalReportedCases = 1420 + inMemoryScanCases.length;
      const activeOutbreaks = inMemoryHotspots.filter((h) => h.status === 'active').length;
      const highRiskDistricts = 4;
      const verifiedCases = 1180;
      const pendingVerification = 48;
      const avgResponseTimeHours = 3.2;

      const cropDistribution = [
        { crop: 'Wheat', cases: 540, risk: 'HIGH' },
        { crop: 'Cotton', cases: 380, risk: 'HIGH' },
        { crop: 'Paddy', cases: 290, risk: 'MEDIUM' },
        { crop: 'Tomato', cases: 140, risk: 'MEDIUM' },
        { crop: 'Mustard', cases: 70, risk: 'LOW' },
      ];

      const monthlyIncidentTrend = [
        { month: 'Oct', fungal: 120, insect: 90, total: 210 },
        { month: 'Nov', fungal: 180, insect: 140, total: 320 },
        { month: 'Dec', fungal: 290, insect: 110, total: 400 },
        { month: 'Jan', fungal: 450, insect: 130, total: 580 },
        { month: 'Feb', fungal: 510, insect: 180, total: 690 },
      ];

      const response = {
        totalReportedCases,
        activeOutbreaks,
        highRiskDistricts,
        verifiedCases,
        pendingVerification,
        avgResponseTimeHours,
        cropDistribution,
        monthlyIncidentTrend,
        recentHotspots: inMemoryHotspots.slice(0, 5),
        recentReferrals: inMemoryReferrals.slice(0, 5),
      };

      return sendSuccess(res, response, 'Agriculture official department overview retrieved');
    } catch (err) {
      next(err);
    }
  }
}
