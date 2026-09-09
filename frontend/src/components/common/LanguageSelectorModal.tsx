import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Language } from '../../types';
import { Languages, Search, X, Check, Globe } from 'lucide-react';

export const LanguageSelectorModal: React.FC = () => {
  const { language, setLanguage, isLanguageModalOpen, closeLanguageModal, supportedLanguages, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLanguageModalOpen) {
        closeLanguageModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLanguageModalOpen, closeLanguageModal]);

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

  if (!isLanguageModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={closeLanguageModal}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .lang-card-item {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lang-card-item:hover {
          transform: translateY(-2px);
          border-color: #10b981 !important;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.15) !important;
        }
      `}</style>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px 16px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#065f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(6, 95, 70, 0.2)',
              }}
            >
              <Languages size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {t('chooseLanguage', 'Choose Your Language')}
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {t('chooseLanguageSub', 'Select your preferred language for the AGRINEXT experience.')} (17 Languages)
              </p>
            </div>
          </div>
          <button
            onClick={closeLanguageModal}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '16px 28px 12px' }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={18}
              color="#94a3b8"
              style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder={t('searchLanguage', 'Search language or script...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: '14px',
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                fontSize: '0.9rem',
                color: '#1e293b',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.boxShadow = 'none';
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  border: 'none',
                  background: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Grid of Languages */}
        <div
          style={{
            padding: '12px 28px 24px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: '12px',
            maxHeight: '440px',
          }}
        >
          {filteredLanguages.map((meta) => {
            const isSelected = language === meta.code;
            return (
              <div
                key={meta.code}
                className="lang-card-item"
                onClick={() => {
                  setLanguage(meta.code as Language);
                  closeLanguageModal();
                }}
                style={{
                  padding: '14px 16px',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid #059669' : '1.5px solid #f1f5f9',
                  backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: isSelected ? '0 4px 14px rgba(5, 150, 105, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: isSelected ? '#065f46' : '#1e293b',
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
                          padding: '1px 6px',
                          borderRadius: '6px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                        }}
                      >
                        RTL
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                    {meta.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                    {meta.region}
                  </span>
                </div>

                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? '#059669' : '#f8fafc',
                    border: isSelected ? 'none' : '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '14px 28px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={15} color="#059669" />
            <span>AGRINEXT Global Multilingual Engine (17 Languages Supported)</span>
          </div>
          <button
            onClick={closeLanguageModal}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              backgroundColor: '#059669',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            {t('save', 'Done')}
          </button>
        </div>
      </div>
    </div>
  );
};
