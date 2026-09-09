import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';
import { Sprout, Sparkles, Search, ArrowRight, Check, Globe, ShieldCheck } from 'lucide-react';

export const LanguageSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return supportedLanguages;
    return supportedLanguages.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.nativeName.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        (item.region && item.region.toLowerCase().includes(query))
    );
  }, [searchQuery, supportedLanguages]);

  const handleSelect = (code: Language) => {
    setSelectedLang(code);
    setLanguage(code);
  };

  const handleContinue = () => {
    setLanguage(selectedLang);
    navigate('/role-selection');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #064e3b 0%, #022c22 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '32px 16px',
        color: '#ffffff',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <style>{`
        .lang-grid-card {
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lang-grid-card:hover {
          transform: translateY(-3px);
          background-color: rgba(255, 255, 255, 0.16) !important;
          border-color: #34d399 !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3) !important;
        }
        .lang-grid-card.active {
          background-color: #065f46 !important;
          border-color: #34d399 !important;
          box-shadow: 0 0 0 2px #34d399, 0 12px 28px rgba(16, 185, 129, 0.25) !important;
        }
      `}</style>

      {/* Decorative background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header & Brand */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 1,
          marginTop: '12px',
        }}
      >
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '8px 20px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            marginBottom: '24px',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sprout size={18} />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.05em', color: '#ffffff' }}>
            AGRI<span style={{ color: '#34d399' }}>NEXT</span>
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: 'rgba(52, 211, 153, 0.2)',
              color: '#6ee7b7',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            GLOBAL i18n
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 900,
            margin: '0 0 10px 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {t('chooseLanguage', 'Choose Your Language')}
        </h1>
        <p
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: '#a7f3d0',
            maxWidth: '560px',
            margin: '0 0 28px 0',
            lineHeight: 1.5,
          }}
        >
          {t('chooseLanguageSub', 'Select your preferred language for the AGRINEXT experience.')}
        </p>

        {/* Search Box */}
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            position: 'relative',
            marginBottom: '28px',
          }}
        >
          <Search
            size={18}
            color="#6ee7b7"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder={t('searchLanguage', 'Search language or script...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px 14px 46px',
              borderRadius: '16px',
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#34d399';
              e.target.style.boxShadow = '0 0 0 4px rgba(52, 211, 153, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Language Cards Grid */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '14px',
          zIndex: 1,
          marginBottom: '32px',
        }}
      >
        {filteredLanguages.map((meta) => {
          const isSelected = selectedLang === meta.code;
          return (
            <div
              key={meta.code}
              className={`lang-grid-card ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelect(meta.code as Language)}
              style={{
                padding: '16px 18px',
                borderRadius: '18px',
                border: '1.5px solid rgba(255, 255, 255, 0.14)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: isSelected ? '#ffffff' : '#f0fdf4',
                      lineHeight: 1.2,
                    }}
                  >
                    {meta.nativeName}
                  </span>
                  {meta.dir === 'rtl' && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(251, 191, 36, 0.25)',
                        color: '#fef08a',
                      }}
                    >
                      RTL
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.82rem', color: '#a7f3d0', fontWeight: 500 }}>
                  {meta.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#6ee7b7', opacity: 0.85 }}>
                  {meta.region}
                </span>
              </div>

              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#34d399' : 'rgba(255, 255, 255, 0.1)',
                  border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#064e3b' : 'transparent',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                <Check size={16} strokeWidth={3.5} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          zIndex: 1,
        }}
      >
        <button
          onClick={handleContinue}
          style={{
            width: '100%',
            maxWidth: '380px',
            padding: '16px 32px',
            borderRadius: '16px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            border: 'none',
            fontSize: '1.05rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>{t('continueBtn', 'Continue →')}</span>
          <ArrowRight size={18} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.78rem',
            color: '#6ee7b7',
            opacity: 0.9,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Globe size={14} />
            <span>17 Indian & International Languages</span>
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={14} />
            <span>SIH 26131 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
