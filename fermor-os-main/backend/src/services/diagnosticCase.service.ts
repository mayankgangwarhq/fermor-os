import { DiagnosticCaseModel } from '../models/DiagnosticCase';
import { isDbConnected } from '../config/db';
import { ConfidenceEngineService } from './confidenceEngine.service';
import { DiseaseDetectionService } from './diseaseDetection.service';
import {
  IDiagnosticCase,
  IExpertReviewPayload,
  IAuditTrailEntry,
  DecisionStatus,
  ExpertStatus,
} from '../types';

// In-Memory fallback store with initial demo cases
const inMemoryCases: IDiagnosticCase[] = [
  {
    id: 'CASE-1001',
    farmerId: 'farmer-101',
    farmerName: 'Ram Kumar (Rajesh)',
    farmerPhone: '+91 98765 43210',
    farmId: 'farm-1',
    cropName: 'Wheat',
    cropStage: 'Tillering / Jointing',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    location: {
      village: 'Sanganer Tehsil',
      district: 'Jaipur',
      state: 'Rajasthan',
      latitude: 26.9124,
      longitude: 75.7873,
      formattedAddress: 'Sanganer Tehsil, Jaipur, Rajasthan',
    },
    symptoms: ['Yellow pustules', 'Striped chlorosis'],
    aiPredictions: [
      {
        diseaseName: 'Yellow Rust (Stripe Rust)',
        scientificName: 'Puccinia striiformis',
        confidenceScore: 88,
        riskLevel: 'HIGH',
        causes: ['High humidity (84%)', 'Cool night temperatures (14°C)'],
        ipmAdvisory: {
          prevention: ['Use certified rust-resistant seed varieties', 'Maintain adequate plant spacing'],
          cultural: ['Avoid excessive urea application during foggy spells'],
          mechanical: ['Prune and burn heavily infected foliage at initial detection'],
          biological: ['Apply Trichoderma viride @ 5g/L as preventive bio-agent'],
          chemical: ['Spray Propiconazole 25% EC @ 1 ml/L during calm morning window'],
          monitoring: ['Inspect lower leaf canopy every 48 hours'],
        },
      },
    ],
    topPrediction: 'Yellow Rust (Stripe Rust)',
    confidenceScore: 88,
    riskLevel: 'HIGH',
    confidenceTier: 'HIGH_CONFIDENCE',
    decisionStatus: 'AI_ADVISORY',
    expertStatus: 'none',
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        action: 'AI_DIAGNOSIS_COMPLETED',
        performedBy: 'AGRINEXT AI Confidence Engine',
        role: 'system',
        newStatus: 'AI_ADVISORY',
        details: 'Initial specimen analyzed with 88% confidence (High Confidence).',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'CASE-1002',
    farmerId: 'farmer-102',
    farmerName: 'Baldev Singh',
    farmerPhone: '+91 98123 45678',
    farmId: 'farm-2',
    cropName: 'Soybean',
    cropStage: 'Pod Initiation',
    imageUrl: 'https://images.unsplash.com/photo-1599818816933-4f9958ebc072?auto=format&fit=crop&w=600&q=80',
    location: {
      village: 'Karnal Block',
      district: 'Karnal',
      state: 'Haryana',
      latitude: 29.6857,
      longitude: 76.9905,
      formattedAddress: 'Karnal Block, Karnal, Haryana',
    },
    symptoms: ['Leaf yellowing', 'Mottled discoloration'],
    aiPredictions: [
      {
        diseaseName: 'Yellow Mosaic Virus (YMV)',
        scientificName: 'Soybean Yellow Mosaic Geminivirus',
        confidenceScore: 62,
        riskLevel: 'HIGH',
        causes: ['Vector transmission by Whiteflies (Bemisia tabaci)'],
        ipmAdvisory: {
          prevention: ['Install yellow sticky traps (15-20 traps/acre)'],
          cultural: ['Eradicate host weeds along field borders'],
          mechanical: ['Roguing out infected virus reservoir plants'],
          biological: ['Spray Neem oil 10,000 PPM @ 3ml/L'],
          chemical: ['Spray Thiamethoxam 25% WG @ 0.3g/L for vector knockdown'],
          monitoring: ['Monitor daily whitefly trap counts'],
        },
      },
    ],
    topPrediction: 'Yellow Mosaic Virus (YMV)',
    confidenceScore: 62,
    riskLevel: 'HIGH',
    confidenceTier: 'MEDIUM_CONFIDENCE',
    decisionStatus: 'CLARIFICATION_REQUIRED',
    expertStatus: 'pending',
    clarificationQuestions: [
      {
        id: 'leaf_pattern',
        question: 'What pattern of discoloration is observed on the foliage?',
        options: [
          'Alternating bright yellow and dark green mosaic patches',
          'Uniform yellowing of entire leaf blade',
          'Necrotic brown spots with yellow borders',
        ],
      },
      {
        id: 'pest_presence',
        question: 'Are small white insects (whiteflies) seen when shaking plants?',
        options: [
          'Yes, active swarm of whiteflies visible on leaf undersides',
          'Occasional insects spotted',
          'No visible insect vectors seen',
        ],
      },
    ],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        action: 'AI_DIAGNOSIS_COMPLETED',
        performedBy: 'AGRINEXT AI Confidence Engine',
        role: 'system',
        newStatus: 'CLARIFICATION_REQUIRED',
        details: 'Confidence evaluated at 62% (Medium Confidence). Clarification questions formulated.',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'CASE-1003',
    farmerId: 'farmer-103',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 97234 56789',
    farmId: 'farm-3',
    cropName: 'Tomato',
    cropStage: 'Flowering & Fruiting',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
    location: {
      village: 'Sanwer',
      district: 'Indore',
      state: 'Madhya Pradesh',
      latitude: 22.7196,
      longitude: 75.8577,
      formattedAddress: 'Sanwer, Indore, Madhya Pradesh',
    },
    symptoms: ['Stem rot', 'Unclear dark lesions'],
    aiPredictions: [
      {
        diseaseName: 'Early Blight (Alternaria solani)',
        scientificName: 'Alternaria solani',
        confidenceScore: 38,
        riskLevel: 'MEDIUM',
        causes: ['Soil-borne fungal residues', 'Excess overhead irrigation'],
      },
    ],
    topPrediction: 'Early Blight (Alternaria solani)',
    confidenceScore: 38,
    riskLevel: 'MEDIUM',
    confidenceTier: 'LOW_CONFIDENCE',
    decisionStatus: 'EXPERT_REVIEW',
    expertStatus: 'pending',
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        action: 'AI_DIAGNOSIS_COMPLETED',
        performedBy: 'AGRINEXT AI Confidence Engine',
        role: 'system',
        newStatus: 'EXPERT_REVIEW',
        details: 'Low confidence (38%) caused by ambiguous lesions. Automatically routed to expert review queue.',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

export class DiagnosticCaseService {
  /**
   * Creates a new Diagnostic Case from leaf image & symptoms, runs Confidence Engine, and saves case.
   */
  public static async createCase(payload: {
    cropName: string;
    cropStage?: string;
    imageUrl: string;
    symptoms?: string[];
    notes?: string;
    location?: {
      village?: string;
      district?: string;
      state?: string;
      latitude?: number;
      longitude?: number;
      formattedAddress?: string;
    };
    farmerId?: string;
    farmerName?: string;
    farmerPhone?: string;
    farmId?: string;
    cropId?: string;
    requestedConfidence?: number; // Optional override for testing confidence tiers
  }): Promise<IDiagnosticCase> {
    const cropName = (payload.cropName || 'Wheat').trim();
    const symptoms = payload.symptoms || [];

    // Run AI Detection Pipeline
    const aiRaw = await DiseaseDetectionService.analyzeImageAndDiagnose(
      {
        cropName,
        symptoms,
        notes: payload.notes,
        imageUrl: payload.imageUrl,
      },
      payload.farmerId,
      payload.farmId
    );

    const confidenceScore =
      typeof payload.requestedConfidence === 'number'
        ? payload.requestedConfidence
        : aiRaw.confidenceScore;

    // Run Centralized Confidence Engine
    const evalResult = ConfidenceEngineService.evaluate(
      confidenceScore,
      cropName,
      aiRaw.suspectedIssue,
      symptoms
    );

    const caseId = `CASE-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    const initialAudit: IAuditTrailEntry = {
      timestamp: nowIso,
      action: 'CASE_CREATED_AI_ANALYZED',
      performedBy: 'AGRINEXT AI Confidence Engine',
      role: 'system',
      newStatus: evalResult.decisionStatus,
      details: `Inference completed with ${evalResult.confidenceScore}% confidence (${evalResult.tier.replace('_', ' ')}). Next status: ${evalResult.decisionStatus}.`,
    };

    const newCase: IDiagnosticCase = {
      id: caseId,
      farmerId: payload.farmerId || 'farmer-101',
      farmerName: payload.farmerName || 'Rajesh Kumar (Farmer)',
      farmerPhone: payload.farmerPhone || '+91 98765 43210',
      farmId: payload.farmId || 'farm-1',
      cropId: payload.cropId,
      cropName,
      cropStage: payload.cropStage || 'Vegetative',
      imageUrl: payload.imageUrl,
      location: {
        village: payload.location?.village || '',
        district: payload.location?.district || 'Jaipur',
        state: payload.location?.state || 'Rajasthan',
        latitude: payload.location?.latitude || 26.9124,
        longitude: payload.location?.longitude || 75.7873,
        formattedAddress: payload.location?.formattedAddress || 'Jaipur, Rajasthan',
      },
      symptoms,
      aiPredictions: [
        {
          diseaseName: aiRaw.suspectedIssue,
          confidenceScore: evalResult.confidenceScore,
          riskLevel: aiRaw.riskLevel,
          causes: [aiRaw.generalExplanation],
          ipmAdvisory: {
            prevention: aiRaw.preventiveSuggestions || [],
            cultural: ['Maintain clean field margins', 'Avoid overhead sprinkler splash'],
            mechanical: ['Prune visibly infected lower leaves'],
            biological: aiRaw.recommendedTreatments?.organic || [],
            chemical: aiRaw.recommendedTreatments?.chemical || [],
            monitoring: aiRaw.nextSteps || [],
          },
        },
      ],
      topPrediction: aiRaw.suspectedIssue,
      confidenceScore: evalResult.confidenceScore,
      riskLevel: aiRaw.riskLevel,
      confidenceTier: evalResult.tier,
      decisionStatus: evalResult.decisionStatus,
      expertStatus: evalResult.tier === 'LOW_CONFIDENCE' ? 'pending' : 'none',
      farmerNotes: payload.notes,
      clarificationQuestions: evalResult.clarificationQuestions || [],
      clarificationAnswers: {},
      auditTrail: [initialAudit],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    if (isDbConnected()) {
      try {
        const doc = await DiagnosticCaseModel.create(newCase);
        const json = doc.toJSON();
        inMemoryCases.unshift(json);
        return json;
      } catch (err) {
        console.warn('[DiagnosticCaseService] DB create failed, falling back to memory store:', err);
      }
    }

    inMemoryCases.unshift(newCase);
    return newCase;
  }

  /**
   * Retrieves all diagnostic cases matching optional filters.
   */
  public static async getCases(filter?: {
    farmerId?: string;
    decisionStatus?: string;
    riskLevel?: string;
    cropName?: string;
    expertStatus?: string;
  }): Promise<IDiagnosticCase[]> {
    if (isDbConnected()) {
      try {
        const query: any = {};
        if (filter?.farmerId) query.farmerId = filter.farmerId;
        if (filter?.decisionStatus) query.decisionStatus = filter.decisionStatus;
        if (filter?.riskLevel) query.riskLevel = filter.riskLevel;
        if (filter?.cropName) query.cropName = new RegExp(filter.cropName, 'i');
        if (filter?.expertStatus) query.expertStatus = filter.expertStatus;

        const docs = await DiagnosticCaseModel.find(query).sort({ createdAt: -1 });
        if (docs && docs.length > 0) {
          return docs.map((d) => d.toJSON());
        }
      } catch (err) {
        console.warn('[DiagnosticCaseService] DB query failed, falling back to memory store:', err);
      }
    }

    // Filter memory store
    return inMemoryCases.filter((c) => {
      if (filter?.farmerId && c.farmerId !== filter.farmerId) return false;
      if (filter?.decisionStatus && c.decisionStatus !== filter.decisionStatus) return false;
      if (filter?.riskLevel && c.riskLevel !== filter.riskLevel) return false;
      if (filter?.cropName && !c.cropName.toLowerCase().includes(filter.cropName.toLowerCase())) return false;
      if (filter?.expertStatus && c.expertStatus !== filter.expertStatus) return false;
      return true;
    });
  }

  /**
   * Retrieves a single diagnostic case by ID.
   */
  public static async getCaseById(id: string): Promise<IDiagnosticCase | null> {
    if (isDbConnected()) {
      try {
        const doc = await DiagnosticCaseModel.findOne({ $or: [{ _id: id }, { id }] });
        if (doc) return doc.toJSON();
      } catch (err) {
        console.warn('[DiagnosticCaseService] DB getCaseById failed, checking memory store:', err);
      }
    }

    return inMemoryCases.find((c) => c.id === id || c._id === id) || null;
  }

  /**
   * Submits farmer answers to clarification questions, recalculating confidence and updating status.
   */
  public static async submitClarification(
    caseId: string,
    answers: Record<string, string>,
    user?: { id?: string; name?: string; role?: string }
  ): Promise<IDiagnosticCase> {
    const targetCase = await this.getCaseById(caseId);
    if (!targetCase) {
      throw new Error(`Diagnostic case ${caseId} not found`);
    }

    const refinement = ConfidenceEngineService.refineConfidence(targetCase, answers);
    const nowIso = new Date().toISOString();

    const auditEntry: IAuditTrailEntry = {
      timestamp: nowIso,
      action: 'CLARIFICATION_SUBMITTED',
      performedBy: user?.name || targetCase.farmerName || 'Farmer User',
      role: user?.role || 'farmer',
      previousStatus: targetCase.decisionStatus,
      newStatus: refinement.newStatus,
      details: `${refinement.explanation} (New score: ${refinement.refinedConfidence}%)`,
    };

    targetCase.clarificationAnswers = answers;
    targetCase.confidenceScore = refinement.refinedConfidence;
    targetCase.confidenceTier = refinement.newTier;
    targetCase.decisionStatus = refinement.newStatus;
    targetCase.updatedAt = nowIso;
    targetCase.auditTrail.push(auditEntry);

    if (refinement.newTier === 'HIGH_CONFIDENCE') {
      targetCase.finalDiagnosis = refinement.refinedDiagnosis;
      targetCase.finalConfidence = refinement.refinedConfidence;
    }

    if (isDbConnected()) {
      try {
        await DiagnosticCaseModel.findOneAndUpdate(
          { $or: [{ _id: caseId }, { id: caseId }] },
          {
            $set: {
              clarificationAnswers: targetCase.clarificationAnswers,
              confidenceScore: targetCase.confidenceScore,
              confidenceTier: targetCase.confidenceTier,
              decisionStatus: targetCase.decisionStatus,
              finalDiagnosis: targetCase.finalDiagnosis,
              finalConfidence: targetCase.finalConfidence,
              updatedAt: nowIso,
            },
            $push: { auditTrail: auditEntry },
          }
        );
      } catch (err) {
        console.warn('[DiagnosticCaseService] DB update clarification failed:', err);
      }
    }

    return targetCase;
  }

  /**
   * Farmer escalates a diagnostic case to Agriculture Agronomist / Expert review.
   */
  public static async requestExpertReview(
    caseId: string,
    farmerNotes?: string,
    user?: { id?: string; name?: string; role?: string }
  ): Promise<IDiagnosticCase> {
    const targetCase = await this.getCaseById(caseId);
    if (!targetCase) {
      throw new Error(`Diagnostic case ${caseId} not found`);
    }

    const nowIso = new Date().toISOString();
    const auditEntry: IAuditTrailEntry = {
      timestamp: nowIso,
      action: 'EXPERT_REVIEW_REQUESTED',
      performedBy: user?.name || targetCase.farmerName || 'Farmer User',
      role: user?.role || 'farmer',
      previousStatus: targetCase.decisionStatus,
      newStatus: 'EXPERT_REVIEW',
      details: farmerNotes ? `Farmer added note: "${farmerNotes}"` : 'Farmer requested formal agronomist review.',
    };

    targetCase.decisionStatus = 'EXPERT_REVIEW';
    targetCase.expertStatus = 'pending';
    if (farmerNotes) targetCase.farmerNotes = farmerNotes;
    targetCase.updatedAt = nowIso;
    targetCase.auditTrail.push(auditEntry);

    if (isDbConnected()) {
      try {
        await DiagnosticCaseModel.findOneAndUpdate(
          { $or: [{ _id: caseId }, { id: caseId }] },
          {
            $set: {
              decisionStatus: 'EXPERT_REVIEW',
              expertStatus: 'pending',
              farmerNotes: targetCase.farmerNotes,
              updatedAt: nowIso,
            },
            $push: { auditTrail: auditEntry },
          }
        );
      } catch (err) {
        console.warn('[DiagnosticCaseService] DB request expert review failed:', err);
      }
    }

    return targetCase;
  }

  /**
   * Agronomist / Expert reviews diagnostic case and submits verdict.
   */
  public static async submitExpertReview(
    caseId: string,
    reviewPayload: IExpertReviewPayload,
    expertUser?: { id?: string; name?: string; role?: string }
  ): Promise<IDiagnosticCase> {
    const targetCase = await this.getCaseById(caseId);
    if (!targetCase) {
      throw new Error(`Diagnostic case ${caseId} not found`);
    }

    const nowIso = new Date().toISOString();
    let newDecisionStatus: DecisionStatus = 'EXPERT_CONFIRMED';
    let newExpertStatus: ExpertStatus = 'confirmed';

    switch (reviewPayload.decision) {
      case 'CONFIRM':
        newDecisionStatus = 'EXPERT_CONFIRMED';
        newExpertStatus = 'confirmed';
        targetCase.finalDiagnosis = reviewPayload.finalDiagnosis || targetCase.topPrediction;
        targetCase.finalConfidence = 99;
        break;
      case 'REJECT':
        newDecisionStatus = 'EXPERT_REJECTED';
        newExpertStatus = 'rejected';
        targetCase.finalDiagnosis = reviewPayload.finalDiagnosis || 'Pathogen Rejected / Corrected';
        targetCase.finalConfidence = 95;
        break;
      case 'REQUEST_MORE_INFO':
        newDecisionStatus = 'CLARIFICATION_REQUIRED';
        newExpertStatus = 'pending';
        break;
      case 'REFER_TO_LAB':
        newDecisionStatus = 'LAB_REFERRAL';
        newExpertStatus = 'referred_to_lab';
        break;
    }

    const expertName = expertUser?.name || reviewPayload.expertName || 'Dr. Ramesh Sharma (Agronomist)';
    const expertId = expertUser?.id || reviewPayload.expertId || 'expert-201';

    const auditEntry: IAuditTrailEntry = {
      timestamp: nowIso,
      action: `EXPERT_${reviewPayload.decision}`,
      performedBy: expertName,
      role: expertUser?.role || 'expert',
      previousStatus: targetCase.decisionStatus,
      newStatus: newDecisionStatus,
      details: `Verdict: ${reviewPayload.decision}. Notes: ${reviewPayload.notes}. Final diagnosis: ${targetCase.finalDiagnosis || targetCase.topPrediction}.`,
    };

    targetCase.decisionStatus = newDecisionStatus;
    targetCase.expertStatus = newExpertStatus;
    targetCase.expertId = expertId;
    targetCase.expertName = expertName;
    targetCase.expertDiagnosis = reviewPayload.finalDiagnosis || targetCase.topPrediction;
    if (reviewPayload.severity) targetCase.expertSeverity = reviewPayload.severity;
    targetCase.expertNotes = reviewPayload.notes;
    targetCase.expertRecommendedAction = reviewPayload.recommendedAction;
    targetCase.resolvedAt = new Date();
    targetCase.updatedAt = nowIso;
    targetCase.auditTrail.push(auditEntry);

    if (isDbConnected()) {
      try {
        await DiagnosticCaseModel.findOneAndUpdate(
          { $or: [{ _id: caseId }, { id: caseId }] },
          {
            $set: {
              decisionStatus: newDecisionStatus,
              expertStatus: newExpertStatus,
              expertId,
              expertName,
              expertDiagnosis: targetCase.expertDiagnosis,
              expertSeverity: targetCase.expertSeverity,
              expertNotes: targetCase.expertNotes,
              expertRecommendedAction: targetCase.expertRecommendedAction,
              finalDiagnosis: targetCase.finalDiagnosis,
              finalConfidence: targetCase.finalConfidence,
              resolvedAt: targetCase.resolvedAt,
              updatedAt: nowIso,
            },
            $push: { auditTrail: auditEntry },
          }
        );
      } catch (err) {
        console.warn('[DiagnosticCaseService] DB submit expert review failed:', err);
      }
    }

    return targetCase;
  }
}
