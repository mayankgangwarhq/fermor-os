import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Sprout,
  Target,
  Eye,
  Cpu,
  TrendingUp,
  ShieldCheck,
  Globe,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PublicCtaSection } from '../components/common/PublicCtaSection';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const isHindi = language === 'hi';

  const stats = [
    { value: '< 3s', label: isHindi ? 'AI निदान गति' : 'AI Scan Latency' },
    { value: '1,000+', label: isHindi ? 'मंडी मूल्य ट्रैकिंग' : 'APMC Mandi Feeds' },
    { value: '100%', label: isHindi ? 'बहुभाषी व रोल-बेस्ड' : 'Multi-Lingual & Role-Based' },
    { value: 'PWA', label: isHindi ? 'ऑफलाइन एज रेडी' : 'Offline Edge Telemetry' },
  ];

  const pillars = [
    {
      icon: Target,
      title: isHindi ? 'हमारा मिशन' : 'Our Mission',
      description: isHindi
        ? 'उन्नत AI, वास्तविक समय मौसम विश्लेषण और मंडी बुद्धिमत्ता के माध्यम से हर भारतीय किसान को सशक्त बनाना ताकि उपज बढ़े और फसल का नुकसान कम से कम हो।'
        : 'To empower every Indian farmer with advanced multimodal AI, real-time weather analytics, and direct market intelligence to maximize crop yield and profitability.',
      color: '#16A34A',
      bgColor: '#DCFCE7',
    },
    {
      icon: Eye,
      title: isHindi ? 'हमारी दृष्टि' : 'Our Vision',
      description: isHindi
        ? 'भारत का सबसे भरोसेमंद, डेटा-संचालित और सुलभ कृषि AI ऑपरेटिंग सिस्टम बनाना जो पारंपरिक खेती को उच्च तकनीक वाले टिकाऊ कृषि व्यवसाय में बदल दे।'
        : 'To build India\'s most trusted, data-driven, and accessible Agricultural AI Operating System, transforming traditional farming into sustainable, high-tech agritech.',
      color: '#14532D',
      bgColor: '#F0FDF4',
    },
    {
      icon: Cpu,
      title: isHindi ? 'तकनीकी ढांचा' : 'Core Technology',
      description: isHindi
        ? 'गहरे कंप्यूटर विज़न, एज-कम्प्यूटिंग टेलीमेट्री, प्राकृतिक भाषा सलाहकारों और लाइव सरकारी API एकीकरण का सहज मिश्रण।'
        : 'Deep Computer Vision for pest/disease detection, Edge IoT telemetry, localized LLM crop advisory, and direct state mandi integration.',
      color: '#052E16',
      bgColor: '#FEF9C3',
    },
    {
      icon: ShieldCheck,
      title: isHindi ? 'स्थिरता एवं प्रभाव' : 'Sustainability & Impact',
      description: isHindi
        ? 'रासायनिक उर्वरकों का सटीक छिड़काव, पानी की बचत और प्रत्यक्ष बाज़ार पहुँच के ज़रिए किसानों की आय बढ़ाना।'
        : 'Precision farming methods reducing chemical runoff, optimizing water usage, and eliminating middleman margins for higher net returns.',
      color: '#B45309',
      bgColor: '#FEF9C3',
    },
  ];

  const timelineEvents = [
    {
      year: 'SIH 2026',
      title: isHindi ? 'स्मार्ट इंडिया हैकथॉन नवाचार' : 'Smart India Hackathon Innovation',
      desc: isHindi
        ? 'AGRINEXT की नींव SIH 2026 में रखी गई थी ताकि भारत की कृषि चुनौतियों का 100% तकनीकी समाधान दिया जा सके।'
        : 'Conceptualized for SIH 2026 as an end-to-end digital ecosystem for Indian agriculture.',
    },
    {
      year: '2026',
      title: isHindi ? 'मल्टीमोडल AI विज़न इंटीग्रेटर' : 'Multimodal AI Vision Integrator',
      desc: isHindi
        ? 'कैमरा स्कैन से 3 सेकंड में फसल की बीमारियों का सटीक पता लगाने की प्रणाली का शुभारंभ।'
        : 'Introduced 3-second instant leaf disease diagnosis and pest vulnerability alerts.',
    },
    {
      year: '2026+',
      title: isHindi ? 'राष्ट्रीय मंडी एवं मौसम नेटवर्क' : 'National Mandi & Weather Network',
      desc: isHindi
        ? 'भारत भर की 1000+ मंडियों और सटीक सूक्ष्म-मौसम पूर्वानुमान के साथ लाइव डेटा सिंक।'
        : 'Direct integration with government e-NAM mandi feeds and hyperlocal micro-climate radars.',
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px', color: '#17201A' }}>
      
      {/* Hero Banner with Dark Green (#14532D) Theme */}
      <div
        style={{
          backgroundColor: '#14532D',
          borderRadius: '24px',
          padding: '48px 36px',
          color: '#ffffff',
          marginBottom: '40px',
          boxShadow: '0 20px 40px rgba(20, 83, 45, 0.3)',
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'center',
          border: '2px solid #16A34A',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(234, 179, 8, 0.2)',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              marginBottom: '16px',
              color: '#EAB308',
            }}
          >
            <Sparkles size={16} />
            <span>{isHindi ? 'SIH 2026 फ्लैगशिप प्रोजेक्ट' : 'SIH 2026 Flagship AI Platform'}</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            {isHindi ? 'AGRINEXT: भारत का अगला कृषि AI प्लेटफॉर्म' : 'About AGRINEXT — Next-Gen AI Agriculture Operating System'}
          </h1>

          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '28px', color: '#DCFCE7' }}>
            {isHindi
              ? 'AGRINEXT एक संपूर्ण डिजिटल कृषि इकोसिस्टम है जो AI रोग पहचान, उपग्रह डेटा, सटीक मौसम अलर्ट और सीधी मंडी पहुंच को एक साथ लाता है।'
              : 'AGRINEXT bridges cutting-edge artificial intelligence, satellite imagery, micro-climate weather forecasting, and real-time mandi prices into one seamless agricultural OS.'}
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/role-selection')}
              style={{
                backgroundColor: '#16A34A',
                color: '#ffffff',
                padding: '12px 26px',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              <span>{t('getStarted', 'Get Started')}</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/how-it-works')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: '1px solid #DCFCE7',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
              }}
            >
              {t('navHowItWorks', 'How It Works')}
            </button>
          </div>
        </div>

        {/* Right Hero Field Photography */}
        <div className="image-hover-zoom" style={{ borderRadius: '20px', overflow: 'hidden', border: '3px solid #EAB308', boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}>
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
            alt="Agricultural Field Landscape"
            style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      {/* Metrics Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #DCFCE7',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(20,83,45,0.04)',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16A34A', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#14532D' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Pillars Section */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#14532D', marginBottom: '8px' }}>
            {isHindi ? 'हमारे मुख्य स्तंभ' : 'Our Strategic Pillars'}
          </h2>
          <p style={{ color: '#475569', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            {isHindi
              ? 'तकनीक और कृषि ज्ञान का संतुलन जो हर किसान को बेहतर निर्णय लेने में मदद करता है।'
              : 'Combining high-tech AI innovation with practical field insights for Indian agriculture.'}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="card feature-card-hover"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  padding: '28px',
                  border: '1px solid #DCFCE7',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div
                  className="icon-bounce"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: pillar.bgColor,
                    color: pillar.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#14532D' }}>{pillar.title}</h3>
                <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline & Roadmap */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '36px',
          border: '1px solid #DCFCE7',
          boxShadow: '0 4px 20px rgba(20,83,45,0.04)',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532D', marginBottom: '24px' }}>
          {isHindi ? 'AGRINEXT विकास यात्रा' : 'AGRINEXT Platform Evolution'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {timelineEvents.map((item, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                paddingLeft: '20px',
                borderLeft: '3px solid #16A34A',
              }}
            >
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#14532D',
                  backgroundColor: '#DCFCE7',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-block',
                  marginBottom: '8px',
                }}
              >
                {item.year}
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#17201A', marginBottom: '6px' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Public CTA Banner */}
      <PublicCtaSection />
    </div>
  );
};
