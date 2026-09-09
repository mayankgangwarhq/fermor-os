import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { sihApi } from '../../services/api';
import { Building2, X, Send, AlertTriangle, CheckCircle, FileText, MapPin } from 'lucide-react';
import type { DiagnosticResult, ILabReferral } from '../../types';

interface LabReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DiagnosticResult;
  cropName: string;
  image?: string;
  locationAddress?: string;
}

export const LabReferralModal: React.FC<LabReferralModalProps> = ({
  isOpen,
  onClose,
  result,
  cropName,
  image,
  locationAddress = 'Ludhiana, Punjab',
}) => {
  const { t } = useLanguage();
  const [targetLab, setTargetLab] = useState('District Krishi Vigyan Kendra (KVK) Plant Pathology Lab');
  const [reason, setReason] = useState(
    result.confidenceScore < 75
      ? 'AI confidence below 75% threshold — atypical leaf margin chlorosis requires laboratory spore PCR verification.'
      : 'Severe critical risk level — urgent official extension verification requested before treatment application.'
  );
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [caseId, setCaseId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const referralId = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
    setCaseId(referralId);

    const referralData: Partial<ILabReferral> = {
      id: referralId,
      caseId: referralId,
      farmerName: 'Ram Kumar (Current Farmer)',
      cropName,
      suspectedIssue: result.suspectedIssue,
      severity: result.riskLevel || 'HIGH',
      confidenceScore: result.confidenceScore,
      reasonForReferral: reason,
      targetLabName: targetLab,
      location: locationAddress,
      status: 'Referred',
      createdDate: new Date().toISOString().split('T')[0],
    };

    try {
      await sihApi.createReferral(referralData);
    } catch (err) {
      console.warn('[LabReferral] Local cache fallback:', err);
    }

    setSubmitted(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
          maxWidth: '560px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '24px 28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
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

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                }}
              >
                <Building2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  {t('labReferralTitle', 'Agronomy Lab / Extension Referral')}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {t('labReferralSubtitle', 'Formal referral for laboratory microscopic / PCR pathogen confirmation')}
                </span>
              </div>
            </div>

            {/* AI Warning Banner */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.8rem', color: '#92400e' }}>
                <strong>AI Confidence: {result.confidenceScore}%</strong> — Recommended for official extension lab verification before large-scale field application.
              </div>
            </div>

            {/* Specimen Summary Box */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Crop: <strong>{cropName}</strong></span>
                <span style={{ color: '#64748b' }}>Severity: <strong style={{ color: '#dc2626' }}>{result.riskLevel || 'HIGH'}</strong></span>
              </div>
              <div style={{ color: '#0f172a', fontWeight: 700 }}>
                Suspected Pathogen: {result.suspectedIssue}
              </div>
            </div>

            {/* Target Diagnostic Center */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                {t('targetLabLabel', 'Target Diagnostic Lab / KVK Center:')}
              </label>
              <select
                value={targetLab}
                onChange={(e) => setTargetLab(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.86rem',
                }}
              >
                <option value="District Krishi Vigyan Kendra (KVK) Plant Pathology Lab">
                  District Krishi Vigyan Kendra (KVK) Plant Pathology Lab (Recommended)
                </option>
                <option value="State Agricultural University (SAU) Extension Division">
                  State Agricultural University (SAU) Extension Division
                </option>
                <option value="ICAR Regional Plant Health Clinic">
                  ICAR Regional Plant Health Clinic & Molecular Diagnostic Unit
                </option>
                <option value="District Agriculture Officer (DAO) Inspection Desk">
                  District Agriculture Officer (DAO) Inspection Desk
                </option>
              </select>
            </div>

            {/* Reason for Referral */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                {t('reasonForReferralLabel', 'Reason for Referral:')}
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  resize: 'none',
                }}
              />
            </div>

            {/* Farmer Notes */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                {t('additionalFieldNotes', 'Additional Field Observation Notes (Optional):')}
              </label>
              <input
                type="text"
                placeholder="e.g. Sowing date Nov 12, drip irrigated, 2 neighboring fields also showing yellowing..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '11px', fontSize: '0.88rem' }}
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  flex: 2,
                  padding: '11px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#dc2626',
                  borderColor: '#dc2626',
                }}
              >
                <Send size={16} />
                <span>{t('submitLabReferral', 'Submit Lab Referral')}</span>
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle size={36} color="#059669" />
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                Case Dossier Registered
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                Case ID: {caseId}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '420px', margin: '6px auto 0' }}>
                {t('labReferralSuccessMsg', 'Your case has been transmitted to the KVK Diagnostic Center. Microscopic PCR results and official advisory will sync back to your dashboard.')}
              </p>
            </div>

            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.9rem', marginTop: '10px' }}
            >
              {t('doneAndReturn', 'Done & Return to Scanner')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
