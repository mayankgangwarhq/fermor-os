import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import type { UserRole } from '../../types';
import {
  Languages, Bell, User as UserIcon, Shield, Sparkles,
  ChevronDown, LogOut, Sprout, ShoppingBag, Award, Wrench,
  HelpCircle, MessageSquare, MapPin
} from 'lucide-react';
import { useFarmLocation } from '../../contexts/FarmLocationContext';
import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  onNavigate: (page: string) => void;
  activePage: string;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activePage, onReplayIntro }) => {
  const { currentUser, role, switchRole, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t, openLanguageModal, currentMeta } = useLanguage();
  const { isDark } = useTheme();
  const { notifications } = useData();
  const { location: farmLoc, openPicker } = useFarmLocation();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const rolesList: { id: UserRole; labelKey: string; icon: any }[] = [
    { id: 'farmer', labelKey: 'roleFarmer', icon: Sprout },
    { id: 'buyer', labelKey: 'roleBuyer', icon: ShoppingBag },
    { id: 'expert', labelKey: 'roleExpert', icon: Award },
    { id: 'equipment_owner', labelKey: 'roleEquipmentOwner', icon: Wrench },
    { id: 'admin', labelKey: 'roleAdmin', icon: Shield }
  ];

  const publicNavLinks = [
    { id: 'landing', labelKey: 'navHome', labelFallback: 'Home' },
    { id: 'about', labelKey: 'navAbout', labelFallback: 'About Us' },
    { id: 'how-it-works', labelKey: 'navHowItWorks', labelFallback: 'How It Works' },
    { id: 'why-agrinext', labelKey: 'navWhyAgrinext', labelFallback: 'Why AGRINEXT' },
    { id: 'mandi-rates', labelKey: 'navMandi', labelFallback: 'Mandi Rates' },
    { id: 'contact', labelKey: 'navContact', labelFallback: 'Contact Us' },
    { id: 'feedback', labelKey: 'navFeedback', labelFallback: 'Feedback' },
  ];

  const authNavLinks = [
    { id: 'dashboard', labelKey: 'navDashboard', labelFallback: 'Dashboard' },
    { id: 'farms', labelKey: 'navMyFarm', labelFallback: 'My Farms' },
    { id: 'crops', labelKey: 'navCrops', labelFallback: 'Crops' },
    { id: 'weather', labelKey: 'navWeather', labelFallback: 'Weather' },
    { id: 'mandi-rates', labelKey: 'navMandi', labelFallback: 'Mandi Rates' },
    { id: 'contact', labelKey: 'navContact', labelFallback: 'Help Desk' },
  ];

  const activeNavLinks = isAuthenticated ? authNavLinks : publicNavLinks;

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: isDark ? '#111827' : '#ffffff',
        borderBottom: isDark ? '1px solid #263449' : '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: isDark ? '0 2px 10px rgba(0, 0, 0, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.03)',
      }}
    >
      <style>{`
        .agrinext-header-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          cursor: pointer;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .agrinext-header-brand:hover .agrinext-logo-badge {
          transform: translateY(-1px) scale(1.04);
          box-shadow: 0 4px 14px rgba(16,185,129,0.35) !important;
        }
        .agrinext-header-brand:active {
          transform: scale(0.98);
        }
        .agrinext-nav-btn {
          white-space: nowrap;
          border-radius: 10px;
          padding: 6px 12px;
          font-size: 0.83rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
      `}</style>
      
      {/* Brand Logo & Tagline */}
      <div
        className="agrinext-header-brand"
        onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'landing')}
      >
        <div
          className="agrinext-logo-badge"
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
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
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
            <span className="eyebrow" style={{ whiteSpace: 'nowrap' }}>
              AI Operating System
            </span>
            <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, letterSpacing: '0.04em', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              For Modern Agriculture
            </span>
          </div>
        </div>
      </div>

      {/* Top Header Navigation Links (Public landing/marketing only, removed for auth to eliminate sidebar duplication) */}
      {!isAuthenticated && (
        <nav
          className="desktop-only"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: isDark ? '#1e293b' : '#f8fafc',
            padding: '3px 5px',
            borderRadius: '12px',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            margin: '0 12px',
            overflowX: 'auto',
            maxWidth: '520px',
          }}
        >
          {publicNavLinks.map((link) => {
            const isActive =
              activePage === link.id ||
              (link.id === 'landing' && activePage === '') ||
              (link.id === 'farms' && activePage === 'farm') ||
              (link.id === 'mandi-rates' && (activePage === 'mandi' || activePage === 'mandi-rates')) ||
              (link.id === 'contact' && (activePage === 'contact' || activePage === 'support'));
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="agrinext-nav-btn"
                style={{
                  border: isActive
                    ? (isDark ? '1px solid #059669' : '1px solid #cbd5e1')
                    : '1px solid transparent',
                  backgroundColor: isActive
                    ? (isDark ? '#064e3b' : '#ffffff')
                    : 'transparent',
                  color: isActive
                    ? (isDark ? '#34d399' : '#047857')
                    : (isDark ? '#cbd5e1' : '#475569'),
                  fontWeight: isActive ? 800 : 600,
                  boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = isDark ? '#334155' : 'rgba(255,255,255,0.8)';
                    e.currentTarget.style.color = isDark ? '#f8fafc' : '#0f172a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = isDark ? '#cbd5e1' : '#475569';
                  }
                }}
              >
                {t(link.labelKey, link.labelFallback)}
              </button>
            );
          })}
        </nav>
      )}

      {/* Right Header Action Items */}
      <div className="header-utilities">
        {/* Global Theme Toggle (Sun/Moon) */}
        <ThemeToggle size="md" />

        {isAuthenticated ? (
          <>
            {/* Farm Location Pill (Issue 5) */}
            <button
              className="location-label"
              onClick={openPicker}
              title={`${t('farmGps', 'Farm GPS')}: ${farmLoc.formattedAddress || `${farmLoc.village || farmLoc.city}, ${farmLoc.district}, ${farmLoc.state}`}`}
            >
              <MapPin size={15} color="#10b981" style={{ flexShrink: 0 }} />
              <span className="location-label-text">
                {farmLoc.formattedAddress || `${farmLoc.village || farmLoc.city || farmLoc.district}, ${farmLoc.state}`}
              </span>
            </button>

            {/* Language Selector */}
            <button
              className="utility-control"
              onClick={openLanguageModal}
              title={t('chooseLanguage', 'Choose Language')}
            >
              <Languages size={16} color="#10b981" />
              <span>{currentMeta.nativeName || 'Language'}</span>
            </button>

            {/* Role Switcher Menu */}
            <div style={{ position: 'relative' }}>
              <button
                className="utility-control"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                title={t('roleSelection', 'Select Role')}
              >
                <Sparkles size={15} color="#10b981" />
                <span>{t(rolesList.find(r => r.id === role)?.labelKey || 'roleFarmer')}</span>
                <ChevronDown size={14} />
              </button>

              {showRoleMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '210px',
                    backgroundColor: isDark ? '#172033' : '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.6)' : 'var(--shadow-xl)',
                    border: isDark ? '1px solid #263449' : '1px solid var(--border-color)',
                    padding: '6px 0',
                    zIndex: 50
                  }}
                >
                  <div style={{ padding: '6px 14px', fontSize: 'var(--fs-xs)', fontWeight: '800', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {t('roleSelection', 'Select Role')}
                  </div>
                  {rolesList.map(r => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => {
                          switchRole(r.id);
                          setShowRoleMenu(false);
                          if (r.id === 'admin') onNavigate('admin');
                          else if (r.id === 'buyer') onNavigate('buyer_dash');
                          else if (r.id === 'expert') onNavigate('expert_dash');
                          else if (r.id === 'equipment_owner') onNavigate('service_dash');
                          else onNavigate('dashboard');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '9px 14px',
                          cursor: 'pointer',
                          backgroundColor: isSelected
                            ? (isDark ? 'rgba(16, 185, 129, 0.2)' : 'var(--primary-50)')
                            : 'transparent',
                          color: isSelected
                            ? (isDark ? '#34d399' : 'var(--primary-800)')
                            : (isDark ? '#f8fafc' : 'var(--slate-700)'),
                          fontWeight: isSelected ? '800' : '600',
                          fontSize: 'var(--fs-sm)'
                        }}
                      >
                        <Icon size={16} color={isSelected ? '#10b981' : (isDark ? '#94a3b8' : 'var(--slate-500)')} />
                        <span>{t(r.labelKey)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => onNavigate('notifications')}
              title={t('alerts', 'Notifications')}
            >
              <div
                className="utility-control"
                style={{
                  width: '40px',
                  padding: 0,
                }}
              >
                <Bell size={18} />
              </div>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isDark ? '2px solid #111827' : '2px solid #ffffff'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>

            {/* User Profile Avatar Menu */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="utility-control"
                style={{
                  height: '40px',
                  padding: '0 8px',
                  gap: '8px',
                }}
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser.name}
                  style={{ width: '28px', height: '28px', borderRadius: '8px', objectFit: 'cover', border: '1.5px solid #10b981' }}
                />
                <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', fontWeight: '800', color: isDark ? '#f8fafc' : 'var(--slate-800)', lineHeight: 1.2 }}>
                    {currentUser.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: isDark ? '#94a3b8' : 'var(--slate-500)', fontWeight: '600', lineHeight: 1.1 }}>
                    {farmLoc.district || currentUser.district || 'Jaipur'}
                  </span>
                </div>
                <ChevronDown size={13} color={isDark ? '#94a3b8' : '#64748b'} />
              </div>

              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '210px',
                    backgroundColor: isDark ? '#172033' : '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.6)' : 'var(--shadow-xl)',
                    border: isDark ? '1px solid #263449' : '1px solid var(--slate-200)',
                    padding: '8px 0',
                    zIndex: 50
                  }}
                >
                  <div
                    onClick={() => { onNavigate('profile'); setShowUserMenu(false); }}
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: 'var(--fs-sm)', fontWeight: '600', color: isDark ? '#f8fafc' : '#0f172a' }}
                  >
                    <UserIcon size={16} />
                    <span>{t('navProfile', 'Profile')}</span>
                  </div>
                  <div
                    onClick={() => { onNavigate('contact'); setShowUserMenu(false); }}
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: 'var(--fs-sm)', fontWeight: '600', color: isDark ? '#f8fafc' : '#0f172a' }}
                  >
                    <HelpCircle size={16} />
                    <span>{t('navContact', 'Support Desk')}</span>
                  </div>
                  <div
                    onClick={() => { onNavigate('feedback'); setShowUserMenu(false); }}
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: 'var(--fs-sm)', fontWeight: '600', color: isDark ? '#f8fafc' : '#0f172a' }}
                  >
                    <MessageSquare size={16} />
                    <span>{t('navFeedback', 'Give Feedback')}</span>
                  </div>
                  <div
                    onClick={() => { logout(); onNavigate('landing'); setShowUserMenu(false); }}
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: 'var(--fs-sm)', fontWeight: '700', color: '#ef4444', borderTop: isDark ? '1px solid #263449' : '1px solid #f1f5f9', marginTop: '4px' }}
                  >
                    <LogOut size={16} />
                    <span>{t('logout', 'Sign Out')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Sign Out Button */}
            <button
              onClick={() => {
                logout();
                onNavigate('landing');
              }}
              className="utility-control"
              style={{
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca',
                color: '#ef4444',
                fontWeight: 700,
              }}
              title={t('logout', 'Sign Out')}
            >
              <LogOut size={15} />
              <span className="desktop-only">{t('logout', 'Sign Out')}</span>
            </button>
          </>
        ) : (
          <>
            <button
              className="utility-control"
              onClick={openLanguageModal}
              title={t('chooseLanguage', 'Choose Language')}
            >
              <Languages size={16} color="#10b981" />
              <span>{currentMeta.nativeName || 'Language'}</span>
            </button>

            <button
              className="btn btn-outline"
              onClick={() => onNavigate('role-selection')}
              style={{ minHeight: '40px', padding: '6px 14px' }}
            >
              {t('signIn', 'Sign In')}
            </button>

            <button
              className="btn btn-primary"
              onClick={() => onNavigate('role-selection')}
              style={{ minHeight: '40px', padding: '6px 16px' }}
            >
              {t('getStarted', 'Get Started')}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
