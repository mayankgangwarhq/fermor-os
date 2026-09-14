import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface VerificationSuccessProps {
  onAnimationEnd?: () => void;
}

export const VerificationSuccess: React.FC<VerificationSuccessProps> = () => {
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
          boxShadow: '0 24px 50px -10px rgba(22, 163, 74, 0.2), 0 0 30px rgba(22, 163, 74, 0.1)',
          padding: '48px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Pulse Rings */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            position: 'relative',
            boxShadow: '0 0 0 12px rgba(34, 197, 94, 0.15), 0 0 0 24px rgba(34, 197, 94, 0.08)',
            animation: 'pulseRing 1.5s ease-out infinite',
          }}
        >
          <CheckCircle2 size={54} color="#16A34A" strokeWidth={2.4} style={{ animation: 'bounceIn 0.5s ease' }} />
        </div>

        {/* Main Text */}
        <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#14532D', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
          {isHindi ? 'OTP सत्यापित ✓' : 'OTP Verified ✓'}
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#15803d', margin: '0 0 24px 0', fontWeight: 700 }}>
          {isHindi ? 'आपका खाता सफलतापूर्वक सत्यापित कर दिया गया है।' : 'Your account has been successfully verified.'}
        </p>

        {/* Step Progress Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#065f46',
          }}
        >
          <ShieldCheck size={14} color="#059669" />
          <span>{isHindi ? 'पहचान प्रमाणित • आधार लिंक हो रहा है' : 'Identity Authenticated • Linking Aadhaar'}</span>
        </div>
      </div>
    </div>
  );
};
