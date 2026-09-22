import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { DataBadge } from '../components/common/DataBadge';
import {
  Sun,
  Bot,
  ShieldAlert,
  TrendingUp,
  ShoppingBag,
  Wrench,
  CheckSquare,
  AlertTriangle,
  Sprout,
  MapPin,
  Wheat,
  Bug,
  Bell,
  ArrowRight,
  Plus,
  ShieldCheck,
  Activity,
  Layers,
  Scan,
  Sparkles,
  ExternalLink,
  Droplets,
  Wind,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react';
import { useFarmLocation } from '../contexts/FarmLocationContext';

interface FarmerDashboardProps {
  onNavigate?: (page: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onNavigate: propNavigate }) => {
  const navigate = useNavigate();
  const outletContext = useOutletContext<{ onNavigate?: (page: string) => void } | null>();
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();
  const { weather, tasks, toggleTask, mandiPrices, farms, cropCycles, notifications } = useData();
  const { location: farmLoc, openPicker } = useFarmLocation();

  const handleNavigate = (page: string) => {
    if (propNavigate) {
      propNavigate(page);
    } else if (outletContext?.onNavigate) {
      outletContext.onNavigate(page);
    } else {
      switch (page) {
        case 'dashboard':
          navigate('/dashboard');
          break;
        case 'disease':
          navigate('/disease-detection');
          break;
        case 'disease-detection':
          navigate('/disease-detection');
          break;
        case 'ai':
          navigate('/ai');
          break;
        case 'early-warning':
          navigate('/early-warning');
          break;
        case 'hotspots':
          navigate('/hotspots');
          break;
        case 'follow-up':
          navigate('/follow-up');
          break;
        case 'experts':
          navigate('/experts');
          break;
        case 'weather':
          navigate('/weather');
          break;
        case 'farms':
        case 'farm':
          navigate('/farms');
          break;
        case 'crops':
          navigate('/crops');
          break;
        case 'mandi':
        case 'mandi-rates':
          navigate('/mandi-rates');
          break;
        case 'alerts':
        case 'notifications':
          navigate('/alerts');
          break;
        default:
          navigate(`/${page}`);
      }
    }
  };

  const unreadAlerts = notifications.filter((n) => !n.read);
  const criticalAlerts = unreadAlerts.filter(
    (n) => n.type === 'weather' || n.title.toLowerCase().includes('risk') || n.title.toLowerCase().includes('alert')
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning', 'Good Morning');
    if (hour < 17) return t('goodAfternoon', 'Good Afternoon');
    return t('goodEvening', 'Good Evening');
  };

  const totalLand = farms.reduce((acc, f) => acc + (Number(f.area) || 0), 0);
  const activeCropsCount = cropCycles.filter((c) => c.status === 'growing' || c.status === 'sown').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '32px' }}>
      {/* 1. Top Executive Banner Greeting & Farm Context */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 45%, #047857 85%, #059669 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '18px',
          boxShadow: '0 8px 24px -4px rgba(5, 150, 105, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          {/* Farm GPS & Role Meta Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--fs-xs)', color: '#a7f3d0', fontWeight: '700', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', color: '#ffffff', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>
              🌾 {t('roleFarmer', 'Farmer')}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={15} color="#34d399" style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'clamp(200px, 30vw, 420px)' }}>
                {farmLoc.formattedAddress || `${farmLoc.village || farmLoc.city}, ${farmLoc.district}, ${farmLoc.state}`}
              </span>
            </div>
            <button
              onClick={openPicker}
              style={{
                border: '1px solid rgba(255,255,255,0.35)',
                backgroundColor: 'rgba(255,255,255,0.18)',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--fs-xs)',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              title={t('changeLocation', 'Change Location')}
            >
              {t('changeLocation', 'Change Location')} ✏️
            </button>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 1.95rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
            {getGreeting()}, {currentUser?.name || t('roleFarmer', 'Farmer')}
          </h1>
          <p style={{ fontSize: 'var(--fs-sm)', color: '#d1fae5', marginTop: '6px', lineHeight: 1.45, fontWeight: '500' }}>
            {t('dashboardHeroDesc', 'AGRINEXT Precision Engine active — crop cycles, hyper-local spray windows & alerts synced.')}
          </p>
        </div>

        {/* Hero Quick Action CTAs (Issue 12) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleNavigate('disease')}
            className="scan-crop-btn"
            style={{
              backgroundColor: '#ffffff',
              color: '#064e3b',
              background: '#ffffff',
              border: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            }}
          >
            <Scan size={17} color="#059669" />
            <span>{t('scanMyCrop', 'Scan My Crop')}</span>
          </button>

          <button
            onClick={() => handleNavigate('ai')}
            className="btn btn-outline"
            style={{
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.16)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 'var(--fs-sm)',
              backdropFilter: 'blur(8px)',
              minHeight: '44px',
            }}
          >
            <Bot size={17} color="#fef08a" />
            <span>{t('askAI', 'Ask AI Assistant')}</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Telemetry KPI Cards (Issues 6, 7) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {/* Metric 1: Total Farm Plots */}
        <div
          className="card card-interactive"
          onClick={() => handleNavigate('farms')}
          style={{
            padding: '18px 20px',
            cursor: 'pointer',
            borderLeft: '4px solid #059669',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '132px',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="stat-label">
              {t('totalFarms', 'Total Farm Plots')}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout size={18} color="#059669" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 900, color: 'var(--text-heading)', lineHeight: 1.1 }}>
              {farms.length} {t('plots', 'Plots')}
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
              {totalLand.toFixed(1)} {t('plotsRegistered', 'Total Acres Registered')}
            </div>
          </div>
        </div>

        {/* Metric 2: Active Crops */}
        <div
          className="card card-interactive"
          onClick={() => handleNavigate('crops')}
          style={{
            padding: '18px 20px',
            cursor: 'pointer',
            borderLeft: '4px solid #d97706',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '132px',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="stat-label">
              {t('activeCrops', 'Active Crops')}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wheat size={18} color="#d97706" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 900, color: 'var(--text-heading)', lineHeight: 1.1 }}>
              {activeCropsCount} {t('active', 'Active')}
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: '#b45309', fontWeight: 700, marginTop: '4px' }}>
              {t('activeCropsList', 'Wheat, Soybean, Mustard')}
            </div>
          </div>
        </div>

        {/* Metric 3: Disease & Pest Alerts */}
        <div
          className="card card-interactive"
          onClick={() => handleNavigate('disease-detection')}
          style={{
            padding: '18px 20px',
            cursor: 'pointer',
            borderLeft: '4px solid #dc2626',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '132px',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="stat-label">
              {t('diseasePestAlerts', 'Disease & Pest Alerts')}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={18} color="#dc2626" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 900, color: '#dc2626', lineHeight: 1.1 }}>
              2 {t('monitored', 'Monitored')}
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: '#dc2626', fontWeight: 700, marginTop: '4px' }}>
              {t('rustWarningWhiteflyText', 'Rust warning & Whitefly')}
            </div>
          </div>
        </div>

        {/* Metric 4: Farm Risk Index */}
        <div
          className="card card-interactive"
          onClick={() => handleNavigate('alerts')}
          style={{
            padding: '18px 20px',
            cursor: 'pointer',
            borderLeft: '4px solid #0284c7',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '132px',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="stat-label">
              {t('farmRiskIndex', 'Farm Risk Index')}
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="#0284c7" />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 900, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px', lineHeight: 1.1 }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
              {t('moderate', 'MODERATE')}
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: '#0284c7', fontWeight: 700, marginTop: '4px' }}>
              {t('optimalSoilMoistureText', 'Optimal soil moisture balance')}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Unified Connected Farm Intelligence System (3 Cards) (Issues 9, 10, 13) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Intelligence Card 1: Microclimate Early Warning */}
        <div
          className="dashboard-card card-interactive"
          onClick={() => handleNavigate('early-warning')}
          style={{
            border: '1px solid #fed7aa',
            borderTop: '4px solid #ea580c',
            cursor: 'pointer',
            gap: '14px',
            minHeight: '220px',
          }}
        >
          {/* Card Header */}
          <div className="dashboard-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sun size={19} color="#ea580c" />
              </div>
              <div>
                <h2 className="dashboard-card-title">
                  {t('microclimateEarlyWarning', 'Microclimate Early Warning')}
                </h2>
                <div className="dashboard-card-meta">
                  {t('fiveDayDiseaseCausality', '5-Day Disease Causality Model')}
                </div>
              </div>
            </div>
            <span className="status-badge" style={{ backgroundColor: '#fed7aa', color: '#c2410c', flexShrink: 0 }}>
              {t('highRisk', 'HIGH RISK')} (78%)
            </span>
          </div>

          {/* Structured Intelligence Body */}
          <div style={{ backgroundColor: '#fffaf5', borderRadius: 'var(--radius-md)', padding: '12px 14px', border: '1px solid #ffedd5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-xs)' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{t('riskLevel', 'Risk Level')}:</span>
              <span style={{ color: '#c2410c', fontWeight: 900, fontSize: 'var(--fs-sm)' }}>78% ({t('highRisk', 'High Risk')})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-xs)' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{t('crop', 'Crop')} / {t('issue', 'Issue')}:</span>
              <span style={{ color: 'var(--text-heading)', fontWeight: 800 }}>{t('wheatCrop', 'Wheat')} • {t('yellowRust', 'Yellow Rust')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', gap: '8px' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700, flexShrink: 0 }}>{t('environmentalFactors', 'Environmental Factors')}:</span>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>{t('humidityTempFactors', 'Humidity (84%) + Cool Night (14°C)')}</span>
            </div>
            <div style={{ borderTop: '1px dashed #fed7aa', paddingTop: '6px', marginTop: '2px', fontSize: 'var(--fs-xs)', color: '#9a3412', fontWeight: 700 }}>
              💡 {t('recommendedAction', 'Recommended Action')}: {t('preventiveSprayRec', 'Apply preventive bio-fungicide spray within 48h')}
            </div>
          </div>

          {/* Card Footer Action (Issue 10) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: 'var(--fs-xs)', color: '#ea580c', fontWeight: 700 }}>
              {t('preventiveSprayActive', 'Preventive spray window active')}
            </span>
            <button
              className="card-action"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate('early-warning');
              }}
            >
              <span>{t('viewForecastAction', 'View Forecast')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Intelligence Card 2: Outbreak Hotspot Radar (GIS) */}
        <div
          className="dashboard-card card-interactive"
          onClick={() => handleNavigate('hotspots')}
          style={{
            border: '1px solid #fecaca',
            borderTop: '4px solid #dc2626',
            cursor: 'pointer',
            gap: '14px',
            minHeight: '220px',
          }}
        >
          {/* Card Header */}
          <div className="dashboard-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={19} color="#dc2626" />
              </div>
              <div>
                <h2 className="dashboard-card-title">
                  {t('outbreakHotspotRadar', 'Outbreak Hotspot Radar')}
                </h2>
                <div className="dashboard-card-meta">
                  {t('gisClusterSurveillance', 'GIS Cluster Surveillance')}
                </div>
              </div>
            </div>
            <span className="status-badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626', flexShrink: 0 }}>
              3 {t('clustersNearby', 'Clusters Nearby')}
            </span>
          </div>

          {/* Structured Intelligence Body */}
          <div style={{ backgroundColor: '#fff5f5', borderRadius: 'var(--radius-md)', padding: '12px 14px', border: '1px solid #fee2e2', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-xs)' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{t('nearbyCluster', 'Nearby Cluster')}:</span>
              <span style={{ color: '#991b1b', fontWeight: 800 }}>{t('stripeRustCluster', 'Stripe Rust Outbreak (Karnal Block)')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-xs)' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{t('distance', 'Distance')}:</span>
              <span style={{ color: 'var(--text-heading)', fontWeight: 900 }}>12.4 km away</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-xs)' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{t('affectedFarmsCount', 'Affected Farms')}:</span>
              <span style={{ color: '#dc2626', fontWeight: 800 }}>{t('activeFarmsAff', '18 Farms Confirmed')}</span>
            </div>
            <div style={{ borderTop: '1px dashed #fecaca', paddingTop: '6px', marginTop: '2px', fontSize: 'var(--fs-xs)', color: '#b91c1c', fontWeight: 700 }}>
              🚨 {t('riskStatus', 'Risk Status')}: {t('containmentAlert', 'Active Containment (5km Buffer)')}
            </div>
          </div>

          {/* Card Footer Action (Issue 10) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: 'var(--fs-xs)', color: '#dc2626', fontWeight: 700 }}>
              {t('containmentBufferActive', 'Containment buffer active')}
            </span>
            <button
              className="card-action"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate('hotspots');
              }}
            >
              <span>{t('openGisMapAction', 'Open GIS Map')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Intelligence Card 3: Follow-Up Recovery Monitor (Timeline) */}
        <div
          className="dashboard-card card-interactive"
          onClick={() => handleNavigate('follow-up')}
          style={{
            border: '1px solid #bbf7d0',
            borderTop: '4px solid #059669',
            cursor: 'pointer',
            gap: '14px',
            minHeight: '220px',
          }}
        >
          {/* Card Header (Issue 5: Day 3 Recovery Title Casing) */}
          <div className="dashboard-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={19} color="#059669" />
              </div>
              <div>
                <h2 className="dashboard-card-title">
                  {t('followUpRecoveryMonitor', 'Follow-Up Recovery Monitor')}
                </h2>
                <div className="dashboard-card-meta">
                  {t('postTreatmentProtocol', 'Post-Treatment Protocol')}
                </div>
              </div>
            </div>
            <span className="status-badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', flexShrink: 0 }}>
              {t('day3Recovery', 'Day 3 Recovery')} (65%)
            </span>
          </div>

          {/* Visual Recovery Timeline */}
          <div style={{ backgroundColor: '#f0fdf4', borderRadius: 'var(--radius-md)', padding: '12px 14px', border: '1px solid #dcfce7' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', margin: '4px 0 8px' }}>
              {/* Timeline Connector Bar */}
              <div style={{ position: 'absolute', top: '12px', left: '15px', right: '15px', height: '3px', backgroundColor: '#86efac', zIndex: 1 }}></div>

              {/* Day 0 Milestone */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--fs-xs)', fontWeight: 900 }}>
                  ✓
                </div>
                <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 800, color: '#065f46', marginTop: '4px' }}>{t('day0Label', 'Day 0')}</span>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>{t('initialScan', 'Initial Scan')}</span>
              </div>

              {/* Day 3 Milestone (Active) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--fs-xs)', fontWeight: 900, boxShadow: '0 0 0 3px #bbf7d0' }}>
                  ●
                </div>
                <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 800, color: '#047857', marginTop: '4px' }}>{t('day3Label', 'Day 3')}</span>
                <span style={{ fontSize: 'var(--fs-xs)', color: '#059669', fontWeight: 800 }}>65% {t('recovery', 'Recovery')}</span>
              </div>

              {/* Day 7 Milestone */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ffffff', border: '2px solid #86efac', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>
                  ⏳
                </div>
                <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 800, color: 'var(--text-muted)', marginTop: '4px' }}>{t('day7Label', 'Day 7')}</span>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>{t('nextReview', 'Next Review')}</span>
              </div>
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: '#166534', fontWeight: 700, textAlign: 'center', borderTop: '1px dashed #bbf7d0', paddingTop: '6px' }}>
              🌿 {t('wheatCrop', 'Wheat')} Plot #1: Bio-fungicide shows 65% lesion drying
            </div>
          </div>

          {/* Card Footer Action (Issue 10) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: 'var(--fs-xs)', color: '#15803d', fontWeight: 700 }}>
              {t('day7ReviewIn4Days', 'Day 7 review in 4 days')}
            </span>
            <button
              className="card-action"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate('follow-up');
              }}
            >
              <span>{t('updateFollowUpAction', 'Update Photos')}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Priority Critical Alerts Banner (Conditional) */}
      {criticalAlerts.length > 0 && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={18} color="#dc2626" />
            </div>
            <div>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 800, color: '#991b1b' }}>
                {criticalAlerts[0].title}
              </div>
              <div style={{ fontSize: 'var(--fs-xs)', color: '#b91c1c', marginTop: '2px' }}>
                {criticalAlerts[0].message}
              </div>
            </div>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => handleNavigate('alerts')}
            style={{ borderColor: '#dc2626', color: '#dc2626', padding: '5px 14px', fontSize: 'var(--fs-xs)', fontWeight: 800, borderRadius: 'var(--radius-md)', flexShrink: 0 }}
          >
            {t('reviewAlerts', 'Review Alerts')}
          </button>
        </div>
      )}

      {/* 5. Dedicated Crop Scanner Spotlight Section (Issues 6, 7, 9) */}
      <div
        className="card"
        style={{
          padding: '22px 26px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 60%, #e6fcf0 100%)',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '680px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
              flexShrink: 0,
            }}
          >
            <Scan size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: 'var(--fs-xs)', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' }}>
              <Sparkles size={13} color="#10b981" />
              <span>AGRINEXT AI Precision Pathology</span>
            </div>
            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 900, color: '#064e3b', lineHeight: 1.25, margin: 0 }}>
              {t('scanMyCropPrompt', 'Is your crop showing yellow leaves or spots?')}
            </h2>
            <div style={{ fontSize: 'var(--fs-sm)', color: '#047857', marginTop: '3px', fontWeight: '500', lineHeight: 1.4 }}>
              {t('scanMyCropDesc', 'Upload a crop photo and let AGRINEXT AI analyze it with instant pathology detection & treatment.')}
            </div>
          </div>
        </div>

        {/* CTA Buttons (Issues 6 & 7: Secondary contextual action + Standardized AI Label) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleNavigate('disease')}
            className="btn btn-outline"
            style={{
              borderColor: '#059669',
              color: '#047857',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              minHeight: '42px',
            }}
          >
            <span>{t('openCropScanner', 'Open Crop Scanner')}</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => handleNavigate('ai')}
            className="btn btn-secondary"
            style={{
              borderRadius: 'var(--radius-md)',
              minHeight: '42px',
            }}
          >
            <Bot size={17} color="#047857" />
            <span>{t('askAIAssistant', 'Ask AI Assistant')}</span>
          </button>
        </div>
      </div>

      {/* 6. Weather & Mandi Rates Telemetry Section (Issues 8, 9, 10) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {/* Weather Intelligence Card */}
        <div className="card card-interactive" style={{ padding: '22px', cursor: 'pointer', borderRadius: 'var(--radius-lg)' }} onClick={() => handleNavigate('weather')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sun size={22} color="#0284c7" />
              </div>
              <div>
                <h2 className="card-title">
                  {weather.district} {t('weather', 'Weather')}
                </h2>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {weather.condition}
                </span>
              </div>
            </div>
            <span style={{ fontSize: 'var(--fs-3xl)', fontWeight: 900, color: 'var(--text-heading)' }}>
              {weather.temperature}°C
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '10px', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '12px' }}>
            <div>
              <span className="weather-label">
                {t('humidity', 'Humidity')}
              </span>
              <div style={{ fontWeight: 800, fontSize: 'var(--fs-md)', color: 'var(--text-heading)', marginTop: '2px' }}>
                {weather.humidity}%
              </div>
            </div>
            <div>
              <span className="weather-label">
                {t('windSpeed', 'Wind')}
              </span>
              <div style={{ fontWeight: 800, fontSize: 'var(--fs-md)', color: 'var(--text-heading)', marginTop: '2px' }}>
                {weather.windSpeed} km/h
              </div>
            </div>
            <div>
              <span className="weather-label">
                {t('rainChance', 'Rain Prob')}
              </span>
              <div style={{ fontWeight: 800, fontSize: 'var(--fs-md)', color: '#0284c7', marginTop: '2px' }}>
                {weather.rainProbability}%
              </div>
            </div>
          </div>

          <div style={{ fontSize: 'var(--fs-xs)', color: '#92400e', backgroundColor: '#fef3c7', padding: '8px 12px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, border: '1px solid #fde68a' }}>
            <AlertTriangle size={15} color="#d97706" style={{ flexShrink: 0 }} />
            <span>{weather.alerts[0]?.title || t('sprayWindowActive', 'Calm morning conditions active until 11:00 AM')}</span>
          </div>
        </div>

        {/* Mandi Rates Today Card */}
        <div className="card card-interactive" style={{ padding: '22px', cursor: 'pointer', borderRadius: 'var(--radius-lg)' }} onClick={() => handleNavigate('mandi')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={22} color="#16a34a" />
              </div>
              <div>
                <h2 className="card-title">
                  {t('mandiRatesToday', 'Mandi Rates Today')}
                </h2>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {t('districtWholesaleRates', 'District Wholesale Rates')}
                </span>
              </div>
            </div>
            <DataBadge status="LIVE DATA" size="sm" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mandiPrices.slice(0, 3).map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  backgroundColor: 'var(--slate-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-100)',
                }}
              >
                <div>
                  <span style={{ fontWeight: 800, fontSize: 'var(--fs-sm)', color: 'var(--text-heading)' }}>{item.commodity}</span>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginLeft: '6px' }}>({item.mandi})</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 900, fontSize: 'var(--fs-md)', color: 'var(--primary-700)' }}>₹{item.modalPrice}</span>
                  <span style={{ fontSize: 'var(--fs-xs)', color: item.trend === 'up' ? '#16a34a' : '#dc2626', marginLeft: '6px', fontWeight: 800 }}>
                    {item.trend === 'up' ? '▲ +' : '▼ '}{item.changePercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Daily Field Operations & Registered Plots Section (Issue 9, 11) */}
      <div className="dashboard-grid-2">
        {/* Today's Daily Field Operations */}
        <div className="dashboard-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '28px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={19} color="var(--primary-600)" />
              <h2 className="card-title">
                {t('dailyFieldOperations', 'Daily Field Operations')}
              </h2>
            </div>
            <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: 'var(--fs-xs)', borderRadius: 'var(--radius-md)', minHeight: '32px' }} onClick={() => handleNavigate('farms')}>
              {t('manageTasks', 'Manage Tasks')}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: task.completed ? 'var(--slate-50)' : 'var(--surface-card)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
                />
                <div style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  <div style={{ fontWeight: 800, fontSize: 'var(--fs-sm)' }}>{task.title}</div>
                  {task.notes && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>{task.notes}</div>}
                </div>
                <span
                  style={{
                    fontSize: 'var(--fs-xs)',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: task.priority === 'high' ? '#fee2e2' : '#fef3c7',
                    color: task.priority === 'high' ? '#dc2626' : '#b45309',
                  }}
                >
                  {task.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Farm Plots */}
        <div className="dashboard-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '28px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sprout size={19} color="var(--primary-600)" />
              <h2 className="card-title">
                {t('registeredLandPlots', 'Registered Land Plots')} ({farms.length})
              </h2>
            </div>
            <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: 'var(--fs-xs)', borderRadius: 'var(--radius-md)', minHeight: '32px' }} onClick={() => handleNavigate('farms')}>
              + {t('addPlot', 'Add Plot')}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {farms.map((f) => (
              <div
                key={f.id}
                onClick={() => handleNavigate(`farms/${f.id}`)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary-500)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: 'var(--fs-sm)', color: 'var(--text-heading)' }}>{f.name}</span>
                  <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 800, color: 'var(--primary-800)', backgroundColor: 'var(--primary-100)', padding: '2px 7px', borderRadius: 'var(--radius-pill)' }}>
                    {f.area} {f.unit}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)' }}>
                  {t('soil', 'Soil')}: {f.soilType} | {t('irrigation', 'Irrigation')}: {f.irrigation}
                </div>
                <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {f.crops.map((c, i) => (
                    <span key={i} style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '2px 7px', borderRadius: 'var(--radius-sm)' }}>
                      🌾 {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
