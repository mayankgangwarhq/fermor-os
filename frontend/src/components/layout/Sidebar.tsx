import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import {
  LayoutDashboard,
  Sprout,
  Wheat,
  ShieldAlert,
  Bug,
  Sun,
  Bell,
  User,
  Settings,
  Bot,
  TrendingUp,
  ShoppingBag,
  Landmark,
  Wrench,
  DollarSign,
  Shield,
  Scan,
  Sparkles,
  ChevronRight,
  Info,
  HelpCircle,
  Award,
  MapPin,
  Activity,
  ShieldCheck,
  LogOut,
  MessageSquare,
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

interface NavItem {
  id: string;
  labelKey: string;
  labelFallback: string;
  icon: any;
  badge?: string;
  count?: number;
  isScanner?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { t, language } = useLanguage();
  const { role, currentUser, logout } = useAuth();
  const { isDark } = useTheme();
  const { notifications } = useData();
  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  const isScannerActive = activePage === 'disease' || activePage === 'disease-detection' || activePage === 'crop_intel';

  let coreNavItems: NavItem[] = [];
  let intelNavItems: NavItem[] = [];
  let ecosystemNavItems: NavItem[] = [];
  let supportNavItems: NavItem[] = [
    { id: 'contact', labelKey: 'navContact', labelFallback: 'Help Desk', icon: HelpCircle },
    { id: 'feedback', labelKey: 'navFeedback', labelFallback: 'Give Feedback', icon: MessageSquare, badge: 'NEW' },
    { id: 'settings', labelKey: 'navSettings', labelFallback: 'Settings', icon: Settings },
  ];

  if (role === 'expert') {
    coreNavItems = [
      { id: 'expert/dashboard', labelKey: 'navDashboard', labelFallback: 'Expert Overview', icon: LayoutDashboard },
      { id: 'expert/consultations', labelKey: 'navDisease', labelFallback: 'Farmer Consultations', icon: ShieldAlert, count: 2 },
      { id: 'expert/disease-cases', labelKey: 'navCropIntel', labelFallback: 'Crop Analysis', icon: Wheat },
      { id: 'hotspots', labelKey: 'navHotspots', labelFallback: 'Regional Hotspots', icon: MapPin },
    ];
    intelNavItems = [
      { id: 'early-warning', labelKey: 'navEarlyWarning', labelFallback: 'Early Warning Model', icon: Activity, badge: 'NEW' },
      { id: 'weather', labelKey: 'navWeather', labelFallback: 'Weather Intelligence', icon: Sun },
      { id: 'ai', labelKey: 'navAI', labelFallback: 'Agrinext AI Advisory', icon: Bot, badge: 'GPT' },
    ];
    ecosystemNavItems = [
      { id: 'official', labelKey: 'navOfficial', labelFallback: 'Agri Official Command', icon: Award, badge: 'GOVT' },
      { id: 'mandi', labelKey: 'navMandi', labelFallback: 'Mandi Rates', icon: TrendingUp },
      { id: 'marketplace', labelKey: 'navMarketplace', labelFallback: 'Crop Marketplace', icon: ShoppingBag },
    ];
  } else if (role === 'buyer') {
    coreNavItems = [
      { id: 'buyer/dashboard', labelKey: 'navDashboard', labelFallback: 'Buyer Overview', icon: LayoutDashboard },
      { id: 'buyer/marketplace', labelKey: 'navMarketplace', labelFallback: 'Produce Marketplace', icon: ShoppingBag },
      { id: 'buyer/mandi', labelKey: 'navMandi', labelFallback: 'Mandi Price Feeds', icon: TrendingUp },
    ];
    intelNavItems = [
      { id: 'weather', labelKey: 'navWeather', labelFallback: 'Weather Advisory', icon: Sun },
      { id: 'ai', labelKey: 'navAI', labelFallback: 'Agrinext AI', icon: Bot, badge: 'GPT' },
    ];
    ecosystemNavItems = [
      { id: 'economics', labelKey: 'navEconomics', labelFallback: 'Procurement Insights', icon: DollarSign },
    ];
  } else {
    coreNavItems = [
      { id: 'dashboard', labelKey: 'navDashboard', labelFallback: 'Dashboard', icon: LayoutDashboard },
      { id: 'disease', labelKey: 'navDisease', labelFallback: 'AI Crop Scanner', icon: ShieldAlert, badge: 'AI', isScanner: true },
      { id: 'farm', labelKey: 'navMyFarm', labelFallback: 'My Farms', icon: Sprout },
      { id: 'crops', labelKey: 'navCrops', labelFallback: 'Crop Cycles', icon: Wheat },
      { id: 'pests', labelKey: 'navPests', labelFallback: 'Pest Monitoring', icon: Bug },
      { id: 'follow-up', labelKey: 'navFollowUp', labelFallback: 'Follow-Up Tracker', icon: ShieldCheck, badge: 'SIH' },
    ];

    intelNavItems = [
      { id: 'early-warning', labelKey: 'navEarlyWarning', labelFallback: 'Early Warning Risk', icon: Activity, badge: 'NEW' },
      { id: 'hotspots', labelKey: 'navHotspots', labelFallback: 'Hotspot GIS Map', icon: MapPin, badge: 'GIS' },
      { id: 'weather', labelKey: 'navWeather', labelFallback: 'Weather & Spray', icon: Sun },
      { id: 'alerts', labelKey: 'navAlerts', labelFallback: 'Farm Alerts', icon: Bell, count: unreadAlertsCount },
      { id: 'ai', labelKey: 'navAI', labelFallback: 'Agrinext AI', icon: Bot, badge: 'GPT' },
    ];

    ecosystemNavItems = [
      { id: 'official', labelKey: 'navOfficial', labelFallback: 'Agri Official Console', icon: Award, badge: 'GOVT' },
      { id: 'mandi', labelKey: 'navMandi', labelFallback: 'Mandi Rates', icon: TrendingUp },
      { id: 'marketplace', labelKey: 'navMarketplace', labelFallback: 'Marketplace', icon: ShoppingBag },
      { id: 'schemes', labelKey: 'navSchemes', labelFallback: 'Govt Schemes', icon: Landmark },
      { id: 'equipment', labelKey: 'navEquipment', labelFallback: 'Farm Equipment', icon: Wrench },
      { id: 'economics', labelKey: 'navEconomics', labelFallback: 'Farm Economics', icon: DollarSign },
    ];
  }

  if (role === 'admin') {
    ecosystemNavItems.push({ id: 'admin', labelKey: 'navAdmin', labelFallback: 'Admin Console', icon: Shield });
  }

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div style={{ marginBottom: '16px' }}>
      <div
        style={{
          fontSize: '0.68rem',
          fontWeight: '800',
          color: isDark ? '#64748b' : '#94a3b8',
          textTransform: 'uppercase',
          padding: '4px 12px 6px',
          letterSpacing: '0.06em',
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            activePage === item.id ||
            (item.id === 'farm' && activePage === 'farms') ||
            (item.id === 'disease' && isScannerActive) ||
            (item.id === 'pests' && activePage === 'pest-monitoring') ||
            (item.id === 'early-warning' && (activePage === 'early-warning' || activePage === 'farmer/early-warning')) ||
            (item.id === 'hotspots' && (activePage === 'hotspots' || activePage === 'farmer/hotspots')) ||
            (item.id === 'follow-up' && (activePage === 'follow-up' || activePage === 'farmer/follow-up')) ||
            (item.id === 'official' && (activePage === 'official' || activePage === 'official/dashboard' || activePage === 'farmer/official')) ||
            (item.id === 'alerts' && activePage === 'notifications') ||
            (item.id === 'contact' && (activePage === 'contact' || activePage === 'farmer/contact' || activePage === 'support')) ||
            (item.id === 'feedback' && (activePage === 'feedback' || activePage === 'farmer/feedback'));

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isActive
                  ? (isDark ? 'rgba(16, 185, 129, 0.18)' : '#ecfdf5')
                  : 'transparent',
                color: isActive
                  ? (isDark ? '#34d399' : '#065f46')
                  : (isDark ? '#cbd5e1' : '#475569'),
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.86rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                boxShadow: isActive ? 'inset 3px 0 0 #10b981' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f8fafc';
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} color={isActive ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')} />
                <span>{t(item.labelKey as any) || item.labelFallback}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      backgroundColor: isActive ? '#10b981' : (isDark ? '#1e293b' : '#e0f2fe'),
                      color: isActive ? '#ffffff' : (isDark ? '#38bdf8' : '#0369a1'),
                      border: isActive ? 'none' : (isDark ? '1px solid #334155' : '1px solid #bae6fd'),
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {item.count && item.count > 0 ? (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '999px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                    }}
                  >
                    {item.count}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside
      className="desktop-only"
      style={{
        width: '244px',
        backgroundColor: isDark ? '#0B1220' : '#ffffff',
        borderRight: isDark ? '1px solid #263449' : '1px solid var(--slate-200)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100vh - 70px)',
        position: 'sticky',
        top: '70px',
        overflowY: 'auto',
        padding: '16px 12px 20px',
        zIndex: 30,
      }}
    >
      <div>
        {/* Flagship Quick Scan CTA */}
        <div style={{ marginBottom: '18px', padding: '0 2px' }}>
          <button
            onClick={() => onNavigate('disease')}
            className="btn"
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(5, 150, 105, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(5, 150, 105, 0.35)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Scan size={16} color="#ffffff" />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>
                {t('scanCrop', 'Scan My Crop')}
              </span>
            </div>
            <Sparkles size={16} color="#fef08a" />
          </button>
        </div>

        {/* Group 1: Core Navigation */}
        {renderNavGroup(t('navCoreDiagnostics', 'Core Diagnostics'), coreNavItems)}

        {/* Group 2: Intelligence & Telemetry */}
        {renderNavGroup(t('navTelemetryAlerts', 'Telemetry & Alerts'), intelNavItems)}

        {/* Group 3: Agri Ecosystem */}
        {renderNavGroup(t('navAgriEcosystem', 'Agri Ecosystem'), ecosystemNavItems)}

        {/* Group 4: Support & Feedback */}
        {renderNavGroup(t('navSupportDesk', 'Support & Preferences'), supportNavItems)}
      </div>

      {/* Footer Profile & Status Chip + Sign Out */}
      <div
        style={{
          borderTop: isDark ? '1px solid #263449' : '1px solid var(--slate-200)',
          paddingTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            onClick={() => onNavigate('profile')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '12px',
              border: isDark ? '1px solid #263449' : '1px solid var(--slate-200)',
              backgroundColor: isDark ? '#172033' : '#f8fafc',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s ease',
              minWidth: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? '#172033' : '#f8fafc')}
            title={t('navProfile', 'Profile')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '10px',
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'var(--primary-100)',
                  color: isDark ? '#34d399' : 'var(--primary-800)',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'F'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: isDark ? '#f8fafc' : 'var(--slate-900)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {currentUser?.name || 'Farmer User'}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700, textTransform: 'capitalize' }}>
                  ● {t(role === 'farmer' ? 'roleFarmer' : role === 'buyer' ? 'roleBuyer' : role === 'expert' ? 'roleExpert' : role === 'equipment_owner' ? 'roleEquipmentOwner' : role === 'admin' ? 'roleAdmin' : 'roleFarmer', role || 'Farmer')}
                </div>
              </div>
            </div>
            <ChevronRight size={14} color={isDark ? '#64748b' : '#94a3b8'} />
          </button>

          <button
            onClick={() => {
              logout();
              onNavigate('landing');
            }}
            style={{
              padding: '8px 10px',
              borderRadius: '12px',
              border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease',
              flexShrink: 0,
            }}
            title={t('logout', 'Sign Out')}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
