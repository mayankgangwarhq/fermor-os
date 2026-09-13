import bcrypt from 'bcryptjs';
import { DiseaseModel } from '../models/Disease';
import { PestModel } from '../models/Pest';
import { HotspotModel } from '../models/Hotspot';
import { SchemeModel } from '../models/Scheme';
import { MandiPriceModel } from '../models/MandiPrice';
import { UserModel } from '../models/User';
import { FarmerModel } from '../models/Farmer';
import { FarmModel } from '../models/Farm';
import { CropModel } from '../models/Crop';
import { AlertModel } from '../models/Alert';
import { logger } from '../utils/logger';

export const seedInitialData = async () => {
  try {
    // 1. Seed Disease Knowledge Base
    const diseaseCount = await DiseaseModel.countDocuments();
    if (diseaseCount === 0) {
      logger.info('[DB Seed] Seeding Agronomic Disease Knowledge Base...');
      await DiseaseModel.insertMany([
        {
          cropName: 'Wheat',
          diseaseName: 'Yellow Rust (Stripe Rust)',
          scientificName: 'Puccinia striiformis f. sp. tritici',
          symptoms: [
            'Yellow or orange-yellow powdery pustules arranged in linear stripes on leaves',
            'Chlorotic leaf streaks along the veins',
            'Premature leaf chlorosis, drying, and reduced photosynthetic surface',
            'Stunted ear development during grain filling stage',
          ],
          causes: [
            'High relative humidity (>85%) with cool temperatures (10-18°C)',
            'Airborne urediniospores carried by wind from Himalayan foothills',
            'Excess split application of nitrogenous fertilizers',
          ],
          preventiveMeasures: [
            'Sow resistant wheat cultivars (HD-2967, DBW-187, PBW-502)',
            'Avoid late sowing beyond late November',
            'Maintain optimal plant density and balanced N:P:K fertilization (120:60:40)',
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
          cropName: 'Wheat',
          diseaseName: 'Karnal Bunt',
          scientificName: 'Tilletia indica (Mitra)',
          symptoms: [
            'Partial conversion of wheat kernels into a black powdery spore mass',
            'Foul fishy odor caused by trimethylamine emission',
            'Hollowed and brittle grains detected during threshing',
          ],
          causes: [
            'Cloudy weather, light rains, and high humidity during wheat anthesis / flowering stage',
            'Soil-borne and seed-borne teliospores that remain viable for up to 5 years',
          ],
          preventiveMeasures: [
            'Use certified disease-free foundation seed',
            'Avoid excess and frequent overhead irrigation during flowering',
            'Follow crop rotation with non-host legumes (Gram, Lentil)',
          ],
          chemicalTreatments: [
            'Seed treatment with Carboxin 37.5% + Thiram 37.5% DS @ 2.5 g/kg seed',
            'Single foliar spray of Propiconazole 25% EC @ 1 ml/L at 50% earhead emergence',
          ],
          organicTreatments: [
            'Seed biopriming with Trichoderma harzianum @ 10 g/kg seed',
            'Application of well-decomposed neem cake @ 200 kg/acre to soil',
          ],
          riskLevel: 'MEDIUM',
          imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
          seasonalOccurrence: 'February - March',
        },
        {
          cropName: 'Tomato',
          diseaseName: 'Early Blight',
          scientificName: 'Alternaria solani (Ellis & Martin)',
          symptoms: [
            'Concentric dark brown to black target-board rings on older lower leaves',
            'Yellow chlorotic halo surrounding necrotic lesions',
            'Dark sunken lesions on stem collars near the ground level',
            'Fruit rot with concentric ridges near the calyx attachment',
          ],
          causes: [
            'Warm humid weather (24-30°C) with persistent leaf wetness or dew',
            'Soil-borne fungal mycelium splashing onto lower leaves via raindrops or sprinkler irrigation',
          ],
          preventiveMeasures: [
            '3-year crop rotation with non-solanaceous crops',
            'Mulching beds with straw/plastic to suppress soil-to-leaf rain splashing',
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
          cropName: 'Tomato',
          diseaseName: 'Tomato Leaf Curl Virus (ToLCV)',
          scientificName: 'Tomato Leaf Curl New Delhi Begomovirus',
          symptoms: [
            'Upward and downward curling, puckering and rolling of young leaves',
            'Severe interveinal chlorosis and reduction in leaf blade size (little leaf)',
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
          cropName: 'Potato',
          diseaseName: 'Late Blight',
          scientificName: 'Phytophthora infestans (Mont.) de Bary',
          symptoms: [
            'Water-soaked dark brown to purplish irregular lesions on leaf tips and margins',
            'Delicate white downy mildew / fungal growth on the underside of leaves during morning dew',
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
            'Dehaulm (cut and destroy haulms) 10-12 days before tuber harvest',
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
          cropName: 'Paddy',
          diseaseName: 'Rice Leaf Blast',
          scientificName: 'Magnaporthe oryzae (B.C. Couch)',
          symptoms: [
            'Spindle-shaped elliptical lesions with grey/whitish centers and dark brown/reddish borders',
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
          cropName: 'Cotton',
          diseaseName: 'Bacterial Blight (Black Arm)',
          scientificName: 'Xanthomonas citri pv. malvacearum',
          symptoms: [
            'Angular, water-soaked brown lesions delimited by leaf veinlets',
            'Elongated black lesions girdling stems and branches (black arm stage)',
            'Water-soaked dark lesions on green bolls causing premature shedding and lint staining',
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
      ]);
    }

    // 2. Seed Pest Profiles
    const pestCount = await PestModel.countDocuments();
    if (pestCount === 0) {
      logger.info('[DB Seed] Seeding Pest Surveillance Database...');
      await PestModel.insertMany([
        {
          cropName: 'Cotton & Soybean',
          pestName: 'Whitefly',
          scientificName: 'Bemisia tabaci',
          identification: [
            'Tiny 1.0-1.5mm yellow-bodied insect with white powdery wings',
            'Found aggregated on the lower leaf surface of young apical foliage',
            'Scale-like translucent greenish nymphs adhering to leaf undersides',
          ],
          symptoms: [
            'Chlorotic leaf spots due to intense sap sucking',
            'Copious honeydew secretion encouraging black sooty mold (Capnodium)',
            'Vectoring catastrophic Cotton Leaf Curl & Yellow Mosaic viruses',
          ],
          management: [
            'Deploy yellow sticky traps @ 20 traps/acre at crop canopy level',
            'Spray Diafenthiuron 50% WP @ 1.2 g/L when ETL exceeds 6-8 adults/leaf',
            'Spray Pyriproxyfen 10% + Clothianidin 10% EC @ 1.0 ml/L',
          ],
          organicControl: [
            '5% Neem Seed Kernel Extract (NSKE) spray',
            'Foliar application of Verticillium lecanii bio-pesticide @ 5 g/L',
            'Conserve predatory ladybird beetles (Coccinella) and Chrysoperla',
          ],
          riskLevel: 'HIGH',
          seasonalPeak: 'July - October',
          imageUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600',
        },
        {
          cropName: 'Maize & Sugarcane',
          pestName: 'Fall Armyworm',
          scientificName: 'Spodoptera frugiperda',
          identification: [
            'Distinct inverted Y-shaped mark on head capsule of mature caterpillar',
            'Four dark elevated pinacula arranged in square on 8th abdominal segment',
            'Extensive ragged shot-holes in whorls filled with sawdust-like fecal frass',
          ],
          symptoms: [
            'Destruction of young leaf whorls leading to complete defoliation',
            'Dead-heart symptom caused by larval boring into central growing shoot',
            'Direct damage to earheads and developing maize cobs',
          ],
          management: [
            'Install pheromone traps @ 5 traps/acre for adult monitoring',
            'Whorl application of Emamectin Benzoate 5% SG @ 0.4 g/L when ETL > 5% whorls damaged',
            'Spray Chlorantraniliprole 18.5% SC @ 0.4 ml/L',
          ],
          organicControl: [
            'Bacillus thuringiensis (Bt) kurstaki formulation @ 2.0 g/L',
            'Soil application of Metarhizium anisopliae bio-agent @ 5 g/L',
            'Release egg parasitoid Trichogramma pretiosum @ 50,000 wasps/acre',
          ],
          riskLevel: 'CRITICAL',
          seasonalPeak: 'Kharif & Rabi whorl stages',
          imageUrl: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?w=600',
        },
        {
          cropName: 'Mustard & Vegetables',
          pestName: 'Mustard Aphid (Mahun)',
          scientificName: 'Lipaphis erysimi',
          identification: [
            'Small, soft-bodied yellowish-green to greyish pear-shaped insects',
            'Dense colonies clustering on inflorescences, tender shoots, and pods',
          ],
          symptoms: [
            'Leaf curling, yellowing, and severe stunting of vegetative vigor',
            'Failure of pod development and formation of shriveled light seeds',
            'Heavy honeydew secretion attracting sooty mold',
          ],
          management: [
            'Spray Dimethoate 30% EC @ 1.5 ml/L of water when ETL > 1.5 cm colony on apical shoot',
            'Spray Imidacloprid 17.8% SL @ 0.5 ml/L during late afternoon',
          ],
          organicControl: [
            'Foliar spray of 2% mild soap solution (20g/L)',
            'Neem oil 3000 PPM @ 5 ml/L foliar spray',
            'Sow early in 1st week of October to escape aphid population buildup',
          ],
          riskLevel: 'MEDIUM',
          seasonalPeak: 'December - February',
          imageUrl: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=600',
        },
      ]);
    }

    // 3. Seed Outbreak Hotspots
    const hotspotCount = await HotspotModel.countDocuments();
    if (hotspotCount === 0) {
      logger.info('[DB Seed] Seeding Hotspot GIS Clusters...');
      await HotspotModel.insertMany([
        {
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
      ]);
    }

    // 4. Seed Government Schemes
    const schemeCount = await SchemeModel.countDocuments();
    if (schemeCount === 0) {
      logger.info('[DB Seed] Seeding Government Agricultural Schemes...');
      await SchemeModel.insertMany([
        {
          title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
          titleHi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
          category: 'direct_benefit',
          sponsor: 'Central Govt',
          benefitSummary: 'Direct income support of ₹6,000 per year transferred in three equal 4-monthly installments of ₹2,000 directly into the bank accounts of all landholding farmer families.',
          benefitSummaryHi: 'सभी भूमिधारक किसान परिवारों के बैंक खातों में सीधे ₹6,000 प्रति वर्ष की वित्तीय सहायता (3 किस्तों में ₹2,000)।',
          eligibilityCriteria: [
            'All landholding small and marginal farmer families having cultivable landholding in their names',
            'Valid Aadhaar card linked with active bank account (DBT enabled)',
            'Updated land revenue records (Khatauni / e-KYC verified)',
          ],
          documentsRequired: [
            'Aadhaar Card',
            'Landholding ownership certificate / Revenue Jamabandi / Khasra-Khatauni',
            'Bank passbook photocopy with IFSC code',
          ],
          subsidyPercentage: 100,
          maxFinancialAssistance: '₹6,000 / year',
          applicationUrl: 'https://pmkisan.gov.in',
          applicationDeadline: 'Continuous / Open Year-round',
          active: true,
        },
        {
          title: 'PM-KUSUM (Solar Agricultural Pump Scheme)',
          titleHi: 'पीएम-कुसुम सौर ऊर्जा पंप योजना',
          category: 'subsidy',
          sponsor: 'Central Govt',
          benefitSummary: 'Provides 60% direct capital subsidy (30% Central + 30% State Govt) for standalone off-grid solar agricultural water pumping systems (3 HP to 10 HP). Farmer pays only 10% upfront.',
          benefitSummaryHi: 'खेतों में 3 से 10 HP तक के सोलर पंप लगवाने के लिए 60% तक सरकारी अनुदान (30% केंद्र + 30% राज्य सरकार)। किसान को केवल 10% लागत देनी होती है।',
          eligibilityCriteria: [
            'Individual farmers, Water User Associations, and Farmer Producer Organizations (FPOs)',
            'Cultivable farm plot with confirmed borewell/open-well water source without grid electricity connection',
          ],
          documentsRequired: [
            'Aadhaar Card and Farmer Registration ID',
            'Land ownership records (Khasra/Khatauni copy)',
            'Groundwater NOC and Bank guarantee / declaration',
          ],
          subsidyPercentage: 60,
          maxFinancialAssistance: 'Up to ₹2,50,000 per pump',
          applicationUrl: 'https://pmkusum.mnre.gov.in',
          applicationDeadline: 'State-wise seasonal tranches',
          active: true,
        },
        {
          title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
          titleHi: 'प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)',
          category: 'insurance',
          sponsor: 'Joint',
          benefitSummary: 'Comprehensive crop insurance against non-preventable natural risks (drought, flood, unseasonal rainfall, localized pest/disease outbreaks) with a uniform nominal premium of only 1.5% for Rabi, 2% for Kharif, and 5% for commercial/horticultural crops.',
          benefitSummaryHi: 'प्राकृतिक आपदाओं, कीटों व रोगों से फसल नुकसान पर पूर्ण बीमा सुरक्षा। किसान के लिए नाममात्र प्रीमियम: रबी 1.5%, खरीफ 2.0%।',
          eligibilityCriteria: [
            'All farmers growing notified crops in notified areas (both loanee and non-loanee sharecroppers)',
          ],
          documentsRequired: [
            'Land Revenue Record (ROR / Jamabandi)',
            'Sowing certificate issued by Patwari / Village Agriculture Officer',
            'Bank passbook details',
          ],
          subsidyPercentage: 85,
          maxFinancialAssistance: '100% of Sum Insured per hectare based on loss assessment',
          applicationUrl: 'https://pmfby.gov.in',
          applicationDeadline: 'Within 15 days of crop sowing',
          active: true,
        },
        {
          title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
          titleHi: 'कृषि यंत्रीकरण उप-मिशन (SMAM)',
          category: 'infrastructure',
          sponsor: 'Central Govt',
          benefitSummary: 'Provides 40% to 50% capital subsidy on modern agricultural machinery, power tillers, rotavators, laser land levelers, high-clearance crop sprayers, and drone sprayers.',
          benefitSummaryHi: 'ट्रैक्टर, रोटावेटर, रीपर, स्प्रेयर और कृषि ड्रोन खरीदने पर 40% से 50% तक सरकारी सब्सिडी।',
          eligibilityCriteria: [
            'Small, marginal, SC/ST, and women farmers given preferential 50% subsidy allocation',
          ],
          documentsRequired: [
            'Aadhaar Card',
            'Caste certificate (if applicable)',
            'Land record certificate and quotation invoice from authorized machinery dealer',
          ],
          subsidyPercentage: 50,
          maxFinancialAssistance: 'Up to ₹5,00,000 depending on machine category',
          applicationUrl: 'https://agrimachinery.nic.in',
          applicationDeadline: 'Open tranches',
          active: true,
        },
      ]);
    }

    // 5. Seed Mandi Benchmark Rates
    const mandiCount = await MandiPriceModel.countDocuments();
    if (mandiCount === 0) {
      logger.info('[DB Seed] Seeding Mandi Price Benchmarks...');
      const today = new Date().toISOString().split('T')[0];
      await MandiPriceModel.insertMany([
        {
          commodity: 'Wheat',
          variety: 'Sharbati Gold (C-306)',
          market: 'Indore Mandi (APMC)',
          district: 'Indore',
          state: 'Madhya Pradesh',
          modalPrice: 2680,
          minPrice: 2450,
          maxPrice: 2850,
          priceUnit: '₹/quintal',
          priceChangePercent: 2.8,
          trend: 'up',
          arrivalTonnes: 450,
          date: today,
        },
        {
          commodity: 'Wheat',
          variety: 'Mill Quality (Lokwan)',
          market: 'Khanna Grain Market',
          district: 'Ludhiana',
          state: 'Punjab',
          modalPrice: 2325,
          minPrice: 2275,
          maxPrice: 2375,
          priceUnit: '₹/quintal',
          priceChangePercent: 0.5,
          trend: 'stable',
          arrivalTonnes: 820,
          date: today,
        },
        {
          commodity: 'Soybean',
          variety: 'Yellow (JS-335)',
          market: 'Ujjain Krishi Upaj Mandi',
          district: 'Ujjain',
          state: 'Madhya Pradesh',
          modalPrice: 4720,
          minPrice: 4400,
          maxPrice: 4950,
          priceUnit: '₹/quintal',
          priceChangePercent: 3.4,
          trend: 'up',
          arrivalTonnes: 320,
          date: today,
        },
        {
          commodity: 'Mustard',
          variety: 'Pusa Bold (Black)',
          market: 'Jaipur APMC Terminal Market',
          district: 'Jaipur',
          state: 'Rajasthan',
          modalPrice: 5450,
          minPrice: 5100,
          maxPrice: 5700,
          priceUnit: '₹/quintal',
          priceChangePercent: -1.2,
          trend: 'down',
          arrivalTonnes: 210,
          date: today,
        },
        {
          commodity: 'Tomato',
          variety: 'Hybrid Red (Abhinav)',
          market: 'Kolar Mandi',
          district: 'Kolar',
          state: 'Karnataka',
          modalPrice: 1850,
          minPrice: 1400,
          maxPrice: 2200,
          priceUnit: '₹/quintal',
          priceChangePercent: 6.2,
          trend: 'up',
          arrivalTonnes: 680,
          date: today,
        },
        {
          commodity: 'Cotton',
          variety: 'Medium Staple (Bt Cotton)',
          market: 'Bathinda Cotton Yard',
          district: 'Bathinda',
          state: 'Punjab',
          modalPrice: 7100,
          minPrice: 6800,
          maxPrice: 7450,
          priceUnit: '₹/quintal',
          priceChangePercent: 1.8,
          trend: 'up',
          arrivalTonnes: 190,
          date: today,
        },
      ]);
    }

    // 6. Seed Default Core Users
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      logger.info('[DB Seed] Seeding Default Users & Demo Farmer Profile...');
      const salt = await bcrypt.genSalt(10);
      const farmerPass = await bcrypt.hash('Farmer@123', salt);
      const expertPass = await bcrypt.hash('Expert@123', salt);
      const adminPass = await bcrypt.hash('Admin@123', salt);

      const farmerUser = await UserModel.create({
        name: 'Rajesh Kumar Patel',
        email: 'rajesh.patel@agrinext.in',
        password: farmerPass,
        role: 'farmer',
        phone: '+91 98765 43210',
        state: 'Madhya Pradesh',
        district: 'Indore',
        village: 'Sanwer',
        language: 'en',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Progressive organic and integrated crop cultivator managing 14.5 acres across Indore & Dewas.',
      });

      await UserModel.create({
        name: 'Dr. Ramesh Sharma',
        email: 'dr.sharma@agrinext.in',
        password: expertPass,
        role: 'expert',
        phone: '+91 98111 22233',
        state: 'Punjab',
        district: 'Ludhiana',
        village: 'PAU Campus',
        language: 'en',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        bio: 'Senior Plant Pathologist and Agronomy Specialist at State Agricultural Extension.',
      });

      await UserModel.create({
        name: 'AGRINEXT Administrator',
        email: 'admin@agrinext.in',
        password: adminPass,
        role: 'admin',
        phone: '+91 99999 00000',
        state: 'Delhi',
        district: 'New Delhi',
        village: 'Krishi Bhawan',
        language: 'en',
        bio: 'Central platform administrator and agricultural officer telemetry supervisor.',
      });

      const farmerRecord = await FarmerModel.create({
        userId: farmerUser._id.toString(),
        farmerId: 'FARMER-IND-2026',
        experienceYears: 12,
        totalLandAcres: 14.5,
        primaryCrops: ['Wheat', 'Soybean', 'Mustard'],
        kycStatus: 'verified',
        govtIdType: 'Aadhaar',
        govtIdNumber: 'XXXX-XXXX-4321',
      });

      const farm1 = await FarmModel.create({
        farmerId: farmerUser._id.toString(),
        name: 'Kisan Greenfield Farm #1',
        location: 'Sanwer Road, Indore',
        district: 'Indore',
        state: 'Madhya Pradesh',
        area: 8.5,
        unit: 'acres',
        soilType: 'Black',
        irrigation: 'Drip',
        farmingType: 'Organic',
        crops: ['Wheat (Sharbati)', 'Soybean (JS-335)'],
        coordinates: { latitude: 22.7196, longitude: 75.8577 },
        status: 'active',
      });

      const farm2 = await FarmModel.create({
        farmerId: farmerUser._id.toString(),
        name: 'Malwa Organic Orchard',
        location: 'Ujjain Bypass, Dewas',
        district: 'Dewas',
        state: 'Madhya Pradesh',
        area: 6.0,
        unit: 'acres',
        soilType: 'Alluvial',
        irrigation: 'Borewell',
        farmingType: 'Mixed',
        crops: ['Mustard (Pusa Bold)', 'Chana (Kabuli)'],
        coordinates: { latitude: 22.9676, longitude: 76.0534 },
        status: 'active',
      });

      await CropModel.create({
        farmId: farm1._id.toString(),
        farmerId: farmerUser._id.toString(),
        cropName: 'Wheat',
        variety: 'Sharbati Gold C-306',
        sowingDate: new Date('2025-11-15'),
        expectedHarvestDate: new Date('2026-03-25'),
        growthStage: 'Grain Filling Stage (Day 95)',
        status: 'growing',
        estimatedYieldKg: 4200,
        areaAllocated: 5.0,
        notes: 'Requires 3rd irrigation round in 5 days',
      });

      await CropModel.create({
        farmId: farm1._id.toString(),
        farmerId: farmerUser._id.toString(),
        cropName: 'Soybean',
        variety: 'JS 335',
        sowingDate: new Date('2025-07-02'),
        expectedHarvestDate: new Date('2025-10-18'),
        growthStage: 'Harvest Completed',
        status: 'sold',
        estimatedYieldKg: 2800,
        actualYieldKg: 2950,
        areaAllocated: 3.5,
      });

      await CropModel.create({
        farmId: farm2._id.toString(),
        farmerId: farmerUser._id.toString(),
        cropName: 'Mustard',
        variety: 'Pusa Bold Mustard',
        sowingDate: new Date('2025-10-25'),
        expectedHarvestDate: new Date('2026-02-28'),
        growthStage: 'Pod Maturation (Harvest Ready)',
        status: 'harvest_ready',
        estimatedYieldKg: 1900,
        areaAllocated: 6.0,
      });

      await AlertModel.create({
        title: 'High Pest Risk: Whitefly Infestation Detected',
        description: 'Elevated humidity in Sanwer block creates favorable microclimate for whiteflies in soybean/cotton fields.',
        severity: 'HIGH',
        type: 'PEST',
        farmId: farm1._id.toString(),
        farmerId: farmerUser._id.toString(),
        read: false,
        actionableStep: 'Install yellow sticky traps (15-20/acre) and inspect leaf undersides.',
      });

      await AlertModel.create({
        title: 'Irrigation Advisory: Critical Soil Moisture Level',
        description: 'Wheat crop has entered the grain filling stage. Ensure timely 3rd irrigation round within 48 hours.',
        severity: 'MEDIUM',
        type: 'IRRIGATION',
        farmId: farm1._id.toString(),
        farmerId: farmerUser._id.toString(),
        read: false,
        actionableStep: 'Activate drip irrigation for 3.5 hours during early morning.',
      });
    }

    logger.info('[DB Seed] Database initialization and seed check complete.');
  } catch (err: any) {
    logger.error('[DB Seed] Error during database seeding:', err.message);
  }
};
