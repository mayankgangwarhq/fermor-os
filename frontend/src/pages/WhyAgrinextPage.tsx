import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  Zap,
  ShieldCheck,
  Globe,
  Cpu,
  TrendingUp,
  Brain,
  WifiOff,
  Scale,
  CloudSun,
  ArrowRight,
  ChevronRight,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PublicCtaSection } from '../components/common/PublicCtaSection';

export const WhyAgrinextPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isHindi = language === 'hi';

  const differentiators = [
    {
      feature: isHindi ? 'रोग व कीट निदान' : 'Crop Disease & Pest Diagnosis',
      traditional: isHindi ? 'पारंपरिक अनुमान / देरी से सलाह' : 'Manual visual guesswork, days for lab test results',
      agrinext: isHindi ? '3-सेकंड AI विज़न मॉडल (डीप लर्निंग वर्गीकरण)' : 'Instant 3-second Vision AI model (Deep learning classification)',
      highlight: true,
    },
    {
      feature: isHindi ? 'मौसम पूर्वानुमान' : 'Micro-Weather Advisory',
      traditional: isHindi ? 'सामान्य जिला-स्तरीय समाचार' : 'Generic broadcast news with wide error radius',
      agrinext: isHindi ? 'खेत-विशिष्ट सूक्ष्म मौसम व छिड़काव विंडो' : 'Hyperlocal farm GPS satellite telemetry & spray calendar',
      highlight: false,
    },
    {
      feature: isHindi ? 'मंडी मूल्य अपडेट' : 'Mandi Price Access',
      traditional: isHindi ? 'स्थानीय बिचौलियों पर निर्भरता' : 'Heavy reliance on local middlemen with hidden margins',
      agrinext: isHindi ? '1000+ मंडियों का सीधा लाइव API फीड' : 'Direct live e-NAM & state mandi feeds with price trends',
      highlight: true,
    },
    {
      feature: isHindi ? 'ऑफलाइन/कम नेटवर्क कार्य' : 'Offline / Low-Connectivity Operation',
      traditional: isHindi ? 'इंटरनेट बंद होने पर काम रुक जाना' : 'Total breakdown when cellular network drops in field',
      agrinext: isHindi ? 'एज-कम्प्यूटिंग PWA व ऑफ़लाइन कैशिंग' : 'Edge PWA offline cache for field diagnostics anywhere',
      highlight: false,
    },
    {
      feature: isHindi ? 'भाषा और सुलभता' : 'Language Accessibility',
      traditional: isHindi ? 'केवल अंग्रेजी या कठिन तकनीकी शब्द' : 'English-heavy text interfaces difficult for local farmers',
      agrinext: isHindi ? 'हिंदी + अंग्रेजी बहुभाषी सपोर्ट' : 'Native Hindi & English multi-lingual AI interface',
      highlight: true,
    },
    {
      feature: isHindi ? 'सरकारी योजनाएं व सब्सिडी' : 'Govt Schemes & Subsidies',
      traditional: isHindi ? 'सरकारी दफ्तरों के चक्कर लगाना' : 'Scattered information, manual application forms',
      agrinext: isHindi ? 'योग्यता के आधार पर स्वचालित योजना मैचिंग' : 'Automated eligibility matching & direct portal links',
      highlight: false,
    },
  ];

  const valueProps = [
    {
      icon: Brain,
      title: isHindi ? 'मल्टीमोडल AI विज़न' : 'Multimodal Vision AI',
      desc: isHindi
        ? 'विशिष्ट कृषि डेटासेट पर प्रशिक्षित विज़न मॉडल जो पत्तियों के दाग, फफूंद और कीटों को तुरंत पहचानता है।'
        : 'State-of-the-art vision classifier trained on 100k+ agricultural leaf disease images across Indian top crops.',
    },
    {
      icon: CloudSun,
      title: isHindi ? 'सटीक मौसम टेलीमेट्री' : 'Precision Climate Radar',
      desc: isHindi
        ? 'बारिश, हवा की गति और तापमान के आधार पर कीटनाशक छिड़काव का सर्वोत्तम समय तय करें।'
        : 'Hyperlocal hourly precipitation and wind velocity radar to maximize chemical efficacy and reduce wastage.',
    },
    {
      icon: Scale,
      title: isHindi ? 'बिचौलिया-मुक्त बाज़ार' : 'Zero-Middleman Price Access',
      desc: isHindi
        ? 'किसानों को उनकी उपज का सही दाम दिलाने के लिए पारदर्शी मूल्य तुलना और खरीदार संपर्क।'
        : 'Real-time price trend analytics enabling farmers to command top market rates without middleman deduction.',
    },
    {
      icon: WifiOff,
      title: isHindi ? 'एज-कम्प्यूटिंग ऑफ़लाइन सपोर्ट' : 'Edge-Computing Resilience',
      desc: isHindi
        ? 'कमज़ोर नेटवर्क वाले दूरदराज के खेतों में भी बिना किसी रुकावट के काम करने की क्षमता।'
        : 'Architected as a Progressive Web App (PWA) ensuring essential scan history works seamlessly offline.',
    },
  ];

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', paddingBottom: '40px', color: '#17201A' }}>
      
      {/* Hero Header in Deep Green (#14532D) */}
      <div
        style={{
          backgroundColor: '#14532D',
          borderRadius: '24px',
          padding: '44px 36px',
          color: '#ffffff',
          marginBottom: '40px',
          boxShadow: '0 16px 36px rgba(20, 83, 45, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          border: '2px solid #16A34A',
        }}
      >
        <div style={{ maxWidth: '680px' }}>
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
              color: '#EAB308',
              marginBottom: '14px',
            }}
          >
            <Sparkles size={16} />
            <span>SIH 2026 Competitive Advantage</span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '14px', color: '#FFFFFF' }}>
            {isHindi ? 'AGRINEXT ही क्यों चुनें?' : 'Why AGRINEXT? — The Next-Gen Advantage'}
          </h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: 1.6, color: '#DCFCE7' }}>
            {isHindi
              ? 'पारंपरिक कृषि प्रथाओं और आधुनिक तकनीक के अंतर को मिटाकर भारतीय किसानों को सर्वोत्तम परिणाम देने वाला मंच।'
              : 'Discover why AGRINEXT outperforms traditional fragmented farming tools with a unified AI platform.'}
          </p>
        </div>

        <button
          onClick={() => navigate('/role-selection')}
          style={{
            backgroundColor: '#16A34A',
            color: '#ffffff',
            padding: '14px 26px',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{isHindi ? 'शुरू करें (Get Started)' : 'Get Started'}</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Visual Storytelling Flow: "Why Agriculture Needs Intelligence" */}
      <div
        style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #DCFCE7',
          borderRadius: '24px',
          padding: '36px 28px',
          textAlign: 'center',
          marginBottom: '44px',
        }}
      >
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          VISUAL STORYTELLING
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#14532D', marginBottom: '24px' }}>
          Why Agriculture Needs Intelligence
        </h2>

        {/* Step Progression */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '12px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '0.88rem', color: '#991b1b' }}>
            Fragmented Data
          </div>
          <ChevronRight size={18} color="#94a3b8" />

          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde047', padding: '12px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '0.88rem', color: '#92400e' }}>
            Limited Visibility
          </div>
          <ChevronRight size={18} color="#94a3b8" />

          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '12px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '0.88rem', color: '#991b1b' }}>
            Delayed Decisions
          </div>
          <ChevronRight size={18} color="#94a3b8" />

          <div style={{ backgroundColor: '#14532D', color: '#ffffff', padding: '12px 20px', borderRadius: '12px', fontWeight: 900, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(20,83,45,0.2)' }}>
            🤖 AGRINEXT INTELLIGENCE
          </div>
          <ChevronRight size={18} color="#94a3b8" />

          <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86efac', color: '#14532D', padding: '12px 20px', borderRadius: '12px', fontWeight: 900, fontSize: '0.9rem' }}>
            🎯 BETTER FARM DECISIONS
          </div>
        </div>
      </div>

      {/* Differentiator Comparison Matrix Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid #DCFCE7',
          boxShadow: '0 4px 20px rgba(20,83,45,0.03)',
          marginBottom: '44px',
          overflowX: 'auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#14532D', marginBottom: '6px' }}>
            {isHindi ? 'पारंपरिक खेती बनाम AGRINEXT प्लेटफ़ॉर्म' : 'Traditional Farming vs. AGRINEXT AI Platform'}
          </h2>
          <p style={{ color: '#475569', fontSize: '0.95rem' }}>
            {isHindi ? 'स्मार्ट इंडिया हैकथॉन 2026 तुलनात्मक विश्लेषण' : 'SIH 2026 Feature-by-Feature Benchmark Matrix'}
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #DCFCE7' }}>
              <th style={{ padding: '14px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 800, color: '#14532D' }}>
                {isHindi ? 'विशेषता / क्षमता' : 'Feature / Capability'}
              </th>
              <th style={{ padding: '14px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 800, color: '#ef4444', backgroundColor: '#fef2f2', borderRadius: '8px 8px 0 0' }}>
                {isHindi ? 'पारंपरिक तरीका' : 'Traditional Approach'}
              </th>
              <th style={{ padding: '14px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 800, color: '#14532D', backgroundColor: '#DCFCE7', borderRadius: '8px 8px 0 0' }}>
                ⚡ AGRINEXT AI Platform
              </th>
            </tr>
          </thead>
          <tbody>
            {differentiators.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: '1px solid #DCFCE7',
                  backgroundColor: row.highlight ? '#F8FAF5' : '#ffffff',
                }}
              >
                <td style={{ padding: '16px 14px', fontWeight: 700, fontSize: '0.92rem', color: '#17201A' }}>
                  {row.feature}
                </td>
                <td style={{ padding: '16px 14px', fontSize: '0.88rem', color: '#64748b', backgroundColor: idx % 2 === 0 ? '#fff5f5' : '#fef2f2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <XCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                    <span>{row.traditional}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 14px', fontSize: '0.9rem', fontWeight: 700, color: '#14532D', backgroundColor: idx % 2 === 0 ? '#F0FDF4' : '#DCFCE7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={18} color="#16A34A" style={{ flexShrink: 0 }} />
                    <span>{row.agrinext}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Core Value Props Grid */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532D', marginBottom: '24px', textAlign: 'center' }}>
          {isHindi ? 'मुख्य नवाचार और लाभ' : 'Core Innovations & Advantages'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {valueProps.map((prop, idx) => {
            const Icon = prop.icon;
            return (
              <div
                key={idx}
                className="card feature-card-hover"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  padding: '24px',
                  border: '1px solid #DCFCE7',
                }}
              >
                <div
                  className="icon-bounce"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#14532D', marginBottom: '8px' }}>
                  {prop.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.55 }}>
                  {prop.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Public CTA Banner */}
      <PublicCtaSection />
    </div>
  );
};
