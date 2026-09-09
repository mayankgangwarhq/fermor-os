import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { sihApi } from '../services/api';
import { sampleOfficialStats } from '../services/mockData';
import {
  Building2,
  ShieldAlert,
  Users,
  Activity,
  MapPin,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Bug,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { OfficialStats } from '../types';

const COLORS = ['#059669', '#0284c7', '#d97706', '#dc2626', '#8b5cf6'];

export const OfficialDashboardPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<OfficialStats>(sampleOfficialStats);
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await sihApi.getOfficialStats();
        if (data) setStats(data);
      } catch (err) {
        console.warn('[OfficialDashboard] Using mock stats:', err);
      }
    };
    loadStats();
  }, []);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'District,Crop,Pathogen,ReportedCases,Severity,Status\n' +
      stats.recentHotspots
        .map((h) => `${h.district},${h.crop},${h.pathogenOrPest},${h.reportedCases},${h.severity},${h.status}`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `District_Agri_Incident_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* 1. Executive Header */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            }}
          >
            <Building2 size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                GOVERNMENT OF INDIA • DEPARTMENT OF AGRICULTURE & FARMERS WELFARE
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', margin: '2px 0' }}>
              {t('officialDashboardTitle', 'Agriculture Department Outbreak Control Center')}
            </h1>
            <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              State & District Level Disease Surveillance, Containment Protocol, and Extension Oversight
            </span>
          </div>
        </div>

        {/* Export & Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExportCSV}
            className="btn"
            style={{
              padding: '9px 16px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={15} />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={() => window.print()}
            className="btn"
            style={{
              padding: '9px 16px',
              borderRadius: '10px',
              backgroundColor: '#4f46e5',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Printer size={15} />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* 2. Top Telemetry KPI Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', borderLeft: '4px solid #4f46e5' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>TOTAL REPORTED CASES</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
            {stats.totalReportedCases}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>+12% vs last fortnight</span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', borderLeft: '4px solid #dc2626' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>ACTIVE OUTBREAK CLUSTERS</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#dc2626', marginTop: '4px' }}>
            {stats.activeOutbreaks} Zones
          </div>
          <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>4 High-risk districts</span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>EXPERT VERIFIED</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
            {stats.verifiedCases}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{stats.pendingVerification} pending review</span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', borderLeft: '4px solid #0284c7' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>AVG AGRONOMIST SLA</span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>
            {stats.avgResponseTimeHours} hrs
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>98.4% within 6h SLA</span>
        </div>
      </div>

      {/* 3. Recharts Analytics Graphs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Outbreak Incidence Trajectory Line Chart */}
        <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Regional Outbreak Incidence Trajectory (2025-26)
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Fungal vs Insect Pest epidemic progression</span>
          </div>

          <div style={{ width: '100%', height: '230px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyIncidentTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="fungal" name="Fungal Rust/Blight" stroke="#dc2626" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="insect" name="Insect Pest/Borer" stroke="#d97706" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop-wise Case Distribution Bar Chart */}
        <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Crop-Wise Infection Distribution
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Number of reported disease & pest occurrences</span>
          </div>

          <div style={{ width: '100%', height: '230px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.cropDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="crop" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="cases" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Active Hotspots Surveillance Table */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              District Outbreak Surveillance Hotlist
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Real-time cluster radius and containment status</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>District / State</th>
                <th style={{ padding: '10px 12px' }}>Host Crop</th>
                <th style={{ padding: '10px 12px' }}>Pathogen / Pest Organism</th>
                <th style={{ padding: '10px 12px' }}>Reported Cases</th>
                <th style={{ padding: '10px 12px' }}>Severity Level</th>
                <th style={{ padding: '10px 12px' }}>Containment Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentHotspots.map((h) => (
                <tr key={h.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px', fontWeight: 800, color: '#0f172a' }}>
                    {h.district}, {h.state}
                  </td>
                  <td style={{ padding: '12px', color: '#334155', fontWeight: 700 }}>
                    {h.crop}
                  </td>
                  <td style={{ padding: '12px', color: '#059669', fontWeight: 800 }}>
                    {h.pathogenOrPest}
                  </td>
                  <td style={{ padding: '12px', color: '#dc2626', fontWeight: 900 }}>
                    {h.reportedCases} cases
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: h.severity === 'CRITICAL' ? '#fee2e2' : h.severity === 'HIGH' ? '#ffedd5' : '#fef9c3',
                        color: h.severity === 'CRITICAL' ? '#dc2626' : h.severity === 'HIGH' ? '#c2410c' : '#854d0e',
                      }}
                    >
                      {h.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: h.status === 'active' ? '#dc2626' : '#059669' }}>
                      ● {h.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
