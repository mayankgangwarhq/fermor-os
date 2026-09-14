import { config } from '../config/env';
import { logger } from '../utils/logger';
import { IDiagnosisRequest, IDiagnosisResult, VisionAnalysisStatus, DiagnosticType } from '../types';
import { normalizeConfidenceDecimal, confidenceToScorePercentage } from '../utils/confidenceNormalizer';

export const DEDICATED_CROP_DISEASE_SYSTEM_PROMPT = `You are AGRINEXT Crop Disease Vision Engine. Analyze ONLY the actual uploaded plant/leaf image. Your primary task is to identify visually supported crop diseases, pests, nutrient deficiencies, physical damage, or healthy condition.

DO NOT assume the disease from the selected crop.
DO NOT assume the disease from previous scans.
DO NOT reuse previous results.
DO NOT use hardcoded diseases.
DO NOT use hardcoded confidence values.

The uploaded image is the primary evidence.

First determine:
1. Is this actually a plant/leaf/crop image?
2. Is the image sufficiently clear for diagnosis?
3. What crop/plant is visible?
4. What visible symptoms are present?
5. What disease, pest, deficiency, physical damage, or healthy condition best explains those symptoms?

IMPORTANT DIAGNOSTIC RULES:
- Never fabricate a disease.
- Never return Yellow Rust unless the uploaded image actually supports it.
- Never return Wheat unless wheat is actually visible or strongly supported.
- Never copy symptoms from previous scans or UI defaults.
- User-selected symptoms are context only.
- AI-observed symptoms must come directly from the image.
- If evidence is insufficient, return unknown.
- If image is not a plant image, return invalid_image and set is_plant = false.
- If image quality is insufficient, return low_quality.
- If multiple diseases are plausible, return the most likely diagnosis and clearly indicate uncertainty.
- CONFIDENCE MUST BE A REALISTIC DECIMAL VALUE BETWEEN 0.0 AND 1.0 (e.g., 0.88 = 88% confidence, 0.78 = 78%, 0.63 = 63%, 0.42 = 42%) representing genuine visual evidence certainty. Do not invent fake certainty.

Inspect:
- leaf color, chlorosis, necrosis, spots, lesions, pustules, streaks, rings, margins
- fungal growth, powdery growth, mildew, leaf curling, wilting, holes, chewing damage
- insect presence, eggs, larvae, webbing, mosaic patterns, deformation, stem symptoms

Return structured JSON only using this EXACT schema:
{
  "status": "success | invalid_image | low_quality | analysis_unavailable",
  "is_plant": true,
  "crop": "Wheat",
  "crop_confidence": 0.92,
  "diagnosis": "Yellow Rust (Stripe Rust)",
  "diagnosis_type": "disease | pest | nutrient_deficiency | healthy | physical_damage | unknown",
  "pathogen": "scientific name or N/A",
  "confidence": 0.88,
  "severity": "low | medium | high | critical | unknown",
  "symptoms": [
    "Only symptoms visibly observed on foliage in the image"
  ],
  "visualEvidence": [
    "Specific visual markers observed in the image"
  ],
  "recommendedActions": [
    "Actionable management and treatment recommendations"
  ],
  "needs_expert_review": true,
  "reasoning": "Brief visual pathology rationale"
}`;

export interface RawVisionResponse {
  status: 'success' | 'invalid_image' | 'low_quality' | 'analysis_unavailable';
  is_plant?: boolean;
  isPlant?: boolean;
  crop?: string | {
    name: string;
    confidence?: number | string;
  };
  crop_confidence?: number | string;
  diagnosis?: string | {
    type?: 'disease' | 'pest' | 'nutrient_deficiency' | 'healthy' | 'physical_damage' | 'unknown';
    name: string;
    confidence?: number | string;
    scientific_name?: string;
    severity?: string;
  };
  diagnosis_type?: string;
  pathogen?: string;
  confidence?: number | string;
  confidenceScore?: number;
  confidence_score?: number;
  symptoms: string[];
  visualEvidence?: string[];
  visual_evidence?: string[];
  recommendedActions?: string[];
  recommendations?: string[];
  severity: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  needs_expert_review: boolean;
  reasoning?: string;
  explanation?: string;
  scientific_name?: string;
  recommended_treatments?: {
    organic?: string[];
    chemical?: string[];
  };
  preventive_measures?: string[];
  causes?: string[];
}

export interface CropDiseaseVisionProvider {
  analyzeLeafImage(params: {
    imageBase64: string;
    mimeType: string;
    cropContext?: string;
    userReportedSymptoms?: string[];
    userNotes?: string;
  }): Promise<RawVisionResponse>;
}

/**
 * Dedicated Gemini Vision Provider for Crop Disease Scanning
 */
export class GeminiCropDiseaseProvider implements CropDiseaseVisionProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = config.cropDiseaseApiKey;
    this.model = config.cropDiseaseModel || 'gemini-3.5-flash';
  }

  public async analyzeLeafImage(params: {
    imageBase64: string;
    mimeType: string;
    cropContext?: string;
    userReportedSymptoms?: string[];
    userNotes?: string;
  }): Promise<RawVisionResponse> {
    if (!this.apiKey) {
      logger.error('[Vision] CROP_DISEASE_API_KEY is not configured on server.');
      return {
        status: 'analysis_unavailable',
        is_plant: false,
        crop: { name: params.cropContext || 'Unknown Crop', confidence: 0 },
        diagnosis: { type: 'unknown', name: 'API Key Not Configured', confidence: 0 },
        symptoms: [],
        visual_evidence: [],
        severity: 'unknown',
        needs_expert_review: true,
        explanation: 'The dedicated Crop Disease Vision API key is not configured on the server (CROP_DISEASE_API_KEY).',
      };
    }

    const candidateModels = Array.from(new Set([
      this.model,
      'gemini-3.1-flash-lite',
      'gemini-3.7-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
    ]));

    let lastError = 'Vision inference failed';
    let lastStatus = 500;

    for (const modelToTry of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTry}:generateContent?key=${this.apiKey}`;

      const promptText = `
[Crop Context Information]: ${params.cropContext ? `Farmer expects target crop: "${params.cropContext}" (Verify visually - do NOT assume true)` : 'No crop selected.'}
[Farmer Reported Symptoms]: ${params.userReportedSymptoms?.length ? params.userReportedSymptoms.join(', ') : 'None reported.'}
[Farmer Notes]: ${params.userNotes || 'None'}

Examine the uploaded leaf image in detail according to your system instructions. Return ONLY structured JSON adhering strictly to the schema.`;

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: params.mimeType || 'image/jpeg',
                  data: params.imageBase64,
                },
              },
              {
                text: promptText,
              },
            ],
          },
        ],
        systemInstruction: {
          parts: [{ text: DEDICATED_CROP_DISEASE_SYSTEM_PROMPT }],
        },
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          maxOutputTokens: 2048,
        },
      };

      logger.info(`[Vision] sending image to dedicated provider (model=${modelToTry})`);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          lastStatus = response.status;
          lastError = errorText.substring(0, 300);
          logger.warn(`[Vision] model ${modelToTry} returned HTTP ${response.status}: ${lastError}`);
          // If 503 / 429 / 404 / 500, try next candidate model
          if ([429, 503, 404, 500].includes(response.status)) {
            continue;
          }
          break;
        }

        const data: any = await response.json();
        logger.info('[Vision] provider response received');

        const candidate = data.candidates?.[0];
        const textPart = candidate?.content?.parts?.find((p: any) => p.text)?.text;

        if (!textPart) {
          logger.warn('[Vision] Empty response content received from provider.');
          continue;
        }

        // Clean JSON content if wrapped in markdown fences
        let cleanJson = textPart.trim();
        if (cleanJson.startsWith('```json')) {
          cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        try {
          const parsed = JSON.parse(cleanJson) as RawVisionResponse;
          logger.info('[Vision] response parsed');
          return parsed;
        } catch (parseErr) {
          logger.error(`[Vision] Failed to parse provider JSON response: ${cleanJson.substring(0, 200)}`);
          continue;
        }
      } catch (fetchErr: any) {
        logger.error(`[Vision] Fetch error on model ${modelToTry}: ${fetchErr?.message || fetchErr}`);
        continue;
      }
    }

    return {
      status: 'analysis_unavailable',
      is_plant: false,
      crop: { name: params.cropContext || 'Unknown Crop', confidence: 0 },
      diagnosis: { type: 'unknown', name: 'Vision Inference Failed', confidence: 0 },
      symptoms: [],
      visual_evidence: [],
      severity: 'unknown',
      needs_expert_review: true,
      explanation: `AI image analysis could not be completed (Provider returned HTTP ${lastStatus}). Please check network and retry.`,
    };
  }
}

/**
 * Dedicated Crop Disease Vision Service
 */
export class CropDiseaseVisionService {
  private static provider: CropDiseaseVisionProvider = new GeminiCropDiseaseProvider();

  /**
   * Set custom provider adapter if needed (e.g. OpenAI Vision or specialized models)
   */
  public static setProvider(customProvider: CropDiseaseVisionProvider) {
    this.provider = customProvider;
  }

  /**
   * Main entrypoint for crop disease image analysis
   */
  public static async analyzeImage(
    request: IDiagnosisRequest,
    farmerId?: string,
    farmId?: string
  ): Promise<IDiagnosisResult> {
    logger.info('[Vision] request received');

    // 1. Extract image payload (base64 or data URI or remote URL)
    let rawImage = request.imageBase64 || request.imageUrl || '';
    if (!rawImage) {
      logger.warn('[Vision] No image buffer/base64 supplied in request payload.');
      return this.buildErrorResult(
        'invalid_image',
        'No image provided. Please frame crop leaf in camera or upload an image file.',
        request.cropName
      );
    }

    let mimeType = 'image/jpeg';
    let base64Data = rawImage;

    // If image is a remote URL (e.g. from preset specimens), fetch the image buffer
    if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
      try {
        logger.info(`[Vision] fetching remote image URL: ${rawImage.substring(0, 80)}...`);
        const imgRes = await fetch(rawImage, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          },
        });
        if (imgRes.ok) {
          const arrayBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          base64Data = buffer.toString('base64');
          const ct = imgRes.headers.get('content-type');
          if (ct && ct.startsWith('image/')) {
            mimeType = ct.split(';')[0].trim();
          }
        } else {
          logger.warn(`[Vision] Failed to fetch remote image URL: HTTP ${imgRes.status}`);
        }
      } catch (fetchErr: any) {
        logger.error(`[Vision] Error fetching remote image: ${fetchErr?.message || fetchErr}`);
      }
    } else if (rawImage.startsWith('data:')) {
      const match = rawImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      } else {
        base64Data = rawImage.replace(/^data:[^;]+;base64,/, '');
      }
    }

    const approxByteSize = Math.round((base64Data.length * 3) / 4);
    logger.info(`[Vision] image received: mimeType=${mimeType}, size=${approxByteSize} bytes`);

    // Basic size validation (e.g. Reject corrupt 0-byte images)
    if (approxByteSize < 200) {
      logger.warn('[Vision] Image payload too small or truncated.');
      return this.buildErrorResult(
        'low_quality',
        'Uploaded image file is corrupted or too small for visual pathology analysis.',
        request.cropName
      );
    }

    // 2. Call the dedicated vision provider
    try {
      const rawResult = await this.provider.analyzeLeafImage({
        imageBase64: base64Data,
        mimeType,
        cropContext: request.cropName,
        userReportedSymptoms: request.symptoms,
        userNotes: request.notes,
      });

      // 3. Validate and normalize the response
      const normalized = this.validateAndNormalizeResponse(rawResult, request);

      logger.info(
        `[Vision] diagnosis generated: status=${normalized.status}, crop=${normalized.cropName}, issue="${normalized.suspectedIssue}", confidence=${normalized.confidenceScore}%`
      );

      return normalized;
    } catch (err: any) {
      logger.error(`[Vision] Unhandled error in CropDiseaseVisionService: ${err?.message || err}`);
      return this.buildErrorResult(
        'analysis_unavailable',
        'AI image analysis could not be completed. Please check your network and retry.',
        request.cropName
      );
    }
  }

  /**
   * Validate and normalize raw provider response into the standard IDiagnosisResult
   */
  private static validateAndNormalizeResponse(
    raw: RawVisionResponse,
    request: IDiagnosisRequest
  ): IDiagnosisResult {
    const rawStatus = raw.status || 'success';

    if (rawStatus !== 'success') {
      return this.buildErrorResult(
        rawStatus as VisionAnalysisStatus,
        raw.explanation || 'Image could not be validated for agricultural diagnosis.',
        request.cropName
      );
    }

    const isPlant = (raw as any).is_plant !== false && (raw as any).isPlant !== false;
    const cropName = typeof raw.crop === 'string' ? raw.crop : (raw.crop?.name || request.cropName || 'Identified Plant');
    const diagnosisName = typeof raw.diagnosis === 'string' ? raw.diagnosis : (raw.diagnosis?.name || (isPlant ? 'Unspecified Condition' : 'Non-Plant Specimen'));
    const diagnosisType = ((raw as any).diagnosis_type || (typeof raw.diagnosis === 'object' ? raw.diagnosis?.type : undefined) || (diagnosisName.toLowerCase().includes('healthy') ? 'healthy' : isPlant ? 'disease' : 'unknown')) as DiagnosticType;
    const pathogen = raw.pathogen || raw.scientific_name || (typeof raw.diagnosis === 'object' ? raw.diagnosis?.scientific_name : '') || '';

    // Extract raw confidence indicators from flat or nested responses
    const rawDiagConf = (raw as any).confidence ?? (typeof raw.diagnosis === 'object' ? raw.diagnosis?.confidence : undefined) ?? (raw as any).confidenceScore ?? (raw as any).confidence_score;
    const rawCropConf = (raw as any).crop_confidence ?? (typeof raw.crop === 'object' ? raw.crop?.confidence : undefined) ?? rawDiagConf;

    // Temporary Debug Logging per requirement 10
    logger.info(`[GEMINI RAW CONFIDENCE] rawDiagConf=${JSON.stringify(rawDiagConf)}, rawCropConf=${JSON.stringify(rawCropConf)}`);

    // Standardize through centralized normalization layer
    const normalizedDiagDecimal = normalizeConfidenceDecimal(rawDiagConf);
    const normalizedCropDecimal = normalizeConfidenceDecimal(rawCropConf);

    // Convert decimal to integer percentage [0, 100] for confidenceScore
    const diagnosisConfidenceScore = confidenceToScorePercentage(normalizedDiagDecimal, 0);
    const cropConfidenceScore = confidenceToScorePercentage(normalizedCropDecimal, diagnosisConfidenceScore || 0);

    // Temporary Debug Logging per requirement 10
    logger.info(`[NORMALIZED CONFIDENCE] decimal=${normalizedDiagDecimal}, score=${diagnosisConfidenceScore}%`);

    // Severity mapping
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
    const sev = (raw.severity || (typeof raw.diagnosis === 'object' ? raw.diagnosis?.severity : '') || '').toLowerCase();
    if (sev === 'critical') riskLevel = 'CRITICAL';
    else if (sev === 'high') riskLevel = 'HIGH';
    else if (sev === 'low' || diagnosisType === 'healthy') riskLevel = 'LOW';
    else riskLevel = 'MEDIUM';

    // Crop match check
    const matchedUserSelection = request.cropName
      ? cropName.toLowerCase().includes(request.cropName.toLowerCase()) ||
        request.cropName.toLowerCase().includes(cropName.toLowerCase())
      : true;

    // Symptoms and visual evidence
    const observedSymptoms = Array.isArray(raw.symptoms) && raw.symptoms.length > 0
      ? raw.symptoms
      : ['Leaf visual morphology inspected by AI'];

    const visualEvidence = (raw as any).visualEvidence || raw.visual_evidence || [];

    // Recommendations
    const recommendations = (raw as any).recommendedActions || raw.recommendations || [
      'Review IPM 6-pillar advisory and formulate response.',
      'Re-inspect foliage in 3-5 days to monitor recovery.'
    ];

    const explanation = raw.reasoning || raw.explanation || `Visual analysis completed for ${cropName} foliage.`;

    // Formulate 6-pillar IPM & action matrix dynamically based on visual evidence
    const ipmAdvisory = this.generateDynamicIPMAdvisory(cropName, diagnosisName, diagnosisType, riskLevel, raw);

    return {
      id: `diag-vision-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      success: true,
      isPlant,
      crop: cropName,
      disease: diagnosisName,
      pathogen,
      confidence: normalizedDiagDecimal ?? 0,
      severity: riskLevel.toLowerCase(),
      symptoms: observedSymptoms,
      recommendations,
      reasoning: explanation,

      cropName,
      suspectedIssue: diagnosisName,
      confidenceScore: diagnosisConfidenceScore,
      scientificName: pathogen || raw.scientific_name,
      riskLevel,
      diagnosisType,
      observedSymptoms,
      userReportedSymptoms: request.symptoms || [],
      possibleCauses: raw.causes || [
        'Pathological spore colonization under humid foliage microclimate',
        'Leaf tissue vulnerability or canopy microclimate stress',
      ],
      preventiveSuggestions: raw.preventive_measures || [
        `Ensure adequate aeration and optimal spacing for ${cropName} canopy.`,
        'Avoid excessive overhead irrigation in evening hours.',
        'Sterilize pruning tools and destroy infected crop residues.',
      ],
      recommendedTreatments: {
        organic: raw.recommended_treatments?.organic || [
          'Neem oil spray (10,000 ppm) @ 3 ml/L with liquid soap emulsifier',
          'Foliar spray of Trichoderma viride / Pseudomonas fluorescens @ 5 g/L',
        ],
        chemical: raw.recommended_treatments?.chemical || [
          'Targeted fungicide/pesticide only if disease exceeds 5% economic threshold',
          'Consult local agronomist before high-volume systemic chemical application',
        ],
      },
      ipmAdvisory,
      generalExplanation: raw.explanation || `Visual analysis completed for ${cropName} foliage.`,
      status: 'success',
      sourceStatus: 'LIVE_DEDICATED_VISION_AI',
      isMockDemo: false,
      nextSteps: [
        'Review IPM 6-pillar advisory and formulate biological or cultural response.',
        'Record follow-up photo in 3-7 days to monitor leaf recovery.',
      ],
      detectedCrop: {
        name: cropName,
        confidence: cropConfidenceScore,
        matchedUserSelection,
      },
      visualEvidence,
    };
  }

  /**
   * Generate IPM 6-pillar advisory
   */
  private static generateDynamicIPMAdvisory(
    cropName: string,
    issueName: string,
    diagnosisType: DiagnosticType,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    raw: RawVisionResponse
  ) {
    if (diagnosisType === 'healthy') {
      return {
        prevention: [
          'Maintain balanced soil NPK fertility and regular irrigation cycles.',
          'Continue bi-weekly field scouting for early pest/pathogen visual signs.',
        ],
        cultural: [
          'Maintain weed-free plot borders and optimal row spacing.',
          'Rotate crops with non-host legumes in following season.',
        ],
        mechanical: [
          'Keep yellow sticky traps at perimeter for preventative monitoring.',
        ],
        biological: [
          'Apply prophylactic bio-inoculants (Rhizobium/PSB) at root zone.',
        ],
        chemical: [
          'No chemical pesticide application warranted (Healthy foliage verified).',
        ],
        monitoring: [
          'Conduct visual field check every 5-7 days during peak vegetative growth.',
        ],
        whatToDoNow: [
          'No emergency intervention required. Plant shows healthy tissue morphology.',
          'Continue scheduled balanced fertilization and irrigation.',
        ],
        whatToAvoid: [
          'Do NOT apply prophylactic chemical fungicides/insecticides on healthy foliage.',
          'Avoid over-watering or waterlogging in root zone.',
        ],
        whenToInspectAgain: 'Inspect in 5 to 7 days',
        whenToContactExpert: 'Only if new yellowing, spotting, or leaf wilting appears.',
      };
    }

    return {
      prevention: raw.preventive_measures?.slice(0, 2) || [
        `Select certified pathogen-free seeds and resistant ${cropName} cultivars.`,
        'Ensure balanced nutrition with adequate potassium to strengthen cell walls.',
      ],
      cultural: [
        'Prune and destroy severely infected lower leaves to lower inoculum density.',
        'Improve field drainage and avoid sprinkler irrigation during humid weather.',
      ],
      mechanical: [
        'Erect yellow/blue sticky traps @ 15/acre to catch vectoring insect pests.',
        'Hand-pick and rogue out heavily blighted leaf clusters into plastic bags.',
      ],
      biological: raw.recommended_treatments?.organic?.slice(0, 2) || [
        'Apply Trichoderma viride 5g/L or Pseudomonas fluorescens 5g/L foliar spray.',
        'Spray Cold-pressed Neem oil (10,000 ppm) @ 3-4 ml/L water in evening.',
      ],
      chemical: raw.recommended_treatments?.chemical?.slice(0, 2) || [
        `Apply targeted therapeutic spray only if ${issueName} exceeds 5% foliage coverage.`,
        'Rotate chemical active ingredients to avoid pathogen resistance build-up.',
      ],
      monitoring: [
        `Scout 20 random ${cropName} plants twice weekly across diagonal field transect.`,
        'Check economic threshold (ETL) before repeating chemical application.',
      ],
      whatToDoNow: [
        `Isolate affected foliage patches and begin biological control.`,
        'Review 48-hour weather forecast before planning foliar spray operations.',
      ],
      whatToAvoid: [
        'Do NOT spray during midday direct sun (>35°C) or high wind (>15 km/h).',
        'Avoid excess nitrogenous top-dressing which promotes lush susceptible tissue.',
      ],
      whenToInspectAgain: riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? 'Inspect within 48-72 hours (Day 3 check)' : 'Inspect in 4 to 5 days',
      whenToContactExpert: riskLevel === 'HIGH' || riskLevel === 'CRITICAL'
        ? 'Immediately if spots/lesions spread across >15% of crop plot.'
        : 'If symptoms do not stabilize after Day 3 biological application.',
    };
  }

  /**
   * Helper to construct error / non-success diagnostic results without fake diseases
   */
  private static buildErrorResult(
    status: VisionAnalysisStatus,
    explanation: string,
    requestedCrop?: string
  ): IDiagnosisResult {
    const isInvalid = status === 'invalid_image';
    const isLowQuality = status === 'low_quality';
    return {
      id: `diag-err-${Date.now()}`,
      success: false,
      isPlant: !isInvalid,
      crop: requestedCrop || 'Unknown Specimen',
      disease: isInvalid
        ? 'Invalid Image / Non-Plant'
        : isLowQuality
        ? 'Low Quality Image'
        : status === 'missing_api_key'
        ? 'API Key Not Configured'
        : 'Vision Analysis Unavailable',
      pathogen: 'N/A',
      confidence: 0,
      severity: 'low',
      symptoms: [],
      recommendations: [
        'Ensure the plant leaf is centered, well-lit, and in clear focus.',
        'Avoid blurry, low-resolution, or non-agricultural photos.'
      ],
      reasoning: explanation,

      cropName: requestedCrop || 'Unknown Specimen',
      suspectedIssue: isInvalid
        ? 'Invalid Image / Non-Plant'
        : isLowQuality
        ? 'Low Quality Image'
        : status === 'missing_api_key'
        ? 'API Key Not Configured'
        : 'Vision Analysis Unavailable',
      confidenceScore: 0,
      riskLevel: 'LOW',
      diagnosisType: 'unknown',
      observedSymptoms: [],
      userReportedSymptoms: [],
      possibleCauses: [],
      preventiveSuggestions: [],
      recommendedTreatments: {
        organic: [],
        chemical: [],
      },
      ipmAdvisory: {
        prevention: [],
        cultural: [],
        mechanical: [],
        biological: [],
        chemical: [],
        monitoring: [],
        whatToDoNow: [],
        whatToAvoid: [],
        whenToInspectAgain: 'N/A',
        whenToContactExpert: 'N/A',
      },
      generalExplanation: explanation,
      status,
      sourceStatus: 'AI_VISION_UNAVAILABLE',
      isMockDemo: false,
      nextSteps: [],
    };
  }
}

