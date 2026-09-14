import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Sprout, ShieldCheck, ArrowRight, AlertCircle, RefreshCw, Smartphone, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

interface OtpVerificationProps {
  mobileNumber?: string;
  onVerify: (otp: string) => Promise<boolean>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({
  mobileNumber = '9876543210',
  onVerify,
  onCancel,
  isLoading = false,
}) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [resendCountdown, setResendCountdown] = useState<number>(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleChange = (index: number, value: string) => {
    setErrorMsg('');
    const numeric = value.replace(/\D/g, '');
    if (!numeric) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    const lastChar = numeric[numeric.length - 1];
    const newDigits = [...otpDigits];
    newDigits[index] = lastChar;
    setOtpDigits(newDigits);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorMsg('');
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleFillDemoOtp = () => {
    setErrorMsg('');
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    inputRefs.current[5]?.focus();
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    setResendCountdown(30);
    setErrorMsg('');
    setOtpDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setErrorMsg(isHindi ? 'कृपया 6 अंकों का पूरा OTP दर्ज करें।' : 'Please enter the complete 6-digit OTP.');
      return;
    }

    try {
      const success = await onVerify(fullOtp);
      if (!success) {
        setErrorMsg(isHindi ? 'अमान्य OTP। कृपया 123456 या कोई 6 अंक दर्ज करें।' : 'Invalid OTP. Enter 123456 or any 6-digit code for demo.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || (isHindi ? 'सत्यापन विफल हुआ।' : 'Verification failed.'));
    }
  };

  const isComplete = otpDigits.every((d) => d.length === 1);

  // Masked mobile format: +91 98*** **210
  const maskedPhone = useMemo(() => {
    const clean = mobileNumber.replace(/\D/g, '');
    if (clean.length >= 10) {
      return `+91 ${clean.slice(0, 2)}*** ***${clean.slice(-2)}`;
    }
    return mobileNumber;
  }, [mobileNumber]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
        animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12), 0 8px 16px -4px rgba(15, 23, 42, 0.04)',
          padding: '36px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Decorative Header Accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #14532D, #16A34A, #4ade80)',
          }}
        />

        {/* Brand Icon & Demo Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #14532D 0%, #16A34A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
              }}
            >
              <Sprout size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                AGRI<span style={{ color: '#16A34A' }}>NEXT</span>
              </span>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                {isHindi ? 'खाता सत्यापन' : 'Account Verification'}
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              backgroundColor: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fde68a',
              padding: '4px 10px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={11} color="#d97706" />
            Demo Verification
          </span>
        </div>

        {/* Main Headings */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {isHindi ? 'अपना खाता सत्यापित करें' : 'Verify Your Account'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, fontWeight: 500, lineHeight: 1.45 }}>
            {isHindi
              ? 'हमने आपके पंजीकृत संपर्क पर एक सत्यापन OTP भेजा है।'
              : "We've sent a verification OTP to your registered contact."}
          </p>

          {/* Mobile Display Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '10px',
              padding: '4px 12px',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              fontSize: '0.82rem',
              color: '#334155',
              fontWeight: 700,
            }}
          >
            <Smartphone size={13} color="#64748b" />
            <span>{maskedPhone}</span>
          </div>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit}>
          {/* 6 OTP Input Boxes */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
              marginBottom: '20px',
            }}
            role="group"
            aria-label="6-digit OTP input"
          >
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                aria-label={`Digit ${idx + 1} of 6`}
                disabled={isLoading}
                style={{
                  width: '48px',
                  height: '56px',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  borderRadius: '12px',
                  border: digit ? '2px solid #16A34A' : errorMsg ? '2px solid #ef4444' : '2px solid #cbd5e1',
                  backgroundColor: digit ? '#f0fdf4' : '#ffffff',
                  color: '#0f172a',
                  outline: 'none',
                  boxShadow: digit ? '0 2px 8px rgba(22, 163, 74, 0.15)' : 'none',
                  transition: 'all 0.18s ease',
                  fontFamily: 'monospace',
                }}
              />
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#dc2626',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '18px',
                animation: 'shake 0.3s ease',
              }}
              role="alert"
            >
              <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Helper Chip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px dashed #cbd5e1',
              marginBottom: '22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
              <KeyRound size={14} color="#059669" />
              <span>{isHindi ? 'डेमो OTP: 123456' : 'Demo OTP: 123456'}</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemoOtp}
              style={{
                border: 'none',
                background: '#e0f2fe',
                color: '#0284c7',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {isHindi ? 'ऑटो-भरें' : 'Auto-Fill'}
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="submit"
              disabled={isLoading || !isComplete}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                backgroundColor: isComplete ? '#16A34A' : '#94a3b8',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isComplete && !isLoading ? 'pointer' : 'not-allowed',
                boxShadow: isComplete ? '0 8px 20px rgba(22, 163, 74, 0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>{isHindi ? 'सत्यापित किया जा रहा है...' : 'Verifying OTP...'}</span>
                </>
              ) : (
                <>
                  <span>{isHindi ? 'OTP सत्यापित करें' : 'Verify OTP'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Resend OTP Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {isHindi ? '← विवरण बदलें' : '← Edit Details'}
                </button>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {isHindi ? 'OTP नहीं मिला?' : "Didn't receive code?"}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCountdown > 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendCountdown > 0 ? '#94a3b8' : '#16A34A',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: resendCountdown > 0 ? 'default' : 'pointer',
                    padding: '2px 6px',
                  }}
                >
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
