import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { AuthLayout } from '../../../layouts/AuthLayout';
import {
  LogIn,
  ArrowRight,
  ArrowLeft,
  Sprout,
  Award,
  ShoppingBag,
  ShieldCheck,
  Eye,
  EyeOff,
  Mail,
  Lock,
  RefreshCw,
  AlertCircle,
  CreditCard,
  KeyRound,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { role: urlRole } = useParams<{ role?: string }>();
  const { login, sendAadhaarOtp, loginWithAadhaarOtp, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const fromLocation = (location.state as any)?.from?.pathname || (location.state as any)?.from || (location.state as any)?.redirectTo;

  // Parse active role dynamically
  const activeRole: UserRole = (
    ['farmer', 'expert', 'buyer', 'equipment_owner', 'admin'].includes(urlRole || '')
      ? urlRole
      : 'farmer'
  ) as UserRole;

  // Auth Mode: 'email' or 'aadhaar'
  const [authMode, setAuthMode] = useState<'email' | 'aadhaar'>('email');

  // Email form state
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Aadhaar Demo state
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarStep, setAadhaarStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState('1234');
  const [aadhaarLast4, setAadhaarLast4] = useState('');

  // Status & Errors
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Default credentials for quick demo convenience
  useEffect(() => {
    if (activeRole === 'farmer') {
      setEmailOrPhone('farmer@agrinext.agri');
      setPassword('farmer123');
    } else if (activeRole === 'expert') {
      setEmailOrPhone('expert@agrinext.agri');
      setPassword('expert123');
    } else if (activeRole === 'buyer') {
      setEmailOrPhone('buyer@agrinext.agri');
      setPassword('buyer123');
    }
  }, [activeRole]);

  const getRoleDisplayName = () => {
    switch (activeRole) {
      case 'farmer':
        return t('roleFarmer', 'Farmer');
      case 'expert':
        return t('roleExpert', 'Agriculture Expert');
      case 'buyer':
        return t('roleBuyer', 'Market Buyer');
      case 'equipment_owner':
        return t('roleEquipmentOwner', 'Equipment Provider');
      default:
        return t('roleAdmin', 'Admin');
    }
  };

  const getRoleIcon = () => {
    switch (activeRole) {
      case 'farmer':
        return <Sprout size={18} color="#059669" />;
      case 'expert':
        return <Award size={18} color="#7c3aed" />;
      case 'buyer':
        return <ShoppingBag size={18} color="#d97706" />;
      default:
        return <ShieldCheck size={18} color="#059669" />;
    }
  };

  const redirectAfterLogin = () => {
    if (fromLocation && typeof fromLocation === 'string' && fromLocation.startsWith('/')) {
      navigate(fromLocation, { replace: true });
    } else {
      if (activeRole === 'expert') {
        navigate('/expert/dashboard', { replace: true });
      } else if (activeRole === 'buyer') {
        navigate('/buyer/dashboard', { replace: true });
      } else {
        navigate('/farmer/dashboard', { replace: true });
      }
    }
  };

  // 1. Handle Email / Password Login
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!emailOrPhone.trim()) {
      setErrorMsg(t('enterEmailOrPhone', 'Please enter your email or mobile number.'));
      return;
    }
    if (!password) {
      setErrorMsg(t('enterPassword', 'Please enter your password.'));
      return;
    }

    try {
      await login(emailOrPhone.trim(), password, activeRole);
      redirectAfterLogin();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
    }
  };

  // 2. Handle Aadhaar Step 1: Send OTP
  const handleSendAadhaarOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const clean = aadhaarNumber.replace(/\D/g, '');
    if (clean.length !== 12) {
      setErrorMsg('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    try {
      const res = await sendAadhaarOtp(clean);
      setDemoOtpHint(res.demoOtp || '1234');
      setAadhaarLast4(res.aadhaarLast4 || clean.slice(-4));
      setAadhaarStep('otp');
      setSuccessMsg('Demo OTP sent successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not verify Aadhaar number.');
    }
  };

  // 3. Handle Aadhaar Step 2: Verify OTP
  const handleVerifyAadhaarOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const clean = aadhaarNumber.replace(/\D/g, '');
    if (!otp.trim()) {
      setErrorMsg('Please enter the 4-digit OTP.');
      return;
    }

    try {
      await loginWithAadhaarOtp(clean, otp.trim());
      redirectAfterLogin();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid OTP');
    }
  };

  return (
    <AuthLayout>
      {/* 1. TOP BACK NAVIGATION */}
      <div style={{ marginBottom: '18px' }}>
        <button
          type="button"
          onClick={() => navigate('/role-selection', { state: location.state })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            fontSize: '0.78rem',
            fontWeight: '700',
            borderRadius: '8px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            color: '#475569',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <ArrowLeft size={14} />
          <span>{t('roleSelection', '← Back to roles')}</span>
        </button>
      </div>

      {/* 2. CARD HEADER: Welcome Back */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sprout size={18} />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            AGRI<span style={{ color: '#10b981' }}>NEXT</span>
          </span>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
          {t('welcomeBack', 'Welcome back')}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: '500' }}>
          {t('brandSubtext', 'Sign in to continue to your AGRINEXT workspace.')}
        </p>
      </div>

      {/* 3. DYNAMIC ROLE CONTEXT BOX */}
      <div
        style={{
          padding: '10px 14px',
          borderRadius: '12px',
          backgroundColor: activeRole === 'expert' ? '#f5f3ff' : activeRole === 'buyer' ? '#fffbeb' : '#ecfdf5',
          border: `1px solid ${activeRole === 'expert' ? '#ddd6fe' : activeRole === 'buyer' ? '#fde68a' : '#a7f3d0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
            }}
          >
            {getRoleIcon()}
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              {t('roleSelection', 'Role')}:
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
              {getRoleDisplayName()}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/role-selection', { state: location.state })}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#059669',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {t('changeLanguage', 'Change role')}
        </button>
      </div>

      {/* 4. AUTH METHOD TABS: EMAIL vs AADHAAR DEMO */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '20px',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setAuthMode('email');
            setErrorMsg('');
            setSuccessMsg('');
          }}
          style={{
            padding: '9px 12px',
            borderRadius: '9px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            backgroundColor: authMode === 'email' ? '#ffffff' : 'transparent',
            color: authMode === 'email' ? '#0f172a' : '#64748b',
            boxShadow: authMode === 'email' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <Mail size={15} color={authMode === 'email' ? '#059669' : '#64748b'} />
          <span>Email Login</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('aadhaar');
            setErrorMsg('');
            setSuccessMsg('');
          }}
          style={{
            padding: '9px 12px',
            borderRadius: '9px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            backgroundColor: authMode === 'aadhaar' ? '#ffffff' : 'transparent',
            color: authMode === 'aadhaar' ? '#0f172a' : '#64748b',
            boxShadow: authMode === 'aadhaar' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <CreditCard size={15} color={authMode === 'aadhaar' ? '#059669' : '#64748b'} />
          <span>Aadhaar Demo</span>
        </button>
      </div>

      {/* 5. INLINE ERROR & SUCCESS NOTIFICATIONS */}
      {errorMsg && (
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            color: '#dc2626',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            color: '#065f46',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 6. FORM OPTION A: EMAIL & PASSWORD LOGIN */}
      {authMode === 'email' && (
        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              {t('emailAddress', 'Email Address')} / {t('mobileNumber', 'Mobile Number')}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input-field"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder={activeRole === 'expert' ? 'expert@agrinext.agri' : activeRole === 'buyer' ? 'buyer@agrinext.agri' : 'farmer@agrinext.agri'}
                required
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              {t('password', 'Password')}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '10px 42px 10px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '6px',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
            }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="spin-icon" />
                <span>{t('signIn', 'Signing in...')}</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>{t('signIn', 'Sign In with Password')}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}

      {/* 7. FORM OPTION B: AADHAAR DEMO OTP LOGIN */}
      {authMode === 'aadhaar' && (
        <div>
          {aadhaarStep === 'input' ? (
            <form onSubmit={handleSendAadhaarOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Aadhaar Number (12-Digit)
                </label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="input-field"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="e.g. 5555 6666 7777"
                    maxLength={14}
                    required
                    style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '6px' }}>
                  🔒 Demo mode uses SHA-256 hashed identifiers. Full Aadhaar is never stored or logged.
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '4px',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    <span>Verifying Aadhaar...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={18} />
                    <span>Send Demo OTP</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAadhaarOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Development Mode OTP Banner */}
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px',
                  color: '#1e40af',
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
                  <Sparkles size={16} color="#2563eb" />
                  <span>Demo OTP: {demoOtpHint}</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#3b82f6' }}>
                  (This is a simulated hackathon/development authorization flow.)
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                    Enter 4-Digit OTP
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Aadhaar: •••• {aadhaarLast4}
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="input-field"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                    maxLength={6}
                    required
                    style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1.1rem', letterSpacing: '4px', fontWeight: 800, outline: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '4px',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Verify OTP & Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAadhaarStep('input');
                    setOtp('');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#059669',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  ← Change Aadhaar number
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 8. REGISTER FOOTER */}
      <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        {t('noAccount', "Don't have an account?")}{' '}
        <Link to={`/register/${activeRole}`} state={location.state} style={{ color: '#059669', fontWeight: 800, textDecoration: 'none' }}>
          {t('signup', 'Register as')} {getRoleDisplayName()}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

