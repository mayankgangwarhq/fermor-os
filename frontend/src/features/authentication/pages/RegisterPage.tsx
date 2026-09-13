import React, { useState } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { UserPlus, ArrowRight, ArrowLeft, Sprout, Award, ShoppingBag, ShieldCheck } from 'lucide-react';
import type { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const { role: urlRole } = useParams<{ role?: string }>();
  const { register, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const fromLocation = (location.state as any)?.from?.pathname || (location.state as any)?.from || (location.state as any)?.redirectTo;

  const activeRole: UserRole = (
    ['farmer', 'expert', 'buyer', 'equipment_owner', 'admin'].includes(urlRole || '')
      ? urlRole
      : 'farmer'
  ) as UserRole;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [stateName, setStateName] = useState('Madhya Pradesh');
  const [district, setDistrict] = useState('Indore');
  const [village, setVillage] = useState('Sanwer');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
        return <Sprout size={20} color="#059669" />;
      case 'expert':
        return <Award size={20} color="#7c3aed" />;
      case 'buyer':
        return <ShoppingBag size={20} color="#d97706" />;
      default:
        return <ShieldCheck size={20} color="#059669" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (aadhaarNumber.trim()) {
      const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');
      if (cleanAadhaar.length !== 12) {
        setErrorMsg('Aadhaar number must be exactly 12 digits');
        return;
      }
    }

    try {
      await register({
        name,
        email,
        password,
        role: activeRole,
        phone,
        aadhaarNumber: aadhaarNumber.replace(/\D/g, '') || undefined,
        state: stateName,
        district,
        village,
      });

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
      setErrorMsg(err.message || 'Registration failed. Please verify details.');
    }
  };

  return (
    <AuthLayout>
      {/* Back to Role Selection */}
      <div style={{ marginBottom: '16px' }}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/role-selection', { state: location.state })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            borderRadius: '8px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
          }}
        >
          <ArrowLeft size={14} />
          <span>{t('roleSelection', '← Back to roles')}</span>
        </button>
      </div>

      {/* Role Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            {t('signup', 'Create Account')} — {getRoleDisplayName()}
          </h2>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              backgroundColor: activeRole === 'expert' ? '#f5f3ff' : activeRole === 'buyer' ? '#fffbeb' : '#ecfdf5',
              border: `1px solid ${activeRole === 'expert' ? '#ddd6fe' : activeRole === 'buyer' ? '#fde68a' : '#a7f3d0'}`,
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            {getRoleIcon()}
            <span>{getRoleDisplayName()}</span>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
          {t('brandSubtext', 'Join AGRINEXT precision agriculture platform.')}
        </p>
      </div>

      {errorMsg && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '0.85rem',
            marginBottom: '16px',
            fontWeight: 600,
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            {t('fullName', 'Full Name')} *
          </label>
          <input
            type="text"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={activeRole === 'expert' ? 'Dr. Ramesh Sharma' : activeRole === 'buyer' ? 'Anil Gupta' : 'Rajesh Kumar Patel'}
            required
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            {t('emailAddress', 'Email Address')} *
          </label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`${activeRole}@agrinext.agri`}
            required
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              {t('mobileNumber', 'Mobile Number')} *
            </label>
            <input
              type="tel"
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Aadhaar Number (12-digit)
            </label>
            <input
              type="text"
              className="input-field"
              value={aadhaarNumber}
              maxLength={14}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              placeholder="XXXX XXXX 1234"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              State
            </label>
            <input
              type="text"
              className="input-field"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              placeholder="State"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              District
            </label>
            <input
              type="text"
              className="input-field"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            {t('password', 'Password')} *
          </label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            required
            minLength={6}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
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
            marginTop: '10px',
          }}
        >
          <UserPlus size={18} />
          <span>{isLoading ? 'Creating account...' : `${t('signup', 'Complete Registration')}`}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        {t('alreadyAccount', 'Already have an account?')}{' '}
        <Link to={`/login/${activeRole}`} state={location.state} style={{ color: '#059669', fontWeight: 800, textDecoration: 'none' }}>
          {t('signIn', 'Sign In')}
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;

