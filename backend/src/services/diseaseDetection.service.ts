import { DiseaseModel } from '../models/Disease';
import { AlertModel } from '../models/Alert';
import { IDiagnosisRequest, IDiagnosisResult, IDisease, VisionAnalysisStatus, DiagnosticType } from '../types';
import { isDbConnected } from '../config/db';
import { config } from '../config/env';
import { buildIdQuery } from '../utils/dbHelper';
import { logger } from '../utils/logger';
import { normalizeConfidenceDecimal, confidenceToScorePercentage } from '../utils/confidenceNormalizer';

export const AGRINEXT_VISION_DIAGNOSTIC_SYSTEM_PROMPT = `You are AGRINEXT Vision, an agricultural crop-disease and pest diagnostic AI.

Your task is to analyze the ACTUAL uploaded plant/leaf image.
Never invent a diagnosis and never assume the crop or disease from the UI selection.

IMPORTANT:
- Analyze the actual pixels of the uploaded image.
- Do not use a hardcoded disease.
- Do not return a diagnosis if the image does not contain enough visual evidence.
- The user's selected crop is only contextual information, not proof of crop identity.
- User-reported symptoms must be treated separately from AI-observed symptoms.
- Clearly distinguish disease, pest, nutrient deficiency, physical damage, healthy plant, and unknown condition.
- If multiple diseases are visually plausible, return the most likely one and explain the uncertainty.
- If confidence is low, return "unknown" rather than guessing.
- If the image is not a plant/leaf image, return invalid_image.
- If the image is too blurry, dark, distant, obstructed, or otherwise insufficient for diagnosis, return low_quality.
- Never fabricate confidence.

Analyze these visual characteristics:
1. Crop/plant identity
2. Leaf color and discoloration
3. Lesion shape and distribution
4. Spots, pustules, streaks, rings, patches or necrosis
5. Leaf curling, deformation or wilting
6. Visible insects, eggs, larvae, webbing or pest damage
7. Fungal/bacterial/viral-like visual patterns
8. Signs of nutrient deficiency
9. Overall plant health
10. Image quality and diagnostic suitability

Return ONLY valid JSON using this structure:

{
  "status": "success | invalid_image | low_quality | analysis_unavailable",
  "crop": {
    "name": "string",
    "confidence": 0
  },
  "diagnosis": {
    "type": "disease | pest | nutrient_deficiency | healthy | physical_damage | unknown",
    "name": "string",
    "confidence": 0
  },
  "symptoms": [
    "Only symptoms visibly observed in the uploaded image"
  ],
  "visual_evidence": [
    "Specific visual evidence supporting the assessment"
  ],
  "severity": "low | medium | high | unknown",
  "needs_expert_review": true,
  "explanation": "Short image-grounded explanation"
}

Rules for confidence:
- 90-100: strong visual evidence
- 70-89: good evidence but some uncertainty
- 50-69: limited evidence
- below 50: prefer unknown instead of making a specific disease claim

Do not mention diseases that are not visually supported by the image.
Do not copy symptoms from the user's selected symptom list unless they are actually visible.
Do not output Markdown.
Do not output \`\`\`json.
Return JSON only.
`;

// Agronomic Knowledge Base fallback definitions for supported crops
const KNOWLEDGE_BASE_DISEASES: IDisease[] = [
  {
    id: 'dis-wheat-rust',
    cropName: 'Wheat',
    diseaseName: 'Yellow Rust (Stripe Rust)',
    scientificName: 'Puccinia striiformis f. sp. tritici',
    symptoms: [
      'Yellow or orange-yellow powdery pustules arranged in linear stripes on leaves',
      'Chlorotic leaf streaks along the veins',
      'Premature chlorosis, leaf drying, and stunted grain filling',
    ],
    causes: [
      'High relative humidity (>85%) with cool temperatures (10-18°C)',
      'Airborne urediniospores carried by wind from Himalayan foothills',
      'Excess split application of nitrogenous fertilizers',
    ],
    preventiveMeasures: [
      'Sow resistant wheat cultivars (HD-2967, DBW-187, PBW-502)',
      'Avoid late sowing beyond late November',
      'Maintain balanced N:P:K fertilization (120:60:40)',
    ],
    chemicalTreatments: [
      'Spray Propiconazole 25% EC @ 1.0 ml/L of water at first sign of infection',
      'Spray Tebuconazole 25.9% EC @ 1.25 ml/L of water in morning hours',
    ],
    organicTreatments: [
      'Foliar spray of 5% Neem Seed Kernel Extract (NSKE @ 50ml/L)',
      'Bio-fungicide Trichoderma viride @ 5g/L foliar application',
    ],
    riskLevel: 'HIGH',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    seasonalOccurrence: 'January - March (Rabi Season)',
  },
  {
    id: 'dis-wheat-bunt',
    cropName: 'Wheat',
    diseaseName: 'Karnal Bunt',
    scientificName: 'Tilletia indica (Mitra)',
    symptoms: [
      'Partial conversion of wheat kernels into a black powdery spore mass',
      'Foul fishy odor caused by trimethylamine emission',
      'Hollowed and brittle grains detected during threshing',
    ],
    causes: [
      'Cloudy weather, light rains, and high humidity during anthesis',
      'Soil-borne and seed-borne teliospores',
    ],
    preventiveMeasures: [
      'Use certified disease-free foundation seed',
      'Avoid frequent overhead sprinkler irrigation during flowering',
      'Follow 3-year crop rotation with legumes',
    ],
    chemicalTreatments: [
      'Seed treatment with Carboxin 37.5% + Thiram 37.5% DS @ 2.5 g/kg seed',
      'Single foliar spray of Propiconazole 25% EC @ 1 ml/L at earhead emergence',
    ],
    organicTreatments: [
      'Seed biopriming with Trichoderma harzianum @ 10 g/kg seed',
      'Soil application of well-decomposed neem cake @ 200 kg/acre',
    ],
    riskLevel: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    seasonalOccurrence: 'February - March',
  },
  {
    id: 'dis-tomato-blight',
    cropName: 'Tomato',
    diseaseName: 'Early Blight',
    scientificName: 'Alternaria solani (Ellis & Martin)',
    symptoms: [
      'Concentric dark brown to black target-board rings on older lower leaves',
      'Yellow chlorotic halo surrounding necrotic lesions',
      'Dark sunken lesions on stem collars near ground level',
      'Fruit rot with concentric ridges near the calyx attachment',
    ],
    causes: [
      'Warm humid weather (24-30°C) with persistent leaf wetness or dew',
      'Soil-borne fungal mycelium splashing onto lower leaves via rain or irrigation',
    ],
    preventiveMeasures: [
      '3-year crop rotation with non-solanaceous crops',
      'Mulching beds with straw to suppress soil-to-leaf rain splashing',
      'Prune lower 20 cm foliage above soil level to improve ventilation',
    ],
    chemicalTreatments: [
      'Foliar spray of Mancozeb 75% WP @ 2.5 g/L of water',
      'Spray Azoxystrobin 23% SC @ 1.0 ml/L of water for systemic eradication',
    ],
    organicTreatments: [
      'Copper Oxychloride 50% WP @ 2.5 g/L foliar spray',
      'Bacillus subtilis bio-fungicide foliar spray @ 3 g/L',
    ],
    riskLevel: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
    seasonalOccurrence: 'Year-round during high humidity spells',
  },
  {
    id: 'dis-tomato-curl',
    cropName: 'Tomato',
    diseaseName: 'Tomato Leaf Curl Virus (ToLCV)',
    scientificName: 'Tomato Leaf Curl New Delhi Begomovirus',
    symptoms: [
      'Upward and downward curling, puckering and rolling of young leaves',
      'Severe interveinal chlorosis and reduction in leaf blade size',
      'Excessive stunting of plant with bushy appearance and flower drop',
    ],
    causes: [
      'Transmitted exclusively by the Whitefly vector (Bemisia tabaci)',
      'Warm, dry ambient periods that accelerate whitefly multiplication',
    ],
    preventiveMeasures: [
      'Install yellow sticky traps @ 20 traps/acre at canopy height',
      'Grow nursery under 40-mesh insect-proof nylon net tunnels',
      'Plant barrier crops (2 rows of Maize or Sorghum) around tomato plots',
    ],
    chemicalTreatments: [
      'Spray Diafenthiuron 50% WP @ 1.2 g/L to suppress whitefly vectors',
      'Spray Acetamiprid 20% SP @ 0.4 g/L during early vegetative stage',
    ],
    organicTreatments: [
      'Spray Neem oil (10,000 PPM) @ 3 ml/L with mild surfactant',
      'Foliar spray of Verticillium lecanii bio-insecticide @ 5 g/L',
    ],
    riskLevel: 'CRITICAL',
    imageUrl: 'https://images.unsplash.com/photo-1599818816933-4f9958ebc072?auto=format&fit=crop&w=600&q=80',
    seasonalOccurrence: 'Kharif & Summer seasons',
  },
  {
    id: 'dis-potato-late-blight',
    cropName: 'Potato',
    diseaseName: 'Late Blight',
    scientificName: 'Phytophthora infestans (Mont.) de Bary',
    symptoms: [
      'Water-soaked dark brown to purplish irregular lesions on leaf tips and margins',
      'Delicate white downy fungal growth on the underside of leaves during morning dew',
      'Rapid blighting and foul rotting of entire foliage within 4-7 days',
      'Brown dry rot with granular discoloration inside tubers',
    ],
    causes: [
      'Cool temperatures (12-18°C) accompanied by relative humidity >90% and overcast conditions',
      'Infected seed tubers carrying latent oospores',
    ],
    preventiveMeasures: [
      'Plant certified disease-free and sprouted seed tubers',
      'High earthing up (ridging) to protect tubers from down-washing spores',
      'Dehaulm (cut haulms) 10-12 days before tuber harvest',
    ],
    chemicalTreatments: [
      'Prophylactic spray of Mancozeb 75% WP @ 2.5 g/L prior to disease onset',
      'Curative systemic spray of Cymoxanil 8% + Mancozeb 64% WP @ 2.0 g/L',
      'Dimethomorph 50% WP @ 1.0 g/L during cold foggy weather',
    ],
    organicTreatments: [
      'Trichoderma harzianum soil drenching and foliar application @ 5 g/L',
      'Copper Hydroxide 53.8% DF @ 2.0 g/L spray',
    ],
    riskLevel: 'CRITICAL',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    seasonalOccurrence: 'December - January (Peak Fog Window)',
  },
  {
    id: 'dis-paddy-blast',
    cropName: 'Paddy',
    diseaseName: 'Rice Leaf Blast',
    scientificName: 'Magnaporthe oryzae (B.C. Couch)',
    symptoms: [
      'Spindle-shaped elliptical lesions with grey/whitish centers and dark brown borders',
      'Coalescing lesions causing complete leaf drying (leaf blast)',
      'Blackened rotten nodes breaking easily (node blast)',
      'Neck rot near panicle base preventing grain filling (neck blast)',
    ],
    causes: [
      'Excessive dosage of nitrogenous fertilizers',
      'High relative humidity (>90%) with night temperatures around 19-22°C',
      'Dew deposition on leaves exceeding 10 hours',
    ],
    preventiveMeasures: [
      'Seed treatment with Pseudomonas fluorescens @ 10 g/kg seed',
      'Split nitrogen application into 3-4 fractional doses',
      'Maintain continuous standing water depth of 2-3 cm to inhibit sporulation',
    ],
    chemicalTreatments: [
      'Foliar spray of Tricyclazole 75% WP @ 0.6 g/L of water at early tillering',
      'Spray Kasugamycin 3% SL @ 2.0 ml/L or Isoprothiolane 40% EC @ 1.5 ml/L',
    ],
    organicTreatments: [
      'Foliar application of Pseudomonas fluorescens bio-agent @ 2.5 g/L',
      'Foliar spray of fermented cow urine + neem leaf extract (10%)',
    ],
    riskLevel: 'HIGH',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    seasonalOccurrence: 'August - October (Kharif Season)',
  },
  {
    id: 'dis-cotton-blight',
    cropName: 'Cotton',
    diseaseName: 'Bacterial Blight (Black Arm)',
    scientificName: 'Xanthomonas citri pv. malvacearum',
    symptoms: [
      'Angular, water-soaked brown lesions delimited by leaf veinlets',
      'Elongated black lesions girdling stems and branches (black arm stage)',
      'Water-soaked dark lesions on green bolls causing premature shedding',
    ],
    causes: [
      'Warm humid monsoon weather (28-34°C) with driven rain splash',
      'Infected seed fuzzy fuzz carrying bacterial inoculum',
    ],
    preventiveMeasures: [
      'Acid delinting of cotton seed with concentrated Sulphuric acid (100ml/kg)',
      'Planting resistant transgenic/hybrid cultivars',
      'Destruction and plowing-under of infected cotton stalks after harvest',
    ],
    chemicalTreatments: [
      'Foliar spray of Streptocycline @ 0.1 g + Copper Oxychloride 50 WP @ 2.5 g per liter of water',
      'Repeat spray after 12-15 days if rainfall continues',
    ],
    organicTreatments: [
      'Seed biopriming with Bacillus subtilis @ 10 g/kg seed',
      'Spray 5% NSKE (Neem Seed Kernel Extract)',
    ],
    riskLevel: 'HIGH',
    imageUrl: 'https://images.unsplash.com/photo-1599818816933-4f9958ebc072?auto=format&fit=crop&w=600&q=80',
    seasonalOccurrence: 'July - September',
  },
  {
    id: 'dis-soybean-ymv',
    cropName: 'Soybean',
    diseaseName: 'Yellow Mosaic Virus (YMV)',
    scientificName: 'Mungbean Yellow Mosaic India Begomovirus',
    symptoms: [
      'Bright yellow mosaic patches alternating with green areas on leaves',
      'Puckering, wrinkling, and reduced size of young trifoliate leaves',
      'Stunted pods containing shriveled and underdeveloped seeds',
    ],
    causes: [
      'Vector transmission by Whiteflies (Bemisia tabaci)',
      'Presence of weed reservoir hosts along field borders and bunds',
    ],
    preventiveMeasures: [
      'Install yellow sticky traps @ 15-20 traps/acre',
      'Seed treatment with Thiamethoxam 30 FS @ 10 ml/kg seed',
      'Eradicate host weeds (Abutilon, Croton) around soybean fields',
    ],
    chemicalTreatments: [
      'Spray Thiamethoxam 25% WG @ 0.3 g/L or Acetamiprid 20% SP @ 0.4 g/L for vector knockdown',
      'Spray Spiromesifen 22.9% SC @ 1.0 ml/L for nymphal control',
    ],
    organicTreatments: [
      'Neem oil (10,000 PPM) @ 3.0 ml/L with mild surfactant',
      'Verticillium lecanii entomopathogenic fungal spray @ 5 g/L',
    ],
    riskLevel: 'CRITICAL',
    imageUrl: 'https://images.unsplash.com/photo-1599818816933-4f9958ebc072?auto=format&fit=crop&w=600&q=80',
    seasonalOccurrence: 'August - September',
  },
  {
    id: 'dis-mustard-rust',
    cropName: 'Mustard',
    diseaseName: 'White Rust & Downy Mildew Complex',
    scientificName: 'Albugo candida & Hyaloperonospora brassicae',
    symptoms: [
      'Prominent white or creamy-white raised pustules on the lower surface of leaves',
      'Severe malformation, hypertrophy, and staghead formation of floral inflorescence',
      'Sterility of pods and extensive yield reduction',
    ],
    causes: [
      'Cool temperatures (10-15°C) with morning fog and relative humidity above 80%',
      'Soil-borne oospores and infected weed crucifers',
    ],
    preventiveMeasures: [
      'Timely sowing during early October to escape disease peak',
      'Seed treatment with Metalaxyl-M 31.8% ES @ 2.5 ml/kg seed',
      'Destruction and burning of staghead hypertrophied inflorescences',
    ],
    chemicalTreatments: [
      'Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.0 g/L of water at disease onset',
      'Foliar spray of Mancozeb 75% WP @ 2.5 g/L after 15 days',
    ],
    organicTreatments: [
      'Bio-agent Trichoderma viride @ 5 g/L foliar spray',
      'Garlic bulb extract (5%) foliar spray for antifungal protection',
    ],
    riskLevel: 'HIGH',
    imageUrl: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=600&q=80',
    seasonalOccurrence: 'December - February',
  },
];

export class DiseaseDetectionService {
  /**
   * Main Diagnostic Pipeline
   * Resolves actual image -> invokes Gemini Vision AI with system prompt -> validates & parses response.
   */
  public static async analyzeImageAndDiagnose(
    request: IDiagnosisRequest,
    farmerId?: string,
    farmId?: string
  ): Promise<IDiagnosisResult> {
    const userCrop = (request.cropName || 'Wheat').trim();
    const userSymptoms = request.symptoms || [];
    const notes = request.notes || '';
    const nowTimestamp = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

    logger.info(`[Vision] request received: userCrop=${userCrop}, symptomsCount=${userSymptoms.length}, notesLength=${notes.length}, hasBase64=${!!request.imageBase64}, hasImageUrl=${!!request.imageUrl}`);

    // Step 1: Extract and validate actual image
    const imagePayload = await this.resolveImagePayload(request);

    if (!imagePayload) {
      logger.warn('[Vision] image payload missing or unreadable - rejecting request');
      return {
        isMockDemo: false,
        status: 'invalid_image',
        cropName: userCrop,
        suspectedIssue: 'No Specimen Image Provided',
        confidenceScore: 0,
        riskLevel: 'LOW',
        observedSymptoms: [],
        generalExplanation: 'Please capture a clear live photo or upload an image file of the crop specimen to perform AI diagnostic analysis.',
        analysisNote: 'Image payload was empty or unreadable.',
        preventiveSuggestions: ['Take a steady close-up photo in natural daylight.', 'Focus on affected leaf lesions or discoloration.'],
        recommendedTreatments: { organic: [], chemical: [] },
        nextSteps: ['Upload a valid crop photo to start visual diagnosis.'],
        sourceStatus: 'INPUT VALIDATION',
      };
    }

    logger.info(`[Vision] image received: mimeType=${imagePayload.mimeType}, size=${imagePayload.byteLength} bytes`);

    // Step 2: Check GEMINI_API_KEY
    const apiKey = config.geminiApiKey;

    if (!apiKey) {
      logger.error('[Vision] GEMINI_API_KEY is not configured on the backend');
      return {
        isMockDemo: false,
        status: 'missing_api_key',
        cropName: userCrop,
        suspectedIssue: 'GEMINI_API_KEY Not Configured',
        confidenceScore: 0,
        riskLevel: 'LOW',
        observedSymptoms: [],
        generalExplanation: 'GEMINI_API_KEY is not configured on the backend server. Please configure GEMINI_API_KEY in backend/.env to enable live AI vision diagnosis.',
        analysisNote: 'Missing API key. No fake diagnosis generated.',
        preventiveSuggestions: ['Add GEMINI_API_KEY to backend/.env and restart server.'],
        recommendedTreatments: { organic: [], chemical: [] },
        nextSteps: ['Contact administrator or configure Google AI Studio API key.'],
        sourceStatus: 'MISSING_API_KEY',
      };
    }

    // Step 3: Multimodal Vision Analysis with Google AI Studio / Gemini API
    try {
      logger.info('[Vision] sending image to Gemini');
      const visionResult = await this.callGeminiVisionAPI(imagePayload, userCrop, userSymptoms, notes, apiKey);

      if (visionResult) {
        logger.info(`[Vision] diagnosis generated: status=${visionResult.status}, crop=${visionResult.cropName}, issue="${visionResult.suspectedIssue}", conf=${visionResult.confidenceScore}%`);

        // If high or critical disease, auto-create alert if DB connected
        if (
          visionResult.status === 'success' &&
          (visionResult.riskLevel === 'HIGH' || visionResult.riskLevel === 'CRITICAL') &&
          visionResult.diagnosisType !== 'healthy'
        ) {
          this.createDiseaseAlertSafe(visionResult, farmerId, farmId);
        }
        return visionResult;
      }
    } catch (err: any) {
      logger.error(`[Vision] Gemini Vision analysis failed: category=API_ERROR, message=${err.message}`);
    }

    // Step 4: Handle API / Vision Service Failure (No Fake Yellow Rust Fallback)
    logger.warn('[Vision] returning vision_request_failed error state with 0% confidence and empty symptoms');
    return {
      isMockDemo: false,
      status: 'vision_request_failed',
      cropName: userCrop,
      suspectedIssue: 'AI Vision Service Request Failed',
      confidenceScore: 0,
      riskLevel: 'LOW',
      observedSymptoms: [],
      generalExplanation: 'AI image analysis could not connect to the vision service. Please verify your internet connection or backend API key and retry.',
      analysisNote: 'Vision inference failed or API key was unreachable. No fake diagnostic values were generated.',
      preventiveSuggestions: [
        'Inspect foliage manually for common regional symptoms.',
        'Consult your local Krishi Vigyan Kendra (KVK) or extension officer.',
      ],
      recommendedTreatments: { organic: [], chemical: [] },
      nextSteps: [
        'Click Retry to re-scan the specimen.',
        'Upload another clear leaf photo with direct lighting.',
      ],
      sourceStatus: 'VISION_REQUEST_FAILED',
      needsExpertReview: true,
      timestamp: nowTimestamp,
    };
  }

  /**
   * Resolves raw base64 data URL, remote image URL, or raw base64 string into normalized binary payload.
   */
  private static async resolveImagePayload(
    request: IDiagnosisRequest
  ): Promise<{ mimeType: string; cleanBase64: string; byteLength: number } | null> {
    try {
      let rawData = request.imageBase64 || request.imageUrl;
      if (!rawData) return null;

      // Case 1: Data URL format (e.g. data:image/jpeg;base64,...)
      if (rawData.startsWith('data:')) {
        const matches = rawData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches && matches[1] && matches[2]) {
          let mimeType = matches[1].toLowerCase();
          if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(mimeType)) {
            mimeType = 'image/jpeg';
          }
          const cleanBase64 = matches[2];
          const byteLength = Buffer.from(cleanBase64, 'base64').length;
          return { mimeType, cleanBase64, byteLength };
        }
      }

      // Case 2: Pure base64 string
      if (!rawData.startsWith('http://') && !rawData.startsWith('https://') && rawData.length > 100) {
        const cleanBase64 = rawData.replace(/\s/g, '');
        const byteLength = Buffer.from(cleanBase64, 'base64').length;
        return { mimeType: 'image/jpeg', cleanBase64, byteLength };
      }

      // Case 3: HTTP/HTTPS remote URL (e.g. Unsplash demo presets)
      if (rawData.startsWith('http://') || rawData.startsWith('https://')) {
        const response = await fetch(rawData, {
          signal: AbortSignal.timeout(10000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/jpeg,image/png,image/webp;q=0.9,*/*;q=0.8',
          },
        });
        if (!response.ok) {
          logger.warn(`[Vision] Failed to download remote image from ${rawData}: HTTP ${response.status}`);
          return null;
        }
        let contentType = response.headers.get('content-type') || 'image/jpeg';
        contentType = contentType.split(';')[0].trim().toLowerCase();
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(contentType)) {
          contentType = 'image/jpeg';
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const cleanBase64 = buffer.toString('base64');
        return {
          mimeType: contentType,
          cleanBase64,
          byteLength: buffer.length,
        };
      }
    } catch (err: any) {
      logger.warn(`[Vision] Error resolving image payload: ${err.message}`);
    }

    return null;
  }

  /**
   * Invokes Gemini Vision REST API with image and strict schema prompt.
   */
  private static async callGeminiVisionAPI(
    image: { mimeType: string; cleanBase64: string; byteLength: number },
    userCrop: string,
    userSymptoms: string[],
    notes: string,
    apiKey: string
  ): Promise<IDiagnosisResult | null> {
    const candidateModels = [
      config.geminiModel || 'gemini-2.5-flash',
      'gemini-2.5-flash',
    ].filter(Boolean) as string[];

    const modelsToTry = Array.from(new Set(candidateModels));

    const promptText = `Analyze this specimen image thoroughly.
User-Selected Host Crop (Context Only): ${userCrop}
User-Reported Symptoms (Farmer Observation, unverified): ${userSymptoms.length > 0 ? userSymptoms.join(', ') : 'None specified'}
User Notes: ${notes || 'None'}

Instructions:
1. Examine the image carefully. Determine if it is a real plant/crop specimen.
2. If it is NOT a plant (e.g. car, human, drawing, furniture, abstract pattern, solid color), set "is_plant": false and "status": "invalid_image".
3. If blurry or unreadable, set "status": "low_quality".
4. If healthy with no pathogen, set "diagnosis.type": "healthy" and "diagnosis.name": "Healthy Crop (No Pathogen Detected)".
5. Identify the true crop in the image and detect whether it matches user selection (${userCrop}).
6. Detect visible symptoms and formulate a realistic diagnosis and complete IPM hierarchy.
7. Return strictly formatted JSON matching the system instructions.`;

    const payload = {
      systemInstruction: {
        parts: [{ text: AGRINEXT_VISION_DIAGNOSTIC_SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: image.mimeType,
                data: image.cleanBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        topP: 0.9,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    };

    let lastError: Error | null = null;

    for (const model of modelsToTry) {
      const startTime = Date.now();
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(45000),
        });

        const elapsed = Date.now() - startTime;

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`HTTP ${response.status}: ${errBody}`);
        }

        const resJson = await response.json();
        const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;

        logger.info(`[Vision] Gemini request completed: HTTP 200 via ${model} in ${elapsed}ms`);

        if (rawText) {
          try {
            const parsed = JSON.parse(rawText);
            logger.info(`[Vision] Gemini response parsed: status=${parsed.status}, is_plant=${parsed.is_plant}, crop=${parsed.crop?.detected_name || userCrop}, issue="${parsed.diagnosis?.name}"`);
            return this.transformVisionOutputToDiagnosisResult(parsed, userCrop, model);
          } catch (parseErr: any) {
            logger.warn(`[Vision] Model ${model} response JSON parse failed: ${parseErr.message}`);
            throw new Error(`JSON_PARSE_ERROR: ${parseErr.message}`);
          }
        } else {
          throw new Error('EMPTY_GEMINI_RESPONSE');
        }
      } catch (err: any) {
        lastError = err;
        logger.warn(`[Vision] Model ${model} attempt failed (${Date.now() - startTime}ms): ${err.message}`);
      }
    }

    if (lastError) {
      throw lastError;
    }

    return null;
  }

  /**
   * Transforms raw Vision AI output into the standardized AGRINEXT IDiagnosisResult.
   */
  private static transformVisionOutputToDiagnosisResult(
    raw: any,
    userCrop: string,
    modelName?: string
  ): IDiagnosisResult {
    const timestamp = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

    // 1. Invalid Image / Non-Plant Case
    if (raw.is_plant === false || raw.status === 'invalid_image') {
      return {
        isMockDemo: false,
        status: 'invalid_image',
        cropName: userCrop,
        suspectedIssue: 'Invalid Image (No Plant Detected)',
        confidenceScore: 0,
        riskLevel: 'LOW',
        observedSymptoms: [],
        visualEvidence: [raw.reason || 'Image does not contain a recognizable crop or plant leaf.'],
        generalExplanation: raw.reason || 'The uploaded image does not contain any recognizable agricultural plant or crop specimen. Please upload a clear photo of an actual crop leaf.',
        analysisNote: raw.reason || 'Non-plant image uploaded.',
        preventiveSuggestions: ['Please upload an image showing the affected leaf, stem, or plant canopy.'],
        recommendedTreatments: { organic: [], chemical: [] },
        nextSteps: ['Take a photo of the crop in good natural daylight.', 'Avoid uploading non-plant photos or objects.'],
        sourceStatus: 'LIVE VISION AI (REJECTED)',
        needsExpertReview: false,
        timestamp,
      };
    }

    // 2. Low Quality / Blurry Image Case
    if (raw.status === 'low_quality') {
      const cropName = raw.crop?.name || raw.crop?.detected_name || userCrop;
      return {
        isMockDemo: false,
        status: 'low_quality',
        cropName,
        suspectedIssue: raw.diagnosis?.name || 'Image Quality Insufficient',
        confidenceScore: Math.min(35, raw.diagnosis?.confidence || 30),
        riskLevel: 'LOW',
        observedSymptoms: (raw.symptoms || []).map((s: any) => typeof s === 'string' ? s : s.name),
        visualEvidence: raw.visual_evidence || ['Image is blurry, out of focus, or dark.'],
        generalExplanation: raw.explanation || raw.reason || 'The image resolution or focus is insufficient for confident pathology analysis. Fine symptom morphology could not be resolved.',
        analysisNote: 'Image quality low. Recommend high-resolution rescan.',
        preventiveSuggestions: ['Hold the camera steady 15-20 cm from the affected leaf.', 'Ensure adequate daylight without harsh glare.'],
        recommendedTreatments: { organic: [], chemical: [] },
        nextSteps: ['Capture a clearer, focused photo of the leaf.', 'Rescan using the camera button.'],
        sourceStatus: 'LIVE VISION AI (LOW CONFIDENCE)',
        needsExpertReview: true,
        requiresLabVerification: true,
        timestamp,
      };
    }

    // 3. Main Diagnosis & Healthy Handling
    const diagType: DiagnosticType = (raw.diagnosis?.type as DiagnosticType) || (raw.diagnosis?.name?.toLowerCase().includes('healthy') ? 'healthy' : 'disease');
    const isHealthy = diagType === 'healthy' || raw.diagnosis?.name?.toLowerCase().includes('healthy');

    const detectedCropName = raw.crop?.name || raw.crop?.detected_name || userCrop;
    const isMatch = raw.crop?.matched_user_selection !== false && (!raw.crop?.name || raw.crop.name.toLowerCase() === userCrop.toLowerCase() || userCrop.toLowerCase().includes(raw.crop.name.toLowerCase()));

    const detectedSymptoms = (raw.symptoms || []).map((s: any) => {
      if (typeof s === 'string') return s;
      return s.evidence ? `${s.name} (${s.evidence})` : s.name;
    });

    // Extract raw confidence indicators from flat or nested responses
    const rawDiagConf = raw.confidence ?? raw.diagnosis?.confidence ?? raw.confidenceScore;
    const rawCropConf = raw.crop_confidence ?? raw.crop?.confidence ?? rawDiagConf;

    logger.info(`[GEMINI RAW CONFIDENCE] rawDiagConf=${JSON.stringify(rawDiagConf)}, rawCropConf=${JSON.stringify(rawCropConf)}`);

    const normalizedDiagDecimal = normalizeConfidenceDecimal(rawDiagConf);
    const normalizedCropDecimal = normalizeConfidenceDecimal(rawCropConf);

    const confidence = confidenceToScorePercentage(normalizedDiagDecimal, 0);
    const cropConfidence = confidenceToScorePercentage(normalizedCropDecimal, confidence || 0);

    logger.info(`[NORMALIZED CONFIDENCE] decimal=${normalizedDiagDecimal}, score=${confidence}%`);

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
    if (isHealthy) {
      riskLevel = 'LOW';
    } else if (raw.severity || raw.diagnosis?.severity) {
      const sev = String(raw.severity || raw.diagnosis.severity).toUpperCase();
      if (['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(sev)) {
        riskLevel = sev as any;
      }
    } else if (confidence >= 80) {
      riskLevel = 'HIGH';
    }

    const advisory = raw.advisory || {};

    const organicTreatments = advisory.biological && advisory.biological.length > 0
      ? advisory.biological
      : isHealthy
      ? ['Apply compost tea or seaweed extract for foliar vitality.']
      : ['Apply bio-fungicide Trichoderma viride @ 5g/L.'];

    const chemicalTreatments = isHealthy
      ? ['No chemical intervention required for healthy crop.']
      : advisory.chemical && advisory.chemical.length > 0
      ? advisory.chemical
      : ['Consult agronomist before chemical application.'];

    const whatToDoNow = advisory.what_to_do_now || [
      isHealthy
        ? 'Continue regular irrigation and balanced nutrient management.'
        : 'Isolate severely infected leaves and inspect adjacent rows.',
    ];

    const finalStatus: VisionAnalysisStatus = raw.status === 'uncertain' || confidence < 50
      ? 'uncertain'
      : (raw.status || 'success');

    const explanation = raw.explanation || raw.general_explanation || `AI Vision analysis confirmed visual characteristics of ${raw.diagnosis?.name || 'the crop specimen'}.`;

    return {
      isMockDemo: false,
      status: finalStatus,
      diagnosisType: diagType,
      cropName: detectedCropName,
      detectedCrop: {
        name: detectedCropName,
        confidence: cropConfidence,
        matchedUserSelection: isMatch,
        note: raw.crop?.discrepancy_note || (!isMatch ? `Selected "${userCrop}" but image resembles "${detectedCropName}".` : undefined),
      },
      suspectedIssue: raw.diagnosis?.name || (isHealthy ? 'Healthy Plant' : 'Pathological Symptom Detected'),
      scientificName: raw.diagnosis?.scientific_name || '',
      confidence: normalizedDiagDecimal ?? 0,
      confidenceScore: confidence,
      riskLevel,
      observedSymptoms: detectedSymptoms.length > 0 ? detectedSymptoms : (isHealthy ? ['Vibrant green leaf tissue', 'No visible pathogen lesions'] : ['Visible foliar discoloration']),
      visualEvidence: raw.visual_evidence || (raw.symptoms || []).map((s: any) => typeof s === 'string' ? s : `${s.name}: ${s.evidence || ''}`),
      possibleCauses: raw.possible_causes || [],
      generalExplanation: explanation,
      analysisNote: raw.reason || (isHealthy ? 'Specimen shows healthy foliage.' : undefined),
      preventiveSuggestions: advisory.prevention || ['Use certified disease-resistant seeds.', 'Ensure balanced NPK fertilization.'],
      ipmAdvisory: {
        prevention: advisory.prevention || [],
        cultural: advisory.cultural || [],
        mechanical: advisory.mechanical || [],
        biological: advisory.biological || [],
        chemical: advisory.chemical || [],
        monitoring: advisory.monitoring || [],
        whatToDoNow,
        whatToAvoid: advisory.what_to_avoid || ['Avoid excess urea application during humid weather.'],
        whenToInspectAgain: advisory.when_to_inspect_again || '48 Hours',
        whenToContactExpert: advisory.when_to_contact_expert || 'If symptoms spread to new flushes within 3 days.',
      },
      recommendedTreatments: {
        organic: organicTreatments,
        chemical: chemicalTreatments,
      },
      nextSteps: whatToDoNow,
      sourceStatus: 'LIVE GEMINI 2.5 FLASH VISION',
      requiresLabVerification: confidence < 75 || riskLevel === 'CRITICAL',
      needsExpertReview: Boolean(raw.needs_expert_review) || confidence < 60,
      timestamp,
    };
  }

  /**
   * Helper to safely persist high/critical disease alert to MongoDB.
   */
  private static async createDiseaseAlertSafe(result: IDiagnosisResult, farmerId?: string, farmId?: string) {
    if (!isDbConnected()) return;
    try {
      await AlertModel.create({
        title: `Disease Alert: ${result.suspectedIssue} on ${result.cropName}`,
        description: `AI Vision analysis detected ${result.suspectedIssue} on ${result.cropName} with ${result.confidenceScore}% confidence. Immediate inspection advised.`,
        severity: result.riskLevel || 'HIGH',
        type: 'DISEASE',
        farmerId: farmerId || 'farmer-101',
        farmId: farmId || 'farm-1',
        read: false,
        actionableStep:
          result.recommendedTreatments?.chemical?.[0] ||
          result.recommendedTreatments?.organic?.[0] ||
          'Inspect foliage and prepare bio-fungicide',
      });
    } catch (err: any) {
      logger.warn('[DiseaseDetectionService] Could not auto-generate alert:', err.message);
    }
  }

  // --- Catalog Reference Methods ---

  public static async getAllDiseases(cropName?: string) {
    if (!isDbConnected()) {
      if (cropName) {
        return KNOWLEDGE_BASE_DISEASES.filter(
          (d) => d.cropName.toLowerCase().includes(cropName.toLowerCase())
        );
      }
      return KNOWLEDGE_BASE_DISEASES;
    }

    const query = cropName ? { cropName: new RegExp(cropName, 'i') } : {};
    return DiseaseModel.find(query).sort({ cropName: 1 });
  }

  public static async getDiseaseById(id: string) {
    if (isDbConnected()) {
      const query = buildIdQuery(id);
      const found = await DiseaseModel.findOne(query);
      if (found) return found;
    }
    return (
      KNOWLEDGE_BASE_DISEASES.find((item) => item.id === id || (item as any)._id === id) ||
      KNOWLEDGE_BASE_DISEASES[0]
    );
  }

  public static async createDisease(data: IDisease) {
    if (!isDbConnected()) {
      const created: IDisease = { ...data, id: `dis-${Date.now()}` };
      KNOWLEDGE_BASE_DISEASES.push(created);
      return created;
    }
    return DiseaseModel.create(data);
  }
}
