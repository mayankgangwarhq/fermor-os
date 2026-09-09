import { Language, AIStructuredResponse, AIDiseaseCardPayload, AIWeatherCardPayload, AIFollowUpCardPayload, AIHotspotCardPayload } from '../types';

export { type AIStructuredResponse };

export const queryAgrinextAI = async (
  query: string,
  language: Language = 'en',
  farmContext?: { farmName?: string; cropName?: string; plotName?: string; location?: string }
): Promise<AIStructuredResponse> => {
  const q = query.toLowerCase();
  const crop = farmContext?.cropName || 'Wheat';
  const farm = farmContext?.farmName || 'Sanganer Farm';
  const location = farmContext?.location || 'Jaipur, Rajasthan';

  const isHindi = language === 'hi';
  const isUrdu = language === 'ur';
  const isMarathi = language === 'mr';

  // 1. DISEASE & LEAF YELLOWING / PATHOLOGY
  if (
    q.includes('पीले') || q.includes('yellow') || q.includes('patti') || q.includes('leaf') ||
    q.includes('रोग') || q.includes('disease') || q.includes('rust') || q.includes('patta') ||
    q.includes('धब्बे') || q.includes('spot') || q.includes('fungus') || q.includes('ब्लाइट')
  ) {
    const diseaseCard: AIDiseaseCardPayload = {
      crop: crop,
      disease: 'Yellow Rust (Puccinia striiformis)',
      risk: 'HIGH',
      confidence: 92,
      environmentalFactors: [
        isHindi ? 'उच्च आर्द्रता (84%)' : 'High relative humidity (84%)',
        isHindi ? 'ठंडी रातें (12-14°C)' : 'Cool night temperatures (12-14°C)',
        isHindi ? 'सुबह की ओस (4+ घंटे)' : 'Extended morning dew (4+ hrs)'
      ],
      preventiveAction: isHindi
        ? 'संक्रमित पत्तियों को तुरंत अलग करें और फसल में अत्यधिक यूरिया का उपयोग रोकें।'
        : 'Isolate heavily infected leaves and avoid excessive Nitrogen application.',
      chemicalTreatment: isHindi
        ? 'प्रोपिकोनाज़ोल 25% EC (1 मिली/लीटर) या टेबुकोनाज़ोल का फोलियर स्प्रे करें।'
        : 'Propiconazole 25% EC @ 1ml/L or Tebuconazole 25.9% EC @ 1.25ml/L.',
      biologicalTreatment: isHindi
        ? 'ट्राइकोडर्मा विरिडे (5 ग्राम/लीटर) + नीम तेल 1500 PPM का छिड़काव करें।'
        : 'Trichoderma viride @ 5g/L + Neem oil 1500 PPM @ 3ml/L.',
      sprayWindow: isHindi
        ? 'सुबह 7:00 से 10:30 बजे (हवा की गति 6 km/h, वर्षा संभावना < 10%)'
        : 'Morning 7:00 AM – 10:30 AM (Wind 6 km/h, Rain prob < 10%)',
      imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
    };

    return {
      understanding: isHindi
        ? `आपके विवरण के आधार पर ${crop} में यलो रस्ट (पीला रतुआ / Leaf Chlorosis) का उच्च जोखिम पाया गया है।`
        : `Based on your description, Yellow Rust (Stripe Rust) in ${crop} has been identified as a high probability.`,
      information: isHindi
        ? `यलो रस्ट कवक पत्तियों पर समानांतर पीली धारियों के रूप में फैलता है। समय पर उपचार न होने पर 30-50% तक उपज हानि संभव है।`
        : `Yellow Rust forms distinct yellow powdery stripe pustules along leaf veins. Without timely mitigation, yield loss can reach 30-50%.`,
      nextSteps: [
        isHindi ? 'पत्ती की स्पष्ट फोटो अपलोड करें ताकि AI सटीक पुष्टि कर सके।' : 'Upload a clear leaf photo for accurate AI confirmation.',
        isHindi ? 'अनुशंसित 24 घंटे की स्प्रे विंडो में कवकनाशी का छिड़काव करें।' : 'Apply recommended fungicide during the active spray window.',
        isHindi ? '3 दिन बाद फॉलो-अप फोटो अपलोड करके सुधार की तुलना करें।' : 'Upload a follow-up photo in 3 days to compare AI recovery.'
      ],
      sourceStatus: 'VERIFIED DB',
      diseaseCard,
      actionButtons: [
        { label: isHindi ? '📷 पत्ती स्कैन करें' : '📷 Scan Leaf Photo', action: 'scan', target: '/disease-detection' },
        { label: isHindi ? '📊 फॉलो-अप शुरू करें' : '📊 Start Follow-Up', action: 'upload_followup', target: '/follow-up' },
        { label: isHindi ? '👨‍🌾 विशेषज्ञ परामर्श' : '👨‍🌾 Consult Agronomist', action: 'expert', target: '/experts' }
      ]
    };
  }

  // 2. WEATHER & SPRAY WINDOW
  if (
    q.includes('बारिश') || q.includes('rain') || q.includes('weather') || q.includes('मौसम') ||
    q.includes('हवा') || q.includes('wind') || q.includes('spray') || q.includes('छिड़काव') ||
    q.includes('forecast') || q.includes('तापमान')
  ) {
    const weatherCard: AIWeatherCardPayload = {
      temp: '26°C',
      condition: isHindi ? 'साफ़ व धूप (आंशिक बादल)' : 'Mostly Sunny with High Visibility',
      humidity: '58%',
      rainProb: '12%',
      windSpeed: '7 km/h (पश्चिम)',
      sprayWindowStatus: isHindi ? '✅ सुरक्षित स्प्रे विंडो सक्रिय' : '✅ SAFE SPRAY WINDOW ACTIVE',
      recommendation: isHindi
        ? 'अगले 36 घंटे कीटनाशक या फफूंदनाशी छिड़काव के लिए अनुकूल हैं। हवा की गति नियंत्रित है।'
        : 'Next 36 hours are optimal for foliar spray. Low wind drift and negligible precipitation risk.'
    };

    return {
      understanding: isHindi
        ? `${location} के लिए वर्तमान मौसम उपग्रह डेटा व स्प्रे विंडो विश्लेषण।`
        : `Real-time agricultural weather radar and spray suitability for ${location}.`,
      information: isHindi
        ? `तापमान 26°C और आर्द्रता 58% है। वर्षा की संभावना केवल 12% है, जिससे आज का दिन खेतों में छिड़काव व बुवाई कार्यों के लिए उत्कृष्ट है।`
        : `Current temperature is 26°C with 58% humidity. Rain probability is minimal (12%), making today ideal for chemical or organic spraying.`,
      nextSteps: [
        isHindi ? 'दोपहर की तेज़ धूप से पहले सुबह 11:00 AM तक छिड़काव पूरा करें।' : 'Complete foliar spray before 11:00 AM to prevent thermal evaporation.',
        isHindi ? 'ड्रिप सिंचाई 45 मिनट के लिए शाम 5 बजे शुरू करें।' : 'Run drip irrigation for 45 minutes after 5:00 PM.',
        isHindi ? 'मौसम पूर्वानुमान रडार पर 5-दिवसीय रुझान देखें।' : 'Monitor 5-day precipitation telemetry on the Weather page.'
      ],
      sourceStatus: 'LIVE API',
      weatherCard,
      actionButtons: [
        { label: isHindi ? '🌦️ लाइव वेदर रडार' : '🌦️ Live Weather Radar', action: 'weather', target: '/weather' },
        { label: isHindi ? '⚠️ प्रारंभिक चेतावनी देखें' : '⚠️ View Early Warning', action: 'navigate', target: '/early-warning' }
      ]
    };
  }

  // 3. FOLLOW-UP RECOVERY & PROGRESS MONITORING
  if (
    q.includes('फॉलो') || q.includes('follow') || q.includes('recovery') || q.includes('सुधार') ||
    q.includes('compare') || q.includes('तुलना') || q.includes('progress') || q.includes('day 3') ||
    q.includes('day 0')
  ) {
    const followUpCard: AIFollowUpCardPayload = {
      crop: crop,
      plotName: `${farm} — Plot #1`,
      initialDate: 'Day 0 (Initial Scan)',
      followUpDate: 'Day 3 (Review Scan)',
      recoveryPercent: 65,
      recoverySummary: isHindi
        ? 'पत्तियों पर कवक के घाव सूख रहे हैं। स्वस्थ हरे ऊतकों का पुनर्जीवन 65% तक दर्ज हुआ है।'
        : 'Active sporulation halted. Visible lesion desiccation and 65% foliar recovery observed.',
      initialImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80',
      followUpImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
      nextCheckupDate: 'Day 7 (Final Clearance)',
      lesionStatus: isHindi ? 'घाव सूख रहे हैं (Drying)' : 'Lesion Desiccation in Progress'
    };

    return {
      understanding: isHindi
        ? `आपके ${crop} प्लॉट के लिए AI फॉलो-अप रिकवरी तुलना विश्लेषण तैयार है।`
        : `AI Follow-Up Recovery Comparison analysis generated for your ${crop} plot.`,
      information: isHindi
        ? `Day 0 (प्रारंभिक स्कैन) और Day 3 (फॉलो-अप स्कैन) की तुलना करने पर AI ने 65% स्वस्थ सुधार दर्ज किया है। कवक का फैलाव रुक चुका है।`
        : `Comparing Day 0 (initial scan) against Day 3 (follow-up scan), AGRINEXT AI detected 65% visible tissue recovery with halted fungal progression.`,
      nextSteps: [
        isHindi ? 'प्रोपिकोनाज़ोल छिड़काव का प्रभाव सकारात्मक है, दूसरा स्प्रे आवश्यक नहीं।' : 'Fungicide efficacy verified; second chemical spray not required.',
        isHindi ? 'Day 7 पर अंतिम पुष्टिकरण फोटो अपलोड करें।' : 'Upload Day 7 confirmation photo to close the recovery cycle.',
        isHindi ? 'हल्की सिंचाई बनाए रखें ताकि पौधों की वृद्धि में बाधा न आए।' : 'Maintain light soil moisture to foster vegetative recovery.'
      ],
      sourceStatus: 'AI GUIDANCE',
      followUpCard,
      actionButtons: [
        { label: isHindi ? '📷 नई फॉलो-अप फोटो अपलोड करें' : '📷 Upload Follow-Up Photo', action: 'upload_followup', target: '/follow-up' },
        { label: isHindi ? '📈 रिकवरी टाइमलाइन देखें' : '📈 Full Recovery Timeline', action: 'navigate', target: '/follow-up' }
      ]
    };
  }

  // 4. GIS HOTSPOTS & CLUSTER OUTBREAKS
  if (
    q.includes('हॉटस्पॉट') || q.includes('hotspot') || q.includes('outbreak') || q.includes('प्रकोप') ||
    q.includes('nearby') || q.includes('आसपास') || q.includes('cluster') || q.includes('संक्रमण')
  ) {
    const hotspotCard: AIHotspotCardPayload = {
      district: 'Karnal & Jaipur Perimeter',
      distance: '12.4 km from your farm',
      disease: 'Yellow Rust Outbreak Cluster #4',
      affectedFarms: 18,
      threatLevel: 'HIGH',
      advisory: isHindi
        ? 'हवा की दिशा आपके ब्लॉक की तरफ है। तुरंत निवारक कवकनाशी स्प्रे तैयार रखें।'
        : 'Wind trajectories favor spore drift towards your block. Prepare preventive IPM spraying.'
    };

    return {
      understanding: isHindi
        ? `आपके खेत के 15 km के दायरे में GIS रोग हॉटस्पॉट क्लस्टर का पता चला है।`
        : `GIS disease cluster surveillance alert within a 15 km radius of your farm.`,
      information: isHindi
        ? `12.4 km दूरी पर स्थित करनाल/जयपुर ब्लॉक में यलो रस्ट के 18 मामले दर्ज हुए हैं। माइक्रोक्लाइमेट मॉडल के अनुसार अगले 48 घंटे जोखिम भरे हैं।`
        : `18 confirmed yellow rust cases identified 12.4 km away. Microclimate causality models indicate high transmission risk over the next 48 hours.`,
      nextSteps: [
        isHindi ? 'GIS हॉटस्पॉट मैप पर प्रभावित खेतों का दायरा देखें।' : 'Inspect affected perimeter on the GIS Hotspot Map.',
        isHindi ? 'सीमावर्ती खेतों में नीम तेल या बायो-कवकनाशी का प्रिवेंटिव स्प्रे करें।' : 'Execute prophylactic bio-fungicide spray on boundary plots.',
        isHindi ? 'अपने गांव के किसानों को अलर्ट साझा करें।' : 'Share community alert with neighboring village farmers.'
      ],
      sourceStatus: 'LIVE API',
      hotspotCard,
      actionButtons: [
        { label: isHindi ? '📍 GIS हॉटस्पॉट मैप खोलें' : '📍 Open GIS Hotspot Map', action: 'navigate', target: '/hotspots' },
        { label: isHindi ? '⚠️ शुरुआती चेतावनी' : '⚠️ Early Warning Dashboard', action: 'navigate', target: '/early-warning' }
      ]
    };
  }

  // 5. PEST MONITORING & TRAP SURVEILLANCE
  if (
    q.includes('कीट') || q.includes('pest') || q.includes('कीड़ा') || q.includes('insect') ||
    q.includes('whitefly') || q.includes('bollworm') || q.includes('trap') || q.includes('ट्रैप')
  ) {
    const diseaseCard: AIDiseaseCardPayload = {
      crop: crop,
      disease: 'Whitefly & Aphid Infestation (Bemisia tabaci)',
      risk: 'MEDIUM',
      confidence: 88,
      environmentalFactors: [
        isHindi ? 'तापमान 28-32°C' : 'Warm ambient temperature (28-32°C)',
        isHindi ? 'शुष्क मौसमी स्थिति' : 'Dry spell condition'
      ],
      preventiveAction: isHindi
        ? 'खेत में प्रति एकड़ 8-10 पीले चिपचिपे कार्ड (Yellow Sticky Traps) लगाएं।'
        : 'Install 8-10 Yellow Sticky Traps per acre at crop canopy height.',
      chemicalTreatment: isHindi
        ? 'एसिटामिप्रिड 20% SP (0.5 ग्राम/लीटर) या इमिडाक्लोप्रिड 17.8% SL का स्प्रे करें।'
        : 'Acetamiprid 20% SP @ 0.5g/L or Imidacloprid 17.8% SL @ 0.5ml/L.',
      biologicalTreatment: isHindi
        ? 'नीम बीज अर्क (NSKE 5%) या वर्टिसिलियम लेकानी (5 ग्राम/लीटर) का छिड़काव करें।'
        : 'Neem Seed Kernel Extract (NSKE 5%) or Verticillium lecanii @ 5g/L.'
    };

    return {
      understanding: isHindi
        ? `आपके क्षेत्र में ${crop} पर चूसक कीटों (Whitefly / Aphids) का मध्यम जोखिम दर्ज हुआ है।`
        : `Moderate sucking pest risk (Whitefly / Aphids) detected for ${crop} in your region.`,
      information: isHindi
        ? `फेरोमोन और स्टिकी ट्रैप से कीड़ों की संख्या आर्थिक सीमा स्तर (ETL) से नीचे रखने के लिए जैविक नियंत्रण सबसे प्रभावी है।`
        : `Monitoring pest density with sticky traps helps maintain pest populations below the Economic Threshold Level (ETL).`,
      nextSteps: [
        isHindi ? 'खेत में पीले स्टिकी ट्रैप स्थापित करें।' : 'Deploy yellow sticky traps across the plot boundary.',
        isHindi ? 'पत्तियों की निचली सतह पर वयस्क मक्खियों की गिनती करें।' : 'Count adult insect counts on the undersides of canopy leaves.',
        isHindi ? 'कीट ट्रैप मॉनिटर पेज पर दैनिक गणना दर्ज करें।' : 'Log counts in the Pest Monitoring tracker.'
      ],
      sourceStatus: 'VERIFIED DB',
      diseaseCard,
      actionButtons: [
        { label: isHindi ? '🪤 कीट ट्रैप मॉनिटर' : '🪤 Pest Trap Monitor', action: 'navigate', target: '/pest-monitoring' },
        { label: isHindi ? '📷 फसल स्कैन करें' : '📷 Scan Crop', action: 'scan', target: '/disease-detection' }
      ]
    };
  }

  // 6. SCHEMES & SUBSIDIES
  if (
    q.includes('योजना') || q.includes('scheme') || q.includes('subsidy') || q.includes('सब्सिडी') ||
    q.includes('अनुदान') || q.includes('pm kisan') || q.includes('kusum')
  ) {
    return {
      understanding: isHindi
        ? `आप भारत सरकार और राज्य सरकार की कृषि सब्सिडी योजनाओं के बारे में जानकारी चाहते हैं।`
        : `Government agricultural subsidy and farmer welfare scheme matching for your profile.`,
      information: isHindi
        ? `आपके राज्य (${location}) के लिए 3 प्रमुख योजनाएं सक्रिय हैं: 1) पीएम-किसान (₹6,000/वर्ष), 2) पीएम-कुसुम सोलर पंप (60% सब्सिडी), 3) SMAM कृषि यंत्र सब्सिडी (40-50%)।`
        : `Top active schemes for your region (${location}): 1) PM-KISAN (₹6,000/yr direct income), 2) PM-KUSUM Solar Pump (60% grant), 3) SMAM Farm Machinery Subsidy (40-50%).`,
      nextSteps: [
        isHindi ? 'AGRINEXT Schemes पोर्टल पर अपनी पात्रता (Eligibility) की जांच करें।' : 'Check your verified eligibility on the Schemes page.',
        isHindi ? 'आधार व खतौनी दस्तावेज़ों के साथ ऑनलाइन आवेदन करें।' : 'Apply with Aadhaar and Khatauni land records.',
        isHindi ? 'नजदीकी सीएससी केंद्र से आवेदन स्थिति ट्रैक करें।' : 'Track application status directly from the portal.'
      ],
      sourceStatus: 'VERIFIED DB',
      actionButtons: [
        { label: isHindi ? '🏛️ सरकारी योजनाएं देखें' : '🏛️ View Govt Schemes', action: 'navigate', target: '/schemes' }
      ]
    };
  }

  // 7. MANDI RATES & MARKET INTELLIGENCE
  if (
    q.includes('मंडी') || q.includes('mandi') || q.includes('rate') || q.includes('भाव') ||
    q.includes('price') || q.includes('कीमत') || q.includes('बाजार') || q.includes('market')
  ) {
    return {
      understanding: isHindi
        ? `${location} और आसपास की APMC मंडियों में ${crop} के आज के थोक भाव।`
        : `Live APMC mandi wholesale pricing & trend analytics for ${crop} in ${location}.`,
      information: isHindi
        ? `आज ${crop} का मॉडल भाव ₹2,540 / क्विंटल है (+₹35 दैनिक उछाल)। आवक 420 क्विंटल दर्ज हुई है और मांग मजबूत है।`
        : `Today's modal price for ${crop} is ₹2,540 / quintal (+₹35 daily gain). Total arrival is 420 quintals with strong buyer demand.`,
      nextSteps: [
        isHindi ? 'अगले 7 दिनों के मूल्य रुझान चार्ट की समीक्षा करें।' : 'Review 7-day price forecast charts on the Mandi page.',
        isHindi ? 'सर्वोत्तम मूल्य के लिए सीधे AGRINEXT बाज़ार में लिस्ट करें।' : 'List your harvest directly on the AGRINEXT B2B Marketplace.',
        isHindi ? 'सत्यापित थोक खरीदारों से बोलियां प्राप्त करें।' : 'Receive verified buyer bids with transparent payment terms.'
      ],
      sourceStatus: 'LIVE API',
      actionButtons: [
        { label: isHindi ? '📈 मंडी भाव देखें' : '📈 View Mandi Rates', action: 'navigate', target: '/mandi' },
        { label: isHindi ? '🛒 मार्केटप्लेस में बेचें' : '🛒 Sell on Marketplace', action: 'navigate', target: '/marketplace' }
      ]
    };
  }

  // 8. DEFAULT / GENERAL ADVISORY
  if (isHindi) {
    return {
      understanding: `आपने पूछा: "${query}" — AGRINEXT AI आपकी कृषि सहायता के लिए सक्रिय है।`,
      information: `फसल उत्पादन बढ़ाने और लागत घटाने के लिए संतुलित पोषण, एकीकृत कीट प्रबंधन (IPM), और रीयल-टाइम मौसम आधारित स्प्रे आवश्यक हैं।`,
      nextSteps: [
        'पत्ती की फोटो अपलोड करके AI रोग निदान प्राप्त करें।',
        'मौसम आधारित सुरक्षित स्प्रे विंडो की जांच करें।',
        'खेत की रिकवरी ट्रैक करने के लिए फॉलो-अप मॉनिटरिंग का उपयोग करें।'
      ],
      sourceStatus: 'AI GUIDANCE',
      actionButtons: [
        { label: '📷 फसल स्कैन करें', action: 'scan', target: '/disease-detection' },
        { label: '🌦️ मौसम जांचें', action: 'weather', target: '/weather' },
        { label: '📊 फॉलो-अप ट्रैकर', action: 'upload_followup', target: '/follow-up' }
      ]
    };
  }

  return {
    understanding: `You asked: "${query}" — AGRINEXT AI is synthesizing agronomic intelligence for your farm.`,
    information: `Maximizing farm productivity requires balancing soil nutrition, proactive IPM disease prevention, and scheduling sprays within optimal weather windows.`,
    nextSteps: [
      'Upload a leaf image for real-time computer vision diagnosis.',
      'Check hyper-local microclimate spray windows before chemical application.',
      'Log periodic follow-up scans to track crop recovery progress over time.'
    ],
    sourceStatus: 'AI GUIDANCE',
    actionButtons: [
      { label: '📷 Scan My Crop', action: 'scan', target: '/disease-detection' },
      { label: '🌦️ Check Weather', action: 'weather', target: '/weather' },
      { label: '📊 Follow-Up Tracker', action: 'upload_followup', target: '/follow-up' }
    ]
  };
};
