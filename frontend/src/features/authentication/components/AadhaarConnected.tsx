import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CreditCard, Sparkles, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';

interface AadhaarConnectedProps {
  maskedAadhaar?: string;
  onAnimationEnd?: () => void;
}

export const AadhaarConnected: React.FC<AadhaarConnectedProps> = ({
  maskedAadhaar = '•••• •••• 1234',
}) => {
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
          boxShadow: '0 24px 50px -10px rgba(22, 163, 74, 0.22), 0 0 35px rgba(22, 163, 74, 0.12)',
          padding: '40px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Demo Banner */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              backgroundColor: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fde68a',
              padding: '4px 12px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={11} color="#d97706" />
            Aadhaar Linked — Demo Verification
          </span>
        </div>

        {/* Identity / Smart Card Icon with Pulse */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #14532D 0%, #16A34A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            position: 'relative',
            boxShadow: '0 10px 28px rgba(20, 83, 45, 0.35)',
          }}
        >
          <CreditCard size={44} color="#ffffff" strokeWidth={1.8} />

          {/* Secure Checkmark Badge on Corner */}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              right: '-6px',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <CheckCircle2 size={24} color="#16A34A" />
          </div>
        </div>

        {/* Main Text */}
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#14532D', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          {isHindi ? 'आधार लिंक हो गया' : 'Aadhaar Linked'}
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0 0 18px 0', fontWeight: 600, lineHeight: 1.45 }}>
          {isHindi
            ? 'आपकी पहचान AGRINEXT के साथ सुरक्षित रूप से लिंक हो गई है।'
            : 'Your identity is securely linked with AGRINEXT.'}
        </p>

        {/* Masked Aadhaar Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: '#334155',
            fontWeight: 800,
            marginBottom: '20px',
          }}
        >
          <ShieldCheck size={14} color="#16A34A" />
          <span>{maskedAadhaar}</span>
        </div>

        {/* Animated Connection Pulse Bar */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '14px',
            backgroundColor: '#f0fdf4',
            border: '1.5px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                boxShadow: '0 0 8px #16A34A',
                animation: 'pulse 1s infinite',
              }}
            />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#14532D' }}>
              {isHindi ? 'सुरक्षित चैनल लिंक हुआ' : 'Secure Channel Linked'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>
            <Lock size={12} />
            <span>256-bit SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
