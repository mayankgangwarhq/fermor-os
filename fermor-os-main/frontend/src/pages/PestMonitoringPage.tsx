import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { pestApi, sihApi } from '../services/api';
import { samplePestObservations } from '../services/mockData';
import {
  Bug,
  AlertTriangle,
  ShieldCheck,
  Search,
  Filter,
  Leaf,
  Info,
  Camera,
  Upload,
  Activity,
  TrendingUp,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { PestData, IPestObservation } from '../types';

export const PestMonitoringPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'catalog' | 'trap_monitoring'>('trap_monitoring');
  const [pests, setPests] = useState<PestData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedPest, setSelectedPest] = useState<PestData | null>(null);

  // Trap Monitoring State
  const [observations, setObservations] = useState<IPestObservation[]>(samplePestObservations);
  const [trapCrop, setTrapCrop] = useState('Cotton');
  const [trapType, setTrapType] = useState<'Sticky Trap' | 'Pheromone Trap' | 'Light Trap' | 'Field Specimen'>('Sticky Trap');
  const [trapPhoto, setTrapPhoto] = useState<string | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  const [countedPest, setCountedPest] = useState<{
    pestName: string;
    count: number;
    etlStatus: 'BELOW_ETL' | 'NEAR_ETL' | 'EXCEEDED_ETL';
    confidence: number;
    advisory: string;
  } | null>(null);

  useEffect(() => {
    const fetchPests = async () => {
      try {
        const data = await pestApi.getAll();
        setPests(data);
        if (data.length > 0) {
          setSelectedPest(data[0]);
        }
      } catch (err) {
        console.warn('[PestMonitoring] Using local fallback:', err);
      }
    };
    fetchPests();
  }, []);

  const fallbackPests: PestData[] = [
    {
      id: 'p-1',
      cropName: 'Cotton & Soybean',
      pestName: 'Whitefly (Bemisia tabaci)',
      scientificName: 'Bemisia tabaci',
      identification: [
        'Tiny 1-2mm moth-like insect with pure white powdery wings',
        'Clusters found on lower surface of young leaves',
      ],
      symptoms: [
        'Chlorotic spots on foliage due to continuous sap sucking',
        'Black sooty mold fungus on honeydew deposits',
        'Transmission of Cotton Leaf Curl & Yellow Mosaic viruses',
      ],
      management: [
        'Install yellow sticky traps @ 15-20 traps/acre',
        'Spray Diafenthiuron 50% WP @ 1.2 g/L during threshold exceedance',
      ],
      organicControl: [
        '5% Neem Seed Kernel Extract (NSKE) foliar spray',
        'Conserve natural predators like ladybird beetles',
      ],
      riskLevel: 'HIGH',
      seasonalPeak: 'July - October',
    },
    {
      id: 'p-2',
      cropName: 'Maize & Sugarcane',
      pestName: 'Fall Armyworm',
      scientificName: 'Spodoptera frugiperda',
      identification: [
        'Inverted Y-shape mark on head capsule of mature caterpillar',
        'Four dark spots arranged in square on 8th abdominal segment',
      ],
      symptoms: [
        'Extensive ragged shot-holes in whorl leaves with sawdust-like frass',
        'Damaged central growing point (dead-heart symptom)',
      ],
      management: [
        'Pheromone traps @ 5 traps/acre for adult monitoring',
        'Apply Emamectin Benzoate 5% SG @ 0.4 g/L into whorls',
      ],
      organicControl: [
        'Bacillus thuringiensis (Bt) kurstaki formulation @ 2 g/L',
        'Intercropping with Cowpea (push-pull strategy)',
      ],
      riskLevel: 'CRITICAL',
      seasonalPeak: 'Kharif & Rabi whorl stages',
    },
    {
      id: 'p-3',
      cropName: 'Mustard & Vegetables',
      pestName: 'Aphids (Mahun)',
      scientificName: 'Lipaphis erysimi',
      identification: [
        'Small, soft-bodied yellowish-green or grey pear-shaped insects',
        'Dense colonies on tender shoots, flowers, and siliquae',
      ],
      symptoms: [
        'Leaf curling and stunted plant vigor',
        'Poor seed setting and shriveled grain formation',
      ],
      management: [
        'Spray Dimethoate 30% EC @ 1.5 ml/L of water',
        'Spray Imidacloprid 17.8% SL @ 0.5 ml/L in late afternoon',
      ],
      organicControl: [
        'Spray 2% soap solution (10g soap in 1L water)',
        'Early sowing in 1st fortnight of October to escape aphid build-up',
      ],
      riskLevel: 'MEDIUM',
      seasonalPeak: 'December - February',
    },
  ];

  const pestList = pests.length > 0 ? pests : fallbackPests;

  const filteredPests = pestList.filter((p) => {
    const matchesSearch =
      p.pestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cropName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRisk === 'all' || p.riskLevel === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  const activePest = selectedPest || filteredPests[0] || fallbackPests[0];

  const handleAnalyzeTrapPhoto = () => {
    setIsCounting(true);
    setTimeout(() => {
      setIsCounting(false);
      let pName = 'Whitefly (Bemisia tabaci)';
      let count = 28;
      let etl: 'BELOW_ETL' | 'NEAR_ETL' | 'EXCEEDED_ETL' = 'EXCEEDED_ETL';
      let adv = 'Exceeds Economic Threshold Level (8 adults/leaf). Deploy yellow sticky traps @ 20/acre and apply 5% NSKE.';

      if (trapCrop === 'Maize') {
        pName = 'Fall Armyworm (Spodoptera frugiperda)';
        count = 14;
        etl = 'NEAR_ETL';
        adv = 'Approaching critical threshold. Release egg parasitoids Trichogramma @ 50,000/acre.';
      } else if (trapCrop === 'Mustard') {
        pName = 'Mustard Aphid (Lipaphis erysimi)';
        count = 6;
        etl = 'BELOW_ETL';
        adv = 'Population below ETL. Continue periodic trap monitoring twice weekly.';
      }

      const result = {
        pestName: pName,
        count,
        etlStatus: etl,
        confidence: 94,
        advisory: adv,
      };

      setCountedPest(result);

      const newObs: IPestObservation = {
        id: `pest-obs-${Date.now()}`,
        farmerId: 'farmer-101',
        cropName: trapCrop,
        trapType,
        pestName: pName,
        estimatedCount: count,
        etlStatus: etl,
        imageUrl: trapPhoto || undefined,
        location: { district: 'Bathinda', state: 'Punjab' },
        severity: etl === 'EXCEEDED_ETL' ? 'HIGH' : etl === 'NEAR_ETL' ? 'MEDIUM' : 'LOW',
        observationDate: new Date().toISOString().split('T')[0],
        notes: `AI Trap Count: ${count} insects detected. ${adv}`,
        recommendedAction: adv,
      };

      setObservations([newObs, ...observations]);
      sihApi.createPestObservation(newObs).catch((e) => console.warn(e));
    }, 1200);
  };

  const trapTrendData = [
    { date: 'Aug 22', count: 4, etlLimit: 10 },
    { date: 'Aug 26', count: 7, etlLimit: 10 },
    { date: 'Aug 30', count: 9, etlLimit: 10 },
    { date: 'Sep 02', count: 18, etlLimit: 10 },
    { date: 'Sep 05', count: 28, etlLimit: 10 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* 1. Header */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 25px -5px rgba(180, 83, 9, 0.35)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fde68a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            SIH 26131 PEST INTELLIGENCE ENGINE
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '4px 0' }}>
            {t('pestMonitoringTitle', 'Pest Monitoring & Trap Imagery Analysis')}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#fef3c7', margin: 0 }}>
            {t('pestMonitoringDesc', 'Upload pest-trap photos, run computer vision count estimation, assess ETL thresholds, and view weekly population trajectories.')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px' }}>
          <button
            onClick={() => setActiveTab('trap_monitoring')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'trap_monitoring' ? '#ffffff' : 'transparent',
              color: activeTab === 'trap_monitoring' ? '#78350f' : '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            📸 Trap AI Counter
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'catalog' ? '#ffffff' : 'transparent',
              color: activeTab === 'catalog' ? '#78350f' : '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            🐛 Pest Biology & IPM
          </button>
        </div>
      </div>

      {activeTab === 'trap_monitoring' ? (
        /* TRAP MONITORING & CV COUNTING TAB */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Upload & Run Analysis Card */}
            <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="#b45309" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Upload Pest Trap / Specimen Photo
                </h3>
              </div>

              {/* Crop & Trap Type Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Host Crop
                  </label>
                  <select
                    value={trapCrop}
                    onChange={(e) => setTrapCrop(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', fontWeight: 700 }}
                  >
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Mustard">Mustard</option>
                    <option value="Paddy">Paddy</option>
                    <option value="Tomato">Tomato</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Trap Mechanism
                  </label>
                  <select
                    value={trapType}
                    onChange={(e: any) => setTrapType(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', fontWeight: 700 }}
                  >
                    <option value="Sticky Trap">Yellow Sticky Trap</option>
                    <option value="Pheromone Trap">Pheromone Funnel Lure</option>
                    <option value="Light Trap">Solar Light Trap</option>
                    <option value="Field Specimen">Leaf Surface Photo</option>
                  </select>
                </div>
              </div>

              {/* Photo Dropzone */}
              <div
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {trapPhoto ? (
                  <img src={trapPhoto} alt="Trap preview" style={{ maxHeight: '180px', width: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                    <Upload size={32} color="#94a3b8" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Click to select trap / insect photo</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Supports JPG, PNG (Max 10MB)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setTrapPhoto(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>

              {/* Quick Sample Presets */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrapCrop('Cotton');
                    setTrapPhoto('https://images.unsplash.com/photo-1599818816933-4f9958ebc072?auto=format&fit=crop&w=600&q=80');
                  }}
                  style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  🟡 Cotton Whitefly Trap
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrapCrop('Maize');
                    setTrapPhoto('https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80');
                  }}
                  style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  🟢 Maize Armyworm Lure
                </button>
              </div>

              <button
                type="button"
                onClick={handleAnalyzeTrapPhoto}
                disabled={isCounting}
                className="btn btn-primary"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  backgroundColor: '#b45309',
                  borderColor: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={16} />
                <span>{isCounting ? 'Analyzing Trap Density...' : 'Run Computer Vision Pest Count'}</span>
              </button>
            </div>

            {/* Analysis Result Output */}
            <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                  AUTOMATED CV PEST ESTIMATION (DEMO PIPELINE)
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 12px 0' }}>
                  {countedPest ? countedPest.pestName : 'Awaiting Trap Image Submission'}
                </h3>

                {countedPest ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#78350f', textTransform: 'uppercase' }}>Estimated Trap Count</span>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#92400e', marginTop: '2px' }}>
                          {countedPest.count} <span style={{ fontSize: '0.85rem' }}>insects</span>
                        </div>
                      </div>

                      <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: countedPest.etlStatus === 'EXCEEDED_ETL' ? '#fee2e2' : '#f0fdf4', border: '1px solid #fca5a5' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: countedPest.etlStatus === 'EXCEEDED_ETL' ? '#991b1b' : '#166534', textTransform: 'uppercase' }}>ETL Threshold Status</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: countedPest.etlStatus === 'EXCEEDED_ETL' ? '#dc2626' : '#15803d', marginTop: '4px' }}>
                          {countedPest.etlStatus === 'EXCEEDED_ETL' ? '⚠️ EXCEEDED' : '✓ SAFE'}
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                        🌾 IPM Action Protocol:
                      </span>
                      <div style={{ color: '#475569', lineHeight: 1.4 }}>{countedPest.advisory}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94a3b8' }}>
                    <Bug size={40} color="#cbd5e1" style={{ margin: '0 auto 10px auto' }} />
                    <p style={{ fontSize: '0.85rem' }}>Upload or select a preset trap image on the left to trigger computer vision pest counting.</p>
                  </div>
                )}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                Note: Image-based trap counts represent AI computer vision estimations. Calibrate against manual square-inch lens grid checks.
              </div>
            </div>
          </div>

          {/* Weekly Trap Population Trajectory Chart */}
          <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Weekly Pest Trap Count Population Trajectory
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Comparing weekly trap counts against the Economic Threshold Level (ETL) limit
                </span>
              </div>
            </div>

            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trapTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" name="Observed Trap Count" stroke="#b45309" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="etlLimit" name="Economic Threshold Limit" stroke="#dc2626" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        /* PEST BIOLOGY & IPM CATALOG TAB */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Pest Selector List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredPests.map((pest) => {
              const isSelected = activePest?.id === pest.id || activePest?.pestName === pest.pestName;
              return (
                <div
                  key={pest.id || pest.pestName}
                  className="card"
                  onClick={() => setSelectedPest(pest)}
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #b45309' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#fef3c7' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bug size={20} color="#b45309" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>{pest.pestName}</h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Host: {pest.cropName}</span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      backgroundColor: pest.riskLevel === 'CRITICAL' ? '#fee2e2' : pest.riskLevel === 'HIGH' ? '#ffedd5' : '#fef9c3',
                      color: pest.riskLevel === 'CRITICAL' ? '#dc2626' : pest.riskLevel === 'HIGH' ? '#c2410c' : '#854d0e',
                    }}
                  >
                    {pest.riskLevel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Pest Detail View */}
          {activePest && (
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                    Host: {activePest.cropName}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                    {activePest.pestName}
                  </h2>
                  {activePest.scientificName && (
                    <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#64748b' }}>
                      Scientific name: {activePest.scientificName}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Peak Period
                  </span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                    {activePest.seasonalPeak || 'Kharif / Rabi'}
                  </div>
                </div>
              </div>

              {/* Identification Key */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  🔍 Morphological Identification:
                </h4>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.84rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {activePest.identification.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Damage Symptoms */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  ⚠️ Damage Symptoms on Crop:
                </h4>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.84rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {activePest.symptoms.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Management Protocols */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                    🌿 Organic & Biological
                  </span>
                  <ul style={{ paddingLeft: '16px', margin: '6px 0 0 0', fontSize: '0.8rem', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {activePest.organicControl.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                    ⚡ Threshold Chemical Spray
                  </span>
                  <ul style={{ paddingLeft: '16px', margin: '6px 0 0 0', fontSize: '0.8rem', color: '#78350f', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {activePest.management.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
