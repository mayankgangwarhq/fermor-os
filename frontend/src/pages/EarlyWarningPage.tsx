import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFarmLocation } from '../contexts/FarmLocationContext';
import { sihApi } from '../services/api';
import { sampleEarlyWarning } from '../services/mockData';
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Calendar,
  Sparkles,
  MapPin,
  TrendingUp,
  Info,
  Layers,
  Leaf,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import type { IEarlyWarning } from '../types';

const CROPS = ['Wheat', 'Paddy / Rice', 'Cotton', 'Tomato', 'Mustard', 'Soybean', 'Maize', 'Potato'];
const GROWTH_STAGES = [
  'Sowing / Germination',
  'Vegetative Growth',
  'Tillering & Branching',
  'Flowering & Pollination',
  'Fruit / Grain Filling',
  'Maturity & Ripening',
];

export const EarlyWarningPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { location: farmLoc } = useFarmLocation();

  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedStage, setSelectedStage] = useState('Flowering & Pollination');
  const [temp, setTemp] = useState(21);
  const [humidity, setHumidity] = useState(86);
  const [rainfall, setRainfall] = useState(14);
  const [loading, setLoading] = useState(false);
  const [warningData, setWarningData] = useState<IEarlyWarning>(sampleEarlyWarning);

  const fetchWarning = async () => {
    setLoading(true);
    try {
      const data = await sihApi.getEarlyWarning({
        crop: selectedCrop,
        district: farmLoc.district || 'Ludhiana',
        stage: selectedStage,
        humidity,
        temp,
        rainfall,
      });
      if (data) {
        setWarningData(data);
      }
    } catch (err) {
      console.warn('[EarlyWarning] Local fallback:', err);
      // Simulate client-side calculations matching parameters
      let dRisk = 30;
      let pRisk = 25;
      let reason = '';

      if (humidity > 75 && temp >= 12 && temp <= 24) {
        dRisk += 45;
        reason += `High relative humidity (${humidity}%) paired with moderate temperature (${temp}°C) creates high fungal spore germination risk. `;
      }
      if (rainfall > 5) {
        dRisk += 15;
        reason += `Recent rainfall (${rainfall}mm) prolongs leaf surface wetness. `;
      }
      if (temp > 28 && humidity > 60) {
        pRisk += 50;
        reason += `Warm humid spell accelerates insect pest multiplication. `;
      }

      dRisk = Math.min(96, Math.max(15, dRisk));
      pRisk = Math.min(92, Math.max(10, pRisk));

      const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' =
        dRisk >= 80 ? 'HIGH' : dRisk >= 55 ? 'MEDIUM' : 'LOW';

      setWarningData({
        crop: selectedCrop,
        district: farmLoc.district || 'Ludhiana',
        state: farmLoc.state || 'Punjab',
        growthStage: selectedStage,
        diseaseRiskScore: dRisk,
        pestRiskScore: pRisk,
        riskLevel,
        causalityReason: reason || 'Environmental indicators are within standard baseline thresholds.',
        recommendedAction:
          riskLevel === 'HIGH'
            ? 'Inspect leaf undersides within 24h. Postpone sprinkler irrigation and apply prophylactic bio-fungicide (Trichoderma viride @ 5g/L).'
            : 'Continue standard weekly scouting routine.',
        forecastTrend: [
          { day: 'Today (Day 1)', riskScore: dRisk, weatherFactor: `${humidity}% RH, ${temp}°C` },
          { day: 'Day 2 (+24h)', riskScore: Math.min(98, dRisk + 5), weatherFactor: 'Overcast, high dew' },
          { day: 'Day 3 (+48h)', riskScore: Math.max(20, dRisk - 10), weatherFactor: 'Partly sunny' },
          { day: 'Day 4 (+72h)', riskScore: Math.max(15, dRisk - 22), weatherFactor: 'Dry westerly wind' },
          { day: 'Day 5 (+96h)', riskScore: Math.max(15, dRisk - 30), weatherFactor: 'Low humidity, warm' },
        ],
        generatedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarning();
  }, [selectedCrop, selectedStage, farmLoc.district]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' };
      case 'HIGH':
        return { bg: '#ffedd5', text: '#c2410c', border: '#fdba74' };
      case 'MEDIUM':
        return { bg: '#fef9c3', text: '#a16207', border: '#fde047' };
      default:
        return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    }
  };

  const riskBadge = getRiskColor(warningData.riskLevel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* 1. Header Banner */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.35)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#a7f3d0', fontWeight: 800, marginBottom: '6px' }}>
            <MapPin size={16} color="#34d399" />
            <span>Telemetry Location: {farmLoc.formattedAddress || 'Ludhiana, Punjab'}</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>
            {t('earlyWarningTitle', 'Weather-Based Early Warning System')}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#d1fae5', marginTop: '4px' }}>
            {t('earlyWarningDesc', 'Predict fungal and insect pest outbreak risks 3–7 days before visual symptoms occur based on microclimate telemetry.')}
          </p>
        </div>

        <button
          onClick={fetchWarning}
          disabled={loading}
          className="btn"
          style={{
            backgroundColor: '#ffffff',
            color: '#064e3b',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.88rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Recalculating...' : 'Recalculate Risk'}</span>
        </button>
      </div>

      {/* 2. Interactive Input Controls Toolbar */}
      <div className="card" style={{ padding: '20px 24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="#059669" />
          <span>{t('configureMicroclimateParams', 'Configure Microclimate & Crop Growth Parameters')}</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* Crop Selector */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Target Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', fontWeight: 700 }}
            >
              {CROPS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Growth Stage Selector */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Growth Stage
            </label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', fontWeight: 700 }}
            >
              {GROWTH_STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Temperature Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Temperature</span>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>{temp}°C</span>
            </div>
            <input
              type="range"
              min={10}
              max={45}
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#059669' }}
            />
          </div>

          {/* Humidity Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Humidity (RH)</span>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#059669' }}>{humidity}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#059669' }}
            />
          </div>

          {/* Rainfall Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Precipitation</span>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb' }}>{rainfall} mm</span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={rainfall}
              onChange={(e) => setRainfall(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#2563eb' }}
            />
          </div>
        </div>
      </div>

      {/* 3. Primary Risk Gauge Dashboard Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Fungal Disease Risk Card */}
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: `2px solid ${warningData.diseaseRiskScore > 75 ? '#f87171' : '#e2e8f0'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                FUNGAL DISEASE RISK
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: riskBadge.bg,
                  color: riskBadge.text,
                }}
              >
                {warningData.riskLevel}
              </span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: warningData.diseaseRiskScore > 75 ? '#dc2626' : '#059669', lineHeight: 1 }}>
              {warningData.diseaseRiskScore}%
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
              High sporulation index for <strong>{selectedCrop}</strong> Yellow Rust / Blight.
            </div>
          </div>

          <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${warningData.diseaseRiskScore}%`,
                backgroundColor: warningData.diseaseRiskScore > 75 ? '#dc2626' : warningData.diseaseRiskScore > 50 ? '#d97706' : '#059669',
                borderRadius: '999px',
              }}
            />
          </div>
        </div>

        {/* Pest Infestation Risk Card */}
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: `2px solid ${warningData.pestRiskScore > 70 ? '#fdba74' : '#e2e8f0'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                PEST OUTBREAK RISK
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: warningData.pestRiskScore > 70 ? '#ffedd5' : '#dcfce7',
                  color: warningData.pestRiskScore > 70 ? '#c2410c' : '#15803d',
                }}
              >
                {warningData.pestRiskScore > 70 ? 'HIGH' : 'MODERATE'}
              </span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: warningData.pestRiskScore > 70 ? '#c2410c' : '#0284c7', lineHeight: 1 }}>
              {warningData.pestRiskScore}%
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
              Sucking pest & armyworm egg hatch proliferation probability.
            </div>
          </div>

          <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${warningData.pestRiskScore}%`,
                backgroundColor: warningData.pestRiskScore > 70 ? '#c2410c' : '#0284c7',
                borderRadius: '999px',
              }}
            />
          </div>
        </div>

        {/* Scientific Causality Explanation */}
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 800, fontSize: '0.92rem', marginBottom: '8px' }}>
              <Info size={18} color="#059669" />
              <span>{t('scientificRiskCausality', 'Scientific Risk Causality')}</span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
              {warningData.causalityReason}
            </div>
          </div>

          <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#166534', fontWeight: 700 }}>
            ⚡ Action: {warningData.recommendedAction}
          </div>
        </div>
      </div>

      {/* 4. 5-Day Outbreak Risk Forecast Chart */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {t('predictiveRiskForecast', '3–5 Day Predictive Disease Risk Forecast')}
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Microclimate curve tracking temperature, leaf wetness hours, and spore reproduction dynamics
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#dc2626' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#dc2626' }} /> &gt;75% High
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d97706' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d97706' }} /> 50-75% Moderate
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#059669' }} /> &lt;50% Safe
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={warningData.forecastTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 800 }}>{d.day}</div>
                        <div style={{ color: '#34d399', fontSize: '0.9rem', fontWeight: 900 }}>Risk Score: {d.riskScore}%</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>Factor: {d.weatherFactor}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="riskScore" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#riskGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
