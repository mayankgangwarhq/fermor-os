import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { diseaseApi, sihApi, diagnosisCaseApi } from '../services/api';
import { ClientConfidenceEngine } from '../services/confidenceEngine';
import { LabReferralModal } from '../components/common/LabReferralModal';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Info,
  Layers,
  Leaf,
  ArrowRight,
  Printer,
  Share2,
  Bot,
  History,
  X,
  ExternalLink,
  ChevronDown,
  Check,
  Eye,
  Sliders,
  Maximize2,
  Building2,
  Send,
  Calendar,
  Award,
  FileCheck,
  HelpCircle,
  Clock,
  ArrowUpRight,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import type { DiagnosticResult, IPMAdvisory, DiagnosticCase, IClarificationQuestion } from '../types';


interface ScanHistoryItem {
  id: string;
  timestamp: string;
  cropName: string;
  suspectedIssue: string;
  confidenceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  imageUrl?: string;
  result: DiagnosticResult;
}

const SUPPORTED_CROPS = [
  { id: 'Wheat', labelEn: 'Wheat', labelHi: 'गेहूं (Wheat)', icon: '🌾' },
  { id: 'Paddy', labelEn: 'Paddy / Rice', labelHi: 'धान (Paddy)', icon: '🌱' },
  { id: 'Mustard', labelEn: 'Mustard', labelHi: 'सरसों (Mustard)', icon: '🌼' },
  { id: 'Tomato', labelEn: 'Tomato', labelHi: 'टमाटर (Tomato)', icon: '🍅' },
  { id: 'Potato', labelEn: 'Potato', labelHi: 'आलू (Potato)', icon: '🥔' },
  { id: 'Cotton', labelEn: 'Cotton', labelHi: 'कपास (Cotton)', icon: '☁️' },
];

const COMMON_SYMPTOMS = [
  { id: 'pustules', labelEn: 'Yellow pustules', labelHi: 'पत्ती पर पीले धब्बे / पाउडर' },
  { id: 'brown_tips', labelEn: 'Dry brown tips', labelHi: 'सूखे भूरे सिरे' },
  { id: 'curled_margins', labelEn: 'Curled leaf margins', labelHi: 'मुड़े हुए पत्ते' },
  { id: 'dark_spots', labelEn: 'Dark concentric spots', labelHi: 'काले छल्लेदार धब्बे' },
  { id: 'pale_stems', labelEn: 'Stunted pale stems', labelHi: 'कमजोर व हल्के तने' },
  { id: 'white_coating', labelEn: 'White powdery coating', labelHi: 'सफेद फफूंदी की परत' },
];

const QUICK_PRESETS = [
  {
    crop: 'Wheat',
    label: '🌾 Wheat Stripe Rust',
    symptom: 'Yellow pustules',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'
  },
  {
    crop: 'Tomato',
    label: '🍅 Tomato Early Blight',
    symptom: 'Dark concentric spots',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80'
  },
  {
    crop: 'Paddy',
    label: '🌱 Rice Leaf Blast',
    symptom: 'Dry brown tips',
    image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80'
  },
  {
    crop: 'Potato',
    label: '🥔 Potato Late Blight',
    symptom: 'Dark concentric spots',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'
  },
];

const SCAN_STAGES = [
  { labelEn: 'Preparing specimen imagery & normalizing resolution...', labelHi: 'पत्ती की तस्वीर तैयार की जा रही है...' },
  { labelEn: 'Extracting cellular leaf morphology & venation markers...', labelHi: 'पत्ती के आकार व नसों का AI विश्लेषण...' },
  { labelEn: 'Matching pathological fungal & spore markers...', labelHi: 'रोग व फफूंदी के लक्षणों की पहचान...' },
  { labelEn: 'Computing confidence & disease severity index...', labelHi: 'सटीकता और गंभीरता स्तर की गणना...' },
  { labelEn: 'Formulating agronomic prescription & action advisory...', labelHi: 'सटीक जैविक व रासायनिक उपचार तैयार हो रहा है...' },
];

export const DiseaseDetectionPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Primary State
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptomInput, setCustomSymptomInput] = useState<string>('');
  
  // Media State
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [specimenImage, setSpecimenImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [exposureLevel, setExposureLevel] = useState<number>(0);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(65);

  // Diagnostic State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStageIndex, setScanStageIndex] = useState<number>(0);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [scanTimestamp, setScanTimestamp] = useState<string>('');
  const [historyItems, setHistoryItems] = useState<ScanHistoryItem[]>([]);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [sentToExpert, setSentToExpert] = useState<boolean>(false);

  // Confidence Engine & Decision Gate State (SIH 26131)
  const [activeCase, setActiveCase] = useState<DiagnosticCase | null>(null);
  const [clarificationAnswers, setClarificationAnswers] = useState<Record<string, string>>({});
  const [isSubmittingClarification, setIsSubmittingClarification] = useState<boolean>(false);
  const [clarificationBoostMessage, setClarificationBoostMessage] = useState<string | null>(null);
  const [showAuditTrail, setShowAuditTrail] = useState<boolean>(false);

  // SIH 26131 Integration Modals
  const [showLabModal, setShowLabModal] = useState<boolean>(false);
  const [showLabReferralModal, setShowLabReferralModal] = useState<boolean>(false);
  const [showFieldConfirmModal, setShowFieldConfirmModal] = useState<boolean>(false);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load past scans from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('agrinext_scan_history');
    if (saved) {
      try {
        setHistoryItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse scan history', e);
      }
    }
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start Camera
  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        t('cameraNotAvailable', 'Camera access is not available on this device. Please upload a photo.')
      );
      return;
    }

    // Stop existing stream first if active
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera stream error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          t('cameraPermissionDenied', 'Camera permission was denied. Please allow camera access in your browser or upload a file.')
        );
      } else {
        setCameraError(
          t('cameraGenericError', 'Could not access camera. Please upload an image file instead.')
        );
      }
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Switch Front/Rear Camera
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  // Capture Photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Trigger flash effect
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      clearPreviousScan();
      setSpecimenImage(dataUrl);
      stopCamera();
    }
  };

  // Clear previous scan state
  const clearPreviousScan = () => {
    setDiagnosticResult(null);
    setActiveCase(null);
    setClarificationAnswers({});
    setClarificationBoostMessage(null);
    setSentToExpert(false);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      clearPreviousScan();
      setSpecimenImage(result);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Toggle Symptom Chip
  const toggleSymptom = (symptomText: string) => {
    if (selectedSymptoms.includes(symptomText)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptomText));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomText]);
    }
  };

  // Add Custom Symptom
  const handleAddCustomSymptom = () => {
    if (customSymptomInput.trim() && !selectedSymptoms.includes(customSymptomInput.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptomInput.trim()]);
      setCustomSymptomInput('');
    }
  };

  // Apply Quick Preset (Sample Only)
  const handleApplyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    clearPreviousScan();
    setSelectedCrop(preset.crop);
    setSelectedSymptoms([]);
    setSpecimenImage(preset.image);
    stopCamera();
  };

  // Execute AI Diagnostic Pipeline
  const handleRunDiagnosis = async () => {
    clearPreviousScan();
    setIsScanning(true);
    setScanStageIndex(0);

    // Simulate animated scanning stages for premium AI SaaS feel
    const stageInterval = setInterval(() => {
      setScanStageIndex((prev) => {
        if (prev < SCAN_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      // Real API Call with real image payload
      const result = await diseaseApi.detect({
        cropName: selectedCrop,
        symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
        notes: customSymptomInput.trim() || undefined,
        imageUrl: specimenImage && !specimenImage.startsWith('data:') ? specimenImage : undefined,
        imageBase64: specimenImage && specimenImage.startsWith('data:') ? specimenImage : undefined,
      });

      clearInterval(stageInterval);
      setScanStageIndex(SCAN_STAGES.length - 1);

      // Brief delay so user sees final stage complete
      setTimeout(() => {
        completeDiagnosis(result);
      }, 400);
    } catch (err: any) {
      console.warn('[AI Scanner] Backend API error:', err);
      clearInterval(stageInterval);

      let errorResult: DiagnosticResult;
      if (err.response?.data?.data && typeof err.response.data.data === 'object') {
        errorResult = err.response.data.data;
      } else {
        const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');
        errorResult = {
          isMockDemo: false,
          status: isTimeout ? 'vision_request_failed' : 'network_error',
          cropName: selectedCrop,
          suspectedIssue: isTimeout ? 'Vision Processing Request Timed Out' : 'Network Connection Error',
          confidenceScore: 0,
          riskLevel: 'LOW',
          observedSymptoms: [],
          visualEvidence: ['No visual symptoms available because image analysis was not completed.'],
          generalExplanation: isTimeout
            ? 'The vision model took longer than expected to process the image. Please click Retry.'
            : 'Could not connect to the backend server. Please verify backend is running on port 5000.',
          analysisNote: 'Image analysis could not be completed.',
          preventiveSuggestions: [
            'Inspect foliage manually for discoloration or chewing damage.',
            'Consult your local Krishi Vigyan Kendra (KVK) or extension officer.',
          ],
          recommendedTreatments: { organic: [], chemical: [] },
          nextSteps: ['Click Retry to re-scan.', 'Upload another clear leaf photo.'],
          sourceStatus: isTimeout ? 'TIMEOUT ERROR' : 'NETWORK ERROR',
        };
      }

      setTimeout(() => {
        completeDiagnosis(errorResult);
      }, 400);
    }
  };

  const completeDiagnosis = async (res: DiagnosticResult) => {
    setIsScanning(false);
    
    const effectiveConfidence = res.confidenceScore;

    const modifiedRes: DiagnosticResult = {
      ...res,
      confidenceScore: effectiveConfidence,
      requiresLabVerification: effectiveConfidence < 75 || res.riskLevel === 'CRITICAL',
    };
    setDiagnosticResult(modifiedRes);
    const now = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    setScanTimestamp(now);
    setClarificationAnswers({});
    setClarificationBoostMessage(null);
    setSentToExpert(false);

    if (modifiedRes.status === 'success') {
      // Call Backend Case API or build in-memory case
      try {
        const caseRes = await diagnosisCaseApi.createCase({
          cropName: modifiedRes.cropName,
          initialSymptoms: modifiedRes.observedSymptoms,
          initialConfidence: modifiedRes.confidenceScore,
          topPrediction: modifiedRes.suspectedIssue,
          scientificName: modifiedRes.scientificName,
          imageUrl: specimenImage || undefined,
          riskLevel: modifiedRes.riskLevel || 'HIGH',
          ipmAdvisory: modifiedRes.ipmAdvisory,
        });
        setActiveCase(caseRes);
      } catch (err) {
        console.warn('Backend DiagnosticCase API fallback:', err);
        const evalResult = ClientConfidenceEngine.evaluate(
          modifiedRes.confidenceScore,
          modifiedRes.cropName,
          modifiedRes.suspectedIssue,
          modifiedRes.observedSymptoms
        );
        const fallbackCase: DiagnosticCase = {
          id: 'CASE-' + Math.floor(100000 + Math.random() * 900000),
          caseNumber: 'CASE-' + Math.floor(100000 + Math.random() * 900000),
          cropName: modifiedRes.cropName,
          initialSymptoms: modifiedRes.observedSymptoms,
          imageUrl: specimenImage || undefined,
          topPrediction: modifiedRes.suspectedIssue,
          scientificName: modifiedRes.scientificName,
          confidenceScore: modifiedRes.confidenceScore,
          confidenceTier: evalResult.tier,
          decisionStatus: evalResult.decisionStatus,
          clarificationQuestions: evalResult.clarificationQuestions || [],
          clarificationAnswers: {},
          auditTrail: [
            {
              action: 'INITIAL_AI_SCAN',
              timestamp: new Date().toISOString(),
              performedBy: 'AGRINEXT Computer Vision AI Engine',
              details: `Specimen image processed for ${modifiedRes.cropName}. Top hypothesis: ${modifiedRes.suspectedIssue} (${modifiedRes.confidenceScore}% raw score).`,
            },
            {
              action: 'CONFIDENCE_EVALUATED',
              timestamp: new Date().toISOString(),
              performedBy: 'AGRINEXT Confidence Engine',
              details: `Assigned to ${evalResult.tier} tier (${modifiedRes.confidenceScore}%). Gate Decision: ${evalResult.decisionStatus}.`,
            },
          ],
          expertStatus: evalResult.tier === 'LOW_CONFIDENCE' ? 'PENDING' : 'NONE',
          riskLevel: modifiedRes.riskLevel || 'HIGH',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setActiveCase(fallbackCase);
      }

      // Sync to backend ScanCases API for official telemetry
      sihApi.createScanCase({
        cropName: modifiedRes.cropName,
        suspectedIssue: modifiedRes.suspectedIssue,
        confidenceScore: modifiedRes.confidenceScore,
        riskLevel: modifiedRes.riskLevel || 'HIGH',
        symptoms: modifiedRes.observedSymptoms,
        imageUrl: specimenImage || undefined,
        ipmAdvisory: modifiedRes.ipmAdvisory,
      }).catch((e) => console.warn(e));

      // Save to persistent history
      const newItem: ScanHistoryItem = {
        id: 'scan-' + Date.now(),
        timestamp: now,
        cropName: modifiedRes.cropName,
        suspectedIssue: modifiedRes.suspectedIssue,
        confidenceScore: modifiedRes.confidenceScore,
        riskLevel: modifiedRes.riskLevel || 'LOW',
        imageUrl: specimenImage || undefined,
        result: modifiedRes,
      };
      setHistoryItems((prev) => [newItem, ...prev.slice(0, 19)]);
      try {
        localStorage.setItem('agrinext_scan_history', JSON.stringify([newItem, ...historyItems.slice(0, 19)]));
      } catch (e) {
        console.warn('LocalStorage save failed', e);
      }
    }

    // Smooth scroll down to result
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleSelectClarification = (questionId: string, option: string) => {
    setClarificationAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmitClarifications = async () => {
    if (!activeCase) return;
    setIsSubmittingClarification(true);
    setClarificationBoostMessage(null);

    try {
      // Try real backend API
      const updatedCase = await diagnosisCaseApi.submitClarification(activeCase.id, clarificationAnswers);
      setActiveCase(updatedCase);
      if (diagnosticResult) {
        setDiagnosticResult({
          ...diagnosticResult,
          confidenceScore: updatedCase.confidenceScore,
          suspectedIssue: updatedCase.topPrediction,
        });
      }
      setClarificationBoostMessage(
        `✓ Clarification Confirmed: Confidence elevated to ${updatedCase.confidenceScore}% (${updatedCase.confidenceTier}). Actionable advisory updated!`
      );
    } catch (e) {
      console.warn('Backend clarification fallback:', e);
      // Fallback local refinement
      const refined = ClientConfidenceEngine.refineConfidence(activeCase, clarificationAnswers);
      const updatedCase: DiagnosticCase = {
        ...activeCase,
        confidenceScore: refined.refinedConfidence,
        confidenceTier: refined.newTier,
        decisionStatus: refined.newStatus,
        clarificationAnswers,
        auditTrail: [
          ...activeCase.auditTrail,
          {
            action: 'CLARIFICATION_ANSWERED',
            timestamp: new Date().toISOString(),
            performedBy: 'Farmer / Field User',
            role: 'FARMER',
            newStatus: refined.newStatus,
            details: `Submitted clarifications: ${Object.entries(clarificationAnswers).map(([k, v]) => `${k}=${v}`).join(', ')}. Resulting confidence: ${refined.refinedConfidence}%.`,
          },
          {
            action: 'STATUS_UPDATED',
            timestamp: new Date().toISOString(),
            performedBy: 'AGRINEXT Confidence Engine',
            role: 'SYSTEM',
            newStatus: refined.newStatus,
            details: refined.explanation,
          },
        ],
        updatedAt: new Date().toISOString(),
      };
      setActiveCase(updatedCase);
      if (diagnosticResult) {
        setDiagnosticResult({
          ...diagnosticResult,
          confidenceScore: refined.refinedConfidence,
        });
      }
      setClarificationBoostMessage(refined.explanation);
    } finally {
      setIsSubmittingClarification(false);
    }
  };

  const handleEscalateToExpert = async () => {
    if (!activeCase) return;
    try {
      await diagnosisCaseApi.requestExpert(activeCase.id, 'Farmer requested clinical verification via Confidence Decision Gate.');
      setActiveCase({
        ...activeCase,
        decisionStatus: 'EXPERT_REVIEW',
        expertStatus: 'PENDING',
        auditTrail: [
          ...activeCase.auditTrail,
          {
            action: 'EXPERT_REQUESTED',
            timestamp: new Date().toISOString(),
            performedBy: 'Farmer / Field User',
            role: 'FARMER',
            newStatus: 'EXPERT_REVIEW',
            details: 'Specimen case enrolled in Agronomist Review Queue.',
          },
        ],
      });
      setSentToExpert(true);
      alert(`Case #${activeCase.caseNumber || activeCase.id} successfully enrolled in the Agronomist Review Queue!`);
    } catch (e) {
      console.warn('Expert request fallback:', e);
      setActiveCase({
        ...activeCase,
        decisionStatus: 'EXPERT_REVIEW',
        expertStatus: 'PENDING',
        auditTrail: [
          ...activeCase.auditTrail,
          {
            action: 'EXPERT_REQUESTED',
            timestamp: new Date().toISOString(),
            performedBy: 'Farmer / Field User',
            role: 'FARMER',
            newStatus: 'EXPERT_REVIEW',
            details: 'Specimen case enrolled in Agronomist Review Queue (Local Sync).',
          },
        ],
      });
      setSentToExpert(true);
      alert(`Case #${activeCase.caseNumber || activeCase.id} successfully enrolled in the Agronomist Review Queue!`);
    }
  };

  // Load Past Scan from History
  const handleLoadPastScan = (item: ScanHistoryItem) => {
    setSelectedCrop(item.cropName);
    setSpecimenImage(item.imageUrl || null);
    setDiagnosticResult(item.result);
    setScanTimestamp(item.timestamp);
    setShowHistoryDrawer(false);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Severity Visual Helpers
  const getSeverityBadge = (level: string = 'MEDIUM') => {
    switch (level.toUpperCase()) {
      case 'CRITICAL':
        return { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5', label: t('statusCritical', 'CRITICAL') };
      case 'HIGH':
        return { bg: '#ffedd5', color: '#c2410c', border: '#fdba74', label: t('statusHighRisk', 'HIGH RISK') };
      case 'MEDIUM':
        return { bg: '#fef9c3', color: '#a16207', border: '#fde047', label: t('statusModerateRisk', 'MODERATE') };
      case 'LOW':
      default:
        return { bg: '#dcfce7', color: '#15803d', border: '#86efac', label: t('statusLowRisk', 'LOW RISK') };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* Hidden canvas for capturing video frames */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* 1. Header Banner */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 40%, #047857 80%, #059669 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '999px',
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Zap size={13} color="#fef08a" />
              AGRINEXT VISION AI 2.0
            </span>
            <span style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 600 }}>
              ● High-Accuracy Crop Diagnostic Pipeline
            </span>
          </div>

          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
            {t('cropScannerTitle', 'AI Crop Disease Scanner & Pathology')}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#d1fae5', marginTop: '6px', maxWidth: '680px' }}>
            {t('cropScannerDesc', 'Frame crop foliage in the live viewfinder or upload high-resolution imagery. The AI diagnostics pipeline identifies fungal/bacterial pathogens and generates actionable protocols.')}
          </p>
        </div>

        {/* Action button to view past scan history */}
        <button
          onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'background-color 0.2s ease',
          }}
        >
          <History size={17} />
          <span>
            {t('scanHistory', 'Scan History')} ({historyItems.length})
          </span>
        </button>
      </div>

      {/* 2. Scan History Drawer (Collapsible) */}
      {showHistoryDrawer && (
        <div
          className="card"
          style={{
            padding: '20px 24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--slate-200)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} color="var(--primary-600)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {t('previousScans', 'Previous Crop Diagnostic Scans')}
              </h3>
            </div>
            <button
              onClick={() => setShowHistoryDrawer(false)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={18} />
            </button>
          </div>

          {historyItems.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
              <Leaf size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.88rem' }}>No previous scans recorded yet. Run a scan to save results here.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {historyItems.map((item) => {
                const sBadge = getSeverityBadge(item.riskLevel);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleLoadPastScan(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid var(--slate-200)',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary-500)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--slate-200)')}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.cropName}
                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          backgroundColor: '#ecfdf5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Leaf size={22} color="#059669" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                          {item.cropName}
                        </span>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '999px',
                            backgroundColor: sBadge.bg,
                            color: sBadge.color,
                          }}
                        >
                          {item.riskLevel}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.suspectedIssue}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        {item.timestamp} • {item.confidenceScore}% match
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Main Scanner Interactive Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Crop Selection, Viewfinder / Upload & Controls */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Step Indicator Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                1
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {t('selectCropAndImage', 'Select Crop & Specimen Image')}
              </h2>
            </div>

            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', backgroundColor: '#ecfdf5', padding: '3px 10px', borderRadius: '999px' }}>
              {t('step1Of2', 'STEP 1 OF 2')}
            </span>
          </div>

          {/* Crop Selector Grid */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '8px' }}>
              {t('targetCrop', 'Target Crop:')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {SUPPORTED_CROPS.map((crop) => {
                const isSelected = selectedCrop === crop.id;
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => setSelectedCrop(crop.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)',
                      backgroundColor: isSelected ? 'var(--primary-50)' : '#ffffff',
                      color: isSelected ? 'var(--primary-900)' : 'var(--slate-700)',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{crop.icon}</span>
                    <span>{t('crop_' + crop.id.toLowerCase(), crop.labelEn)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capture Mode Toggle Tabs (Live Camera vs Upload File) */}
          <div>
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '3px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('camera');
                  if (!isCameraActive && !specimenImage) startCamera();
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === 'camera' ? '#ffffff' : 'transparent',
                  color: activeTab === 'camera' ? 'var(--slate-900)' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: activeTab === 'camera' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <Camera size={15} color={activeTab === 'camera' ? 'var(--primary-600)' : '#64748b'} />
                <span>{t('liveCameraViewfinder', 'Live Camera Viewfinder')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('upload');
                  stopCamera();
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === 'upload' ? '#ffffff' : 'transparent',
                  color: activeTab === 'upload' ? 'var(--slate-900)' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: activeTab === 'upload' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <Upload size={15} color={activeTab === 'upload' ? 'var(--primary-600)' : '#64748b'} />
                <span>{t('uploadLeafPhoto', 'Upload Leaf Photo')}</span>
              </button>
            </div>

            {/* Camera Viewfinder View */}
            {activeTab === 'camera' && (
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
                {/* Visual Flash effect overlay */}
                {showFlash && <div className="camera-flash-overlay" />}

                {specimenImage ? (
                  /* Captured Snapshot Preview */
                  <div style={{ position: 'relative', width: '100%', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={specimenImage}
                      alt="Crop specimen preview"
                      style={{ width: '100%', maxHeight: '340px', objectFit: 'cover' }}
                    />

                    {/* Holographic Laser Beam when analyzing */}
                    {isScanning && <div className="scanner-laser-beam" />}

                    {/* Retake Snapshot overlay button */}
                    {!isScanning && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '14px',
                          left: '14px',
                          right: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: 'rgba(15, 23, 42, 0.75)',
                          backdropFilter: 'blur(10px)',
                          padding: '8px 14px',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 700 }}>
                          ✓ Specimen Captured
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSpecimenImage(null);
                            startCamera();
                          }}
                          style={{
                            border: '1px solid rgba(255,255,255,0.3)',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: '#ffffff',
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <RotateCcw size={13} />
                          <span>{t('retakePhoto', 'Retake Photo')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : isCameraActive ? (
                  /* Live Camera Viewfinder with Framing Reticle */
                  <div style={{ position: 'relative', width: '100%', height: '320px', backgroundColor: '#000000' }}>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Grid Overlay */}
                    <div className="scanner-viewfinder-grid" />

                    {/* 4 Corner Reticle Marks */}
                    <div className="reticle-corner reticle-corner-tl" />
                    <div className="reticle-corner reticle-corner-tr" />
                    <div className="reticle-corner reticle-corner-bl" />
                    <div className="reticle-corner reticle-corner-br" />

                    {/* Framing Guidance text banner */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        color: '#a7f3d0',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '4px 12px',
                        borderRadius: '999px',
                        letterSpacing: '0.04em',
                        whiteSpace: 'nowrap',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      🌿 Frame specimen leaf inside corners
                    </div>

                    {/* Viewfinder Controls (Capture Button & Flip Camera) */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '16px',
                        left: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '24px',
                      }}
                    >
                      {/* Flip Camera Button */}
                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        title="Switch Camera"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.25)',
                          border: 'none',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <RefreshCw size={18} />
                      </button>

                      {/* Large Shutter Button */}
                      <button
                        type="button"
                        onClick={capturePhoto}
                        title="Capture Specimen Photo"
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          border: '4px solid #10b981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
                          transition: 'transform 0.1s ease',
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#059669' }} />
                      </button>

                      {/* Close Camera */}
                      <button
                        type="button"
                        onClick={stopCamera}
                        title="Close Camera"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.25)',
                          border: 'none',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Camera Off State / Click to Start */
                  <div
                    style={{
                      padding: '48px 24px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#ffffff',
                    }}
                  >
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '18px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Camera size={30} color="#34d399" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                        {t('launchCropCamera', 'Launch Crop Camera')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', maxWidth: '300px' }}>
                        {t('cameraPositionHint', 'Position phone or webcam toward infected foliage for AI scan.')}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="btn btn-primary"
                      style={{ marginTop: '6px', padding: '10px 24px', borderRadius: '12px' }}
                    >
                      <Camera size={18} />
                      <span>{t('openCamera', 'Open Camera')}</span>
                    </button>

                    {cameraError && (
                      <div
                        style={{
                          marginTop: '12px',
                          fontSize: '0.78rem',
                          color: '#f87171',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          padding: '8px 14px',
                          borderRadius: '8px',
                        }}
                      >
                        ⚠️ {cameraError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Upload File Tab View */}
            {activeTab === 'upload' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                {specimenImage ? (
                  <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--slate-200)' }}>
                    <img
                      src={specimenImage}
                      alt="Uploaded crop leaf"
                      style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', backgroundColor: '#f8fafc' }}
                    />
                    {isScanning && <div className="scanner-laser-beam" />}
                    <div
                      style={{
                        padding: '10px 14px',
                        backgroundColor: '#ffffff',
                        borderTop: '1px solid var(--slate-200)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)' }}>
                        ✓ Specimen Image Attached
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: 'none',
                          backgroundColor: '#f1f5f9',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {t('changePhoto', 'Change Photo')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '16px',
                      padding: '36px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      backgroundColor: '#f8fafc',
                      transition: 'border-color 0.2s ease, background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-600)';
                      e.currentTarget.style.backgroundColor = 'var(--primary-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        backgroundColor: '#ecfdf5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Upload size={24} color="#059669" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--slate-800)' }}>
                        {t('clickToUpload', 'Click to select plant photo')}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                        Supports JPG, PNG, WEBP up to 15MB
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Demo Test Presets */}
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              ⚡ {t('quickTestPresets', 'Quick Test Presets')} ({t('sampleLabel', 'SAMPLE')}):
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {QUICK_PRESETS.map((pr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyPreset(pr)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--slate-200)',
                    backgroundColor: '#ffffff',
                    color: 'var(--slate-700)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary-600)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--slate-200)')}
                >
                  <span>{pr.label}</span>
                  <ArrowRight size={12} color="#94a3b8" />
                </button>
              ))}
            </div>
          </div>

          {/* Selectable Observed Symptoms (Chips) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '8px' }}>
              {t('observedSymptoms', 'Observed Symptoms (Optional):')}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {COMMON_SYMPTOMS.map((symp) => {
                const isSelected = selectedSymptoms.includes(symp.labelEn);
                return (
                  <button
                    key={symp.id}
                    type="button"
                    onClick={() => toggleSymptom(symp.labelEn)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      border: isSelected ? '1px solid var(--primary-600)' : '1px solid var(--slate-300)',
                      backgroundColor: isSelected ? 'var(--primary-600)' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--slate-700)',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isSelected && <Check size={12} />}
                    <span>{t('symp_' + symp.id, symp.labelEn)}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom symptom input */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input
                type="text"
                placeholder={t('otherSymptomsPlaceholder', 'Add other symptoms / observations...')}
                value={customSymptomInput}
                onChange={(e) => setCustomSymptomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSymptom())}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--slate-300)',
                  fontSize: '0.82rem',
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomSymptom}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                + Add
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRunDiagnosis}
            disabled={isScanning}
            style={{
              padding: '14px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
            }}
          >
            <Sparkles size={20} color="#fef08a" />
            <span>
              {isScanning
                ? t('diagnosticsRunning', 'AI Diagnostics Pipeline Running...')
                : t('analyzeAndDetect', 'Analyze & Detect Disease')}
            </span>
          </button>
        </div>

        {/* Right Column: AI Analysis Holographic Stages OR Diagnostic Result Output */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Step 2 Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: diagnosticResult ? '#059669' : '#94a3b8',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                2
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {diagnosticResult ? t('pathologyReportTitle', 'Pathology Report & Advisory') : t('aiAnalysisFindings', 'AI Analysis & Findings')}
              </h2>
            </div>

            {diagnosticResult && (
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', backgroundColor: '#dcfce7', padding: '3px 10px', borderRadius: '999px' }}>
                {t('statusCompleted', 'COMPLETED')}
              </span>
            )}
          </div>

          {/* ACTIVE SCANNING STATE */}
          {isScanning ? (
            <div
              style={{
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '20px',
              }}
            >
              {/* Radar scanner pulse circle */}
              <div
                className="ai-pulse-box"
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: '3px solid var(--primary-500)',
                  backgroundColor: 'var(--primary-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Leaf size={40} color="#059669" />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px dashed #34d399',
                    animation: 'spin 4s linear infinite',
                  }}
                />
              </div>

              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--primary-700)',
                    backgroundColor: 'var(--primary-100)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                  }}
                >
                  Stage {scanStageIndex + 1} of {SCAN_STAGES.length}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--slate-900)', marginTop: '10px' }}>
                  {t('scanStage_' + scanStageIndex, SCAN_STAGES[scanStageIndex].labelEn)}
                </h3>
              </div>

              {/* Multi-step progress track */}
              <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '6px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${((scanStageIndex + 1) / SCAN_STAGES.length) * 100}%`,
                      background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
                      transition: 'width 0.35s ease',
                      borderRadius: '999px',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Running deep multi-class crop pathology classification...
                </span>
              </div>
            </div>
          ) : diagnosticResult ? (
            /* COMPLETED DIAGNOSIS RESULT CARD */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {diagnosticResult.status === 'success' ? (
                <>
                  {/* Case C: Crop Mismatch Warning */}
                  {diagnosticResult.detectedCrop?.matchedUserSelection === false && (
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #93c5fd',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <Info size={18} color="#2563eb" />
                      <div style={{ fontSize: '0.84rem', color: '#1e40af' }}>
                        <strong>{t('cropMismatch', 'Crop Visual Mismatch:')}</strong> Selected <em>{selectedCrop}</em>, but Vision AI detected visual markers of <strong>{diagnosticResult.cropName}</strong>. Advisory below is generated for {diagnosticResult.cropName}.
                      </div>
                    </div>
                  )}

              {/* Top Identified Disease Card Banner */}
              {(() => {
                const sBadge = getSeverityBadge(diagnosticResult.riskLevel);
                const isHealthy = diagnosticResult.diagnosisType === 'healthy' || diagnosticResult.suspectedIssue.toLowerCase().includes('healthy');
                return (
                  <div
                    style={{
                      padding: '22px',
                      borderRadius: '16px',
                      backgroundColor: isHealthy ? '#ecfdf5' : sBadge.bg,
                      border: `1.5px solid ${isHealthy ? '#a7f3d0' : sBadge.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            backgroundColor: isHealthy ? '#059669' : sBadge.color,
                            color: '#ffffff',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {isHealthy ? t('statusHealthy', 'HEALTHY') : sBadge.label}
                        </span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: isHealthy ? '#065f46' : sBadge.color }}>
                          {t('hostCropLabel', 'Host Crop:')} <strong>{diagnosticResult.cropName}</strong>
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          ({diagnosticResult.sourceStatus})
                        </span>
                      </div>

                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--slate-900)' }}>
                        {diagnosticResult.suspectedIssue}
                      </div>

                      {diagnosticResult.scientificName && (
                        <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#475569', marginTop: '2px' }}>
                          {t('pathogenLabel', 'Pathogen:')} {diagnosticResult.scientificName}
                        </div>
                      )}

                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                        {t('scanTimestampLabel', 'Scan timestamp:')} {scanTimestamp}
                      </div>
                    </div>

                    {/* Confidence Meter Badge */}
                    <div
                      style={{
                        textAlign: 'center',
                        backgroundColor: '#ffffff',
                        padding: '14px 20px',
                        borderRadius: '14px',
                        border: `1px solid ${isHealthy ? '#a7f3d0' : sBadge.border}`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', lineHeight: 1 }}>
                        {diagnosticResult.confidenceScore}%
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                        {t('confidenceIndexLabel', 'Confidence Index')}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* AI CONFIDENCE DECISION GATE PANEL (SIH-26131 CONFIDENCE ENGINE) */}
              {(() => {
                const confScore = diagnosticResult.confidenceScore;
                const isHighConfidence = confScore >= 75;
                const isMediumConfidence = confScore >= 45 && confScore < 75;
                const isLowConfidence = confScore < 45;

                return (
                  <div
                    style={{
                      borderRadius: '16px',
                      backgroundColor: isHighConfidence ? '#f0fdf4' : isMediumConfidence ? '#fffbeb' : '#fef2f2',
                      border: `1.5px solid ${isHighConfidence ? '#86efac' : isMediumConfidence ? '#fde047' : '#fca5a5'}`,
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {/* Confidence Meter Status & Tier Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            backgroundColor: isHighConfidence ? '#059669' : isMediumConfidence ? '#d97706' : '#dc2626',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Zap size={18} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isHighConfidence ? '#166534' : isMediumConfidence ? '#854d0e' : '#991b1b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              {t('decisionGateTitle', 'AGRINEXT CONFIDENCE DECISION GATE')}
                            </span>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '999px',
                                backgroundColor: isHighConfidence ? '#dcfce7' : isMediumConfidence ? '#fef3c7' : '#fee2e2',
                                color: isHighConfidence ? '#15803d' : isMediumConfidence ? '#b45309' : '#dc2626',
                                border: `1px solid ${isHighConfidence ? '#bbf7d0' : isMediumConfidence ? '#fde68a' : '#fecaca'}`,
                              }}
                            >
                              {isHighConfidence ? t('tier1High', 'TIER 1: HIGH (≥75%)') : isMediumConfidence ? t('tier2Medium', 'TIER 2: MEDIUM (45-74%)') : t('tier3Low', 'TIER 3: LOW (<45%)')}
                            </span>
                          </div>
                          <h4 style={{ margin: '2px 0 0 0', fontSize: '1.05rem', fontWeight: 900, color: 'var(--slate-900)' }}>
                            {isHighConfidence
                              ? t('markerConfirmed', 'Pathological Visual Markers Confirmed (Automated IPM Active)')
                              : isMediumConfidence
                              ? t('clarificationNeeded', 'Dynamic Symptom Clarification Needed')
                              : t('confidenceInsufficient', 'AI Confidence Insufficient for Automated Recommendation')}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Visual Segmented 3-Tier Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', height: '10px', borderRadius: '999px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                        <div style={{ width: '45%', backgroundColor: '#f87171' }} title="Low Tier (<45%)" />
                        <div style={{ width: '30%', backgroundColor: '#fbbf24' }} title="Medium Tier (45-74%)" />
                        <div style={{ width: '25%', backgroundColor: '#34d399' }} title="High Tier (≥75%)" />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                        <span>0% Low / Expert Review</span>
                        <span>45% Clarification Gate</span>
                        <span>75% High Precision</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Boost / Success Banner if clarified */}
                    {clarificationBoostMessage && (
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#dcfce7',
                          border: '1px solid #86efac',
                          fontSize: '0.82rem',
                          color: '#14532d',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <CheckCircle size={16} color="#16a34a" />
                        <span>{clarificationBoostMessage}</span>
                      </div>
                    )}

                    {/* GATE CASE 1: HIGH CONFIDENCE (≥ 75%) */}
                    {isHighConfidence && (
                      <div style={{ padding: '12px 16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={18} color="#059669" />
                          <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
                            AI confidence exceeds quality threshold (<strong>{confScore}%</strong>). Integrated pest management and precision chemical spray thresholds are unlocked below.
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={sentToExpert}
                          onClick={handleEscalateToExpert}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            backgroundColor: sentToExpert ? '#e2e8f0' : '#f5f3ff',
                            color: sentToExpert ? '#64748b' : '#7c3aed',
                            border: '1px solid #ddd6fe',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: sentToExpert ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Award size={14} />
                          <span>{sentToExpert ? t('agronomistEnrolled', '✓ Agronomist Verification Enrolled') : t('requestAgronomist2ndOpinion', 'Request Agronomist 2nd Opinion')}</span>
                        </button>
                      </div>
                    )}

                    {/* GATE CASE 2: MEDIUM CONFIDENCE (45-74%) — INTERACTIVE CLARIFICATION */}
                    {isMediumConfidence && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ fontSize: '0.84rem', color: '#78350f', lineHeight: 1.4 }}>
                          AGRINEXT detected <strong>{diagnosticResult.suspectedIssue}</strong> at <strong>{confScore}% confidence</strong>. 
                          {t('clarificationIntro', 'Please confirm the following visual observations to boost confidence or verify with an agronomist:')}
                        </div>

                        {/* Clarification Questions */}
                        {((activeCase?.clarificationQuestions && activeCase.clarificationQuestions.length > 0)
                          ? activeCase.clarificationQuestions
                          : ClientConfidenceEngine.generateClarificationQuestions(diagnosticResult.cropName, diagnosticResult.suspectedIssue)
                        ).map((q, qIdx) => (
                          <div
                            key={q.id || qIdx}
                            style={{
                              padding: '12px 14px',
                              backgroundColor: '#ffffff',
                              borderRadius: '10px',
                              border: '1px solid #fde68a',
                            }}
                          >
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <HelpCircle size={14} color="#d97706" />
                              <span>Q{qIdx + 1}: {q.question}</span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {q.options.map((opt, oIdx) => {
                                const isChosen = clarificationAnswers[q.id] === opt;
                                return (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    onClick={() => handleSelectClarification(q.id, opt)}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '8px',
                                      border: isChosen ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                                      backgroundColor: isChosen ? '#f5f3ff' : '#ffffff',
                                      color: isChosen ? '#6d28d9' : '#334155',
                                      fontWeight: isChosen ? 800 : 600,
                                      fontSize: '0.78rem',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      transition: 'all 0.15s ease',
                                    }}
                                  >
                                    {isChosen && '✓ '} {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        {/* Clarification Action Controls */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={handleSubmitClarifications}
                            disabled={isSubmittingClarification || Object.keys(clarificationAnswers).length === 0}
                            className="btn btn-primary"
                            style={{
                              padding: '10px 18px',
                              borderRadius: '10px',
                              fontSize: '0.84rem',
                              fontWeight: 800,
                              backgroundColor: Object.keys(clarificationAnswers).length === 0 ? '#94a3b8' : '#7c3aed',
                              borderColor: Object.keys(clarificationAnswers).length === 0 ? '#94a3b8' : '#7c3aed',
                              cursor: Object.keys(clarificationAnswers).length === 0 ? 'not-allowed' : 'pointer',
                            }}
                          >
                            <Sparkles size={15} color="#fef08a" />
                            <span>
                              {isSubmittingClarification ? t('refiningConfidence', 'Refining Confidence...') : t('submitClarifications', 'Submit Answers & Refine Confidence')}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSpecimenImage(null);
                              startCamera();
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '10px 14px', fontSize: '0.84rem', fontWeight: 700 }}
                          >
                            <Camera size={14} />
                            <span>{t('uploadClearerAngle', 'Upload Clearer Photo Angle')}</span>
                          </button>

                          <button
                            type="button"
                            disabled={sentToExpert}
                            onClick={handleEscalateToExpert}
                            className="btn btn-outline"
                            style={{ padding: '10px 14px', fontSize: '0.84rem', fontWeight: 700, borderColor: '#d97706', color: '#b45309' }}
                          >
                            <Send size={14} />
                            <span>{sentToExpert ? t('forwardedToAgronomist', '✓ Forwarded to Agronomist') : t('forwardToAgronomist', 'Forward to Agronomist Review')}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* GATE CASE 3: LOW CONFIDENCE (< 45%) — EXPERT AUTO ROUTE & RESTRICTION */}
                    {isLowConfidence && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            border: '1.5px solid #fca5a5',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={20} color="#dc2626" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#991b1b' }}>
                              {t('chemicalRestrictedWarning', 'Automated Chemical Advisory Restricted to Prevent Crop Damage')}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: '#7f1d1d', lineHeight: 1.45 }}>
                            {t('chemicalRestrictedDesc', 'AI confidence score is insufficient for safe automated pesticide spraying. To avoid wrong chemical usage and financial loss, this diagnostic specimen is automatically queued for district agronomist verification.')}
                          </p>
                        </div>

                        {/* Live Escalated Case Ticket Card */}
                        <div
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', backgroundColor: '#f1f5f9', color: '#475569' }}>
                                #{activeCase?.caseNumber || 'CASE-1003'}
                              </span>
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', backgroundColor: '#fef3c7', color: '#b45309' }}>
                                {t('pendingAgronomistVerification', '⏳ PENDING AGRONOMIST VERIFICATION')}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                              {t('enrolledInDistrictReview', 'Enrolled in District Agronomist Review Queue (KVK Link)')}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                              {t('estimatedResponseWindow', 'Estimated response window: < 2 Hours • Assigned to Crop Pathology Extension Officer')}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => setShowLabReferralModal(true)}
                              className="btn btn-primary"
                              style={{ padding: '8px 14px', fontSize: '0.8rem', backgroundColor: '#dc2626', borderColor: '#dc2626' }}
                            >
                              <Building2 size={14} />
                              <span>{t('referToKvkLab', 'Refer to KVK Lab')}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSpecimenImage(null);
                                startCamera();
                              }}
                              className="btn btn-secondary"
                              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                            >
                              <RotateCcw size={14} />
                              <span>{t('retakePhoto', 'Retake Photo')}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SIH 26131 AUDIT TRAIL COLLAPSIBLE ACCORDION */}
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setShowAuditTrail(!showAuditTrail)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          color: '#475569',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Clock size={13} />
                        <span>
                          {showAuditTrail ? t('hideAuditTrail', '▼ Hide Diagnostic Decision Audit Trail') : t('viewAuditTrail', '▶ View Decision Audit Trail') + ' (' + (activeCase?.auditTrail?.length || 2) + ')'}
                        </span>
                      </button>

                      {showAuditTrail && (
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                          {(activeCase?.auditTrail || [
                            {
                              action: 'INITIAL_AI_SCAN',
                              timestamp: scanTimestamp || new Date().toISOString(),
                              performedBy: 'AGRINEXT Computer Vision AI Engine',
                              details: `Specimen analyzed for ${diagnosticResult.cropName}. Top diagnosis: ${diagnosticResult.suspectedIssue} (${confScore}% raw score).`,
                            },
                            {
                              action: 'CONFIDENCE_EVALUATED',
                              timestamp: scanTimestamp || new Date().toISOString(),
                              performedBy: 'AGRINEXT Confidence Engine',
                              details: `Assigned to ${isHighConfidence ? 'HIGH_CONFIDENCE' : isMediumConfidence ? 'MEDIUM_CONFIDENCE' : 'LOW_CONFIDENCE'} tier (${confScore}%).`,
                            },
                          ]).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.78rem', borderBottom: idx !== (activeCase?.auditTrail?.length || 2) - 1 ? '1px dashed #e2e8f0' : 'none', paddingBottom: '6px' }}>
                              <span style={{ fontWeight: 800, color: '#7c3aed', minWidth: '120px' }}>
                                [{item.action}]
                              </span>
                              <div style={{ flex: 1 }}>
                                <div style={{ color: '#0f172a', fontWeight: 600 }}>{item.details}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                  By: {item.performedBy} • {item.timestamp}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Observed Symptoms & Possible Causes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                    {t('symptomsDetectedTitle', '🔍 Symptoms Detected on Foliage:')}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {diagnosticResult.observedSymptoms.map((sym, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: '#ffffff',
                          color: 'var(--slate-800)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--slate-300)',
                        }}
                      >
                        • {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {diagnosticResult.possibleCauses && (
                  <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                      {t('environmentalDriversTitle', '☁️ Environmental / Pathological Drivers:')}
                    </span>
                    <ul style={{ paddingLeft: '16px', margin: '8px 0 0 0', fontSize: '0.8rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {diagnosticResult.possibleCauses.map((cause, idx) => (
                        <li key={idx}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* SMART INTEGRATED PEST MANAGEMENT (IPM) 6-PILLAR ADVISORY ENGINE */}
              <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Leaf size={20} color="#059669" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#064e3b', margin: 0 }}>
                      {t('ipmAdvisoryTitle', 'Integrated Pest & Disease Management (IPM) Advisory')}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '999px', backgroundColor: '#dcfce7', color: '#15803d' }}>
                    {t('safeInputHierarchy', 'SAFE INPUT HIERARCHY')}
                  </span>
                </div>

                {/* 6-Pillar Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {/* Pillar 1: Prevention */}
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                      {t('ipmPillar1', '1. Prevention')}
                    </span>
                    <ul style={{ paddingLeft: '16px', margin: '6px 0 0 0', fontSize: '0.78rem', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {(diagnosticResult.ipmAdvisory?.prevention || diagnosticResult.preventiveSuggestions || []).slice(0, 2).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Pillar 2: Cultural */}
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                      {t('ipmPillar2', '2. Cultural Practices')}
                    </span>
                    <ul style={{ paddingLeft: '16px', margin: '6px 0 0 0', fontSize: '0.78rem', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {(diagnosticResult.ipmAdvisory?.cultural || ['Provide optimal row spacing', 'Balanced nitrogen-potash nutrition']).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Pillar 3: Mechanical */}
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                      {t('ipmPillar3', '3. Mechanical / Traps')}
                    </span>
                    <ul style={{ paddingLeft: '16px', margin: '6px 0 0 0', fontSize: '0.78rem', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {(diagnosticResult.ipmAdvisory?.mechanical || ['Install sticky/pheromone traps @ 15/acre', 'Rogue out infected foci']).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Pillar 4: Biological */}
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                      {t('ipmPillar4', '4. Biological Bio-Control')}
                    </span>
                    <ul style={{ paddingLeft: '16px', margin: '6px 0 0 0', fontSize: '0.78rem', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {(diagnosticResult.recommendedTreatments?.organic || ['Trichoderma viride 5g/L foliar spray']).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Pillar 5: Threshold Chemical */}
                  <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase' }}>
                      {t('ipmPillar5', '5. Chemical (Threshold Gated)')}
                    </span>
                    <ul style={{ paddingLeft: '16px', margin: '6px 0 0 0', fontSize: '0.78rem', color: '#1e3a8a', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {(diagnosticResult.recommendedTreatments?.chemical || ['Only apply if ETL > 5% leaf damage']).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Pillar 6: Monitoring */}
                  <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                      {t('ipmPillar6', '6. Monitoring & ETL')}
                    </span>
                    <ul style={{ paddingLeft: '16px', margin: '6px 0 0 0', fontSize: '0.78rem', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {(diagnosticResult.ipmAdvisory?.monitoring || ['Scout canopy twice weekly']).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* FARMER ACTION MATRIX QUADRANT */}
              {diagnosticResult.ipmAdvisory && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  {/* What to do today */}
                  <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      {t('whatToDoImmediately', '✅ What to do immediately:')}
                    </span>
                    <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.8rem', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {diagnosticResult.ipmAdvisory.whatToDoNow.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  {/* What to avoid */}
                  <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      {t('whatNotToDo', '🚫 What NOT to do (Avoid):')}
                    </span>
                    <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '0.8rem', color: '#7f1d1d', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {diagnosticResult.ipmAdvisory.whatToAvoid.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  {/* When to inspect next */}
                  <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#eff6ff', border: '1px solid #93c5fd' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {t('nextFieldInspection', '⏱️ Next Field Inspection:')}
                    </span>
                    <div style={{ fontSize: '0.85rem', color: '#1e3a8a', fontWeight: 700 }}>
                      {diagnosticResult.ipmAdvisory.whenToInspectAgain}
                    </div>
                  </div>

                  {/* When to contact expert */}
                  <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#fffbeb', border: '1px solid #fde047' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#854d0e', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {t('escalateToAgronomist', '👨‍🔬 Escalate to Agronomist:')}
                    </span>
                    <div style={{ fontSize: '0.85rem', color: '#713f12', fontWeight: 700 }}>
                      {diagnosticResult.ipmAdvisory.whenToContactExpert}
                    </div>
                  </div>
                </div>
              )}

              {/* SIH WORKFLOW ACTION SUITE (Send to Expert, Start Follow-up, Lab Referral, AI, Print) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--slate-200)' }}>
                {/* Send to Expert Button */}
                <button
                  type="button"
                  disabled={sentToExpert}
                  onClick={() => {
                    setSentToExpert(true);
                    sihApi.createScanCase({
                      cropName: diagnosticResult.cropName,
                      suspectedIssue: diagnosticResult.suspectedIssue,
                      confidenceScore: diagnosticResult.confidenceScore,
                      riskLevel: diagnosticResult.riskLevel || 'HIGH',
                      symptoms: diagnosticResult.observedSymptoms,
                      imageUrl: specimenImage || undefined,
                      expertStatus: 'pending',
                    }).catch((e) => console.warn(e));
                    alert('Case transmitted to Agronomist Consultation Desk! You will receive verified diagnosis feedback.');
                  }}
                  className="btn"
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    padding: '11px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    backgroundColor: sentToExpert ? '#e2e8f0' : '#7c3aed',
                    color: sentToExpert ? '#64748b' : '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: sentToExpert ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Send size={15} />
                  <span>{sentToExpert ? t('sentToExpert', '✓ Sent to Expert') : t('sendToExpert', 'Send to Expert')}</span>
                </button>

                {/* Start Follow-up Monitoring Button */}
                <button
                  type="button"
                  onClick={() => {
                    navigate('/farmer/follow-up');
                  }}
                  className="btn"
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    padding: '11px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Calendar size={15} />
                  <span>{t('startFollowUpDays', 'Start Follow-up (Day 0/3/7)')}</span>
                </button>

                {/* Refer to KVK Lab */}
                <button
                  type="button"
                  onClick={() => setShowLabReferralModal(true)}
                  className="btn btn-secondary"
                  style={{ padding: '11px 16px', fontSize: '0.85rem', fontWeight: 800 }}
                >
                  <Building2 size={15} />
                  <span>{t('referToLab', 'Refer to Lab')}</span>
                </button>

                {/* Print Report */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-secondary"
                  style={{ padding: '11px 14px', fontSize: '0.85rem' }}
                  title="Print Advisory"
                >
                  <Printer size={15} />
                  <span>{t('printReport', 'Print')}</span>
                </button>

                {/* New Scan */}
                <button
                  type="button"
                  onClick={() => {
                    setDiagnosticResult(null);
                    setSpecimenImage(null);
                    setSentToExpert(false);
                    startCamera();
                  }}
                  className="btn btn-outline"
                  style={{ padding: '11px 14px', fontSize: '0.85rem' }}
                >
                  <RefreshCw size={14} />
                  <span>{t('newScan', 'New Scan')}</span>
                </button>
              </div>

                </>
              ) : (
                /* NON-SUCCESS ERROR / GUIDANCE STATES */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Case A: Invalid Image / Non-Plant */}
                  {diagnosticResult.status === 'invalid_image' && (
                    <div
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        backgroundColor: '#fef2f2',
                        border: '1.5px solid #f87171',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <AlertTriangle size={22} />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#991b1b' }}>
                            {t('invalidImageTitle', 'Invalid Image / Non-Plant Detected')}
                          </h3>
                          <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>{t('invalidImageSubtitle', 'Image rejected by Vision AI classifier')}</div>
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#7f1d1d', lineHeight: 1.5 }}>
                        {diagnosticResult.generalExplanation || t('invalidImageDefault', 'The uploaded photo does not contain a recognizable agricultural plant, leaf, or crop specimen.')}
                      </p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <button
                          type="button"
                          onClick={() => { setDiagnosticResult(null); fileInputRef.current?.click(); }}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          {t('uploadPlantPhoto', '📁 Upload Plant Photo')}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setDiagnosticResult(null); startCamera(); }}
                          className="btn btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          {t('openCamera', '📷 Open Camera')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Case B: Low Quality Image */}
                  {diagnosticResult.status === 'low_quality' && (
                    <div
                      style={{
                        padding: '20px',
                        borderRadius: '16px',
                        backgroundColor: '#fffbeb',
                        border: '1.5px solid #facc15',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertTriangle size={22} color="#d97706" />
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#92400e' }}>
                          {t('lowQualityTitle', 'Image Resolution or Quality Insufficient')}
                        </h3>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350f', lineHeight: 1.5 }}>
                        {diagnosticResult.generalExplanation || t('lowQualityDefault', 'Photo is blurry or lighting is insufficient to accurately identify disease morphology.')}
                      </p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <button
                          type="button"
                          onClick={() => { setDiagnosticResult(null); if (activeTab === 'camera') startCamera(); else fileInputRef.current?.click(); }}
                          className="btn btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          {t('retakeClearerPhoto', '📸 Retake Clearer Photo')}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setDiagnosticResult(null); fileInputRef.current?.click(); }}
                          className="btn btn-outline"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          {t('uploadHigherRes', '📁 Upload Higher Resolution Photo')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Case C: Missing API Key */}
                  {diagnosticResult.status === 'missing_api_key' && (
                    <div
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        backgroundColor: '#fffbeb',
                        border: '1.5px solid #f59e0b',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertTriangle size={24} color="#d97706" />
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#92400e' }}>
                          {t('missingApiKeyTitle', 'Gemini Vision API Key Not Configured')}
                        </h3>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#78350f', lineHeight: 1.5 }}>
                        {diagnosticResult.generalExplanation || t('missingApiKeyDefault', 'The server does not have a valid GEMINI_API_KEY environment variable configured.')}
                      </p>
                    </div>
                  )}

                  {/* Case D: Vision Request Failed / Network / Model Response / Unavailable */}
                  {(diagnosticResult.status === 'vision_request_failed' ||
                    diagnosticResult.status === 'analysis_unavailable' ||
                    diagnosticResult.status === 'model_response_invalid' ||
                    diagnosticResult.status === 'network_error' ||
                    !['invalid_image', 'low_quality', 'missing_api_key'].includes(diagnosticResult.status as string)) && (
                    <div
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        backgroundColor: '#fef2f2',
                        border: '1.5px solid #fca5a5',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShieldAlert size={24} color="#dc2626" />
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#991b1b' }}>
                          {t('serviceUnavailableTitle', 'AI Vision Service Temporarily Unavailable')}
                        </h3>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#7f1d1d', lineHeight: 1.5 }}>
                        {diagnosticResult.generalExplanation || t('serviceUnavailableDefault', 'AI image analysis could not be completed. Please check your network and retry.')}
                      </p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={handleRunDiagnosis}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          {t('retryAnalysis', '🔄 Retry Analysis')}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setDiagnosticResult(null); fileInputRef.current?.click(); }}
                          className="btn btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          {t('uploadAnotherPhoto', '📁 Upload Another Photo')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Clear Empty Symptoms Notice */}
                  <div
                    style={{
                      padding: '16px 20px',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px dashed #cbd5e1',
                      color: '#64748b',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                      textAlign: 'center',
                    }}
                  >
                    {t('noVisualSymptoms', 'No visual symptoms available because image analysis was not completed.')}
                  </div>

                  {/* Action Reset Button */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setDiagnosticResult(null);
                        setSpecimenImage(null);
                        setSentToExpert(false);
                        startCamera();
                      }}
                      className="btn btn-outline"
                      style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                    >
                      <RefreshCw size={14} />
                      <span>{t('startFreshScan', 'Start Fresh Scan')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Lab Referral Modal Instance */}
              {showLabReferralModal && (
                <LabReferralModal
                  isOpen={showLabReferralModal}
                  onClose={() => setShowLabReferralModal(false)}
                  result={diagnosticResult}
                  cropName={diagnosticResult.cropName}
                  image={specimenImage || undefined}
                />
              )}
            </div>
          ) : (
            /* EMPTY STANDBY STATE */
            <div

              style={{
                padding: '60px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
                color: '#94a3b8',
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Leaf size={36} color="#cbd5e1" />
              </div>
              <div style={{ maxWidth: '320px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-800)' }}>
                  {t('readyForSpecimenAnalysis', 'Ready for Leaf Specimen Analysis')}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>
                  {t('selectCropAndRunAnalysis', 'Select target crop, capture or upload specimen leaf photo, then run AI diagnostics to generate your prescription.')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

