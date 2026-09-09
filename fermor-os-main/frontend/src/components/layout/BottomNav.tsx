import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LayoutDashboard, Sprout, Scan, Sun, Bell } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { notifications } = useData();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const isScannerActive = activePage === 'disease' || activePage === 'disease-detection' || activePage === 'crop_intel';

  return (
    <nav
      className="mobile-only"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '68px',
        backgroundColor: isDark ? '#111827' : '#ffffff',
        borderTop: isDark ? '1px solid #263449' : '1px solid var(--slate-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        boxShadow: isDark ? '0 -4px 20px rgba(0, 0, 0, 0.5)' : '0 -4px 20px rgba(0, 0, 0, 0.06)',
        padding: '0 8px',
      }}
    >
      {/* 1. Dashboard */}
      <button
        onClick={() => onNavigate('dashboard')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'transparent',
          color: activePage === 'dashboard' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
          gap: '3px',
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        <LayoutDashboard size={20} color={activePage === 'dashboard' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')} />
        <span style={{ fontSize: '0.68rem', fontWeight: activePage === 'dashboard' ? 800 : 600 }}>
          {t('navDashboard', 'Dashboard')}
        </span>
      </button>

      {/* 2. My Farms */}
      <button
        onClick={() => onNavigate('farm')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'transparent',
          color: (activePage === 'farm' || activePage === 'farms') ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
          gap: '3px',
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        <Sprout size={20} color={(activePage === 'farm' || activePage === 'farms') ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')} />
        <span style={{ fontSize: '0.68rem', fontWeight: (activePage === 'farm' || activePage === 'farms') ? 800 : 600 }}>
          {t('navMyFarm', 'My Farms')}
        </span>
      </button>

      {/* 3. CENTER FLOATING AI SCAN BUTTON */}
      <div style={{ position: 'relative', top: '-14px' }}>
        <button
          onClick={() => onNavigate('disease')}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
            border: isDark ? '4px solid #111827' : '4px solid #ffffff',
            boxShadow: '0 8px 20px rgba(5, 150, 105, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
        >
          <Scan size={24} color="#ffffff" />
        </button>
        <div style={{ textAlign: 'center', marginTop: '2px' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: isScannerActive ? '#10b981' : (isDark ? '#f8fafc' : '#0f172a') }}>
            {t('scanCrop', 'Scan')}
          </span>
        </div>
      </div>

      {/* 4. Weather */}
      <button
        onClick={() => onNavigate('weather')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'transparent',
          color: activePage === 'weather' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
          gap: '3px',
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        <Sun size={20} color={activePage === 'weather' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')} />
        <span style={{ fontSize: '0.68rem', fontWeight: activePage === 'weather' ? 800 : 600 }}>
          {t('weather', 'Weather')}
        </span>
      </button>

      {/* 5. Alerts */}
      <button
        onClick={() => onNavigate('alerts')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'transparent',
          color: (activePage === 'alerts' || activePage === 'notifications') ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
          gap: '3px',
          padding: '6px 12px',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Bell size={20} color={(activePage === 'alerts' || activePage === 'notifications') ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                minWidth: '16px',
                height: '16px',
                borderRadius: '999px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: (activePage === 'alerts' || activePage === 'notifications') ? 800 : 600 }}>
          {t('navAlerts', 'Alerts')}
        </span>
      </button>
    </nav>
  );
};
