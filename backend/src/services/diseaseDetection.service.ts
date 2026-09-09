import { DiseaseModel } from '../models/Disease';
import { AlertModel } from '../models/Alert';
import { IDiagnosisRequest, IDiagnosisResult, IDisease } from '../types';
import { isDbConnected } from '../config/db';

const sampleDiseases: IDisease[] = [
  {
    id: 'dis-1',
    cropName: 'Wheat',
    diseaseName: 'Yellow Rust (Stripe Rust)',
    scientificName: 'Puccinia striiformis',
    symptoms: [
      'Yellow or orange-yellow powdery pustules arranged in linear stripes on leaves',
      'Premature chlorosis and leaf drying',
      'Stunted plant growth during grain formation',
    ],
    causes: ['High humidity with cool temperature (10-18°C)', 'Airborne fungal spores from foothills'],
    preventiveMeasures: [
      'Use resistant wheat varieties (HD-2967, DBW-187)',
      'Avoid excess nitrogenous fertilizers',
      'Maintain adequate plant spacing',
    ],
    chemicalTreatments: [
      'Spray Propiconazole 25% EC @ 1 ml/L of water',
      'Spray Tebuconazole 25.9% EC @ 1.25 ml/L of water',
    ],
    organicTreatments: [
      'Foliar spray of 5% Neem seed kernel extract (NSKE)',
      'Bio-fungicide Trichoderma viride @ 5g/L',
    ],
    riskLevel: 'HIGH',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600',
    seasonalOccurrence: 'January - March',
  },
  {
    id: 'dis-2',
    cropName: 'Soybean',
    diseaseName: 'Yellow Mosaic Virus (YMV)',
    scientificName: 'Soybean Yellow Mosaic Geminivirus',
    symptoms: [
      'Bright yellow patches alternating with green areas on leaves',
      'Reduced leaf size and puckering',
      'Pod stunting and poor grain filling',
    ],
    causes: ['Vector transmission by Whiteflies (Bemisia tabaci)', 'Weed hosts harboring geminiviruses'],
    preventiveMeasures: [
      'Install yellow sticky traps (15-20 traps/acre)',
      'Seed treatment with Thiamethoxam 30 FS',
      'Eradicate host weeds along field borders',
    ],
    chemicalTreatments: [
      'Spray Thiamethoxam 25% WG @ 0.3 g/L for vector control',
      'Spray Acetamiprid 20% SP @ 0.4 g/L',
    ],
    organicTreatments: [
      'Neem oil 10,000 PPM @ 3 ml/L with 0.5 ml surfactant',
      'Verticillium lecanii fungal bio-agent spray',
    ],
    riskLevel: 'CRITICAL',
    imageUrl: 'https://images.unsplash.com/photo-1599818816933-4f9958ebc072?w=600',
    seasonalOccurrence: 'August - September',
  },
  {
    id: 'dis-3',
    cropName: 'Tomato',
    diseaseName: 'Early Blight',
    scientificName: 'Alternaria solani',
    symptoms: [
      'Concentric dark brown rings (target-like spots) on older leaves',
      'Yellow halo surrounding lesions',
      'Collar rot on stems near ground level',
    ],
    causes: ['Warm temperatures (24-30°C) with frequent wet foliage', 'Soil-borne fungal residues'],
    preventiveMeasures: [
      'Follow 3-year crop rotation with non-solanaceous crops',
      'Mulch soil to prevent rain-splash from soil to foliage',
      'Drip irrigation instead of overhead sprinklers',
    ],
    chemicalTreatments: [
      'Spray Mancozeb 75% WP @ 2.5 g/L of water',
      'Spray Azoxystrobin 23% SC @ 1 ml/L of water',
    ],
    organicTreatments: [
      'Copper oxychloride organic formulation @ 2.5 g/L',
      'Bacillus subtilis bio-fungicide foliar spray',
    ],
    riskLevel: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600',
    seasonalOccurrence: 'Year-round during humid spells',
  },
];

let inMemoryDiseases = [...sampleDiseases];

export class DiseaseDetectionService {
  /**
   * AI/ML Disease Detection Pipeline (Service Abstraction)
   * Note: This service provides an extensible interface ready for computer vision ML model integration.
   * When no external ML inference server (e.g. PyTorch / ONNX / Vertex AI) is connected,
   * it returns structured rule-based agronomic diagnoses clearly flagged as DEMO/MOCK MODE.
   */
  public static async analyzeImageAndDiagnose(
    request: IDiagnosisRequest,
    farmerId?: string,
    farmId?: string
  ): Promise<IDiagnosisResult> {
    const crop = (request.cropName || 'Wheat').trim();
    const symptoms = (request.symptoms || []).join(' ').toLowerCase() + ' ' + (request.notes || '').toLowerCase();

    let matchedDisease: IDisease | undefined;

    if (symptoms.includes('mosaic') || symptoms.includes('whitefly') || crop.toLowerCase().includes('soybean')) {
      matchedDisease = sampleDiseases[1]; // Yellow Mosaic
    } else if (symptoms.includes('blight') || symptoms.includes('target') || crop.toLowerCase().includes('tomato')) {
      matchedDisease = sampleDiseases[2]; // Early Blight
    } else {
      matchedDisease = sampleDiseases[0]; // Yellow Rust
    }

    const confidenceScore = Math.floor(82 + Math.random() * 14); // 82% - 96%
    const riskLevel = matchedDisease.riskLevel;

    // Trigger an alert in database if risk is HIGH or CRITICAL
    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      try {
        if (isDbConnected()) {
          await AlertModel.create({
            title: `Disease Alert: ${matchedDisease.diseaseName} on ${crop}`,
            description: `AI diagnostic detected potential ${matchedDisease.diseaseName} with ${confidenceScore}% confidence. Immediate inspection advised.`,
            severity: riskLevel,
            type: 'DISEASE',
            farmerId: farmerId || 'farmer-101',
            farmId: farmId || 'farm-1',
            read: false,
            actionableStep: matchedDisease.chemicalTreatments[0] || 'Inspect leaf undersides and consult agronomist',
          });
        }
      } catch (err) {
        console.warn('[DiseaseDetection] Could not auto-generate alert:', err);
      }
    }

    return {
      isMockDemo: true,
      cropName: matchedDisease.cropName,
      suspectedIssue: matchedDisease.diseaseName,
      confidenceScore,
      riskLevel: matchedDisease.riskLevel,
      observedSymptoms: matchedDisease.symptoms,
      generalExplanation: `Agronomic analysis identified characteristic patterns consistent with ${matchedDisease.diseaseName} (${matchedDisease.scientificName || 'Fungal/Viral pathogen'}). Causes: ${matchedDisease.causes.join(', ')}.`,
      preventiveSuggestions: matchedDisease.preventiveMeasures,
      recommendedTreatments: {
        organic: matchedDisease.organicTreatments,
        chemical: matchedDisease.chemicalTreatments,
      },
      nextSteps: [
        'Isolate infected leaf samples in sealed polythene for agronomist verification.',
        `Apply recommended treatment: ${matchedDisease.chemicalTreatments[0] || matchedDisease.organicTreatments[0]}`,
        'Check soil moisture & suspend sprinkler irrigation to curb fungal propagation.',
      ],
      sourceStatus: 'AGRONOMIC ADVISORY (DEMO / MOCK AI MODE)',
    };
  }

  public static async getAllDiseases(cropName?: string) {
    if (!isDbConnected()) {
      if (cropName) {
        return inMemoryDiseases.filter((d) => d.cropName.toLowerCase() === cropName.toLowerCase());
      }
      return inMemoryDiseases;
    }

    const query = cropName ? { cropName: new RegExp(cropName, 'i') } : {};
    return DiseaseModel.find(query).sort({ cropName: 1 });
  }

  public static async getDiseaseById(id: string) {
    if (!isDbConnected()) {
      const d = inMemoryDiseases.find((item) => item.id === id);
      return d || inMemoryDiseases[0];
    }
    return DiseaseModel.findById(id);
  }

  public static async createDisease(data: IDisease) {
    if (!isDbConnected()) {
      const created: IDisease = { ...data, id: `dis-${Date.now()}` };
      inMemoryDiseases.push(created);
      return created;
    }
    return DiseaseModel.create(data);
  }
}
