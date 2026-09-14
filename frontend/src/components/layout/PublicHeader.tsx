import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Sprout, Sparkles, Languages, LogIn, ArrowRight, LayoutDashboard, LogOut, Phone, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, openLanguageModal, currentMeta } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const { isDark } = useTheme();

  const navLinks = [
    { path: '/', labelKey: 'navHome', labelDefault: 'Home' },
    { path: '/about', labelKey: 'navAbout', labelDefault: 'About Us' },
    { path: '/how-it-works', labelKey: 'navHowItWorks', labelDefault: 'How It Works' },
    { path: '/why-agrinext', labelKey: 'navWhyAgrinext', labelDefault: 'Why AGRINEXT' },
    { path: '/mandi-rates', labelKey: 'navMandi', labelDefault: 'Mandi Rates' },
    { path: '/contact', labelKey: 'navContact', labelDefault: 'Contact Us' },
    { path: '/feedback', labelKey: 'navFeedback', labelDefault: 'Feedback' },
  ];

  return (
    <header
      className="glass-nav-sticky"
      style={{
        height: '70px',
        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.92)' : 'rgba(248, 250, 245, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isDark ? '1px solid #263449' : '1px solid #dcfce7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(20,83,45,0.05)',
      }}
    >
      {/* Brand Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '11px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
            position: 'relative',
            flexShrink: 0,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <Sprout size={20} style={{ position: 'absolute', transform: 'translate(-2px, -1px)' }} />
          <Sparkles size={13} style={{ position: 'absolute', transform: 'translate(5px, 4px)', color: '#fef08a' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.22rem', fontWeight: '900', color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            AGRI<span style={{ color: '#10b981' }}>NEXT</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '2px' }}>
            <span style={{ fontSize: '0.53rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: isDark ? '#34d399' : '#047857', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              THE AI OPERATING SYSTEM
            </span>
            <span style={{ fontSize: '0.50rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              FOR MODERN AGRICULTURE
            </span>
          </div>
        </div>
      </div>

      {/* Public Top Navbar Navigation Links */}
      <nav
        className="desktop-only"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
          padding: '4px 6px',
          borderRadius: '14px',
          border: isDark ? '1px solid #334155' : '1px solid #dcfce7',
          margin: '0 12px',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.02)',
        }}
      >
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                border: 'none',
                backgroundColor: isActive ? '#16A34A' : 'transparent',
                color: isActive ? '#FFFFFF' : (isDark ? '#cbd5e1' : '#17201A'),
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.84rem',
                padding: '6px 12px',
                borderRadius: '9px',
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 8px rgba(22,163,74,0.3)' : 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {t(link.labelKey, link.labelDefault)}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Theme Toggle, Language Switcher, Sign In & Get Started */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Global Light/Dark Switcher */}
        <ThemeToggle size="md" />

        <button
          onClick={openLanguageModal}
          style={{
            padding: '7px 12px',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '10px',
            backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
            color: isDark ? '#f8fafc' : '#14532D',
            border: isDark ? '1px solid #334155' : '1px solid #dcfce7',
            cursor: 'pointer',
          }}
          title="Switch Language (17 Languages Supported)"
        >
          <Languages size={16} color="#16A34A" />
          <span>{currentMeta.nativeName || 'Language'}</span>
        </button>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* My Dashboard button */}
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '8px 16px',
                fontSize: '0.88rem',
                fontWeight: 800,
                borderRadius: '10px',
                backgroundColor: '#14532D',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(20, 83, 45, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <LayoutDashboard size={16} />
              <span>{t('myDashboard', 'My Dashboard')}</span>
              <ArrowRight size={15} />
            </button>

            {/* Sign Out button */}
            <button
              onClick={() => {
                logout();
                navigate('/', { replace: true });
              }}
              style={{
                padding: '8px 12px',
                fontSize: '0.85rem',
                fontWeight: 800,
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                color: '#ef4444',
                border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1.5px solid #fecaca',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
              title={t('logout', 'Sign Out')}
            >
              <LogOut size={15} />
              <span>{t('logout', 'Sign Out')}</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Sign In button */}
            <button
              onClick={() => navigate('/role-selection', { state: { from: { pathname: '/dashboard' } } })}
              style={{
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: '800',
                borderRadius: '10px',
                color: isDark ? '#f8fafc' : '#14532D',
                backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
                border: isDark ? '1.5px solid #334155' : '1.5px solid #16A34A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <LogIn size={15} color="#16A34A" />
              <span>{t('signIn', 'Sign In')}</span>
            </button>

            {/* Get Started button */}
            <button
              onClick={() => navigate('/onboarding')}
              style={{
                padding: '8px 16px',
                fontSize: '0.88rem',
                fontWeight: 800,
                borderRadius: '10px',
                backgroundColor: '#14532D',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(20, 83, 45, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{t('getStarted', 'Get Started')}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
