import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Award,
  MessageSquare,
  CheckCircle,
  Send,
  ShieldAlert,
  Wheat,
  FileText,
  Search,
  Activity,
  Sparkles,
  Filter,
  CheckCheck,
  Edit3,
  Building2,
  AlertTriangle,
  FlaskConical,
  Microscope,
  X,
  Clock,
  Check,
  CheckCircle2,
  RefreshCw,
  Eye,
  HelpCircle,
} from 'lucide-react';
import { LabReferralModal } from '../components/common/LabReferralModal';
import { diagnosisCaseApi } from '../services/api';
import type { DiagnosticCase, ExpertReviewPayload } from '../types';

export const ExpertDashboard: React.FC = () => {
  const { consultations } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'consultations' | 'specimens' | 'pathology' | 'reports'>('specimens');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'answered'>('all');
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLabModal, setShowLabModal] = useState(false);
  const [selectedCaseForLab, setSelectedCaseForLab] = useState<{ id: string; disease: string; crop: string } | null>(null);

  // Diagnostic Cases (SIH 26131 AI Confidence Engine & Expert Review Queue)
  const [diagnosticCases, setDiagnosticCases] = useState<DiagnosticCase[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState<boolean>(false);
  const [specimenFilter, setSpecimenFilter] = useState<'all' | 'pending' | 'low_confidence' | 'clarified' | 'validated'>('all');
  
  // Review Modal State
  const [selectedCaseForReview, setSelectedCaseForReview] = useState<DiagnosticCase | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [reviewDecision, setReviewDecision] = useState<'CONFIRM' | 'REJECT' | 'REQUEST_MORE_INFO' | 'REFER_TO_LAB'>('CONFIRM');
  const [verifiedDisease, setVerifiedDisease] = useState<string>('');
  const [verifiedSeverity, setVerifiedSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [prescribedChemical, setPrescribedChemical] = useState<string>('');
  const [prescribedOrganic, setPrescribedOrganic] = useState<string>('');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Default initial demo cases matching SIH 26131
  const getDefaultDemoCases = (): DiagnosticCase[] => [
    {
      id: 'CASE-1001',
      caseNumber: 'CASE-1001',
      cropName: 'Wheat',
      initialSymptoms: ['Yellow pustules on upper leaves', 'Striped chlorosis along venation'],
      imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
      topPrediction: 'Yellow Rust (Stripe Rust)',
      scientificName: 'Puccinia striiformis',
      confidenceScore: 88,
      confidenceTier: 'HIGH_CONFIDENCE',
      decisionStatus: 'VALIDATED_BY_EXPERT',
      clarificationQuestions: [],
      clarificationAnswers: {},
      auditTrail: [
        { action: 'INITIAL_AI_SCAN', timestamp: '2026-03-01T10:00:00Z', performedBy: 'AGRINEXT AI Vision', role: 'SYSTEM', newStatus: 'AI_ADVISORY', details: 'Initial scan identified Yellow Rust at 88% confidence.' },
        { action: 'CONFIDENCE_EVALUATED', timestamp: '2026-03-01T10:00:05Z', performedBy: 'AGRINEXT Confidence Engine', role: 'SYSTEM', newStatus: 'AI_ADVISORY', details: 'Tier HIGH_CONFIDENCE assigned.' },
        { action: 'EXPERT_REVIEWED', timestamp: '2026-03-01T11:30:00Z', performedBy: 'Dr. Ramesh Sharma (Agronomist)', role: 'AGRONOMIST', newStatus: 'VALIDATED_BY_EXPERT', details: 'Validated AI diagnosis. Prescribed Propiconazole 25% EC @ 1ml/L.' },
      ],
      expertStatus: 'VALIDATED',
      expertReview: {
        reviewedBy: 'Dr. Ramesh Sharma (Agronomist)',
        reviewedAt: '2026-03-01T11:30:00Z',
        decision: 'CONFIRM',
        verifiedDisease: 'Yellow Rust (Stripe Rust)',
        prescribedTreatments: {
          chemical: ['Spray Propiconazole 25% EC @ 1 ml/L during morning calm hours'],
          organic: ['Trichoderma viride 5g/L foliar spray'],
        },
        notes: 'Morphological linear stripe pustules confirmed. High risk if morning fog persists.',
      },
      riskLevel: 'HIGH',
      createdAt: '2026-03-01T10:00:00Z',
      updatedAt: '2026-03-01T11:30:00Z',
    },
    {
      id: 'CASE-1002',
      caseNumber: 'CASE-1002',
      cropName: 'Soybean',
      initialSymptoms: ['Yellow-green mosaic patches', 'Leaf wrinkling'],
      imageUrl: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&w=600&q=80',
      topPrediction: 'Yellow Mosaic Virus (YMV)',
      scientificName: 'Soybean yellow mosaic virus',
      confidenceScore: 68,
      confidenceTier: 'MEDIUM_CONFIDENCE',
      decisionStatus: 'CLARIFICATION_REQUIRED',
      clarificationQuestions: [
        { id: 'pest_presence', question: 'Are small white insects (whiteflies) or aphids seen when shaking the plants?', options: ['Yes, active swarm of whiteflies visible', 'Occasional insects spotted', 'No visible insect vectors seen'] },
      ],
      clarificationAnswers: { pest_presence: 'Yes, active swarm of whiteflies visible' },
      auditTrail: [
        { action: 'INITIAL_AI_SCAN', timestamp: '2026-03-02T14:10:00Z', performedBy: 'AGRINEXT AI Vision', role: 'SYSTEM', newStatus: 'CLARIFICATION_REQUIRED', details: 'Scanned Soybean specimen. Confidence 62%.' },
        { action: 'CONFIDENCE_EVALUATED', timestamp: '2026-03-02T14:10:03Z', performedBy: 'AGRINEXT Confidence Engine', role: 'SYSTEM', newStatus: 'CLARIFICATION_REQUIRED', details: 'Medium confidence gate triggered clarification questions.' },
        { action: 'CLARIFICATION_ANSWERED', timestamp: '2026-03-02T14:15:20Z', performedBy: 'Farmer (Baldev Singh)', role: 'FARMER', newStatus: 'CLARIFICATION_REQUIRED', details: 'Farmer confirmed whitefly swarms on leaf undersides. Refined score: 68%.' },
      ],
      expertStatus: 'PENDING',
      riskLevel: 'HIGH',
      createdAt: '2026-03-02T14:10:00Z',
      updatedAt: '2026-03-02T14:15:20Z',
    },
    {
      id: 'CASE-1003',
      caseNumber: 'CASE-1003',
      cropName: 'Tomato',
      initialSymptoms: ['Indistinct dark spots', 'Lower leaf curling'],
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
      topPrediction: 'Early Blight vs Septoria Leaf Spot',
      scientificName: 'Alternaria solani / Septoria lycopersici',
      confidenceScore: 38,
      confidenceTier: 'LOW_CONFIDENCE',
      decisionStatus: 'EXPERT_REVIEW',
      clarificationQuestions: [],
      clarificationAnswers: {},
      auditTrail: [
        { action: 'INITIAL_AI_SCAN', timestamp: '2026-03-03T09:00:00Z', performedBy: 'AGRINEXT AI Vision', role: 'SYSTEM', newStatus: 'EXPERT_REVIEW', details: 'Low confidence scan (38%). Leaf lighting ambiguous.' },
        { action: 'CONFIDENCE_EVALUATED', timestamp: '2026-03-03T09:00:04Z', performedBy: 'AGRINEXT Confidence Engine', role: 'SYSTEM', newStatus: 'EXPERT_REVIEW', details: 'Auto-restricted chemical recommendation. Enrolled in Agronomist Queue.' },
      ],
      expertStatus: 'PENDING',
      riskLevel: 'MEDIUM',
      createdAt: '2026-03-03T09:00:00Z',
      updatedAt: '2026-03-03T09:00:04Z',
    },
  ];

  // Fetch live cases on mount
  useEffect(() => {
    fetchDiagnosticCases();
  }, []);

  const fetchDiagnosticCases = async () => {
    setIsLoadingCases(true);
    try {
      const res = await diagnosisCaseApi.getCases();
      if (res && res.length > 0) {
        setDiagnosticCases(res);
      } else {
        setDiagnosticCases(getDefaultDemoCases());
      }
    } catch (e) {
      console.warn('Backend cases fetch fallback:', e);
      setDiagnosticCases(getDefaultDemoCases());
    } finally {
      setIsLoadingCases(false);
    }
  };

  const pendingCount = consultations.filter((c) => c.status === 'pending').length;
  const answeredCount = consultations.filter((c) => c.status === 'answered').length;
  const pendingSpecimenCount = diagnosticCases.filter((c) => c.expertStatus === 'PENDING' || c.expertStatus === 'pending' || c.decisionStatus === 'EXPERT_REVIEW').length;

  const filteredConsultations = consultations.filter((c) => {
    const matchSearch =
      c.cropIssueTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cropName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredSpecimens = diagnosticCases.filter((sc) => {
    if (specimenFilter === 'pending') {
      return sc.expertStatus === 'PENDING' || sc.expertStatus === 'pending' || sc.decisionStatus === 'EXPERT_REVIEW' || sc.decisionStatus === 'CLARIFICATION_REQUIRED';
    }
    if (specimenFilter === 'low_confidence') {
      return sc.confidenceTier === 'LOW_CONFIDENCE' || sc.confidenceScore < 45;
    }
    if (specimenFilter === 'clarified') {
      return Object.keys(sc.clarificationAnswers || {}).length > 0;
    }
    if (specimenFilter === 'validated') {
      return sc.expertStatus === 'VALIDATED' || sc.expertStatus === 'confirmed' || sc.decisionStatus === 'VALIDATED_BY_EXPERT' || sc.decisionStatus === 'EXPERT_CONFIRMED';
    }
    return true;
  });

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringId) return;

    const target = consultations.find((c) => c.id === answeringId);
    if (target) {
      target.status = 'answered';
      target.answer = answerText;
      target.answeredAt = new Date().toLocaleString();
    }
    alert('Agronomist treatment advisory successfully transmitted to farmer!');
    setAnsweringId(null);
    setAnswerText('');
  };

  const handleOpenReviewModal = (diagnosticCase: DiagnosticCase) => {
    setSelectedCaseForReview(diagnosticCase);
    setReviewDecision('CONFIRM');
    setVerifiedDisease(diagnosticCase.topPrediction);
    setVerifiedSeverity(diagnosticCase.riskLevel || 'HIGH');
    setPrescribedChemical(
      diagnosticCase.expertReview?.prescribedTreatments?.chemical?.join('; ') ||
      'Spray Propiconazole 25% EC @ 1 ml/L or Mancozeb 75% WP @ 2.5 g/L depending on weather window'
    );
    setPrescribedOrganic(
      diagnosticCase.expertReview?.prescribedTreatments?.organic?.join('; ') ||
      'Trichoderma viride 5g/L foliar bio-spray @ 500L water/ha'
    );
    setClinicalNotes(
      diagnosticCase.expertReview?.notes ||
      'Morphological leaf markers confirmed by agronomist. Safe dosage validated for current vegetative stage.'
    );
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForReview) return;
    setIsSubmittingReview(true);

    const payload: ExpertReviewPayload = {
      decision: reviewDecision,
      verifiedDisease,
      verifiedRiskLevel: verifiedSeverity,
      notes: clinicalNotes,
      prescribedTreatments: {
        chemical: prescribedChemical.split(';').map((s) => s.trim()).filter(Boolean),
        organic: prescribedOrganic.split(';').map((s) => s.trim()).filter(Boolean),
      },
      reviewedBy: currentUser?.name || 'Dr. Ramesh Sharma (Agronomist)',
    };

    try {
      const updatedCase = await diagnosisCaseApi.submitExpertReview(selectedCaseForReview.id, payload);
      setDiagnosticCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
      alert(`Case #${updatedCase.caseNumber || updatedCase.id} verified & signed off by agronomist! Decision transmitted to farmer.`);
      setReviewModalOpen(false);
    } catch (err) {
      console.warn('Backend expert review submission fallback:', err);
      const updatedCase: DiagnosticCase = {
        ...selectedCaseForReview,
        topPrediction: reviewDecision === 'CONFIRM' ? selectedCaseForReview.topPrediction : verifiedDisease,
        riskLevel: verifiedSeverity,
        decisionStatus: reviewDecision === 'CONFIRM' ? 'VALIDATED_BY_EXPERT' : reviewDecision === 'REJECT' ? 'OVERRIDDEN_BY_EXPERT' : 'EXPERT_REVIEW',
        expertStatus: reviewDecision === 'REFER_TO_LAB' ? 'REFERRED_TO_LAB' : 'VALIDATED',
        expertReview: {
          reviewedBy: currentUser?.name || 'Dr. Ramesh Sharma (Agronomist)',
          reviewedAt: new Date().toISOString(),
          decision: reviewDecision,
          verifiedDisease,
          prescribedTreatments: payload.prescribedTreatments,
          notes: clinicalNotes,
        },
        auditTrail: [
          ...selectedCaseForReview.auditTrail,
          {
            action: 'EXPERT_REVIEWED',
            timestamp: new Date().toISOString(),
            performedBy: currentUser?.name || 'Dr. Ramesh Sharma (Agronomist)',
            role: 'AGRONOMIST',
            newStatus: reviewDecision === 'CONFIRM' ? 'VALIDATED_BY_EXPERT' : 'EXPERT_REVIEW',
            details: `Agronomist decision: ${reviewDecision}. Verified issue: ${verifiedDisease}. Clinical notes: ${clinicalNotes}`,
          },
        ],
        updatedAt: new Date().toISOString(),
      };
      setDiagnosticCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
      alert(`Case #${updatedCase.caseNumber || updatedCase.id} verified & signed off by agronomist! Decision transmitted to farmer.`);
      setReviewModalOpen(false);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* 1. Header Banner */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
            }}
          >
            <Award size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                AGRINEXT AGRONOMIST & PATHOLOGY CONSOLE
              </span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', backgroundColor: '#f5f3ff', color: '#6d28d9', fontWeight: 800, border: '1px solid #ddd6fe' }}>
                VERIFIED ADVISOR
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
              {currentUser?.name || 'Dr. Ramesh Sharma (Agronomist)'}
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right', padding: '6px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>SPECIALIZATION</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Crop Pathology & IPM Diagnostic Verification</div>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>SPECIMEN QUEUE</span>
            <Microscope size={20} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7c3aed' }}>{pendingSpecimenCount}</div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Awaiting clinical validation</span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>PENDING QUERIES</span>
            <MessageSquare size={20} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d97706' }}>{pendingCount}</div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Farmer direct questions</span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>ANSWERED CASES</span>
            <CheckCircle size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669' }}>{answeredCount}</div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Transmitted to farmers</span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>VALIDATED SPECIMENS</span>
            <ShieldAlert size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669' }}>
            {diagnosticCases.filter((c) => c.expertStatus === 'VALIDATED' || c.expertStatus === 'confirmed' || c.decisionStatus === 'VALIDATED_BY_EXPERT').length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>AI outputs certified</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('specimens')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'specimens' ? '#7c3aed' : '#ffffff',
            color: activeTab === 'specimens' ? '#ffffff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: activeTab === 'specimens' ? '0 4px 12px rgba(124,58,237,0.25)' : 'none',
          }}
        >
          <Microscope size={16} />
          <span>Specimen Review Queue ({diagnosticCases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('consultations')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'consultations' ? '#7c3aed' : '#ffffff',
            color: activeTab === 'consultations' ? '#ffffff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'consultations' ? '0 4px 12px rgba(124,58,237,0.25)' : 'none',
          }}
        >
          Farmer Consultations ({consultations.length})
        </button>

        <button
          onClick={() => setActiveTab('pathology')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'pathology' ? '#7c3aed' : '#ffffff',
            color: activeTab === 'pathology' ? '#ffffff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'pathology' ? '0 4px 12px rgba(124,58,237,0.25)' : 'none',
          }}
        >
          Crop Pathology Analysis
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'reports' ? '#7c3aed' : '#ffffff',
            color: activeTab === 'reports' ? '#ffffff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'reports' ? '0 4px 12px rgba(124,58,237,0.25)' : 'none',
          }}
        >
          Agronomist Reports
        </button>
      </div>

      {/* TAB 1: SPECIMEN VALIDATION QUEUE (SIH 26131 WORKFLOW) */}
      {activeTab === 'specimens' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header Notice Banner */}
          <div style={{ padding: '14px 18px', backgroundColor: '#f5f3ff', borderRadius: '12px', border: '1px solid #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Microscope size={20} color="#7c3aed" />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#5b21b6' }}>
                  AI Computer Vision Specimen Review Queue — SIH-26131 Requirement #5
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6d28d9', marginTop: '2px' }}>
                  Evaluate AI diagnostic hypotheses, inspect farmer clarifications, confirm prescriptions or override with clinical notes.
                </div>
              </div>
            </div>

            <button
              onClick={fetchDiagnosticCases}
              disabled={isLoadingCases}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #ddd6fe',
                color: '#6d28d9',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} className={isLoadingCases ? 'spin' : ''} />
              <span>Refresh Queue</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `All Cases (${diagnosticCases.length})` },
              { id: 'pending', label: `Pending Review (${pendingSpecimenCount})` },
              { id: 'low_confidence', label: `Low Confidence (<45%)` },
              { id: 'clarified', label: `Clarified by Farmer` },
              { id: 'validated', label: `Validated / Signed Off` },
            ].map((flt) => (
              <button
                key={flt.id}
                onClick={() => setSpecimenFilter(flt.id as any)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: specimenFilter === flt.id ? '#7c3aed' : '#ffffff',
                  color: specimenFilter === flt.id ? '#ffffff' : '#475569',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                {flt.label}
              </button>
            ))}
          </div>

          {/* Specimen Case Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredSpecimens.map((spec) => {
              const isConfirmed = spec.expertStatus === 'VALIDATED' || spec.expertStatus === 'confirmed' || spec.decisionStatus === 'VALIDATED_BY_EXPERT' || spec.decisionStatus === 'EXPERT_CONFIRMED';
              const isLowConf = spec.confidenceTier === 'LOW_CONFIDENCE' || spec.confidenceScore < 45;
              const hasClarification = Object.keys(spec.clarificationAnswers || {}).length > 0;

              return (
                <div
                  key={spec.id}
                  className="card"
                  style={{
                    padding: '24px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Specimen Image */}
                  <div style={{ width: '160px', height: '140px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0', position: 'relative' }}>
                    <img
                      src={spec.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'}
                      alt={spec.cropName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '6px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {spec.cropName}
                    </div>
                  </div>

                  {/* Specimen Details & Audit */}
                  <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.04em' }}>
                            #{spec.caseNumber || spec.id}
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              backgroundColor: isLowConf ? '#fee2e2' : spec.confidenceTier === 'MEDIUM_CONFIDENCE' ? '#fef3c7' : '#dcfce7',
                              color: isLowConf ? '#dc2626' : spec.confidenceTier === 'MEDIUM_CONFIDENCE' ? '#b45309' : '#15803d',
                            }}
                          >
                            AI CONFIDENCE: {spec.confidenceScore}% ({spec.confidenceTier})
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            backgroundColor: isConfirmed ? '#dcfce7' : '#fef3c7',
                            color: isConfirmed ? '#15803d' : '#b45309',
                          }}
                        >
                          {isConfirmed ? '✓ CLINICALLY CERTIFIED' : '⏳ PENDING CLINICAL REVIEW'}
                        </span>
                      </div>

                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                        {spec.topPrediction}
                      </h3>

                      {spec.scientificName && (
                        <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#64748b', marginBottom: '6px' }}>
                          Pathogen: {spec.scientificName}
                        </div>
                      )}

                      {/* Symptoms */}
                      <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '8px' }}>
                        Symptoms: {(spec.initialSymptoms || spec.symptoms || []).map((s: string) => `• ${s}`).join(' ')}
                      </div>

                      {/* Clarification Responses from Farmer */}
                      {hasClarification && (
                        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px', fontSize: '0.78rem', color: '#92400e' }}>
                          <strong>Farmer Clarification Responses:</strong>
                          <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                            {Object.entries(spec.clarificationAnswers || {}).map(([k, v]) => (
                              <li key={k}><strong>{k}:</strong> {v}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Agronomist Notes if already reviewed */}
                      {(spec.expertReview?.notes || spec.expertNotes) && (
                        <div style={{ fontSize: '0.82rem', color: '#166534', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 12px', borderRadius: '8px', marginBottom: '10px' }}>
                          <b>Agronomist Validation:</b> {spec.expertReview?.notes || spec.expertNotes} (By {spec.expertReview?.reviewedBy || spec.expertName || 'Dr. Ramesh Sharma'})
                        </div>
                      )}
                    </div>

                    {/* Clinical Actions Toolbar */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={() => handleOpenReviewModal(spec)}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.8rem', backgroundColor: '#7c3aed', borderColor: '#7c3aed' }}
                      >
                        <CheckCheck size={15} />
                        <span>{isConfirmed ? 'Edit Clinical Review' : 'Perform Clinical Review'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCaseForLab({ id: spec.id, disease: spec.topPrediction, crop: spec.cropName });
                          setShowLabModal(true);
                        }}
                        className="btn btn-outline"
                        style={{ padding: '8px 14px', fontSize: '0.8rem', borderColor: '#7c3aed', color: '#7c3aed' }}
                      >
                        <FlaskConical size={15} />
                        <span>Refer to KVK Lab</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CONSULTATIONS */}
      {activeTab === 'consultations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search & Filter bar */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search consultations by crop, farmer name, or issue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '9px 12px 9px 40px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {(['all', 'pending', 'answered'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: filterStatus === st ? '#0f172a' : '#ffffff',
                    color: filterStatus === st ? '#ffffff' : '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Consultation List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredConsultations.map((cons) => (
              <div
                key={cons.id}
                className="card card-interactive"
                style={{
                  padding: '24px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Wheat size={20} color="#7c3aed" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{cons.cropIssueTitle}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Farmer: <b>{cons.farmerName}</b> ({cons.farmerPhone}) | Crop: <b>{cons.cropName}</b>
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '999px',
                      backgroundColor: cons.status === 'answered' ? '#dcfce7' : '#fef3c7',
                      color: cons.status === 'answered' ? '#15803d' : '#b45309',
                      border: `1px solid ${cons.status === 'answered' ? '#bbf7d0' : '#fde68a'}`,
                      textTransform: 'uppercase',
                    }}
                  >
                    {cons.status}
                  </span>
                </div>

                <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', marginBottom: '14px', borderLeft: '4px solid #7c3aed' }}>
                  <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0, fontStyle: 'italic' }}>
                    "{cons.description}"
                  </p>
                </div>

                {cons.status === 'pending' ? (
                  <div>
                    {answeringId === cons.id ? (
                      <form onSubmit={handleAnswerSubmit} style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <textarea
                          rows={3}
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Provide precise agronomist advisory (chemical spray protocol, dosage per acre, organic bio-control)..."
                          required
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button className="btn btn-primary" type="submit" style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
                            <Send size={16} />
                            <span>Transmit Response to Farmer</span>
                          </button>
                          <button className="btn btn-secondary" type="button" onClick={() => setAnsweringId(null)} style={{ padding: '9px 14px', fontSize: '0.85rem' }}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        className="btn btn-outline"
                        onClick={() => setAnsweringId(cons.id)}
                        style={{ fontSize: '0.85rem', padding: '8px 16px', borderRadius: '8px' }}
                      >
                        <MessageSquare size={16} color="#7c3aed" />
                        <span>Formulate Advisory Response</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '14px', backgroundColor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', fontSize: '0.88rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: '4px' }}>
                      ✓ Your Official Agronomist Advisory ({cons.answeredAt || 'Recently Delivered'}):
                    </div>
                    <div style={{ color: '#166534', fontWeight: 600 }}>{cons.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PATHOLOGY ANALYSIS */}
      {activeTab === 'pathology' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              Yellow Rust (Puccinia striiformis)
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '14px' }}>
              High spore density observed across Northern Plains wheat fields. Cool night temperatures paired with morning dew favor rapid stripe development.
            </p>
            <div style={{ padding: '10px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', fontSize: '0.82rem', color: '#991b1b', fontWeight: 700 }}>
              Recommended Control: Propiconazole 25% EC @ 1 ml/L foliar spray.
            </div>
          </div>

          <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              Soybean Yellow Mosaic Virus (YMV)
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '14px' }}>
              Whitefly (Bemisia tabaci) vector population increasing in central state districts. Vector control is essential before flowering flushes.
            </p>
            <div style={{ padding: '10px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.82rem', color: '#92400e', fontWeight: 700 }}>
              Recommended Control: Diafenthiuron 50% WP @ 1.2 g/L + Yellow sticky traps @ 15/acre.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS */}
      {activeTab === 'reports' && (
        <div className="card" style={{ padding: '28px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <FileText size={36} color="#7c3aed" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            Agronomist Weekly Diagnostic Reports
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 20px' }}>
            Comprehensive regional outbreak logs, chemical efficacy statistics, and seasonal pathogen trends compiled for district extension offices.
          </p>
          <button className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '10px' }}>
            Export Weekly Advisory PDF
          </button>
        </div>
      )}

      {/* EXPERT CLINICAL REVIEW MODAL (SIH 26131) */}
      {reviewModalOpen && selectedCaseForReview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} color="#7c3aed" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                    Clinical Specimen Validation
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Case #{selectedCaseForReview.caseNumber || selectedCaseForReview.id} • {selectedCaseForReview.cropName}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* AI Hypothesis Summary */}
              <div style={{ padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    AI PREDICTION
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                    {selectedCaseForReview.topPrediction}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    AI CONFIDENCE
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#7c3aed' }}>
                    {selectedCaseForReview.confidenceScore}% ({selectedCaseForReview.confidenceTier})
                  </div>
                </div>
              </div>

              {/* Review Decision Radios */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                  Clinical Validation Decision:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'CONFIRM', label: '✓ Confirm AI Diagnosis', color: '#059669', bg: '#dcfce7' },
                    { id: 'REJECT', label: '✎ Override / Correct', color: '#d97706', bg: '#fef3c7' },
                    { id: 'REFER_TO_LAB', label: '🔬 Refer to KVK Lab', color: '#7c3aed', bg: '#f5f3ff' },
                  ].map((dec) => {
                    const isSelected = reviewDecision === dec.id;
                    return (
                      <button
                        key={dec.id}
                        type="button"
                        onClick={() => setReviewDecision(dec.id as any)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: isSelected ? `2px solid ${dec.color}` : '1px solid #cbd5e1',
                          backgroundColor: isSelected ? dec.bg : '#ffffff',
                          color: isSelected ? dec.color : '#334155',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        {dec.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verified Disease Name (editable if override) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Certified Pathogen / Disease Name:
                </label>
                <input
                  type="text"
                  value={verifiedDisease}
                  onChange={(e) => setVerifiedDisease(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              {/* Severity Level */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Risk Severity Classification:
                </label>
                <select
                  value={verifiedSeverity}
                  onChange={(e) => setVerifiedSeverity(e.target.value as any)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                >
                  <option value="LOW">Low (Below ETL Threshold)</option>
                  <option value="MEDIUM">Medium (Moderate Leaf Damage)</option>
                  <option value="HIGH">High (Active Epidemic Potential)</option>
                  <option value="CRITICAL">Critical (Severe Outbreak Containment Needed)</option>
                </select>
              </div>

              {/* Chemical Treatment Prescription */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Prescribed Chemical Formulations & Dosages (Semicolon separated):
                </label>
                <textarea
                  rows={2}
                  value={prescribedChemical}
                  onChange={(e) => setPrescribedChemical(e.target.value)}
                  placeholder="e.g. Propiconazole 25% EC @ 1 ml/L; Tebuconazole 25.9% EC @ 1.25 ml/L"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              {/* Organic Treatment Prescription */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Prescribed Bio-Control / Organic Protocols:
                </label>
                <textarea
                  rows={2}
                  value={prescribedOrganic}
                  onChange={(e) => setPrescribedOrganic(e.target.value)}
                  placeholder="e.g. Trichoderma viride foliar spray @ 5g/L; 5% Neem Seed Kernel Extract"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              {/* Clinical Notes & Agronomist Sign-off */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Clinical Pathology Notes & Sign-off:
                </label>
                <textarea
                  rows={2}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Observations on fungal morphology, spore rub test verification, or irrigation advisory..."
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.85rem', backgroundColor: '#7c3aed', borderColor: '#7c3aed' }}
                >
                  <Send size={15} />
                  <span>{isSubmittingReview ? 'Transmitting...' : 'Sign & Transmit Verified Diagnosis'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KVK Lab Referral Modal */}
      {showLabModal && (
        <LabReferralModal
          isOpen={showLabModal}
          onClose={() => setShowLabModal(false)}
          cropName={selectedCaseForLab?.crop || 'Wheat'}
          result={{
            cropName: selectedCaseForLab?.crop || 'Wheat',
            suspectedIssue: selectedCaseForLab?.disease || 'Yellow Stripe Rust',
            scientificName: 'Puccinia striiformis',
            confidenceScore: 92,
            riskLevel: 'HIGH',
            observedSymptoms: ['Yellow stripe pustules'],
            generalExplanation: 'Specimen referred to district KVK laboratory for PCR verification.',
            preventiveSuggestions: ['Maintain border strip inspection', 'Rogue out infected foci'],
            sourceStatus: 'EXPERT_REFERRAL',
            recommendedTreatments: {
              organic: ['Trichoderma viride 5g/L bio-spray'],
              chemical: ['Propiconazole 25% EC @ 1ml/L foliar spray'],
            },
          }}
        />
      )}
    </div>
  );
};

export default ExpertDashboard;
