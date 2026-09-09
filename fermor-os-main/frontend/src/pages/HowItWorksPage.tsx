import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Sprout,
  Camera,
  Activity,
  Sun,
  TrendingUp,
  Bot,
  Sparkles,
  ArrowRight,
  Zap,
  Brain,
  Layers,
  CloudRain,
  ShoppingBag,
  Cpu,
  Info,
  ChevronRight,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isHindi = language === 'hi';
  const [activeStep, setActiveStep] = useState<number>(1);

  const workflowSteps = [
    {
      id: 1,
      stepNum: '01',
      titleEn: '1. Add Farm Location',
      titleHi: '1. खेत का स्थान और विवरण जोड़ें',
      farmerEn: 'Adds farm location GPS, land area (acres), and basic soil parameters.',
      farmerHi: 'अपने खेत का स्थान, क्षेत्रफल (एकड़) और मिट्टी के बुनियादी पैरामीटर दर्ज करता है।',
      aiEn: 'Creates a localized farm profile, location context, and eco-zone agricultural baseline.',
      aiHi: 'खेत का डिजिटल प्रोफ़ाइल, स्थान संदर्भ और कृषि परिवेशीय आधार तैयार करता है।',
      farmerIcon: MapPin,
      aiIcon: Cpu,
      farmerColor: '#14532D',
      aiColor: '#052E16',
    },
    {
      id: 2,
      stepNum: '02',
      titleEn: '2. Tell AGRINEXT What You’re Growing',
      titleHi: '2. अपनी फसल की जानकारी दर्ज करें',
      farmerEn: 'Selects the crop type (e.g. Wheat, Paddy, Cotton), sowing date, and growth stage.',
      farmerHi: 'फसल की किस्म (जैसे गेहूं, धान, कपास), बुवाई की तारीख और वृद्धि चरण चुनता है।',
      aiEn: 'Builds crop-specific growth telemetry, milestone timelines, and seasonal vulnerability profiles.',
      aiHi: 'फसल-विशिष्ट वृद्धि टेलीमेट्री, समय-सीमा और मौसमी जोखिम सूचकांक तैयार करता है।',
      farmerIcon: Sprout,
      aiIcon: Brain,
      farmerColor: '#16A34A',
      aiColor: '#052E16',
    },
    {
      id: 3,
      stepNum: '03',
      titleEn: '3. Show the Crop (Photo Upload)',
      titleHi: '3. फसल की पत्ती/पौधे की फोटो लें',
      farmerEn: 'Takes or uploads a photo of affected crop leaves or field condition using a smartphone.',
      farmerHi: 'स्मार्टफोन से प्रभावित पत्ती या खेत की फोटो खींचकर अपलोड करता है।',
      aiEn: 'Runs AI-assisted crop health analysis to evaluate morphological patterns and potential risk indicators.',
      aiHi: 'AI-सहायता प्राप्त स्वास्थ्य विश्लेषण चलाकर पत्ती के धब्बों और संभावित कीट जोखिमों का आकलन करता है।',
      farmerIcon: Camera,
      aiIcon: Bot,
      farmerColor: '#14532D',
      aiColor: '#16A34A',
    },
    {
      id: 4,
      stepNum: '04',
      titleEn: '4. Share Field Observation Signals',
      titleHi: '4. खेत की स्थिति और सिंचाई साझा करें',
      farmerEn: 'Provides field observations such as current irrigation status, leaf color, or fertilizer application.',
      farmerHi: 'सिंचाई स्थिति, पत्ती का रंग और खाद उपयोग जैसी प्राथमिक अवलोकन प्रविष्टियां साझा करता है।',
      aiEn: 'Synthesizes Farm Data + Crop Data + Image Signals into a unified multimodal intelligence matrix.',
      aiHi: 'फार्म डेटा + फसल प्रकार + फोटो सिग्नल को मिलाकर एक एकीकृत मल्टीमोडल इंटेलिजेंस बनाता है।',
      farmerIcon: Activity,
      aiIcon: Layers,
      farmerColor: '#16A34A',
      aiColor: '#052E16',
    },
    {
      id: 5,
      stepNum: '05',
      titleEn: '5. Check Weather Advisory',
      titleHi: '5. मौसम और छिड़काव विंडो देखें',
      farmerEn: 'Checks current local weather, rain probability radar, and 7-day microclimate forecast.',
      farmerHi: 'स्थानीय मौसम, बारिश की संभावना और 7-दिवसीय सूक्ष्म-मौसम पूर्वानुमान की जांच करता है।',
      aiEn: 'Correlates weather conditions with farm tasks to calculate optimal spray and irrigation timing.',
      aiHi: 'मौसम की स्थिति को कृषि कार्यों से जोड़कर छिड़काव और सिंचाई का सबसे सही समय तय करता है।',
      farmerIcon: Sun,
      aiIcon: CloudRain,
      farmerColor: '#14532D',
      aiColor: '#16A34A',
    },
    {
      id: 6,
      stepNum: '06',
      titleEn: '6. Check Mandi & Market Intelligence',
      titleHi: '6. मंडी भाव व बाज़ार रुझान जानें',
      farmerEn: 'Selects commodity and district location to view verified APMC wholesale prices.',
      farmerHi: 'अपनी फसल और जिले का चयन करके आधिकारिक मंडी भाव और मूल्य रुझान देखता है।',
      aiEn: 'Processes regional market price data and historical trends to surface transparent selling options.',
      aiHi: 'क्षेत्रीय मंडी आंकड़ों और ऐतिहासिक रुझानों का विश्लेषण करके बेचने के बेहतर अवसर प्रस्तुत करता है।',
      farmerIcon: TrendingUp,
      aiIcon: ShoppingBag,
      farmerColor: '#B45309',
      aiColor: '#052E16',
    },
  ];

  const handleStart = () => {
    navigate('/role-selection');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px', color: '#17201A' }}>
      
      {/* HERO SECTION (SOFT CREAM #F8FAF5 BACKGROUND) */}
      <div style={{ textAlign: 'center', marginBottom: '44px', padding: '10px 10px 0' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#DCFCE7',
            color: '#14532D',
            border: '1px solid #86efac',
            padding: '6px 18px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(22,163,74,0.1)',
          }}
        >
          <Sparkles size={16} color="#EAB308" />
          <span>
            {isHindi
              ? 'किसान ↔ AGRINEXT AI समानांतर कार्यप्रवाह'
              : 'Parallel Workflow: Farmer Inputs ↔ AGRINEXT AI Engine'}
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
            fontWeight: 900,
            color: '#14532D',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
          }}
        >
          {isHindi ? 'फार्म डेटा से बेहतर कृषि निर्णय तक' : 'From Farm Data to Better Decisions'}
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#16A34A',
            maxWidth: '820px',
            margin: '0 auto 20px',
            lineHeight: 1.5,
          }}
        >
          {isHindi
            ? 'देखें कि AGRINEXT कैसे किसान के रोजमर्रा के इनपुट को AI कृषि बुद्धिमत्ता में बदलता है।'
            : 'See how AGRINEXT turns a farmer’s everyday inputs into AI-powered agricultural intelligence.'}
        </p>

        {/* Short supporting callout box */}
        <div
          style={{
            maxWidth: '840px',
            margin: '0 auto',
            backgroundColor: '#FFFFFF',
            border: '1px solid #DCFCE7',
            borderRadius: '16px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            textAlign: 'left',
            boxShadow: '0 4px 14px rgba(20,83,45,0.04)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#14532D',
            }}
          >
            <Info size={22} />
          </div>
          <p style={{ fontSize: '0.95rem', color: '#17201A', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
            {isHindi
              ? 'किसान खेत और फसल की सरल जानकारी प्रदान करता है। AGRINEXT उस जानकारी को AI, मौसम टेलीमेट्री और बाज़ार डेटा का उपयोग करके व्यावहारिक सलाह और सुझावों में संसाधित करता है।'
              : 'The farmer provides simple information about the farm and crop. AGRINEXT processes that information using AI, weather intelligence and market data to generate practical insights and recommendations.'}
          </p>
        </div>
      </div>

      {/* PARALLEL WORKFLOW SECTION */}
      <div style={{ marginBottom: '56px' }}>
        
        {/* Section Title & Lane Headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          {/* Left Column Header (Farmer - Green Tones) */}
          <div
            style={{
              backgroundColor: '#14532D',
              color: '#ffffff',
              padding: '16px 24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(20, 83, 45, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>👨‍🌾</span>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#DCFCE7', letterSpacing: '0.05em' }}>
                  FARMER INPUT LANE
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  FARMER — What the farmer does
                </h3>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '999px', fontWeight: 700 }}>
              Input Layer
            </span>
          </div>

          {/* Right Column Header (AGRINEXT AI - Dark Green #052E16 + Mint Tones) */}
          <div
            style={{
              backgroundColor: '#052E16',
              color: '#ffffff',
              padding: '16px 24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(5, 46, 22, 0.3)',
              border: '1px solid #16A34A',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>🤖</span>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#EAB308', letterSpacing: '0.05em' }}>
                  PARALLEL PROCESSING
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  AGRINEXT AI — What the AI does
                </h3>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', backgroundColor: '#DCFCE7', color: '#052E16', padding: '4px 10px', borderRadius: '999px', fontWeight: 800 }}>
              AI Engine
            </span>
          </div>
        </div>

        {/* 6 Parallel Workflow Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {workflowSteps.map((item) => {
            const FarmerIcon = item.farmerIcon;
            const AiIcon = item.aiIcon;
            const isActive = activeStep === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveStep(item.id)}
                onClick={() => setActiveStep(item.id)}
                style={{
                  backgroundColor: isActive ? '#FFFFFF' : '#F8FAF5',
                  border: isActive ? `2px solid #16A34A` : '1px solid #DCFCE7',
                  borderRadius: '20px',
                  padding: '20px 24px',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive
                    ? '0 12px 30px rgba(22, 163, 74, 0.15)'
                    : '0 2px 8px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                }}
              >
                {/* Step Banner Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #DCFCE7',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        backgroundColor: isActive ? '#14532D' : '#64748b',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 900,
                        padding: '4px 12px',
                        borderRadius: '999px',
                      }}
                    >
                      STEP {item.stepNum}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#14532D', margin: 0 }}>
                      {isHindi ? item.titleHi : item.titleEn}
                    </h4>
                  </div>
                  
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isActive ? '#16A34A' : '#94a3b8' }}>
                    {isActive ? '● Active Step' : 'Click/Hover to inspect'}
                  </span>
                </div>

                {/* Two Parallel Lanes Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    alignItems: 'center',
                  }}
                >
                  {/* Left Lane: Farmer Action (Green tones) */}
                  <div
                    style={{
                      backgroundColor: isActive ? '#DCFCE7' : '#FFFFFF',
                      border: '1px solid #86efac',
                      borderRadius: '16px',
                      padding: '18px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: '#14532D',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(20,83,45,0.2)',
                      }}
                    >
                      <FarmerIcon size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#14532D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        👨‍🌾 Farmer Action
                      </div>
                      <p style={{ fontSize: '0.92rem', color: '#17201A', margin: '4px 0 0', lineHeight: 1.5, fontWeight: 600 }}>
                        {isHindi ? item.farmerHi : item.farmerEn}
                      </p>
                    </div>
                  </div>

                  {/* Right Lane: AI Parallel Processing (Dark Green #052E16 + Mint) */}
                  <div
                    style={{
                      backgroundColor: isActive ? '#052E16' : '#14532D',
                      border: '1px solid #16A34A',
                      borderRadius: '16px',
                      padding: '18px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      color: '#FFFFFF',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: '#16A34A',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                      }}
                    >
                      <AiIcon size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#EAB308', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        🤖 AGRINEXT AI Engine
                      </div>
                      <p style={{ fontSize: '0.92rem', color: '#dcfce7', margin: '4px 0 0', lineHeight: 1.5, fontWeight: 500 }}>
                        {isHindi ? item.aiHi : item.aiEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTRAL ARCHITECTURE NODE: DARK GREEN (#052E16) WITH WARM GOLD ACCENTS */}
      <div
        style={{
          backgroundColor: '#052E16',
          borderRadius: '24px',
          padding: '44px 32px',
          color: '#ffffff',
          marginBottom: '56px',
          boxShadow: '0 20px 40px rgba(5, 46, 22, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid #14532D',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(234, 179, 8, 0.2)',
              color: '#EAB308',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              marginBottom: '12px',
            }}
          >
            <Cpu size={14} />
            <span>CENTRAL ARCHITECTURE</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            AGRINEXT INTELLIGENCE ENGINE
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#dcfce7', margin: 0 }}>
            {isHindi
              ? 'मल्टीपल इनपुट सिग्नल्स को एक साथ मिलाकर स्पष्ट और कार्रवाई योग्य कृषि सलाह तैयार करना।'
              : 'Synthesizing multi-source signals into verified, actionable agricultural decisions.'}
          </p>
        </div>

        {/* Visual Engine Flow Diagram */}
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#14532D', border: '1px solid #16A34A', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <MapPin size={20} color="#86efac" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>FARM DATA & GPS</div>
              <div style={{ fontSize: '0.72rem', color: '#dcfce7' }}>Acreage, location context & soil</div>
            </div>

            <div style={{ backgroundColor: '#14532D', border: '1px solid #16A34A', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <Sprout size={20} color="#86efac" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>CROP DATA & AGE</div>
              <div style={{ fontSize: '0.72rem', color: '#dcfce7' }}>Crop type, sowing date & stage</div>
            </div>

            <div style={{ backgroundColor: '#14532D', border: '1px solid #EAB308', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <Sun size={20} color="#EAB308" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EAB308' }}>WEATHER TELEMETRY</div>
              <div style={{ fontSize: '0.72rem', color: '#fef9c3' }}>Rain probability & spray window</div>
            </div>

            <div style={{ backgroundColor: '#14532D', border: '1px solid #16A34A', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
              <TrendingUp size={20} color="#86efac" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>MANDI APMC FEEDS</div>
              <div style={{ fontSize: '0.72rem', color: '#dcfce7' }}>District market pricing feeds</div>
            </div>
          </div>

          {/* Central AI Processor Box */}
          <div
            style={{
              backgroundColor: '#14532D',
              border: '2px solid #EAB308',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(234, 179, 8, 0.2)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(234,179,8,0.2)', color: '#EAB308', padding: '4px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 900, marginBottom: '10px' }}>
              <Bot size={16} />
              <span>AGRINEXT MULTIMODAL AI INTELLIGENCE LAYER</span>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#ffffff', maxWidth: '650px', margin: '0 auto', lineHeight: 1.5 }}>
              Cross-references computer vision imagery, micro-climate weather forecasts, and APMC market trends to generate tailored farm actions.
            </p>
          </div>

          {/* 3 Output Branches */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#14532D', border: '1px solid #16A34A', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#86efac', textTransform: 'uppercase' }}>🌱 Crop Risk Insights</div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '6px', lineHeight: 1.4 }}>
                Leaf pathology scan result & organic/chemical treatment advice.
              </div>
            </div>

            <div style={{ backgroundColor: '#14532D', border: '1px solid #16A34A', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#86efac', textTransform: 'uppercase' }}>⛅ Weather Insights</div>
              <div style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: '6px', lineHeight: 1.4 }}>
                Precision spray calendar & rain/irrigation windows.
              </div>
            </div>

            <div style={{ backgroundColor: '#14532D', border: '1px solid #EAB308', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EAB308', textTransform: 'uppercase' }}>📈 Market Insights</div>
              <div style={{ fontSize: '0.85rem', color: '#fef9c3', marginTop: '6px', lineHeight: 1.4 }}>
                Wholesale mandi price trends & direct buyer selling context.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA SECTION (DEEP GREEN #14532D) */}
      <div
        style={{
          backgroundColor: '#14532D',
          borderRadius: '24px',
          padding: '48px 32px',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(20, 83, 45, 0.3)',
          border: '2px solid #16A34A',
        }}
      >
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '14px', letterSpacing: '-0.02em' }}>
          {isHindi ? 'क्या आप AGRINEXT का अनुभव करने के लिए तैयार हैं?' : 'Ready to experience AGRINEXT?'}
        </h2>

        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.6, color: '#DCFCE7' }}>
          {isHindi
            ? 'अपने खेत से शुरुआत करें। AGRINEXT को अपने कृषि डेटा को उपयोगी बुद्धिमत्ता में बदलने दें।'
            : 'Start with your farm. Let AGRINEXT turn agricultural data into useful intelligence.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={handleStart}
            style={{
              backgroundColor: '#16A34A',
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            }}
          >
            <span>{isHindi ? 'शुरू करें (Get Started)' : 'Get Started'}</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={handleStart}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '1rem',
              border: '1px solid #DCFCE7',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span>{isHindi ? 'साइन इन करें (Sign In)' : 'Sign In'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
