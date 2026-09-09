import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { sihApi } from '../services/api';
import { sampleHotspots } from '../services/mockData';
import {
  MapPin,
  Filter,
  Search,
  AlertTriangle,
  Bug,
  ShieldAlert,
  Layers,
  Calendar,
  Activity,
  Maximize2,
  RefreshCw,
  Plus,
  Info,
} from 'lucide-react';
import type { IHotspot } from '../types';

export const HotspotMapPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [hotspots, setHotspots] = useState<IHotspot[]>(sampleHotspots);
  const [selectedHotspot, setSelectedHotspot] = useState<IHotspot | null>(sampleHotspots[0]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'disease' | 'pest'>('all');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHotspots = async () => {
      setLoading(true);
      try {
        const data = await sihApi.getHotspots();
        if (data && data.length > 0) {
          setHotspots(data);
          setSelectedHotspot(data[0]);
        }
      } catch (err) {
        console.warn('[Hotspots] Using local mock dataset:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHotspots();
  }, []);

  const filteredHotspots = hotspots.filter((h) => {
    const matchCategory = categoryFilter === 'all' || h.category === categoryFilter;
    const matchCrop = cropFilter === 'all' || h.crop.toLowerCase() === cropFilter.toLowerCase();
    const matchSeverity = severityFilter === 'all' || h.severity === severityFilter;
    const matchSearch =
      h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.pathogenOrPest.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchCrop && matchSeverity && matchSearch;
  });

  const getSeverityPill = (severity: string) => {
    switch (severity) {
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

  const totalReportedCases = filteredHotspots.reduce((acc, h) => acc + h.reportedCases, 0);
  const totalAcreage = filteredHotspots.reduce((acc, h) => acc + h.affectedAreaAcres, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* 1. Header */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
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
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            AGRINEXT GEOSPATIAL INTELLIGENCE
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '4px 0' }}>
            {t('hotspotMapTitle', 'Geospatial Disease & Pest Hotspot Map')}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: 0 }}>
            {t('hotspotMapDesc', 'Interactive GIS visualization of regional epidemic clusters, reported case density, and outbreak contagion radius.')}
          </p>
        </div>

        {/* Quick Aggregates */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>ACTIVE CLUSTERS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f87171' }}>{filteredHotspots.length}</div>
          </div>
          <div style={{ padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>REPORTED CASES</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>{totalReportedCases}</div>
          </div>
          <div style={{ padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>SURVEILLANCE ACRES</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4ade80' }}>{totalAcreage} Ac</div>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search district, state, pathogen, or crop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'disease', 'pest'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: categoryFilter === cat ? '#0f172a' : '#f1f5f9',
                color: categoryFilter === cat ? '#ffffff' : '#475569',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {cat === 'all' ? 'All Outbreaks' : cat === 'disease' ? '🦠 Diseases' : '🐛 Pests'}
            </button>
          ))}
        </div>

        {/* Crop Filter */}
        <select
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
        >
          <option value="all">All Crops</option>
          <option value="Wheat">Wheat</option>
          <option value="Cotton">Cotton</option>
          <option value="Paddy">Paddy</option>
          <option value="Tomato">Tomato</option>
          <option value="Maize">Maize</option>
          <option value="Mustard">Mustard</option>
        </select>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700 }}
        >
          <option value="all">All Severities</option>
          <option value="CRITICAL">Critical Alerts</option>
          <option value="HIGH">High Severity</option>
          <option value="MEDIUM">Moderate</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* 3. Interactive GIS Map Simulation Canvas & Side Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Visual Map Canvas Card */}
        <div
          className="card"
          style={{
            minHeight: '440px',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* Map Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', backgroundColor: 'rgba(15,23,42,0.8)', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(56,189,248,0.3)' }}>
              🛰️ GIS SATELLITE TELEMETRY OVERLAY
            </span>

            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                North-Central India Sector
              </span>
            </div>
          </div>

          {/* SVG Map Graphic with Interactive Pins */}
          <div style={{ position: 'relative', height: '320px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%' }}>
              {/* Background Geographic Contour Lines */}
              <path
                d="M 150,80 Q 280,60 400,100 T 650,140 Q 720,240 680,380 T 450,460 Q 280,480 180,380 Z"
                fill="rgba(30, 41, 59, 0.6)"
                stroke="rgba(71, 85, 105, 0.4)"
                strokeWidth="2"
              />
              <path
                d="M 220,120 Q 320,110 460,150 T 580,260 Q 520,380 380,400 T 240,300 Z"
                fill="rgba(51, 65, 85, 0.4)"
                stroke="rgba(100, 116, 139, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* State Grid Lines */}
              <line x1="300" y1="100" x2="350" y2="400" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1" />
              <line x1="450" y1="120" x2="480" y2="420" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1" />
              <line x1="200" y1="260" x2="650" y2="280" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1" />

              {/* Render Hotspot Pins & Radius Waves */}
              {filteredHotspots.map((h, i) => {
                // Map lat/long to SVG Coordinates roughly for North/Central India
                // Punjab ~ (280, 160), Haryana ~ (340, 200), UP ~ (480, 240), MP ~ (420, 340), Rajasthan ~ (260, 260)
                let x = 280 + (i % 3) * 110 + (i * 15);
                let y = 140 + (i * 45) % 240;

                if (h.district === 'Ludhiana') { x = 260; y = 150; }
                else if (h.district === 'Bathinda') { x = 220; y = 180; }
                else if (h.district === 'Karnal') { x = 330; y = 190; }
                else if (h.district === 'Chhindwara') { x = 430; y = 350; }
                else if (h.district === 'Varanasi') { x = 540; y = 260; }
                else if (h.district === 'Bharatpur') { x = 290; y = 240; }

                const isSelected = selectedHotspot?.id === h.id;
                const pinColor = h.severity === 'CRITICAL' ? '#ef4444' : h.severity === 'HIGH' ? '#f97316' : '#eab308';

                return (
                  <g key={h.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedHotspot(h)}>
                    {/* Pulsing Radiation Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={h.radiusKm * 2.2}
                      fill={pinColor}
                      fillOpacity={isSelected ? 0.28 : 0.14}
                      stroke={pinColor}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isSelected ? 'none' : '3 3'}
                    />

                    {/* Central Core Pin */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 9 : 6}
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Pin Label */}
                    <text
                      x={x + 12}
                      y={y + 4}
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                    >
                      {h.district} ({h.reportedCases})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(15,23,42,0.85)', padding: '10px 14px', borderRadius: '10px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', gap: '14px', fontSize: '0.74rem', fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f87171' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} /> Critical Outbreak
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fb923c' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f97316' }} /> High Risk
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#facc15' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }} /> Moderate Cluster
              </span>
            </div>

            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Click pin to inspect hotspot telemetry</span>
          </div>
        </div>

        {/* Selected Hotspot Detailed Dossier Panel */}
        {selectedHotspot && (
          <div
            className="card"
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            {(() => {
              const pill = getSeverityPill(selectedHotspot.severity);
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', backgroundColor: pill.bg, color: pill.text }}>
                        {selectedHotspot.severity} SEVERITY
                      </span>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '6px 0 2px 0' }}>
                        {selectedHotspot.title}
                      </h2>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        📍 {selectedHotspot.district}, {selectedHotspot.state} ({selectedHotspot.latitude.toFixed(3)}°N, {selectedHotspot.longitude.toFixed(3)}°E)
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: selectedHotspot.category === 'disease' ? '#059669' : '#d97706', textTransform: 'uppercase' }}>
                      {selectedHotspot.category === 'disease' ? '🦠 Fungal Disease' : '🐛 Pest Infestation'}
                    </span>
                  </div>

                  {/* Hotspot Specimen Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '14px' }}>
                    <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Host Crop</span>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedHotspot.crop}</div>
                    </div>

                    <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Reported Cases</span>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: '#dc2626', marginTop: '2px' }}>{selectedHotspot.reportedCases} Reports</div>
                    </div>

                    <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Contagion Radius</span>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedHotspot.radiusKm} km</div>
                    </div>

                    <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Affected Land</span>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedHotspot.affectedAreaAcres} Acres</div>
                    </div>
                  </div>

                  {/* Primary Pathogen/Pest */}
                  <div style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                      Identified Pathogen / Pest Organism:
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#064e3b', marginTop: '2px' }}>
                      {selectedHotspot.pathogenOrPest}
                    </div>
                  </div>

                  {/* Containment Protocol */}
                  <div style={{ marginTop: '14px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                      Regional Containment Advisory:
                    </span>
                    <ul style={{ paddingLeft: '18px', margin: '6px 0 0 0', fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li>Broadcast early warning advisory to farmers within a {selectedHotspot.radiusKm}km perimeter radius.</li>
                      <li>Deploy bio-control agents and install yellow/pheromone surveillance traps immediately.</li>
                      <li>Postpone excessive nitrogen fertilizer application to limit canopy susceptibility.</li>
                    </ul>
                  </div>
                </div>
              );
            })()}

            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => alert(`Containment advisory broadcast triggered for ${selectedHotspot.district} district!`)}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '0.84rem', fontWeight: 800 }}
              >
                Broadcast Containment Alert
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
