import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Sprout, Sparkles, Languages, LogIn, ArrowRight, LayoutDashboard, LogOut, ChevronDown, TrendingUp, Phone, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, openLanguageModal, currentMeta } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const { isDark } = useTheme();

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation links visible directly on desktop (Issue 14)
  const primaryNavLinks = [
    { path: '/', labelKey: 'navHome', labelDefault: 'Home' },
    { path: '/about', labelKey: 'navAbout', labelDefault: 'About Us' },
    { path: '/how-it-works', labelKey: 'navHowItWorks', labelDefault: 'How It Works' },
    { path: '/why-agrinext', labelKey: 'navWhyAgrinext', labelDefault: 'Why AGRINEXT' },
  ];

  // Secondary navigation links grouped cleanly inside "More" dropdown
  const secondaryNavLinks = [
    { path: '/mandi-rates', labelKey: 'navMandi', labelDefault: 'Mandi Rates', icon: TrendingUp },
    { path: '/contact', labelKey: 'navContact', labelDefault: 'Contact Us', icon: Phone },
    { path: '/feedback', labelKey: 'navFeedback', labelDefault: 'Feedback', icon: MessageSquare },
  ];

  const isMoreActive = secondaryNavLinks.some((l) => location.pathname === l.path);

  return (
    <header
      className="glass-nav-sticky"
      style={{
        height: '70px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.92)' : 'rgba(248, 250, 245, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isDark ? '1px solid #263449' : '1px solid #dcfce7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(20,83,45,0.05)',
      }}
    >
      {/* Brand Logo & Subtitle (Issues 5 & 6) */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '11px',
          cursor: 'pointer',
          flexShrink: 0,
          minWidth: 0,
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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <div style={{ fontSize: '1.22rem', fontWeight: '900', color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            AGRI<span style={{ color: '#10b981' }}>NEXT</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '2px' }}>
            {/* Issue 5: Minimum 12px / 0.75rem readable text */}
            <span className="eyebrow" style={{ whiteSpace: 'nowrap' }}>
              AI Operating System
            </span>
            {/* Issue 6: Mixed Case rather than all-caps */}
            <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, letterSpacing: '0.04em', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              For Modern Agriculture
            </span>
          </div>
        </div>
      </div>

      {/* Decluttered Desktop Navigation with Primary Links & "More" Dropdown (Issue 14) */}
      <nav
        className="desktop-only"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
          padding: '4px 6px',
          borderRadius: 'var(--radius-md)',
          border: isDark ? '1px solid #334155' : '1px solid #dcfce7',
          margin: '0 12px',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.02)',
          minWidth: 0,
        }}
      >
        {primaryNavLinks.map((link) => {
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
                fontSize: 'var(--fs-sm)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
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

        {/* Accessible "More" Menu Dropdown for Secondary Navigation Items */}
        <div style={{ position: 'relative' }} ref={moreMenuRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            aria-expanded={showMoreMenu}
            aria-haspopup="true"
            aria-label="More navigation links"
            style={{
              border: 'none',
              backgroundColor: isMoreActive ? '#16A34A' : (showMoreMenu ? (isDark ? '#334155' : '#f1f5f9') : 'transparent'),
              color: isMoreActive ? '#FFFFFF' : (isDark ? '#cbd5e1' : '#17201A'),
              fontWeight: isMoreActive ? 800 : 600,
              fontSize: 'var(--fs-sm)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span>More</span>
            <ChevronDown size={14} style={{ transform: showMoreMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>

          {showMoreMenu && (
            <div
              className="dropdown-menu"
              role="menu"
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '180px',
                backgroundColor: isDark ? '#172033' : '#ffffff',
                borderRadius: 'var(--radius-md)',
                boxShadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.6)' : 'var(--shadow-xl)',
                border: isDark ? '1px solid #263449' : '1px solid #e2e8f0',
                padding: '6px 0',
                zIndex: 60,
              }}
            >
              {secondaryNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <button
                    key={link.path}
                    role="menuitem"
                    onClick={() => {
                      navigate(link.path);
                      setShowMoreMenu(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      border: 'none',
                      backgroundColor: isActive ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5') : 'transparent',
                      color: isActive ? (isDark ? '#34d399' : '#047857') : (isDark ? '#f8fafc' : '#334155'),
                      fontWeight: isActive ? 800 : 600,
                      fontSize: 'var(--fs-sm)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon size={16} color={isActive ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')} />
                    <span>{t(link.labelKey, link.labelDefault)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Right Controls: Theme Toggle, Language Switcher, Sign In & Get Started / Dashboard (Issues 10, 15, 16) */}
      <div className="header-actions">
        {/* Global Light/Dark Switcher */}
        <ThemeToggle size="md" />

        {/* Language Selector */}
        <button
          className="btn-ghost"
          onClick={openLanguageModal}
          style={{
            minHeight: '40px',
            padding: '7px 12px',
            fontSize: 'var(--fs-sm)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
            color: isDark ? '#f8fafc' : '#14532D',
            border: isDark ? '1px solid #334155' : '1px solid #dcfce7',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Switch Language (17 Languages Supported)"
        >
          <Languages size={16} color="#16A34A" />
          <span>{currentMeta.nativeName || 'Language'}</span>
        </button>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* My Dashboard button (Issues 15 & 16: Vertical alignment & shape consistency) */}
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary dashboard-btn"
              style={{
                minHeight: '40px',
                padding: '8px 16px',
                fontSize: 'var(--fs-sm)',
                fontWeight: 800,
                borderRadius: 'var(--radius-md)',
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
                minHeight: '40px',
                padding: '8px 12px',
                fontSize: 'var(--fs-sm)',
                fontWeight: 800,
                borderRadius: 'var(--radius-md)',
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
              className="btn btn-outline"
              style={{
                minHeight: '40px',
                padding: '8px 14px',
                fontSize: 'var(--fs-sm)',
                fontWeight: 800,
                borderRadius: 'var(--radius-md)',
                color: isDark ? '#f8fafc' : '#14532D',
                backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
                borderColor: isDark ? '#334155' : '#16A34A',
              }}
            >
              <LogIn size={15} color="#16A34A" />
              <span>{t('signIn', 'Sign In')}</span>
            </button>

            {/* Get Started button */}
            <button
              onClick={() => navigate('/onboarding')}
              className="btn btn-primary"
              style={{
                minHeight: '40px',
                padding: '8px 16px',
                fontSize: 'var(--fs-sm)',
                fontWeight: 800,
                borderRadius: 'var(--radius-md)',
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
