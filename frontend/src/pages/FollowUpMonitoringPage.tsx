import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { sihApi } from '../services/api';
import { sampleFollowUps } from '../services/mockData';
import { FieldConfirmationModal } from '../components/common/FieldConfirmationModal';
import {
  Calendar,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Upload,
  Camera,
  Activity,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  FileCheck,
  Layers,
  Leaf,
  Clock,
} from 'lucide-react';
import type { IFollowUp } from '../types';

export const FollowUpMonitoringPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [followUps, setFollowUps] = useState<IFollowUp[]>(sampleFollowUps);
  const [selectedCase, setSelectedCase] = useState<IFollowUp>(sampleFollowUps[0]);
  const [activeStageTab, setActiveStageTab] = useState<'Day 0' | 'Day 3' | 'Day 7'>('Day 3');
  const [day3NotesInput, setDay3NotesInput] = useState('');
  const [day3StatusInput, setDay3StatusInput] = useState<'Improving' | 'Stable' | 'Worsened'>('Improving');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const loadFollowUps = async () => {
      try {
        const data = await sihApi.getFollowUps();
        if (data && data.length > 0) {
          setFollowUps(data);
          setSelectedCase(data[0]);
        }
      } catch (err) {
        console.warn('[FollowUp] Using sample follow-ups:', err);
      }
    };
    loadFollowUps();
  }, []);

  const handleSaveDayProgress = (stage: 'Day 3' | 'Day 7') => {
    const updated = { ...selectedCase };
    if (stage === 'Day 3') {
      updated.day3Date = new Date().toISOString().split('T')[0];
      updated.day3Status = day3StatusInput;
      updated.day3Notes = day3NotesInput || 'Treatment applied as scheduled. Symptoms stabilizing.';
      updated.day3Image = uploadedPhoto || selectedCase.day0Image;
      updated.currentStage = 'Day 3';
      updated.overallTrend = day3StatusInput === 'Improving' ? 'Improvement' : day3StatusInput === 'Worsened' ? 'Worsening' : 'Stable';
    } else {
      updated.day7Date = new Date().toISOString().split('T')[0];
      updated.day7Status = 'Healed';
      updated.day7Notes = 'Full resolution achieved with standard biological IPM protocol.';
      updated.day7Image = uploadedPhoto || selectedCase.day0Image;
      updated.currentStage = 'Day 7';
      updated.overallTrend = 'Improvement';
    }

    setSelectedCase(updated);
    const listUpdated = followUps.map((f) => (f.id === updated.id ? updated : f));
    setFollowUps(listUpdated);
    sihApi.updateFollowUp({
      caseId: updated.caseId,
      stage,
      status: updated.day3Status,
      notes: updated.day3Notes,
      image: updated.day3Image,
    }).catch((e) => console.warn(e));

    alert(`${stage} follow-up inspection recorded!`);
  };

  const getTrendBadge = (trend: string) => {
    if (trend === 'Improvement') {
      return { bg: '#dcfce7', text: '#15803d', label: '✓ RECOVERING / IMPROVING' };
    } else if (trend === 'Worsening') {
      return { bg: '#fee2e2', text: '#dc2626', label: '⚠️ SPREADING / WORSENED' };
    }
    return { bg: '#eff6ff', text: '#1d4ed8', label: 'ℹ️ STABLE / MONITORED' };
  };

  const trendBadge = getTrendBadge(selectedCase.overallTrend);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* 1. Header */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #047857 0%, #059669 60%, #10b981 100%)',
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
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            AGRINEXT DISEASE RESOLUTION PIPELINE
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '4px 0' }}>
            {t('followUpTitle', 'Disease Follow-Up & Recovery Monitoring')}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#d1fae5', margin: 0 }}>
            {t('followUpDesc', 'Structured 7-day post-diagnostic timeline tracking symptom remission, treatment efficacy, and field resolution.')}
          </p>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <FileCheck size={18} color="#059669" />
          <span>{t('confirmAiDiagnosis', 'Confirm AI Diagnosis')}</span>
        </button>
      </div>

      {/* 2. Active Case Selector Ribbon */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        {followUps.map((f) => {
          const isSelected = selectedCase.id === f.id;
          return (
            <div
              key={f.id}
              onClick={() => setSelectedCase(f)}
              className="card"
              style={{
                minWidth: '240px',
                padding: '14px 18px',
                borderRadius: '14px',
                cursor: 'pointer',
                border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>{f.cropName}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#e2e8f0', color: '#475569' }}>
                  {f.currentStage}
                </span>
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{f.initialDisease}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Farmer: {f.farmerName}</div>
            </div>
          );
        })}
      </div>

      {/* 3. Follow-Up Day 0 -> Day 3 -> Day 7 Progression Track */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              {selectedCase.cropName} — {selectedCase.initialDisease}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Case Reference: {selectedCase.caseId}</span>
          </div>

          <span
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              backgroundColor: trendBadge.bg,
              color: trendBadge.text,
              fontSize: '0.8rem',
              fontWeight: 800,
            }}
          >
            {trendBadge.label}
          </span>
        </div>

        {/* 3-Step Milestone Progression Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', position: 'relative' }}>
          {/* Day 0 Card */}
          <div
            onClick={() => setActiveStageTab('Day 0')}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: activeStageTab === 'Day 0' ? '2px solid #059669' : '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#059669', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✓
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Day 0: Initial Scan</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: {selectedCase.day0Date}</div>
            <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>Diagnosis Confirmed</div>
          </div>

          {/* Day 3 Card */}
          <div
            onClick={() => setActiveStageTab('Day 3')}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: activeStageTab === 'Day 3' ? '2px solid #059669' : '1px solid #e2e8f0',
              backgroundColor: selectedCase.day3Date ? '#f0fdf4' : '#fffbeb',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: selectedCase.day3Date ? '#059669' : '#d97706', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedCase.day3Date ? '✓' : '2'}
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Day 3: Mid-Check</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedCase.day3Date || 'Due in 3 days'}</div>
            <div style={{ fontSize: '0.78rem', color: selectedCase.day3Date ? '#166534' : '#d97706', fontWeight: 700, marginTop: '4px' }}>
              {selectedCase.day3Status || 'Inspection Pending'}
            </div>
          </div>

          {/* Day 7 Card */}
          <div
            onClick={() => setActiveStageTab('Day 7')}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: activeStageTab === 'Day 7' ? '2px solid #059669' : '1px solid #e2e8f0',
              backgroundColor: selectedCase.day7Date ? '#f0fdf4' : '#f8fafc',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: selectedCase.day7Date ? '#059669' : '#94a3b8', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedCase.day7Date ? '✓' : '3'}
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Day 7: Resolution</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedCase.day7Date || 'Final Check'}</div>
            <div style={{ fontSize: '0.78rem', color: selectedCase.day7Date ? '#166534' : '#64748b', fontWeight: 700, marginTop: '4px' }}>
              {selectedCase.day7Status || 'Awaiting Stage 3'}
            </div>
          </div>
        </div>

        {/* Active Stage Inspection View */}
        <div style={{ marginTop: '24px', padding: '20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
            {activeStageTab} Inspection & Treatment Efficacy Log
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Left: Specimen Snapshot Comparison */}
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Specimen Imagery (Before vs Now):
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                  <img
                    src={selectedCase.day0Image || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'}
                    alt="Day 0"
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '4px 8px', fontSize: '0.72rem', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: 700, textAlign: 'center' }}>
                    Day 0: Initial Spotting
                  </div>
                </div>

                <div style={{ flex: 1, borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1', position: 'relative' }}>
                  <img
                    src={uploadedPhoto || selectedCase.day3Image || selectedCase.day0Image || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'}
                    alt="Current"
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '4px 8px', fontSize: '0.72rem', backgroundColor: '#059669', color: '#ffffff', fontWeight: 700, textAlign: 'center' }}>
                    {activeStageTab} Photo
                  </div>
                </div>
              </div>

              {/* Photo Upload Trigger */}
              <label
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px dashed #059669',
                  backgroundColor: '#f0fdf4',
                  color: '#059669',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <Upload size={14} />
                <span>Upload New {activeStageTab} Inspection Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setUploadedPhoto(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            {/* Right: Observation Status & Log Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Recovery Status Assessment:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['Improving', 'Stable', 'Worsened'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setDay3StatusInput(st)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: day3StatusInput === st ? '2px solid #059669' : '1px solid #cbd5e1',
                        backgroundColor: day3StatusInput === st ? '#f0fdf4' : '#ffffff',
                        color: day3StatusInput === st ? '#166534' : '#475569',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      {st === 'Improving' ? '🌿 Improving' : st === 'Worsened' ? '⚠️ Worsened' : '⏸️ Stable'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Agronomic Observations & Notes:
                </label>
                <textarea
                  rows={2}
                  value={day3NotesInput || selectedCase.day3Notes || ''}
                  onChange={(e) => setDay3NotesInput(e.target.value)}
                  placeholder="e.g. Applied 5% Neem extract, spots drying up, no new lesions on top flush..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', resize: 'none' }}
                />
              </div>

              <button
                type="button"
                onClick={() => handleSaveDayProgress(activeStageTab === 'Day 7' ? 'Day 7' : 'Day 3')}
                className="btn btn-primary"
                style={{ padding: '9px 16px', fontSize: '0.84rem', fontWeight: 800, alignSelf: 'flex-start' }}
              >
                Log {activeStageTab} Progress
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Field Confirmation Modal */}
      {showConfirmModal && (
        <FieldConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          caseId={selectedCase.caseId}
          aiDiagnosis={selectedCase.initialDisease}
          cropName={selectedCase.cropName}
        />
      )}
    </div>
  );
};
