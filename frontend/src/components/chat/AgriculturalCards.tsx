import React from 'react';
import {
  AIDiseaseCardPayload,
  AIWeatherCardPayload,
  AIPestCardPayload,
  AIMandiCardPayload,
  AISchemeCardPayload,
  AIFollowUpCardPayload,
  AIHotspotCardPayload,
  AIActionButton,
} from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Calendar,
  Layers,
  Sprout,
  Sun,
  Droplets,
  Wind,
} from 'lucide-react';

// --- 1. SCHEME CARD ---
export const SchemeCard: React.FC<{ scheme: AISchemeCardPayload }> = ({ scheme }) => {
  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        border: '1.5px solid #cbd5e1',
        borderLeft: '4px solid #059669',
        borderRadius: '14px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          🏛️ {scheme.sponsor || 'Government Scheme'}
        </span>
        {scheme.maxFinancialAssistance && (
          <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#065f46', padding: '2px 8px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
            {scheme.maxFinancialAssistance}
          </span>
        )}
      </div>

      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
        {scheme.title}
      </h4>

      <p style={{ fontSize: '0.86rem', color: '#334155', margin: '0 0 10px 0', lineHeight: 1.45 }}>
        {scheme.benefitSummary}
      </p>

      {scheme.eligibilityCriteria && scheme.eligibilityCriteria.length > 0 && (
        <div style={{ marginBottom: '8px', backgroundColor: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            Eligibility:
          </span>
          <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '0.8rem', color: '#334155' }}>
            {scheme.eligibilityCriteria.map((crit, idx) => (
              <li key={idx}>{crit}</li>
            ))}
          </ul>
        </div>
      )}

      {scheme.documentsRequired && scheme.documentsRequired.length > 0 && (
        <div style={{ marginBottom: '10px', backgroundColor: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            Required Documents:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
            {scheme.documentsRequired.map((doc, idx) => (
              <span key={idx} style={{ fontSize: '0.74rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px' }}>
                📄 {doc}
              </span>
            ))}
          </div>
        </div>
      )}

      {scheme.applicationUrl && (
        <a
          href={scheme.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#059669',
            textDecoration: 'none',
            marginTop: '4px',
          }}
        >
          <span>Official Portal ({scheme.applicationUrl})</span>
          <ExternalLink size={13} />
        </a>
      )}
    </div>
  );
};

// --- 2. DISEASE CARD ---
export const DiseaseCard: React.FC<{ disease: AIDiseaseCardPayload; isHindi?: boolean }> = ({ disease, isHindi }) => {
  const isHigh = disease.risk === 'HIGH' || disease.risk === 'CRITICAL';
  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        border: '1.5px solid #cbd5e1',
        borderLeft: `4px solid ${isHigh ? '#dc2626' : '#d97706'}`,
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
          🌿 {disease.crop} • AI Pathology Scan
        </span>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: isHigh ? '#fee2e2' : '#fef3c7',
            color: isHigh ? '#dc2626' : '#b45309',
            border: `1px solid ${isHigh ? '#fca5a5' : '#fde68a'}`,
          }}
        >
          {disease.risk} RISK {disease.confidence ? `(${disease.confidence}%)` : ''}
        </span>
      </div>

      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
        {disease.disease}
      </h4>

      {disease.environmentalFactors && disease.environmentalFactors.length > 0 && (
        <div style={{ marginBottom: '8px', backgroundColor: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            {isHindi ? 'पहचाने गए मौसमी कारक' : 'Microclimate Triggers:'}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
            {disease.environmentalFactors.map((f, i) => (
              <div key={i} style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} color="#059669" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {disease.chemicalTreatment && (
        <div style={{ fontSize: '0.82rem', color: '#991b1b', backgroundColor: '#fef2f2', padding: '8px 10px', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '6px' }}>
          💊 <strong>{isHindi ? 'दवा स्प्रे:' : 'Chemical Action:'}</strong> {disease.chemicalTreatment}
        </div>
      )}

      {disease.biologicalTreatment && (
        <div style={{ fontSize: '0.82rem', color: '#065f46', backgroundColor: '#ecfdf5', padding: '8px 10px', borderRadius: '8px', border: '1px solid #a7f3d0', marginBottom: '6px' }}>
          🌱 <strong>{isHindi ? 'जैविक उपचार:' : 'Biological Control:'}</strong> {disease.biologicalTreatment}
        </div>
      )}

      {disease.sprayWindow && (
        <div style={{ fontSize: '0.8rem', color: '#78350f', backgroundColor: '#fffbeb', padding: '8px 10px', borderRadius: '8px', border: '1px solid #fef3c7' }}>
          ⛅ <strong>{isHindi ? 'स्प्रे विंडो:' : 'Spray Window:'}</strong> {disease.sprayWindow}
        </div>
      )}
    </div>
  );
};

// --- 3. PEST CARD ---
export const PestCard: React.FC<{ pest: AIPestCardPayload }> = ({ pest }) => {
  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        border: '1.5px solid #cbd5e1',
        borderLeft: '4px solid #ea580c',
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase' }}>
          🐛 Pest Entomology • {pest.cropName}
        </span>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#ffedd5', color: '#c2410c', padding: '2px 8px', borderRadius: '999px' }}>
          {pest.riskLevel} RISK
        </span>
      </div>

      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
        {pest.pestName} {pest.scientificName ? `(${pest.scientificName})` : ''}
      </h4>

      {pest.symptoms && (
        <div style={{ fontSize: '0.82rem', color: '#334155', marginBottom: '8px' }}>
          <strong>Symptoms:</strong> {pest.symptoms.join(', ')}
        </div>
      )}

      {pest.management && pest.management.length > 0 && (
        <div style={{ fontSize: '0.82rem', color: '#991b1b', backgroundColor: '#fef2f2', padding: '8px 10px', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '6px' }}>
          🛡️ <strong>IPM Control:</strong> {pest.management.join(' • ')}
        </div>
      )}

      {pest.organicControl && pest.organicControl.length > 0 && (
        <div style={{ fontSize: '0.82rem', color: '#065f46', backgroundColor: '#ecfdf5', padding: '8px 10px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
          🌱 <strong>Bio Control:</strong> {pest.organicControl.join(' • ')}
        </div>
      )}
    </div>
  );
};

// --- 4. WEATHER CARD ---
export const WeatherCard: React.FC<{ weather: AIWeatherCardPayload }> = ({ weather }) => {
  return (
    <div
      style={{
        backgroundColor: '#f0f9ff',
        border: '1.5px solid #bae6fd',
        borderLeft: '4px solid #0284c7',
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>
          ⛅ Agricultural Weather Telemetry
        </span>
        {weather.sprayWindowStatus && (
          <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#065f46', padding: '2px 8px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
            {weather.sprayWindowStatus}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))', gap: '8px', marginBottom: '10px', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '6px 4px', borderRadius: '8px', border: '1px solid #e0f2fe' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Temp</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{weather.temp}</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '6px 4px', borderRadius: '8px', border: '1px solid #e0f2fe' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Humidity</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{weather.humidity}</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '6px 4px', borderRadius: '8px', border: '1px solid #e0f2fe' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Rain Prob</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0284c7' }}>{weather.rainProb}</div>
        </div>
        <div style={{ backgroundColor: '#ffffff', padding: '6px 4px', borderRadius: '8px', border: '1px solid #e0f2fe' }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Wind</div>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>{weather.windSpeed}</div>
        </div>
      </div>

      {weather.recommendation && (
        <p style={{ fontSize: '0.82rem', color: '#0369a1', margin: 0, fontWeight: 600, lineHeight: 1.4 }}>
          {weather.recommendation}
        </p>
      )}
    </div>
  );
};

// --- 5. MANDI CARD ---
export const MandiCard: React.FC<{ mandi: AIMandiCardPayload }> = ({ mandi }) => {
  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        border: '1.5px solid #cbd5e1',
        borderLeft: '4px solid #d97706',
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
          📈 APMC Mandi Rate
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#64748b' }}>
          <MapPin size={12} color="#059669" />
          <span>{mandi.market} ({mandi.district || ''})</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          {mandi.commodity} {mandi.variety ? `• ${mandi.variety}` : ''}
        </h4>
        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#047857' }}>
          ₹{mandi.modalPrice} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>/ quintal</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: '#475569', backgroundColor: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
        <span>Min: <strong>₹{mandi.minPrice}</strong></span>
        <span>•</span>
        <span>Max: <strong>₹{mandi.maxPrice}</strong></span>
        {mandi.trend && (
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '2px', color: mandi.trend === 'up' ? '#059669' : mandi.trend === 'down' ? '#dc2626' : '#64748b', fontWeight: 700 }}>
            {mandi.trend === 'up' ? <TrendingUp size={13} /> : mandi.trend === 'down' ? <TrendingDown size={13} /> : <Minus size={13} />}
            {mandi.trend.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

// --- 6. SOURCE BADGE ---
export const SourceBadge: React.FC<{ sourceStatus?: string; sources?: Array<{ name: string; url?: string; lastUpdated?: string }> }> = ({ sourceStatus, sources }) => {
  if (!sourceStatus && (!sources || sources.length === 0)) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '10px', fontSize: '0.72rem', color: '#64748b' }}>
      {sourceStatus && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, border: '1px solid #e2e8f0' }}>
          <ShieldCheck size={12} color="#059669" />
          <span>Source: {sourceStatus}</span>
        </span>
      )}
      {sources && sources.map((s, idx) => (
        <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {s.url ? (
            <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline', fontWeight: 600 }}>
              {s.name} ↗
            </a>
          ) : (
            <span>{s.name}</span>
          )}
          {s.lastUpdated && <span style={{ color: '#94a3b8' }}>({s.lastUpdated})</span>}
        </span>
      ))}
    </div>
  );
};

// --- 7. ACTION BUTTON GROUP ---
export const ActionButtonGroup: React.FC<{ buttons?: AIActionButton[]; onAction: (btn: AIActionButton) => void }> = ({ buttons, onAction }) => {
  if (!buttons || buttons.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          onClick={() => onAction(btn)}
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: '1px solid #a7f3d0',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#d1fae5';
            e.currentTarget.style.borderColor = '#6ee7b7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ecfdf5';
            e.currentTarget.style.borderColor = '#a7f3d0';
          }}
        >
          <span>{btn.label}</span>
          <ChevronRight size={13} />
        </button>
      ))}
    </div>
  );
};
