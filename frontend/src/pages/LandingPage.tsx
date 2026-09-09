import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Sprout,
  Bot,
  Sun,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Scan,
  Zap,
  ChevronDown,
  Layers,
  CheckCircle2,
  XCircle,
  Activity,
  CloudRain,
  ShieldCheck,
  ChevronRight,
  Camera,
  Play,
  RotateCcw,
  Check,
  Eye,
  Calendar,
  AlertTriangle,
  MapPin,
  Flame,
  Radio,
  Clock,
  LogIn
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isHindi = language === 'hi';

  const handleProtectedNavigate = (targetPath: string) => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate('/role-selection', { state: { from: { pathname: targetPath } } });
    }
  };

  // Hero AI Workflow live active stage (0 to 5)
  const [heroStage, setHeroStage] = useState<number>(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState<boolean>(true);

  // Demo crop selection in the interactive product demo
  const [selectedDemoCrop, setSelectedDemoCrop] = useState<'wheat' | 'tomato' | 'cotton'>('wheat');

  // Mini-Demo interactive simulator step (0 to 4)
  const [simStep, setSimStep] = useState<number>(0);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Auto-play the Hero AI Workflow progression
  useEffect(() => {
    if (!isHeroPlaying) return;
    const timer = setInterval(() => {
      setHeroStage((prev) => (prev + 1) % 6);
    }, 3200);
    return () => clearInterval(timer);
  }, [isHeroPlaying]);

  const heroWorkflowSteps = [
    {
      id: 0,
      title: isHindi ? '1. खेत की फोटो' : '1. Farm Photo',
      badge: isHindi ? 'स्मार्टफोन कैप्चर' : 'Smartphone Capture',
      desc: isHindi ? 'किसान पत्ती या फसल की स्पष्ट फोटो लेता है।' : 'Farmer frames infected leaf or canopy photo.',
      icon: Camera,
      color: '#16A34A',
      bgColor: '#DCFCE7',
      detail: isHindi ? 'गेहूं पत्ती • जगदीशपुरा खेत #1' : 'Wheat Canopy • Jagatpura Plot #1',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 1,
      title: isHindi ? '2. AI विश्लेषण' : '2. AI Analysis',
      badge: isHindi ? 'कंप्यूटर विज़न एक्टिव' : 'Computer Vision Active',
      desc: isHindi ? 'AGRINEXT AI मॉडल पत्ती के ऊतक और कवक पैटर्न स्कैन करता है।' : 'AGRINEXT AI extracts morphological pathogen markers.',
      icon: Bot,
      color: '#0284c7',
      bgColor: '#e0f2fe',
      detail: isHindi ? 'पैथोलॉजी स्कैन • 2.4s लेटेंसी' : 'Neural Inference • 2.4s Latency',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: isHindi ? '3. रोग की पहचान' : '3. Disease Detected',
      badge: isHindi ? 'उच्च जोखिम (92% सटीकता)' : 'HIGH RISK (92% Conf.)',
      desc: isHindi ? 'यलो रस्ट (पीला रतुआ) का सटीक निदान।' : 'Yellow Rust (Puccinia striiformis) confirmed.',
      icon: AlertTriangle,
      color: '#dc2626',
      bgColor: '#fee2e2',
      detail: isHindi ? 'जोखिम: उच्च • आर्द्रता: 84%' : 'Risk: High • Spore Germination Favored',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      title: isHindi ? '4. उपचार मार्गदर्शन' : '4. Treatment Plan',
      badge: isHindi ? 'जैविक + रासायनिक' : 'Biological + Chemical',
      desc: isHindi ? 'प्रोपिकोनाज़ोल स्प्रे + 24 घंटे की अनुकूल स्प्रे विंडो।' : 'Propiconazole 25% EC + Calm spray window advisory.',
      icon: Zap,
      color: '#d97706',
      bgColor: '#fef3c7',
      detail: isHindi ? 'स्प्रे विंडो: सुबह 7:00 - 10:30 AM' : 'Optimal Spray Window: 7:00 - 10:30 AM',
      image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      title: isHindi ? '5. फॉलो-अप फोटो' : '5. Follow-Up Photo',
      badge: isHindi ? 'Day 3 री-स्कैन' : 'Day 3 Review Photo',
      desc: isHindi ? 'किसान 3 दिन बाद दोबारा फोटो अपलोड करता है।' : 'Farmer uploads follow-up photo 72 hrs post-treatment.',
      icon: Camera,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      detail: isHindi ? 'प्रगति निरीक्षण • 72 घंटे बाद' : 'Midway Treatment Verification',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 5,
      title: isHindi ? '6. रिकवरी मॉनिटरिंग' : '6. Recovery Tracking',
      badge: isHindi ? '65% दृश्य सुधार' : '65% Tissue Recovery',
      desc: isHindi ? 'AI ने घाव सूखने और स्वस्थ ऊतक बनने की पुष्टि की।' : 'AI verifies lesion desiccation and halted spore spread.',
      icon: CheckCircle2,
      color: '#16A34A',
      bgColor: '#DCFCE7',
      detail: isHindi ? 'सुधार: 65% • अगला चेकअप Day 7' : 'Recovery: 65% • Final Checkup on Day 7',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Interactive Product Demo Data
  const demoCropsData = {
    wheat: {
      name: isHindi ? 'गेहूं (Wheat)' : 'Wheat (Triticum aestivum)',
      disease: isHindi ? 'यलो रस्ट (Yellow Rust)' : 'Yellow Rust (Puccinia striiformis)',
      risk: 'HIGH',
      riskLabel: isHindi ? 'उच्च जोखिम' : 'HIGH RISK',
      confidence: 92,
      factors: isHindi
        ? ['उच्च आर्द्रता (84%)', 'ठंडी रातें (12-14°C)', 'सुबह की ओस (4+ घंटे)']
        : ['High relative humidity (84%)', 'Cool night temperatures (12-14°C)', 'Prolonged canopy dew (4+ hrs)'],
      biological: isHindi ? 'ट्राइकोडर्मा विरिडे (5g/L) + नीम तेल 1500 PPM' : 'Trichoderma viride @ 5g/L + Neem oil 1500 PPM',
      chemical: isHindi ? 'प्रोपिकोनाज़ोल 25% EC (1 ml/L पानी)' : 'Propiconazole 25% EC @ 1ml/L foliar spray',
      sprayWindow: isHindi ? 'सुबह 7:00 - 10:30 AM (हवा 6 km/h, वर्षा 0%)' : 'Morning 7:00 – 10:30 AM (Wind 6 km/h, Rain 0%)',
      recoveryPercent: 65,
      recoveryText: isHindi
        ? 'कवक के घाव सूख चुके हैं और नई पत्तियों में क्लोरोफिल का स्तर सामान्य है।'
        : 'Active fungal sporulation halted; lesion drying and healthy foliar regeneration verified.',
      day0Image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=500&q=80',
      day3Image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=80',
    },
    tomato: {
      name: isHindi ? 'टमाटर (Tomato)' : 'Tomato (Solanum lycopersicum)',
      disease: isHindi ? 'अर्ली ब्लाइट (Early Blight)' : 'Early Blight (Alternaria solani)',
      risk: 'MEDIUM',
      riskLabel: isHindi ? 'मध्यम जोखिम' : 'MEDIUM RISK',
      confidence: 89,
      factors: isHindi
        ? ['पत्तियों पर संकेंद्रित छल्लेदार धब्बे', 'नमी व तापमान 24-28°C']
        : ['Concentric target-board leaf lesions', 'High canopy moisture & 26°C warmth'],
      biological: isHindi ? 'स्यूडोमोनास फ्लोरेसेन्स (10g/L)' : 'Pseudomonas fluorescens @ 10g/L',
      chemical: isHindi ? 'मैनकोज़ेब 75% WP (2.5g/L पानी)' : 'Mancozeb 75% WP @ 2.5g/L or Azoxystrobin',
      sprayWindow: isHindi ? 'शाम 4:30 - 6:30 PM (मौसम शुष्क)' : 'Late Afternoon 4:30 – 6:30 PM (Dry canopy)',
      recoveryPercent: 78,
      recoveryText: isHindi
        ? 'निचली पत्तियों पर धब्बों का फैलाव रुक चुका है, नए फल स्वस्थ हैं।'
        : 'Lesion borders sealed; no secondary infection observed on younger canopy.',
      day0Image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=500&q=80',
      day3Image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=500&q=80',
    },
    cotton: {
      name: isHindi ? 'कपास (Cotton)' : 'Cotton (Gossypium)',
      disease: isHindi ? 'लीफ कर्ल वायरस (Leaf Curl Virus)' : 'Cotton Leaf Curl Virus (CLCuV)',
      risk: 'CRITICAL',
      riskLabel: isHindi ? 'गंभीर जोखिम' : 'CRITICAL THREAT',
      confidence: 95,
      factors: isHindi
        ? ['सफेद मक्खी (Whitefly) वाहक की अधिकता', 'पत्तियों का ऊपर मुड़ना']
        : ['High Whitefly vector density (14/leaf)', 'Upward leaf curling & vein thickening'],
      biological: isHindi ? 'पीले स्टिकी ट्रैप (10/एकड़) + NSKE 5%' : 'Yellow Sticky Traps (10/acre) + NSKE 5% spray',
      chemical: isHindi ? 'डायफेंथियूरॉन 50% WP (1g/L)' : 'Diafenthiuron 50% WP @ 1g/L for vector knockdown',
      sprayWindow: isHindi ? 'सुबह 6:30 - 9:30 AM' : 'Early Morning 6:30 – 9:30 AM',
      recoveryPercent: 55,
      recoveryText: isHindi
        ? 'सफेद मक्खियों की संख्या 80% घटी, नए पत्तों में कर्लिंग नियंत्रित है।'
        : 'Whitefly population reduced below ETL; terminal shoots emerging normally.',
      day0Image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=500&q=80',
      day3Image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=80',
    },
  };

  const currentDemo = demoCropsData[selectedDemoCrop];

  // 15s Mini Demo Stepper handler
  const handleSimNext = () => {
    if (simStep < 4) {
      setSimStep((prev) => prev + 1);
    } else {
      setSimStep(0);
    }
  };

  const faqs = [
    {
      q: isHindi ? 'AGRINEXT पारंपरिक क्रॉप स्कैनर से कैसे अलग है?' : 'How is AGRINEXT different from standard crop scanner apps?',
      a: isHindi
        ? 'अधिकांश ऐप्स केवल एक बार बीमारी का नाम बताते हैं। AGRINEXT एक संपूर्ण AI ऑपरेटिंग सिस्टम है—यह बीमारी की पहचान के बाद 24h स्प्रे विंडो बताता है, फिर Day 3 और Day 7 पर फॉलो-अप फोटो की तुलना करके 65%+ रिकवरी की पुष्टि करता है और आसपास के GIS रोग हॉटस्पॉट को मॉनिटर करता है।'
        : 'Most scanner apps provide a one-off diagnosis and stop. AGRINEXT is a continuous crop intelligence system: it detects disease, syncs an optimal microclimate spray window, and prompts follow-up scans on Day 3 & 7 to verify recovery progress while monitoring regional GIS disease clusters.',
    },
    {
      q: isHindi ? 'क्या AGRINEXT ऑफ़लाइन या धीमी इंटरनेट में काम करता है?' : 'Does AGRINEXT work in rural areas with low network bandwidth?',
      a: isHindi
        ? 'हाँ! AGRINEXT का आर्किटेक्चर हल्का और मोबाइल-फ्रेंडली है। फोटो स्थानीय रूप से कंप्रेस होती है और कम नेटवर्क में भी 3 सेकंड के अंदर AI परिणाम प्राप्त होते हैं।'
        : 'Yes! AGRINEXT uses lightweight client compression and low-latency inference pipelines optimized for rural 2G/3G/4G connectivity, delivering diagnostic reports within 3 seconds.',
    },
    {
      q: isHindi ? 'क्या AI चैटबॉट मेरी स्थानीय भाषा में बात कर सकता है?' : 'Can the AGRINEXT AI Assistant speak and respond in my regional language?',
      a: isHindi
        ? 'बिल्कुल! AGRINEXT 17 भारतीय और क्षेत्रीय भाषाओं (हिन्दी, मराठी, उर्दू, बांग्ला, गुजराती, पंजाबी, तमिल, तेलुगु आदि) में वॉइस और टेक्स्ट दोनों का समर्थन करता है।'
        : 'Absolutely! AGRINEXT AI natively supports 17 Indian & regional languages (Hindi, Marathi, Urdu, Bengali, Gujarati, Punjabi, Tamil, Telugu, etc.) with both voice recognition and localized text responses.',
    },
    {
      q: isHindi ? 'फॉलो-अप रिकवरी मॉनिटरिंग कैसे काम करती है?' : 'How does the Follow-Up Recovery Comparison feature work?',
      a: isHindi
        ? 'उपचार के बाद, किसान 72 घंटे (Day 3) पर उसी पौधे की दूसरी फोटो अपलोड करता है। हमारा AI दोनों फोटो की तुलना करके बताता है कि घाव कितने प्रतिशत सूखे हैं और क्या अगला स्प्रे आवश्यक है या नहीं।'
        : 'After initial treatment, you upload a review photo 72 hours later (Day 3). Our computer vision models perform temporal comparative analysis to evaluate lesion desiccation and calculate a validated recovery percentage.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#F8FAF5', color: '#17201A', overflowX: 'hidden' }}>
      
      {/* Dynamic Keyframes and Interactive Styles */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(22, 163, 74, 0.3); }
          50% { box-shadow: 0 0 30px rgba(22, 163, 74, 0.7); }
        }

        @keyframes scanBeam {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 90%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }

        .step-connect-node {
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .step-connect-node:hover {
          transform: translateY(-3px);
          border-color: #16A34A !important;
          box-shadow: 0 8px 24px rgba(22,163,74,0.15) !important;
        }

        .tab-btn-active {
          background-color: #14532D !important;
          color: #ffffff !important;
          border-color: #14532D !important;
          box-shadow: 0 4px 14px rgba(20,83,45,0.2) !important;
        }

        .scanning-radar-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #22c55e, #86efac, transparent);
          box-shadow: 0 0 12px #22c55e;
          animation: scanBeam 2.5s ease-in-out infinite;
          z-index: 10;
        }
      `}</style>

      {/* =========================================================================
         1. HERO SECTION WITH LIVE INTERACTIVE AI WORKFLOW VISUALIZER
         ========================================================================= */}
      <section
        style={{
          padding: '60px 4% 80px',
          position: 'relative',
          background: 'radial-gradient(circle at 12% 18%, rgba(220, 252, 231, 0.85) 0%, rgba(248, 250, 245, 1) 72%)',
          borderBottom: '1px solid #DCFCE7',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* LEFT SIDE: Hero Value Proposition */}
          <div>
            {/* Live Precision AI Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#DCFCE7',
                border: '1.5px solid #86efac',
                padding: '6px 18px',
                borderRadius: '999px',
                color: '#14532D',
                fontWeight: 800,
                fontSize: '0.84rem',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.12)',
              }}
            >
              <Sparkles size={16} color="#EAB308" />
              <span>{isHindi ? 'AGRINEXT AI — सतत फसल बुद्धिमत्ता प्रणाली' : 'AGRINEXT AI — Continuous Crop Intelligence System'}</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                fontWeight: 900,
                color: '#14532D',
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                marginBottom: '20px',
              }}
            >
              {isHindi ? 'हर खेत के लिए AI-संचालित बुद्धिमत्ता' : 'AI-Powered Intelligence for Every Farm'}
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: '1.18rem',
                color: '#334155',
                maxWidth: '580px',
                marginBottom: '36px',
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              {isHindi
                ? 'अपनी फसल स्कैन करें, बीमारियों की पहचान करें, जोखिम समझें, उपचार मार्गदर्शन प्राप्त करें और निरंतर सुधार की निगरानी करें — सब कुछ AGRINEXT AI के साथ।'
                : 'Scan your crop, detect diseases, understand risk, get treatment guidance and continuously monitor recovery — all with AGRINEXT AI.'}
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleProtectedNavigate('/disease-detection')}
                style={{
                  padding: '14px 34px',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  borderRadius: '14px',
                  backgroundColor: '#14532D',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(20,83,45,0.25)',
                  transition: 'transform 0.18s ease',
                }}
              >
                <Scan size={20} />
                <span>{t('scanMyCrop', 'Scan My Crop')}</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => handleProtectedNavigate('/ai')}
                style={{
                  padding: '14px 28px',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  borderRadius: '14px',
                  backgroundColor: '#FFFFFF',
                  color: '#14532D',
                  border: '2px solid #16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                }}
              >
                <Bot size={20} color="#16A34A" />
                <span>{isHindi ? 'AGRINEXT AI से पूछें' : 'Talk to AGRINEXT AI'}</span>
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '1px solid #DCFCE7',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#16A34A' }}>94%+</div>
                <div style={{ fontSize: '0.78rem', color: '#14532D', fontWeight: 700 }}>AI Vision Accuracy</div>
              </div>
              <div style={{ width: '1px', height: '30px', backgroundColor: '#DCFCE7' }} />
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#14532D' }}>Day 0 → 3 → 7</div>
                <div style={{ fontSize: '0.78rem', color: '#14532D', fontWeight: 700 }}>Continuous Follow-Up</div>
              </div>
              <div style={{ width: '1px', height: '30px', backgroundColor: '#DCFCE7' }} />
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#EAB308' }}>17 Languages</div>
                <div style={{ fontSize: '0.78rem', color: '#14532D', fontWeight: 700 }}>Full Voice & Text</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: LIVE AI WORKFLOW INTERACTIVE VISUALIZER */}
          <div style={{ position: 'relative' }}>
            
            {/* Ambient Background Glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-10px',
                background: 'linear-gradient(135deg, rgba(22,163,74,0.15) 0%, rgba(234,179,8,0.1) 100%)',
                borderRadius: '32px',
                filter: 'blur(20px)',
                zIndex: 0,
              }}
            />

            {/* Main Interactive AI Console Box */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                backgroundColor: '#ffffff',
                borderRadius: '26px',
                border: '2px solid #86efac',
                boxShadow: '0 20px 50px rgba(20,83,45,0.15)',
                overflow: 'hidden',
                padding: '24px',
              }}
            >
              {/* Header: Live Workflow Controller */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#16A34A',
                      boxShadow: '0 0 10px #16A34A',
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#14532D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isHindi ? 'लाइव AI वर्कफ़्लो सिमुलेशन' : 'Live AI Crop Workflow'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => setIsHeroPlaying(!isHeroPlaying)}
                    style={{
                      border: 'none',
                      backgroundColor: '#f1f5f9',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isHeroPlaying ? '⏸ Pause' : '▶ Play'}
                  </button>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '6px' }}>
                    Step {heroStage + 1} / 6
                  </span>
                </div>
              </div>

              {/* 6-Step Compact Progression Tabs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '6px',
                  marginBottom: '16px',
                }}
              >
                {heroWorkflowSteps.map((step, idx) => {
                  const isActive = heroStage === idx;
                  const StepIcon = step.icon;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setHeroStage(idx);
                        setIsHeroPlaying(false);
                      }}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '10px',
                        border: isActive ? '2px solid #16A34A' : '1px solid #e2e8f0',
                        backgroundColor: isActive ? step.bgColor : '#f8fafc',
                        color: isActive ? step.color : '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease',
                      }}
                      title={step.title}
                    >
                      <StepIcon size={16} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>
                        0{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Live Visual Viewport */}
              {(() => {
                const cur = heroWorkflowSteps[heroStage];
                const CurIcon = cur.icon;
                return (
                  <div
                    style={{
                      borderRadius: '18px',
                      backgroundColor: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {/* Visual Mockup Frame */}
                    <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                      <img
                        src={cur.image}
                        alt={cur.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      
                      {/* Scanning Radar Overlay if on Step 1 or 2 */}
                      {(heroStage === 1 || heroStage === 2) && <div className="scanning-radar-line" />}

                      {/* Floating Overlay Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          backdropFilter: 'blur(8px)',
                          padding: '6px 12px',
                          borderRadius: '10px',
                          border: `1.5px solid ${cur.color}`,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <CurIcon size={16} color={cur.color} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#0f172a' }}>
                          {cur.badge}
                        </span>
                      </div>

                      {/* Detail Pill */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          right: '12px',
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(6px)',
                          color: '#ffffff',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{cur.detail}</span>
                        <span style={{ color: '#86efac', fontWeight: 800 }}>● Active</span>
                      </div>
                    </div>

                    {/* Step Description Bar */}
                    <div style={{ padding: '16px', backgroundColor: '#ffffff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#14532D', margin: 0 }}>
                          {cur.title}
                        </h3>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                          Workflow Stage {heroStage + 1} of 6
                        </span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                        {cur.desc}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Bottom Flow Arrow Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '14px',
                  paddingTop: '10px',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  {isHindi ? '🔄 सतत ऑटो-मॉनिटरिंग सक्रिय' : '🔄 Continuous Autonomous Cycle'}
                </div>
                <button
                  onClick={() => setHeroStage((prev) => (prev + 1) % 6)}
                  style={{
                    border: 'none',
                    backgroundColor: '#DCFCE7',
                    color: '#14532D',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{isHindi ? 'अगला चरण देखें' : 'Next Step'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
         2. "HOW AGRINEXT AI WORKS" — 5 VISUALLY CONNECTED STEPS
         ========================================================================= */}
      <section style={{ padding: '80px 4%', backgroundColor: '#FFFFFF', borderBottom: '1px solid #DCFCE7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#DCFCE7',
                color: '#14532D',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '12px',
                border: '1px solid #86efac',
              }}
            >
              <Zap size={16} color="#16A34A" />
              <span>THE 5-STEP CONTINUOUS INTELLIGENCE CYCLE</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 900, color: '#14532D', marginBottom: '14px', letterSpacing: '-0.02em' }}>
              {isHindi ? 'एक फोटो से सतत फसल बुद्धिमत्ता तक' : 'From One Photo to Continuous Crop Intelligence'}
            </h2>
            <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
              {isHindi
                ? 'AGRINEXT केवल एक बार रोग बताने वाला स्कैनर नहीं है। यह किसान के साथ पूरा रिकवरी चक्र पूरा करता है।'
                : 'AGRINEXT is not a one-time disease identifier. It completes the full loop from initial detection to verified crop recovery.'}
            </p>
          </div>

          {/* 5 Connected Step Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '18px',
              position: 'relative',
            }}
          >
            {[
              {
                num: '01',
                step: isHindi ? 'चरण 1 — फोटो लें' : 'STEP 1 — CAPTURE',
                title: isHindi ? 'पत्ती की तस्वीर' : 'Farmer Takes Photo',
                desc: isHindi ? 'किसान अपने स्मार्टफोन कैमरे से प्रभावित पत्ती की स्पष्ट फोटो लेता है।' : 'Farmer frames leaf imagery using smartphone camera.',
                icon: Camera,
                color: '#16A34A',
                bg: '#DCFCE7',
              },
              {
                num: '02',
                step: isHindi ? 'चरण 2 — AI स्कैन' : 'STEP 2 — AI SCAN',
                title: isHindi ? 'न्यूरल विज़न विश्लेषण' : 'AGRINEXT AI Analysis',
                desc: isHindi ? 'कंप्यूटर विज़न मॉडल 3 सेकंड में कवक व कीट ऊतकों की जांच करता है।' : 'Computer vision evaluates pathogen patterns in < 3s.',
                icon: Bot,
                color: '#0284c7',
                bg: '#e0f2fe',
              },
              {
                num: '03',
                step: isHindi ? 'चरण 3 — सटीक निदान' : 'STEP 3 — DIAGNOSIS',
                title: isHindi ? 'रोग व जोखिम स्तर' : 'Pathogen & Risk Level',
                desc: isHindi ? 'AI रोग का नाम, गंभीरता (HIGH/MED/LOW) और विश्वास स्कोर देता है।' : 'Identifies disease name, risk severity & confidence %.',
                icon: AlertTriangle,
                color: '#dc2626',
                bg: '#fee2e2',
              },
              {
                num: '04',
                step: isHindi ? 'चरण 4 — समाधान' : 'STEP 4 — ACTION',
                title: isHindi ? 'उपचार + स्प्रे विंडो' : 'Treatment Protocols',
                desc: isHindi ? 'किसान को जैविक/रासायनिक दवाएं और अनुकूल मौसम स्प्रे विंडो मिलती है।' : 'Farmer receives biological/chemical steps + weather window.',
                icon: Zap,
                color: '#d97706',
                bg: '#fef3c7',
              },
              {
                num: '05',
                step: isHindi ? 'चरण 5 — फॉलो-अप' : 'STEP 5 — FOLLOW-UP',
                title: isHindi ? 'रिकवरी तुलना' : 'Comparative Recovery',
                desc: isHindi ? '3 दिन बाद किसान दोबारा फोटो भेजता है और AI सुधार प्रतिशत मापता है।' : 'Farmer uploads review photo later; AI validates recovery %.',
                icon: CheckCircle2,
                color: '#059669',
                bg: '#ecfdf5',
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="step-connect-node"
                  style={{
                    backgroundColor: '#F8FAF5',
                    borderRadius: '20px',
                    padding: '24px 20px',
                    border: '1.5px solid #DCFCE7',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  {/* Step Number Pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: s.bg,
                        color: s.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#94a3b8' }}>
                      {s.num}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', fontWeight: 900, color: s.color, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                    {s.step}
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#14532D', marginBottom: '8px' }}>
                    {s.title}
                  </h3>

                  <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
         3. INTERACTIVE PRODUCT DEMONSTRATION: PHOTO → AI → FOLLOW-UP
         ========================================================================= */}
      <section
        style={{
          padding: '80px 4%',
          backgroundColor: '#F0FDF4',
          borderBottom: '1px solid #DCFCE7',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#DCFCE7',
                color: '#14532D',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '12px',
                border: '1px solid #86efac',
              }}
            >
              <Bot size={16} color="#16A34A" />
              <span>INTERACTIVE PRODUCT DEMONSTRATION</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 900, color: '#14532D', marginBottom: '14px', letterSpacing: '-0.02em' }}>
              {isHindi ? 'फोटो → AI निदान → फॉलो-अप रिकवरी लाइव अनुभव' : 'Photo → AI Diagnosis → Follow-Up Recovery Experience'}
            </h2>
            <p style={{ color: '#17201A', fontSize: '1.08rem', maxWidth: '680px', margin: '0 auto' }}>
              {isHindi
                ? 'नीचे किसी भी फसल का चयन करें और देखें कि AGRINEXT AI कैसे निरंतर निगरानी करता है।'
                : 'Select any sample crop below to interact with the full AI diagnostic & recovery loop.'}
            </p>

            {/* Crop Selector Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              {(['wheat', 'tomato', 'cotton'] as const).map((cropKey) => {
                const isActive = selectedDemoCrop === cropKey;
                return (
                  <button
                    key={cropKey}
                    onClick={() => setSelectedDemoCrop(cropKey)}
                    className={isActive ? 'tab-btn-active' : ''}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '12px',
                      border: '1.5px solid #86efac',
                      backgroundColor: '#FFFFFF',
                      color: '#14532D',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Sprout size={18} />
                    <span>{demoCropsData[cropKey].name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Column Interactive Demo Showcase */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              alignItems: 'stretch',
              marginBottom: '32px',
            }}
          >
            {/* COLUMN 1: Crop Upload & Live Scanner */}
            <div
              className="card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '22px',
                border: '1.5px solid #86efac',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 24px rgba(20,83,45,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#16A34A', textTransform: 'uppercase' }}>
                  📷 Crop Leaf Capture
                </span>
                <span style={{ fontSize: '0.72rem', backgroundColor: '#DCFCE7', color: '#14532D', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                  Day 0
                </span>
              </div>

              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '220px', marginBottom: '16px' }}>
                <img
                  src={currentDemo.day0Image}
                  alt={currentDemo.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="scanning-radar-line" />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  ⚡ AI Vision Pathology Scanning...
                </div>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#14532D', marginBottom: '4px' }}>
                {currentDemo.name}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                {isHindi ? 'पत्ती की निचली सतह पर कवक व धब्बों की पहचान।' : 'Infected foliage captured from field plot.'}
              </p>
            </div>

            {/* COLUMN 2: AI Diagnosis & Risk Telemetry */}
            <div
              className="card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '22px',
                border: '1.5px solid #86efac',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 24px rgba(20,83,45,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#0284c7', textTransform: 'uppercase' }}>
                  🧠 AI Diagnostic Card
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, backgroundColor: currentDemo.risk === 'HIGH' || currentDemo.risk === 'CRITICAL' ? '#fee2e2' : '#fef3c7', color: currentDemo.risk === 'HIGH' || currentDemo.risk === 'CRITICAL' ? '#dc2626' : '#d97706', padding: '3px 10px', borderRadius: '999px' }}>
                  {currentDemo.riskLabel}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
                {currentDemo.disease}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${currentDemo.confidence}%`, height: '100%', backgroundColor: '#16A34A', borderRadius: '999px' }} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16A34A' }}>
                  {currentDemo.confidence}% Confidence
                </span>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {isHindi ? 'पहचाने गए मौसमी कारक' : 'Identified Microclimate Triggers'}
                </div>
                {currentDemo.factors.map((f, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <CheckCircle2 size={13} color="#16A34A" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', fontSize: '0.78rem', color: '#14532D', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '8px 12px', borderRadius: '10px' }}>
                🌿 {isHindi ? 'प्रारंभिक उपचार तुरंत शुरू करें' : 'Prophylactic protocol ready'}
              </div>
            </div>

            {/* COLUMN 3: Treatment Protocol & Spray Window */}
            <div
              className="card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '22px',
                border: '1.5px solid #86efac',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 24px rgba(20,83,45,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#d97706', textTransform: 'uppercase' }}>
                  💊 Treatment Guidance
                </span>
                <span style={{ fontSize: '0.72rem', backgroundColor: '#FEF9C3', color: '#B45309', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                  24h Window
                </span>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {isHindi ? 'जैविक उपचार' : 'Biological Control'}
                </div>
                <div style={{ fontSize: '0.86rem', color: '#166534', fontWeight: 700, backgroundColor: '#f0fdf4', padding: '8px 12px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  {currentDemo.biological}
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {isHindi ? 'रासायनिक फोलियर स्प्रे' : 'Chemical Foliar Spray'}
                </div>
                <div style={{ fontSize: '0.86rem', color: '#991b1b', fontWeight: 700, backgroundColor: '#fef2f2', padding: '8px 12px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                  {currentDemo.chemical}
                </div>
              </div>

              <div style={{ marginTop: 'auto', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '10px 12px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: '2px' }}>
                  ⛅ {isHindi ? 'मौसम स्प्रे विंडो' : 'Weather Spray Window'}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#78350f' }}>
                  {currentDemo.sprayWindow}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM FOLLOW-UP MONITORING TIMELINE CARD */}
          <div
            style={{
              backgroundColor: '#14532D',
              borderRadius: '24px',
              padding: '28px 32px',
              color: '#ffffff',
              boxShadow: '0 16px 40px rgba(20,83,45,0.25)',
              border: '2px solid #EAB308',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#EAB308', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '6px' }}>
                  <Sparkles size={13} />
                  <span>CONTINUOUS RECOVERY TRACKING</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>
                  {isHindi ? 'फॉलो-अप मॉनिटरिंग: Day 0 vs Day 3 तुलना' : 'Follow-Up Monitoring: Day 0 vs Day 3 Comparison'}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#86efac' }}>
                  {currentDemo.recoveryPercent}%
                </span>
                <span style={{ fontSize: '0.82rem', color: '#dcfce7', fontWeight: 700 }}>
                  {isHindi ? 'दृश्य सुधार दर्ज' : 'Visible Tissue Recovery'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '10px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ width: `${currentDemo.recoveryPercent}%`, height: '100%', backgroundColor: '#86efac', borderRadius: '999px', transition: 'width 0.8s ease' }} />
            </div>

            {/* 3 Days Steps Timeline */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Day 0 — Initial Scan
                </div>
                <div style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600 }}>
                  {isHindi ? 'रोग की पुष्टि व 24h स्प्रे' : 'Pathogen confirmed & spray scheduled'}
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '14px 16px', border: '1.5px solid #86efac' }}>
                <div style={{ fontSize: '0.75rem', color: '#EAB308', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Day 3 — Review Scan
                </div>
                <div style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600 }}>
                  {currentDemo.recoveryText}
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Day 7 — Final Clearance
                </div>
                <div style={{ fontSize: '0.86rem', color: '#ffffff', fontWeight: 600 }}>
                  {isHindi ? 'अंतिम पुष्टिकरण व फसल चक्र बंद' : 'Final clearance & case resolution'}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
         4. MULTIMODAL CONVERGENCE: "AGRICULTURE INTELLIGENCE ENGINE"
         ========================================================================= */}
      <section style={{ padding: '80px 4%', backgroundColor: '#052E16', color: '#ffffff', borderBottom: '2px solid #14532D' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(234, 179, 8, 0.2)',
              color: '#EAB308',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 800,
              marginBottom: '12px',
            }}
          >
            <Layers size={16} />
            <span>MULTIMODAL AGRICULTURAL SYNTHESIS</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 900, color: '#ffffff', marginBottom: '14px', letterSpacing: '-0.02em' }}>
            {isHindi ? '7 कृषि डेटा स्रोत → एक केंद्रीय AI ऑपरेटिंग सिस्टम' : '7 Agricultural Data Streams → One Unified AI Engine'}
          </h2>
          <p style={{ color: '#bbf7d0', fontSize: '1.08rem', maxWidth: '680px', margin: '0 auto 48px', lineHeight: 1.6 }}>
            {isHindi
              ? 'AGRINEXT फसल के विज़न, उपग्रह मौसम, खेत के जीपीएस, जीआईएस हॉटस्पॉट और मंडी दरों को मिलाकर सटीक निर्णय देता है।'
              : 'AGRINEXT synthesizes crop vision, hyper-local weather telemetry, farm GPS, GIS outbreak radar, and mandi rates into daily actionable farm guidance.'}
          </p>

          {/* Convergence Grid System */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '14px',
              alignItems: 'center',
              marginBottom: '28px',
            }}
          >
            {[
              { label: 'AI Crop Vision', icon: Scan, color: '#16A34A', bg: '#DCFCE7' },
              { label: 'Weather Radar', icon: Sun, color: '#0284c7', bg: '#e0f2fe' },
              { label: 'Farm GPS & Soil', icon: MapPin, color: '#d97706', bg: '#fef3c7' },
              { label: 'GIS Hotspots', icon: Flame, color: '#dc2626', bg: '#fee2e2' },
              { label: 'Crop Cycle', icon: Sprout, color: '#16A34A', bg: '#DCFCE7' },
              { label: 'Pest Traps', icon: Radio, color: '#7c3aed', bg: '#f5f3ff' },
              { label: 'Follow-Up Data', icon: Clock, color: '#059669', bg: '#ecfdf5' },
            ].map((node, idx) => {
              const NodeIcon = node.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#14532D',
                    border: '1.5px solid rgba(134, 239, 172, 0.3)',
                    borderRadius: '16px',
                    padding: '16px 12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: node.bg,
                      color: node.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                    }}
                  >
                    <NodeIcon size={20} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>
                    {node.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central AI Processor Core Banner */}
          <div
            style={{
              backgroundColor: '#14532D',
              border: '2px solid #EAB308',
              borderRadius: '20px',
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: '#EAB308',
                  color: '#14532D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.5rem',
                  boxShadow: '0 4px 14px rgba(234, 179, 8, 0.4)',
                }}
              >
                <Bot size={30} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  AGRINEXT FARM INTELLIGENCE ENGINE
                </h4>
                <p style={{ fontSize: '0.86rem', color: '#dcfce7', margin: '2px 0 0 0' }}>
                  {isHindi
                    ? 'सभी 7 स्रोतों को विश्लेषित कर किसान के लिए दैनिक कार्रवाई योग्य कार्य तैयार करता है।'
                    : 'Real-time synthesis powering accurate farm advisories, spray timing & risk mitigation.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleProtectedNavigate('/dashboard')}
              style={{
                backgroundColor: '#16A34A',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
              }}
            >
              <span>{isHindi ? 'डैशबोर्ड देखें' : 'Explore Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
         5. "SEE AGRINEXT AI IN ACTION" — 15-SECOND INTERACTIVE MINI-DEMO
         ========================================================================= */}
      <section style={{ padding: '80px 4%', backgroundColor: '#FFFFFF', borderBottom: '1px solid #DCFCE7' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#DCFCE7',
                color: '#14532D',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '12px',
                border: '1px solid #86efac',
              }}
            >
              <Sparkles size={16} color="#EAB308" />
              <span>15-SECOND MINI PRODUCT TOUR</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 900, color: '#14532D', marginBottom: '14px' }}>
              {isHindi ? 'AGRINEXT AI को एक्शन में देखें' : 'See AGRINEXT AI in Action'}
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', margin: 0 }}>
              {isHindi
                ? 'बिना जटिलता के 15 सेकंड में समझें कि AGRINEXT कैसे काम करता है।'
                : 'Step through the complete interactive walkthrough in less than 15 seconds.'}
            </p>
          </div>

          {/* Interactive Stepper Box */}
          <div
            style={{
              backgroundColor: '#F8FAF5',
              borderRadius: '24px',
              border: '2px solid #86efac',
              padding: '32px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
            }}
          >
            {/* Step Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', gap: '8px' }}>
              {[
                { label: isHindi ? 'फोटो अपलोड' : 'Upload Leaf', icon: Camera },
                { label: isHindi ? 'AI प्रोसेसिंग' : 'AI Analysis', icon: Bot },
                { label: isHindi ? 'रोग निदान' : 'Diagnosis', icon: AlertTriangle },
                { label: isHindi ? 'उपचार सुझाव' : 'Action Plan', icon: Zap },
                { label: isHindi ? 'फॉलो-अप रिकवरी' : 'Recovery Check', icon: CheckCircle2 },
              ].map((step, idx) => {
                const isActive = simStep === idx;
                const isPassed = simStep > idx;
                const StepIcon = step.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setSimStep(idx)}
                    style={{
                      flex: 1,
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: isActive ? 1 : isPassed ? 0.9 : 0.45,
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: isActive ? '#14532D' : isPassed ? '#16A34A' : '#e2e8f0',
                        color: isActive || isPassed ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isActive ? '0 0 10px rgba(20,83,45,0.3)' : 'none',
                      }}
                    >
                      {isPassed ? <Check size={18} /> : <StepIcon size={16} />}
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isActive ? '#14532D' : '#64748b', textAlign: 'center' }}>
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sim Viewport */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1.5px solid #e2e8f0',
                padding: '24px',
                minHeight: '180px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '18px',
                  backgroundColor: simStep === 2 ? '#fee2e2' : '#DCFCE7',
                  color: simStep === 2 ? '#dc2626' : '#14532D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {simStep === 0 && <Camera size={36} />}
                {simStep === 1 && <Bot size={36} />}
                {simStep === 2 && <AlertTriangle size={36} />}
                {simStep === 3 && <Zap size={36} />}
                {simStep === 4 && <CheckCircle2 size={36} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Step {simStep + 1} of 5
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>
                  {simStep === 0 && (isHindi ? '1. पत्ती की फोटो अपलोड करें' : '1. Upload Field Crop Imagery')}
                  {simStep === 1 && (isHindi ? '2. AGRINEXT AI न्यूरल स्कैन' : '2. Neural Vision Pathology Inference')}
                  {simStep === 2 && (isHindi ? '3. रोग: यलो रस्ट (92% सटीकता, उच्च जोखिम)' : '3. Disease: Yellow Rust (92% Conf., High Risk)')}
                  {simStep === 3 && (isHindi ? '4. अनुशंसित फोलियर स्प्रे + 24h वेदर विंडो' : '4. Recommended Foliar Protocol + 24h Spray Window')}
                  {simStep === 4 && (isHindi ? '5. Day 3 फॉलो-अप: 65% दृश्य रिकवरी सत्यापित' : '5. Day 3 Follow-Up: 65% Tissue Recovery Verified')}
                </h4>
                <p style={{ fontSize: '0.92rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {simStep === 0 && (isHindi ? 'किसान खेत से सीधे स्मार्टफोन द्वारा पत्ती की तस्वीर अपलोड करता है।' : 'Capture leaves directly with your phone or select from existing crop gallery.')}
                  {simStep === 1 && (isHindi ? 'डीप लर्निंग मॉडल सूक्ष्म कवक व ऊतक क्षति के पैटर्न की पहचान करता है।' : 'Extracts visual cellular features and cross-references agronomic databases.')}
                  {simStep === 2 && (isHindi ? 'यलो रस्ट की पहचान और माइक्रॉक्लाइमेट डेटा के आधार पर फैलाव का जोखिम आंका जाता है।' : 'Confirms pathogen risk level and flags potential neighboring plot spread.')}
                  {simStep === 3 && (isHindi ? 'प्रोपिकोनाज़ोल 25% EC का फोलियर छिड़काव और सुबह की अनुकूल स्प्रे विंडो सुझाई जाती है।' : 'Delivers precise chemical/bio dosage and verifies calm rain-free hours.')}
                  {simStep === 4 && (isHindi ? '72 घंटे बाद की फोटो की तुलना में घाव सूखने और ऊतक स्वस्थ होने की पुष्टि होती है।' : 'Temporal comparison verifies lesion drying and closes the treatment loop.')}
                </p>
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => setSimStep(0)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RotateCcw size={16} />
                <span>{isHindi ? 'रीसेट' : 'Reset Tour'}</span>
              </button>

              <button
                onClick={handleSimNext}
                style={{
                  backgroundColor: '#14532D',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>{simStep === 4 ? (isHindi ? 'दोबारा शुरू करें' : 'Restart Tour') : (isHindi ? 'अगला चरण →' : 'Next Step →')}</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
         6. COMPARISON MATRIX: TRADITIONAL FARMING VS AGRINEXT AI OS
         ========================================================================= */}
      <section style={{ padding: '80px 4%', backgroundColor: '#F8FAF5', borderBottom: '1px solid #DCFCE7' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#16A34A',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
              }}
            >
              COMPARISON MATRIX
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#14532D', marginBottom: '12px' }}>
              {isHindi ? 'पारंपरिक खेती बनाम AGRINEXT AI ऑपरेटिंग सिस्टम' : 'Traditional Farming vs AGRINEXT AI OS'}
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
              {isHindi
                ? 'देखें कि कैसे अनुमान आधारित खेती से सटीक AI बुद्धिमत्ता की ओर बढ़ना किसानों की उपज व लाभ बदल देता है।'
                : 'See why transitioning from delayed guesswork to connected intelligence transforms farm productivity.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {/* TRADITIONAL FARMING */}
            <div
              className="card"
              style={{
                padding: '32px',
                backgroundColor: '#ffffff',
                borderColor: '#fecaca',
                borderRadius: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <XCircle size={26} color="#ef4444" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#991b1b', margin: 0 }}>
                  {isHindi ? 'पारंपरिक खेती के तरीके' : 'TRADITIONAL FARMING'}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.92rem', color: '#7f1d1d' }}>
                  <span style={{ fontWeight: 900 }}>•</span>
                  <span><strong>{isHindi ? 'देरी से रोग पहचान:' : 'Delayed Diagnosis:'}</strong> {isHindi ? 'लक्षण गंभीर होने तक बीमारी का पता नहीं चलता, जिससे 30-50% फसल बर्बाद होती है।' : 'Visual guesswork delays critical chemical or biological treatments.'}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.92rem', color: '#7f1d1d' }}>
                  <span style={{ fontWeight: 900 }}>•</span>
                  <span><strong>{isHindi ? 'स्प्रे की बर्बादी:' : 'Wasted Sprays:'}</strong> {isHindi ? 'बिना मौसम रडार के स्प्रे करने से बारिश में महंगी दवाएं धुल जाती हैं।' : 'Unpredicted rain washes away expensive chemical sprays without radar.'}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.92rem', color: '#7f1d1d' }}>
                  <span style={{ fontWeight: 900 }}>•</span>
                  <span><strong>{isHindi ? 'कोई फॉलो-अप नहीं:' : 'No Follow-Up Verification:'}</strong> {isHindi ? 'दवा के प्रभाव या रिकवरी की जांच का कोई वैज्ञानिक तरीका नहीं होता।' : 'No temporal validation to know whether crop is actually recovering.'}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.92rem', color: '#7f1d1d' }}>
                  <span style={{ fontWeight: 900 }}>•</span>
                  <span><strong>{isHindi ? 'बिचौलियों पर निर्भरता:' : 'Opaque Mandi Prices:'}</strong> {isHindi ? 'मंडी के सही भाव न मिलने से किसान को उचित दाम नहीं मिलता।' : 'Reliance on middlemen cuts deep into harvest profitability.'}</span>
                </div>
              </div>
            </div>

            {/* AGRINEXT AI OS */}
            <div
              className="card"
              style={{
                padding: '32px',
                backgroundColor: '#DCFCE7',
                borderColor: '#86efac',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(22, 163, 74, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <CheckCircle2 size={26} color="#16A34A" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#14532D', margin: 0 }}>
                  {isHindi ? 'AGRINEXT AI ऑपरेटिंग सिस्टम' : 'AGRINEXT AI OS'}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.92rem', color: '#14532D' }}>
                  <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>{isHindi ? '3-सेकंड AI निदान:' : '3-Second AI Diagnosis:'}</strong> {isHindi ? 'कैमरा फोटो से 94% सटीकता के साथ तत्काल रोग पहचान व उपचार।' : 'Instant leaf pathology vision with 94%+ diagnostic accuracy.'}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.92rem', color: '#14532D' }}>
                  <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>{isHindi ? 'अनुकूल स्प्रे विंडो:' : 'Optimal Spray Windows:'}</strong> {isHindi ? 'हवा की गति और वर्षा की संभावना देखकर दवा छिड़काव का सही समय।' : 'Hyper-local microclimate rain telemetry prevents spray wastage.'}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.92rem', color: '#14532D' }}>
                  <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>{isHindi ? 'सतत फॉलो-अप (Day 0/3/7):' : 'Continuous Follow-Up (Day 0/3/7):'}</strong> {isHindi ? 'AI पुरानी और नई फोटो की तुलना कर 65%+ रिकवरी की पुष्टि करता है।' : 'Automated comparative monitoring verifies tissue desiccation & recovery.'}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.92rem', color: '#14532D' }}>
                  <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>{isHindi ? 'लाइव APMC मंडी भाव:' : 'Direct APMC Mandi Feeds:'}</strong> {isHindi ? 'दैनिक भाव रुझान और सीधे खरीदारों से जुड़ने की सुविधा।' : 'Transparent APMC wholesale pricing with direct B2B buyer marketplace.'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
         7. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION
         ========================================================================= */}
      <section style={{ padding: '80px 4%', backgroundColor: '#FFFFFF', borderBottom: '1px solid #DCFCE7' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#16A34A',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
              }}
            >
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#14532D' }}>
              {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Got Questions? We Have Answers.'}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    borderColor: isOpen ? '#16A34A' : '#e2e8f0',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      backgroundColor: isOpen ? '#DCFCE7' : '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: '1.02rem', fontWeight: 800, color: '#14532D' }}>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      color={isOpen ? '#16A34A' : '#64748b'}
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                    />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', backgroundColor: '#DCFCE7', color: '#14532D', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
         8. HIGH-CONVERSION PUBLIC CTA BANNER
         ========================================================================= */}
      <section style={{ padding: '60px 4% 80px', backgroundColor: '#F8FAF5' }}>
        <div
          style={{
            maxWidth: '1140px',
            margin: '0 auto',
            backgroundColor: '#14532D',
            borderRadius: '28px',
            padding: '50px 36px',
            color: '#ffffff',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(20, 83, 45, 0.3)',
            border: '2px solid #16A34A',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(234, 179, 8, 0.2)',
              color: '#EAB308',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 800,
              marginBottom: '14px',
            }}
          >
            <Sparkles size={14} />
            <span>START YOUR PRECISION FARMING JOURNEY</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 900, marginBottom: '14px', color: '#FFFFFF' }}>
            {isHindi ? 'क्या आप अपनी खेती को AI-सक्षम बनाने के लिए तैयार हैं?' : 'Ready to Experience Continuous Crop Intelligence?'}
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.95, maxWidth: '640px', margin: '0 auto 32px', lineHeight: 1.6, color: '#DCFCE7' }}>
            {isHindi
              ? 'आज ही AGRINEXT AI के साथ शुरुआत करें। अपनी पहली फसल की फोटो स्कैन करें और सटीक मार्गदर्शन पाएं।'
              : 'Scan your first crop photo today and experience the complete loop of continuous farm intelligence.'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    backgroundColor: '#16A34A',
                    color: '#ffffff',
                    padding: '14px 34px',
                    borderRadius: '14px',
                    fontWeight: 900,
                    fontSize: '1.02rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  <span>{t('myDashboard', 'My Dashboard')}</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => navigate('/ai')}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    padding: '14px 28px',
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: '1.02rem',
                    border: '1.5px solid #DCFCE7',
                    cursor: 'pointer',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Bot size={18} color="#86efac" />
                  <span>{isHindi ? 'AGRINEXT AI से पूछें' : 'Talk to AGRINEXT AI'}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/role-selection', { state: { from: { pathname: '/dashboard' } } })}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    padding: '14px 28px',
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: '1.02rem',
                    border: '1.5px solid #DCFCE7',
                    cursor: 'pointer',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <LogIn size={18} />
                  <span>{t('signIn', 'Sign In')}</span>
                </button>

                <button
                  onClick={() => navigate('/role-selection', { state: { from: { pathname: '/dashboard' } } })}
                  style={{
                    backgroundColor: '#16A34A',
                    color: '#ffffff',
                    padding: '14px 34px',
                    borderRadius: '14px',
                    fontWeight: 900,
                    fontSize: '1.02rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  <span>{t('getStarted', 'Get Started')}</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => handleProtectedNavigate('/ai')}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    padding: '14px 28px',
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: '1.02rem',
                    border: '1.5px solid #DCFCE7',
                    cursor: 'pointer',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Bot size={18} color="#86efac" />
                  <span>{isHindi ? 'AGRINEXT AI से पूछें' : 'Talk to AGRINEXT AI'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
