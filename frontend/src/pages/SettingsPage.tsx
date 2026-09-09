import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types';
import { Settings, Globe, Bell, Shield, Database, Save, Check, Sun, Moon, Sparkles, Laptop } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsWeatherAlerts, setSmsWeatherAlerts] = useState(true);
  const [pestThresholdNotification, setPestThresholdNotification] = useState(true);
  const [languageChoice, setLanguageChoice] = useState<Language>(language);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setLanguage(languageChoice);
    updateUserProfile({ language: languageChoice });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
          {t('settings.title', 'AGRINEXT System Settings')}
        </h1>
        <p style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
          {t('settings.subtitle', 'Configure language localization, dark/light appearance, real-time alert thresholds, and system preferences.')}
        </p>
      </div>

      {savedSuccess && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5',
            border: isDark ? '1px solid #059669' : '1px solid #a7f3d0',
            color: isDark ? '#34d399' : '#065f46',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          <Check size={18} /> Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Appearance & Dark Mode Settings Card */}
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: isDark ? '#172033' : '#ffffff',
            borderColor: isDark ? '#263449' : '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sun size={20} color="#eab308" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                Appearance & Theme Mode
              </h3>
            </div>
            <ThemeToggle size="md" showLabel={true} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div
              onClick={() => setTheme('light')}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                border: theme === 'light' ? '2px solid #10b981' : (isDark ? '1px solid #334155' : '1px solid #e2e8f0'),
                backgroundColor: theme === 'light' ? (isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4') : (isDark ? '#111827' : '#f8fafc'),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.15s ease',
              }}
            >
              <Sun size={18} color="#eab308" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isDark ? '#f8fafc' : '#0f172a' }}>Light Mode</div>
                <div style={{ fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#64748b' }}>Clean crisp daylight</div>
              </div>
            </div>

            <div
              onClick={() => setTheme('dark')}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                border: theme === 'dark' ? '2px solid #10b981' : (isDark ? '1px solid #334155' : '1px solid #e2e8f0'),
                backgroundColor: theme === 'dark' ? (isDark ? 'rgba(16,185,129,0.15)' : '#f0fdf4') : (isDark ? '#111827' : '#f8fafc'),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.15s ease',
              }}
            >
              <Moon size={18} color="#facc15" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isDark ? '#f8fafc' : '#0f172a' }}>Dark Mode</div>
                <div style={{ fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#64748b' }}>Night field mode</div>
              </div>
            </div>
          </div>
        </div>

        {/* Language & Regional Settings */}
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: isDark ? '#172033' : '#ffffff',
            borderColor: isDark ? '#263449' : '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Globe size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              Language & Regional Localization
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                Interface Language
              </label>
              <select
                value={languageChoice}
                onChange={(e) => setLanguageChoice(e.target.value as Language)}
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  backgroundColor: isDark ? '#111827' : '#fff',
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name}) {l.dir === 'rtl' ? '— [RTL]' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Early Warning & Alert Thresholds */}
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: isDark ? '#172033' : '#ffffff',
            borderColor: isDark ? '#263449' : '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Bell size={20} color="#d97706" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              Notification & Alert Thresholds
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#334155' }}>
              <input
                type="checkbox"
                checked={smsWeatherAlerts}
                onChange={(e) => setSmsWeatherAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
              />
              <span>High precipitation & heatwave advisory notifications</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#334155' }}>
              <input
                type="checkbox"
                checked={pestThresholdNotification}
                onChange={(e) => setPestThresholdNotification(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
              />
              <span>Regional disease spore and pest surge alerts</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#334155' }}>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
              />
              <span>Daily Mandi price updates & crop market intelligence</span>
            </label>
          </div>
        </div>

        {/* Backend Connectivity Status */}
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: isDark ? '#172033' : '#ffffff',
            borderColor: isDark ? '#263449' : '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Database size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              Backend REST API Configuration
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ padding: '10px 14px', backgroundColor: isDark ? '#111827' : '#f8fafc', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>API URL</div>
              <div style={{ fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', fontFamily: 'monospace', marginTop: '2px' }}>
                {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: isDark ? '#111827' : '#f8fafc', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>API Health Status</div>
              <div style={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                Operational / Healthy
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.95rem',
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Save size={18} />
          <span>Save Preferences</span>
        </button>
      </form>
    </div>
  );
};
