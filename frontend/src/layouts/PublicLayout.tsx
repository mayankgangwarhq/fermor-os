import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PublicHeader } from '../components/layout/PublicHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sprout, Sparkles, Mail, Phone, Heart } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const isLandingPage = location.pathname === '/';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: isDark ? '#0B1220' : '#F8FAF5', color: isDark ? '#F8FAFC' : '#17201A' }}>
      <PublicHeader />

      <main style={{
        flex: 1,
        padding: isLandingPage ? '0' : '28px 20px',
        maxWidth: isLandingPage ? '100%' : '1240px',
        margin: '0 auto',
        width: '100%',
        minWidth: 0
      }}>
        <Outlet />
      </main>

      {/* Dark Forest Green Public Website Footer */}
      <footer
        style={{
          backgroundColor: isDark ? '#06130d' : '#052E16',
          color: '#dcfce7',
          padding: '48px 24px 24px',
          borderTop: isDark ? '2px solid #0f381e' : '2px solid #14532D',
          marginTop: 'auto',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ maxWidth: '380px' }}>
              <div
                onClick={() => navigate('/')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '12px' }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <Sprout size={20} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  AGRI<span style={{ color: '#16A34A' }}>NEXT</span>
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#bbf7d0' }}>
                {t('footerMission', 'Next-Generation AI Agriculture Operating System for Indian Agriculture. Real-time crop pathology, weather radar, and direct mandi prices.')}
              </p>
            </div>

            {/* Links Columns */}
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EAB308', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                  {t('footerPlatform', 'Platform')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                  <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('navHome', 'Home')}</span>
                  <span onClick={() => navigate('/about')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('navAbout', 'About Us')}</span>
                  <span onClick={() => navigate('/how-it-works')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('navHowItWorks', 'How It Works')}</span>
                  <span onClick={() => navigate('/why-agrinext')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('navWhyAgrinext', 'Why AGRINEXT')}</span>
                  <span onClick={() => navigate('/mandi-rates')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('navMandi', 'Mandi Rates')}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EAB308', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                  Help & Support
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                  <span onClick={() => navigate('/contact')} style={{ cursor: 'pointer', color: '#ffffff' }}>Contact Desk</span>
                  <span onClick={() => navigate('/feedback')} style={{ cursor: 'pointer', color: '#ffffff' }}>Give Feedback</span>
                  <span onClick={() => navigate('/role-selection')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('signIn', 'Sign In')}</span>
                  <span onClick={() => navigate('/onboarding')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('getStarted', 'Get Started')}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: isDark ? '1px solid #0f381e' : '1px solid #14532D',
              paddingTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.82rem',
              color: '#86efac',
            }}
          >
            <span>© 2026 AGRINEXT Inc. Smart India Hackathon 2026 Flagship Edition.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EAB308', fontWeight: 800 }}>
              <Sparkles size={14} />
              <span>AI Agriculture Operating System</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
