import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { User, ShieldCheck, Globe, Sprout, Download, Trash2, LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const { language, setLanguage, t, currentMeta, supportedLanguages, openLanguageModal } = useLanguage();
  const { farms } = useData();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* User Header Profile */}
      <div className="card" style={{ padding: '28px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
            alt={currentUser.name}
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-600)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)', margin: 0 }}>{currentUser.name}</h1>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '2px 10px', borderRadius: '999px' }}>
                {currentUser.role.toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginTop: '4px', marginBottom: 0 }}>
              📍 {currentUser.village}, {currentUser.district}, {currentUser.state}
            </p>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '4px' }}>
              📞 {currentUser.phone} | ✉️ {currentUser.email}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/', { replace: true });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1.5px solid #fecaca',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.08)',
          }}
          title={t('logout', 'Sign Out')}
        >
          <LogOut size={16} />
          <span>{t('logout', 'Sign Out')}</span>
        </button>
      </div>

      {/* Language Preference Settings */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={20} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--slate-900)' }}>{t('nav.language', 'Platform Language Settings')}</h3>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#f0fdf4', color: '#15803d', padding: '3px 10px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
            {t('common.active', 'Active')}: {currentMeta.nativeName} ({currentMeta.name})
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={language}
            onChange={(e) => {
              const newLang = e.target.value as any;
              setLanguage(newLang);
              updateUserProfile({ language: newLang });
            }}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.9rem',
              fontWeight: 600,
              backgroundColor: '#fff',
              color: '#0f172a'
            }}
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.name}) {l.dir === 'rtl' ? '— [RTL]' : ''}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={openLanguageModal}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', whiteSpace: 'nowrap' }}
          >
            <Globe size={16} />
            <span>{t('languageModal.title', 'Change Language (17 Languages)')}</span>
          </button>
        </div>
      </div>

      {/* Farms Summary */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Sprout size={20} color="var(--primary-600)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--slate-900)' }}>Registered Farm Land Plots ({farms.length})</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {farms.map(f => (
            <div key={f.id} style={{ padding: '12px 16px', backgroundColor: 'var(--slate-50)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{f.name}</span>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{f.location} | Soil: {f.soilType}</div>
              </div>
              <span style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--primary-700)' }}>
                {f.area} {f.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Privacy & Account Tools */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <ShieldCheck size={20} color="var(--primary-600)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--slate-900)' }}>Data Governance & Privacy</h3>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => alert('Farmer profile data exported as JSON!')}>
            <Download size={16} />
            <span>Export My Data</span>
          </button>

          <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => alert('Account deletion request queued.')}>
            <Trash2 size={16} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

    </div>
  );
};
