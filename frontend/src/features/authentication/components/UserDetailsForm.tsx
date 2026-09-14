import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { INDIA_STATES_DATA } from '../../../data/indiaLocations';
import {
  Sprout,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  MapPin,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Home,
  CheckCircle2,
} from 'lucide-react';

export interface UserDetailsFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  aadhaarNumber: string;
  state: string;
  district: string;
  village?: string;
  block?: string;
}

interface UserDetailsFormProps {
  initialValues?: Partial<UserDetailsFormData>;
  onSubmit: (data: UserDetailsFormData) => Promise<void>;
  isLoading?: boolean;
  onBack?: () => void;
}

export const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
  onBack,
}) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const [name, setName] = useState(initialValues?.name || '');
  const [email, setEmail] = useState(initialValues?.email || '');
  const [password, setPassword] = useState(initialValues?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState(initialValues?.phone || '');
  const [aadhaarRaw, setAadhaarRaw] = useState(initialValues?.aadhaarNumber || '');
  const [state, setState] = useState(initialValues?.state || 'Rajasthan');
  const [district, setDistrict] = useState(initialValues?.district || 'Jaipur');
  const [village, setVillage] = useState(initialValues?.village || '');
  const [block, setBlock] = useState(initialValues?.block || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>('');

  // Available districts based on selected state
  const availableDistricts = useMemo(() => {
    const found = INDIA_STATES_DATA.find((s) => s.state.toLowerCase() === state.toLowerCase());
    return found ? found.districts.map((d) => d.name) : ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner'];
  }, [state]);

  // Format Aadhaar display as XXXX XXXX XXXX
  const formattedAadhaar = useMemo(() => {
    const digits = aadhaarRaw.replace(/\D/g, '').slice(0, 12);
    const parts: string[] = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.substring(i, i + 4));
    }
    return parts.join(' ');
  }, [aadhaarRaw]);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    setAadhaarRaw(raw);
    if (errors.aadhaar) {
      setErrors((prev) => ({ ...prev, aadhaar: '' }));
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setState(newState);
    const found = INDIA_STATES_DATA.find((s) => s.state.toLowerCase() === newState.toLowerCase());
    if (found && found.districts.length > 0) {
      setDistrict(found.districts[0].name);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = isHindi ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Full Name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = isHindi ? 'ईमेल पता आवश्यक है।' : 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = isHindi ? 'कृपया एक मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = isHindi ? 'पासवर्ड आवश्यक है।' : 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = isHindi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = isHindi ? 'मोबाइल नंबर आवश्यक है।' : 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = isHindi ? 'कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें।' : 'Enter a valid 10-digit Indian mobile number.';
    }

    const cleanAadhaar = aadhaarRaw.replace(/\D/g, '');
    if (!cleanAadhaar) {
      newErrors.aadhaar = isHindi ? 'आधार संख्या आवश्यक है।' : 'Aadhaar number is required.';
    } else if (cleanAadhaar.length !== 12) {
      newErrors.aadhaar = isHindi ? 'आधार संख्या 12 अंकों की होनी चाहिए।' : 'Aadhaar number must be exactly 12 digits.';
    }

    if (!state.trim()) {
      newErrors.state = isHindi ? 'राज्य चुनें।' : 'State is required.';
    }

    if (!district.trim()) {
      newErrors.district = isHindi ? 'जिला चुनें।' : 'District is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.replace(/\D/g, ''),
        aadhaarNumber: aadhaarRaw.replace(/\D/g, ''),
        state: state.trim(),
        district: district.trim(),
        village: village.trim() || undefined,
        block: block.trim() || undefined,
      });
    } catch (err: any) {
      setFormError(err.message || (isHindi ? 'पंजीकरण विफल हुआ। कृपया पुनः प्रयास करें।' : 'Registration failed. Please try again.'));
    }
  };

  // Quick Demo Auto-Fill helper
  const handleAutoFillDemo = () => {
    setName('Rajesh Kumar Patel');
    setEmail(`farmer_${Math.floor(1000 + Math.random() * 9000)}@agrinext.in`);
    setPassword('farmer123');
    setPhone('9876543210');
    setAadhaarRaw('543298761234');
    setState('Rajasthan');
    setDistrict('Jaipur');
    setVillage('Jagatpura (VGU)');
    setBlock('Sanganer');
    setErrors({});
    setFormError('');
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '560px',
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
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
                {isHindi ? 'किसान ऑनबोर्डिंग फॉर्म' : 'Farmer Registration'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleAutoFillDemo}
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                border: '1px solid #bae6fd',
                padding: '4px 10px',
                borderRadius: '999px',
                cursor: 'pointer',
              }}
              title="Auto-fill with sample farmer data"
            >
              ⚡ Demo Auto-Fill
            </button>
          </div>
        </div>

        {/* Headings */}
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            {isHindi ? 'किसान विवरण दर्ज करें' : 'Enter Farmer Details'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
            {isHindi ? 'अपने खाते को सुरक्षित रूप से सेट करने के लिए विवरण भरें' : 'Fill in your details to set up your AGRINEXT account'}
          </p>
        </div>

        {/* Form Error Banner */}
        {formError && (
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
            }}
            role="alert"
          >
            <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              {isHindi ? 'पूरा नाम *' : 'Full Name *'}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '14px' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                }}
                placeholder="e.g. Rajesh Kumar Patel"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 38px',
                  borderRadius: '10px',
                  border: errors.name ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>
            {errors.name && <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: '3px', display: 'block' }}>{errors.name}</span>}
          </div>

          {/* Email & Phone Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                {isHindi ? 'ईमेल पता *' : 'Email Address *'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                  }}
                  placeholder="rajesh@agrinext.in"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 38px',
                    borderRadius: '10px',
                    border: errors.email ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
              </div>
              {errors.email && <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: '3px', display: 'block' }}>{errors.email}</span>}
            </div>

            {/* Mobile Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                {isHindi ? 'मोबाइल नंबर *' : 'Mobile Number *'}
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((p) => ({ ...p, phone: '' }));
                  }}
                  placeholder="9876543210"
                  maxLength={10}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 38px',
                    borderRadius: '10px',
                    border: errors.phone ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
              </div>
              {errors.phone && <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: '3px', display: 'block' }}>{errors.phone}</span>}
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              {isHindi ? 'पासवर्ड *' : 'Password *'}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '14px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: '' }));
                }}
                placeholder="••••••••"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '11px 38px 11px 38px',
                  borderRadius: '10px',
                  border: errors.password ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: '3px', display: 'block' }}>{errors.password}</span>}
          </div>

          {/* Aadhaar Number Input */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                {isHindi ? 'आधार संख्या *' : 'Aadhaar Number *'}
              </label>
              <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                🔒 Demo Verification
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <CreditCard size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '14px' }} />
              <input
                type="text"
                value={formattedAadhaar}
                onChange={handleAadhaarChange}
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 38px',
                  borderRadius: '10px',
                  border: errors.aadhaar ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.95rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>
            {errors.aadhaar && <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: '3px', display: 'block' }}>{errors.aadhaar}</span>}
          </div>

          {/* State & District Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            {/* State */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                {isHindi ? 'राज्य *' : 'State *'}
              </label>
              <select
                value={state}
                onChange={handleStateChange}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '10px',
                  border: errors.state ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              >
                {INDIA_STATES_DATA.map((s) => (
                  <option key={s.state} value={s.state}>
                    {s.state}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                {isHindi ? 'जिला *' : 'District *'}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  borderRadius: '10px',
                  border: errors.district ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Village & Block (Optional) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '5px' }}>
                {isHindi ? 'गाँव (वैकल्पिक)' : 'Village (Optional)'}
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Jagatpura"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '5px' }}>
                {isHindi ? 'ब्लॉक / तहसील' : 'Block / Tehsil'}
              </label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                placeholder="e.g. Sanganer"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                style={{
                  padding: '13px 20px',
                  borderRadius: '12px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                {isHindi ? 'वापस' : 'Back'}
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#16A34A',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>{isHindi ? 'सहेजा जा रहा है...' : 'Saving Details...'}</span>
                </>
              ) : (
                <>
                  <span>{isHindi ? 'सत्यापन के लिए आगे बढ़ें' : 'Continue to Verification'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
