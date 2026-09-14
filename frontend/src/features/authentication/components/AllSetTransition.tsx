import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Sprout } from 'lucide-react';

interface AllSetTransitionProps {
  onAnimationEnd?: () => void;
}

export const AllSetTransition: React.FC<AllSetTransitionProps> = () => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
        animation: 'scaleInCenter 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid #86efac',
          boxShadow: '0 24px 50px -10px rgba(22, 163, 74, 0.25), 0 0 40px rgba(22, 163, 74, 0.15)',
          padding: '48px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Sprout Logo Emblem */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '26px',
            background: 'linear-gradient(135deg, #14532D 0%, #16A34A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            boxShadow: '0 12px 32px rgba(20, 83, 45, 0.35)',
            position: 'relative',
            animation: 'floatSlow 2s ease-in-out infinite',
          }}
        >
          <Sprout size={50} color="#ffffff" strokeWidth={2.2} />
        </div>

        {/* Main Text */}
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#14532D', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          {isHindi ? 'आप पूरी तरह तैयार हैं! 🎉' : "You're All Set! 🎉"}
        </h2>
        <p style={{ fontSize: '1.15rem', color: '#16A34A', margin: '0 0 8px 0', fontWeight: 800 }}>
          {isHindi ? 'AGRINEXT में आपका स्वागत है' : 'Welcome to AGRINEXT'}
        </p>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 24px 0', fontWeight: 500 }}>
          {isHindi
            ? 'आपका व्यक्तिगत कृषि बुद्धिमत्ता डैशबोर्ड तैयार है।'
            : 'Your personalized agriculture intelligence dashboard is ready.'}
        </p>

        {/* Subtext with loader indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: '#64748b',
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              border: '2px solid #cbd5e1',
              borderTopColor: '#16A34A',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <span>{isHindi ? 'डैशबोर्ड लोड हो रहा है...' : 'Opening your Farmer Dashboard...'}</span>
        </div>
      </div>
    </div>
  );
};
