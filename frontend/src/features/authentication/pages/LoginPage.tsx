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
  KeyRound,
  Eye,
  EyeOff,
  Mail,
  Lock,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import type { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { role: urlRole } = useParams<{ role?: string }>();
  const { login, isLoading } = useAuth();
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

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Default credentials for quick test/demo
  useEffect(() => {
    if (activeRole === 'farmer') {
      setEmailOrPhone('farmer@farmer-os.agri');
      setPassword('farmer123');
    } else if (activeRole === 'expert') {
      setEmailOrPhone('expert@farmer-os.agri');
      setPassword('expert123');
    } else if (activeRole === 'buyer') {
      setEmailOrPhone('buyer@farmer-os.agri');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrPhone.trim()) {
      setErrorMsg(t('enterEmailOrPhone', 'Please enter your email or mobile number.'));
      return;
    }
    if (!password) {
      setErrorMsg(t('enterPassword', 'Please enter your password.'));
      return;
    }

    try {
      await login(emailOrPhone, password, activeRole);
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
    } catch (err: any) {
      setErrorMsg(err.message || t('invalidCredentials', 'Invalid email or password.'));
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotInput('');
    }, 2500);
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
          marginBottom: '20px',
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

      {/* 4. ELEGANT INLINE ERROR STATE */}
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

      {/* 5. LOGIN INPUT FORM */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Field 1: Email / Mobile */}
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

        {/* Field 2: Password with Show/Hide Toggle */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
              {t('password', 'Password')}
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              style={{ border: 'none', background: 'transparent', fontSize: '0.78rem', color: '#059669', fontWeight: 700, cursor: 'pointer' }}
            >
              {t('forgotPassword', 'Forgot password?')}
            </button>
          </div>

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

        {/* Primary CTA Button */}
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
              <span>{t('signIn', 'Sign In')}</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* 6. DYNAMIC REGISTER SECTION */}
      <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        {t('noAccount', "Don't have an account?")}{' '}
        <Link to={`/register/${activeRole}`} state={location.state} style={{ color: '#059669', fontWeight: 800, textDecoration: 'none' }}>
          {t('signup', 'Register as')} {getRoleDisplayName()}
        </Link>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KeyRound size={20} color="#059669" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {t('forgotPassword', 'Reset Password')}
              </h3>
            </div>

            {forgotSuccess ? (
              <div style={{ padding: '12px', backgroundColor: '#ecfdf5', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', fontWeight: 700 }}>
                ✓ {t('resetSent', 'Password reset link sent to your registered address!')}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                  {t('enterEmailOrPhone', 'Enter your registered email or mobile number:')}
                </p>
                <input
                  type="text"
                  required
                  placeholder="name@domain.com or mobile"
                  value={forgotInput}
                  onChange={(e) => setForgotInput(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForgotModal(false)} style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                    {t('cancel', 'Cancel')}
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                    {t('submit', 'Send Reset Link')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default LoginPage;
