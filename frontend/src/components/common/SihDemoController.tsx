import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Layers,
  Award,
  ShieldCheck,
  MapPin,
  Bug,
  Sun,
  Activity,
  UserCheck,
  Building2,
  TrendingUp,
  X,
  ExternalLink,
} from 'lucide-react';

const SIH_REQUIREMENTS = [
  { id: '1', title: 'Image-based symptom identification', status: 'Implemented', path: '/farmer/disease-detection', icon: '📸' },
  { id: '2', title: 'Pest-trap/sensor inputs & counting', status: 'Implemented', path: '/farmer/pest-monitoring', icon: '🪤' },
  { id: '3', title: 'Weather-based risk forecasting', status: 'Implemented', path: '/farmer/early-warning', icon: '🌦️' },
  { id: '4', title: 'Geospatial hotspot mapping', status: 'Implemented', path: '/farmer/hotspots', icon: '🗺️' },
  { id: '5', title: 'Expert clinical validation workflow', status: 'Implemented', path: '/expert/dashboard', icon: '👨‍🔬' },
  { id: '6', title: 'Multilingual advisories (Hindi & English)', status: 'Implemented', path: '/farmer/dashboard', icon: '🌐' },
  { id: '7', title: 'Integrated pest & disease management (IPM)', status: 'Implemented', path: '/farmer/disease-detection', icon: '🌿' },
  { id: '8', title: 'Safe input usage & gated chemical spray', status: 'Implemented', path: '/farmer/disease-detection', icon: '🧪' },
  { id: '9', title: 'Extension / laboratory referral system', status: 'Implemented', path: '/farmer/disease-detection', icon: '🏛️' },
  { id: '10', title: 'Follow-up monitoring (Day 0/3/7 recovery)', status: 'Implemented', path: '/farmer/follow-up', icon: '📈' },
  { id: '11', title: 'Field confirmation & training learning data', status: 'Implemented', path: '/farmer/follow-up', icon: '🧠' },
  { id: '12', title: 'Agriculture official outbreak console', status: 'Implemented', path: '/official/dashboard', icon: '📊' },
];

const DEMO_STEPS = [
  { step: 1, label: '1. Scan Crop', path: '/farmer/disease-detection', desc: 'AI symptom detection with 6-pillar IPM & confidence score' },
  { step: 2, label: '2. Early Warning', path: '/farmer/early-warning', desc: 'Microclimate weather & crop stage risk forecast' },
  { step: 3, label: '3. Hotspot Map', path: '/farmer/hotspots', desc: 'Live GIS disease & pest outbreak clusters' },
  { step: 4, label: '4. Pest Trap Monitor', path: '/farmer/pest-monitoring', desc: 'Sticky trap upload, CV count, ETL threshold' },
  { step: 5, label: '5. Expert Validation', path: '/expert/dashboard', desc: 'Agronomist clinical review, override, & prescription' },
  { step: 6, label: '6. Follow-up Timeline', path: '/farmer/follow-up', desc: 'Day 0 -> Day 3 -> Day 7 recovery tracking' },
  { step: 7, label: '7. Official Command Center', path: '/official/dashboard', desc: 'Govt Agri Department regional telemetry & incident reports' },
];

export const SihDemoController: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  return (
    <>
      {/* Floating Demo Bar Top Strip */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: '#059669',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.68rem',
              letterSpacing: '0.05em',
            }}
          >
            SIH 26131 LIVE
          </span>
          <span style={{ color: '#e2e8f0', fontWeight: 700 }}>
            Smart India Hackathon 2026 Presentation Mode
          </span>
        </div>

        {/* Demo Fast Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {DEMO_STEPS.map((s) => {
            const isActive = location.pathname.includes(s.path.replace('/farmer', '').replace('/official', '').replace('/expert', ''));
            return (
              <button
                key={s.step}
                onClick={() => navigate(s.path)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isActive ? '#059669' : 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title={s.desc}
              >
                {s.label}
              </button>
            );
          })}

          <button
            onClick={() => setShowChecklist(true)}
            style={{
              padding: '3px 10px',
              borderRadius: '6px',
              border: '1px solid #10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#6ee7b7',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ShieldCheck size={13} />
            <span>SIH Matrix (12/12)</span>
          </button>
        </div>
      </div>

      {/* SIH Requirements Coverage Checklist Modal */}
      {showChecklist && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '640px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px 28px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowChecklist(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} color="#059669" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  SIH 26131 Requirements Coverage
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Early detection and management of crop diseases and pest infestations
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SIH_REQUIREMENTS.map((req) => (
                <div
                  key={req.id}
                  onClick={() => {
                    setShowChecklist(false);
                    navigate(req.path);
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{req.icon}</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b' }}>
                      {req.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                      }}
                    >
                      ✓ 100% {req.status}
                    </span>
                    <ExternalLink size={14} color="#94a3b8" />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                All 12 Problem Statement criteria active with live and demo fallbacks.
              </span>
              <button
                onClick={() => setShowChecklist(false)}
                className="btn btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.84rem' }}
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
