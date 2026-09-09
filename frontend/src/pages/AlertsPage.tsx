import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { alertApi } from '../services/api';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  CheckCheck,
  Filter,
  Trash2,
  Sun,
  ShieldAlert,
  Bug,
  Droplets,
  Activity,
  ArrowRight,
} from 'lucide-react';
import type { Alert, AlertSeverity, AlertType } from '../types';

export const AlertsPage: React.FC = () => {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const fallbackAlerts: Alert[] = [
    {
      id: 'alt-1',
      title: 'High Pest Risk: Whitefly Infestation Influx',
      description: 'Elevated humidity in Sanwer block creates favorable microclimate for whitefly multiplication in soybean and cotton.',
      severity: 'HIGH',
      type: 'PEST',
      farmId: 'farm-1',
      cropId: 'crop-2',
      read: false,
      actionableStep: 'Install yellow sticky traps (15-20/acre) and inspect lower foliage.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'alt-2',
      title: 'Irrigation Advisory: Critical Soil Moisture Threshold',
      description: 'Wheat plot is entering active grain filling. Ensure timely 3rd irrigation round within 48 hours to avert kernel shriveling.',
      severity: 'MEDIUM',
      type: 'IRRIGATION',
      farmId: 'farm-1',
      cropId: 'crop-1',
      read: false,
      actionableStep: 'Activate drip irrigation grid for 3.5 hours during early morning.',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'alt-3',
      title: 'Weather Warning: Unseasonal Rain Expected in District',
      description: 'IMD regional radar indicates 35% to 70% probability of light to moderate showers in the next 36 hours.',
      severity: 'CRITICAL',
      type: 'WEATHER',
      read: false,
      actionableStep: 'Defer chemical top-dressing and inspect plot drainage ditches.',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'alt-4',
      title: 'Crop Risk: Yellow Rust Spore Warning in Region',
      description: 'Neighboring blocks report localized stripe rust on susceptible wheat cultivars.',
      severity: 'LOW',
      type: 'DISEASE',
      farmId: 'farm-2',
      read: true,
      actionableStep: 'Keep Propiconazole 25% EC on standby if yellow powdery lines appear.',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ];

  const loadAlerts = async () => {
    try {
      const data = await alertApi.getAll();
      setAlerts(data.length > 0 ? data : fallbackAlerts);
    } catch {
      setAlerts(fallbackAlerts);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleMarkRead = async (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    try {
      await alertApi.markRead(id);
    } catch {
      // Local state already updated
    }
  };

  const handleMarkAllRead = async () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    try {
      await alertApi.markAllRead();
    } catch {
      // Local state already updated
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    return matchSeverity && matchType;
  });

  const getSeverityStyle = (sev: AlertSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' };
      case 'HIGH':
        return { bg: '#ffedd5', text: '#c2410c', border: '#fdba74' };
      case 'MEDIUM':
        return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
      case 'LOW':
        return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
    }
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'WEATHER':
        return <Sun size={18} color="#0284c7" />;
      case 'DISEASE':
        return <ShieldAlert size={18} color="#dc2626" />;
      case 'PEST':
        return <Bug size={18} color="#d97706" />;
      case 'IRRIGATION':
        return <Droplets size={18} color="#059669" />;
      case 'CROP_RISK':
        return <Activity size={18} color="#7c3aed" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            {t('alerts.title', 'Farm Alerts & Early Warning Engine')}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
            {t('alerts.subtitle', 'Real-time telemetry alerts, threshold notifications, disease spore warnings, and irrigation advisories.')}
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={handleMarkAllRead}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px' }}
        >
          <CheckCheck size={18} color="#059669" />
          <span>{t('alerts.markAllRead', 'Mark All Read')}</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginRight: '4px' }}>SEVERITY:</span>
          {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: severityFilter === s ? '#0f172a' : 'transparent',
                color: severityFilter === s ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginRight: '4px' }}>TYPE:</span>
          {['all', 'DISEASE', 'PEST', 'WEATHER', 'IRRIGATION', 'CROP_RISK'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: typeFilter === t ? '#059669' : 'transparent',
                color: typeFilter === t ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const sev = getSeverityStyle(alert.severity);
            return (
              <div
                key={alert.id}
                className="card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderLeft: `5px solid ${sev.text}`,
                  backgroundColor: alert.read ? '#ffffff' : '#f8fafc',
                  opacity: alert.read ? 0.85 : 1,
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    {getTypeIcon(alert.type)}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          backgroundColor: sev.bg,
                          color: sev.text,
                          border: `1px solid ${sev.border}`,
                          padding: '2px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        {alert.severity}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        {alert.type.replace('_', ' ')}
                      </span>
                      {!alert.read && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                      {alert.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                      {alert.description}
                    </p>

                    {alert.actionableStep && (
                      <div style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.82rem', color: '#166534', fontWeight: 600 }}>
                        💡 <strong>Action Required:</strong> {alert.actionableStep}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!alert.read && (
                    <button
                      className="btn btn-outline"
                      onClick={() => handleMarkRead(alert.id)}
                      style={{ padding: '4px 10px', fontSize: '0.78rem', borderRadius: '6px' }}
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <CheckCircle size={48} color="#a7f3d0" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669' }}>
              All clear! No pending alerts for the selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
