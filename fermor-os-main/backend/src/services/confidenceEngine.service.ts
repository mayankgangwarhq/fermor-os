import { ConfidenceTier, DecisionStatus, IClarificationQuestion, IDiagnosticCase } from '../types';

/**
 * Centralized Threshold Configuration for AGRINEXT AI Confidence Engine
 * All thresholds are defined here as the single source of truth.
 */
export const CONFIDENCE_THRESHOLDS = {
  HIGH_CONFIDENCE_MIN: 75,
  MEDIUM_CONFIDENCE_MIN: 45,
};

export interface ConfidenceEvaluation {
  tier: ConfidenceTier;
  decisionStatus: DecisionStatus;
  confidenceScore: number;
  recommendation: 'AI_ADVISORY' | 'CLARIFICATION_REQUIRED' | 'EXPERT_REVIEW';
  uncertaintyMessage?: string;
  clarificationQuestions?: IClarificationQuestion[];
}

export class ConfidenceEngineService {
  /**
   * Evaluates AI diagnostic output and determines tier, status, and whether human-in-the-loop is needed.
   */
  public static evaluate(
    confidenceScore: number,
    cropName: string,
    suspectedIssue: string,
    symptoms: string[] = []
  ): ConfidenceEvaluation {
    const score = Math.max(0, Math.min(100, Math.round(confidenceScore)));

    if (score >= CONFIDENCE_THRESHOLDS.HIGH_CONFIDENCE_MIN) {
      return {
        tier: 'HIGH_CONFIDENCE',
        decisionStatus: 'AI_ADVISORY',
        confidenceScore: score,
        recommendation: 'AI_ADVISORY',
      };
    } else if (score >= CONFIDENCE_THRESHOLDS.MEDIUM_CONFIDENCE_MIN) {
      const questions = this.generateClarificationQuestions(cropName, suspectedIssue, symptoms);
      return {
        tier: 'MEDIUM_CONFIDENCE',
        decisionStatus: 'CLARIFICATION_REQUIRED',
        confidenceScore: score,
        recommendation: 'CLARIFICATION_REQUIRED',
        uncertaintyMessage: 'AGRINEXT needs a little more information to confirm this diagnosis.',
        clarificationQuestions: questions,
      };
    } else {
      return {
        tier: 'LOW_CONFIDENCE',
        decisionStatus: 'EXPERT_REVIEW',
        confidenceScore: score,
        recommendation: 'EXPERT_REVIEW',
        uncertaintyMessage: 'AGRINEXT could not confidently identify the issue. Case automatically forwarded to an agricultural expert.',
      };
    }
  }

  /**
   * Generates tailored clarification questions to resolve ambiguity in Medium Confidence scenarios.
   */
  public static generateClarificationQuestions(
    cropName: string,
    suspectedIssue: string,
    initialSymptoms: string[] = []
  ): IClarificationQuestion[] {
    const cropLower = (cropName || '').toLowerCase();
    const issueLower = (suspectedIssue || '').toLowerCase();

    if (cropLower.includes('wheat') || issueLower.includes('rust')) {
      return [
        {
          id: 'symptom_location',
          question: 'Where are the symptoms primarily visible on the plant?',
          options: [
            'Upper leaf surface in linear stripe pattern',
            'Scattered pustules across entire leaf & sheath',
            'Only on lower older leaves',
            'On the stem and ear heads',
          ],
        },
        {
          id: 'spore_rub',
          question: 'When you gently rub the yellow/orange spots with your fingers, does yellow powder come off?',
          options: [
            'Yes, leaves a distinct yellow/orange powdery residue',
            'No, spots are dry and flat without powder',
            'Slight powdery film observed',
          ],
        },
        {
          id: 'spread_speed',
          question: 'How rapidly have the symptoms spread across the plot?',
          options: [
            'Rapidly appeared across large patch in last 2-3 days',
            'Gradual development over 1-2 weeks',
            'Isolated to only a few individual plants',
          ],
        },
      ];
    } else if (cropLower.includes('soybean') || issueLower.includes('mosaic')) {
      return [
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
          question: 'Are small white insects (whiteflies) or aphids seen when shaking the plants?',
          options: [
            'Yes, active swarm of whiteflies visible on underside of leaves',
            'Occasional insects spotted',
            'No visible insect vectors seen',
          ],
        },
        {
          id: 'leaf_texture',
          question: 'Is there leaf puckering, curling, or reduction in leaf size?',
          options: [
            'Noticeable puckering, wrinkling and stunted growth',
            'Leaves remain normal shape, only color changed',
            'Curling along leaf margins only',
          ],
        },
      ];
    } else if (cropLower.includes('tomato') || issueLower.includes('blight')) {
      return [
        {
          id: 'spot_appearance',
          question: 'What do the spots on the leaves look like?',
          options: [
            'Concentric target-like rings (dark brown/black)',
            'Water-soaked dark lesions spreading rapidly',
            'Tiny pinhole spots with yellow halo',
          ],
        },
        {
          id: 'leaf_age',
          question: 'Which leaves started showing symptoms first?',
          options: [
            'Older lower leaves near the soil line first',
            'New fresh leaves at the top shoots',
            'All levels simultaneously',
          ],
        },
        {
          id: 'stem_involvement',
          question: 'Are dark lesions or collar rot visible on stems near the base?',
          options: [
            'Yes, dark lesions present on lower stems',
            'No, symptoms strictly confined to leaf blades',
          ],
        },
      ];
    } else {
      return [
        {
          id: 'general_leaf_age',
          question: 'Are older or newer leaves primarily affected?',
          options: ['Older lower leaves', 'New top leaves and fresh shoots', 'Both equally'],
        },
        {
          id: 'spot_spread',
          question: 'Are spots or lesions actively spreading to neighboring leaves?',
          options: ['Yes, spreading quickly', 'Stable, confined to few spots', 'Unsure'],
        },
        {
          id: 'moisture_condition',
          question: 'Has there been high humidity, recent rainfall, or morning dew?',
          options: ['Yes, wet foliage and high humidity', 'Moderate moisture', 'Dry weather conditions'],
        },
      ];
    }
  }

  /**
   * Refines diagnostic confidence and diagnosis after the farmer submits answers to clarification questions.
   */
  public static refineConfidence(
    currentCase: IDiagnosticCase,
    answers: Record<string, string>
  ): {
    refinedConfidence: number;
    newTier: ConfidenceTier;
    newStatus: DecisionStatus;
    refinedDiagnosis: string;
    explanation: string;
  } {
    let boost = 0;
    const answerValues = Object.values(answers).map((a) => a.toLowerCase());

    // Evaluate answers to boost or confirm hypothesis
    if (answerValues.some((a) => a.includes('yellow/orange powdery') || a.includes('target-like') || a.includes('mosaic patches') || a.includes('whiteflies'))) {
      boost += 22;
    } else if (answerValues.some((a) => a.includes('rapidly') || a.includes('lower leaves') || a.includes('high humidity'))) {
      boost += 14;
    } else {
      boost += 8;
    }

    const refinedScore = Math.min(94, Math.round(currentCase.confidenceScore + boost));
    const isHigh = refinedScore >= CONFIDENCE_THRESHOLDS.HIGH_CONFIDENCE_MIN;

    return {
      refinedConfidence: refinedScore,
      newTier: isHigh ? 'HIGH_CONFIDENCE' : 'MEDIUM_CONFIDENCE',
      newStatus: isHigh ? 'AI_ADVISORY' : 'EXPERT_REVIEW',
      refinedDiagnosis: currentCase.topPrediction,
      explanation: isHigh
        ? `Clarification answers confirmed pathological markers for ${currentCase.topPrediction}. AI confidence elevated to ${refinedScore}%.`
        : `Clarification provided valuable context, but pathogen remains borderline. Case recommended for agronomist validation.`,
    };
  }
}
