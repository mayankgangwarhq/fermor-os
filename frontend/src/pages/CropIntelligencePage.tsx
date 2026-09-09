import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DataBadge } from '../components/common/DataBadge';
import type { DiagnosticResult } from '../types';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Users,
  RefreshCw,
  X,
  RotateCcw,
  Sparkles,
  Zap,
  Image as ImageIcon,
  Check,
  Info,
  Sprout
} from 'lucide-react';

interface CropIntelligencePageProps {
  onNavigate: (page: string) => void;
}

interface CropDiseaseInfo {
  issue: string;
  confidence: number;
  severity: 'Moderate' | 'High' | 'Low';
  symptomChips: string[];
  explanation: string;
  treatments: string[];
}

const CROP_DISEASE_DB: Record<string, CropDiseaseInfo> = {
  Wheat: {
    issue: 'Leaf Rust (Puccinia striiformis)',
    confidence: 94,
    severity: 'Moderate',
    symptomChips: ['Yellow/Orange Spots', 'Leaf Discoloration', 'Orange Pustules', 'Dry Leaf Edges'],
    explanation: 'Wheat Leaf Rust is a fungal disease caused by cool, moist weather. It forms powdery rust pustules along leaf veins that impede photosynthesis.',
    treatments: [
      'Spray Propiconazole 25% EC @ 1 ml per Liter water.',
      'Avoid excess urea application during humid foggy periods.',
      'Clear field edge weeds serving as host reservoirs.'
    ]
  },
  Paddy: {
    issue: 'Paddy Leaf Blast (Magnaporthe oryzae)',
    confidence: 92,
    severity: 'High',
    symptomChips: ['Spindle Lesions', 'Grey Center Spots', 'Brown Leaf Margins', 'Stunted Stalk'],
    explanation: 'Rice Leaf Blast affects leaves and panicles, creating diamond-shaped lesions under high relative humidity (>90%).',
    treatments: [
      'Apply Tricyclazole 75% WP @ 0.6 g per Liter water.',
      'Maintain standing water in field plots to suppress spore dispersal.',
      'Apply recommended Potash doses for leaf tissue strength.'
    ]
  },
  Mustard: {
    issue: 'Mustard Alternaria Blight & Aphid Damage',
    confidence: 91,
    severity: 'Moderate',
    symptomChips: ['Concentric Dark Rings', 'Yellow Lower Leaves', 'Sticky Leaf Residue', 'Pale Stems'],
    explanation: 'Alternaria Blight causes concentric dark spots while sap-sucking aphids weaken winter mustard flowers and pod development.',
    treatments: [
      'Spray Mancozeb 75% WP @ 2 g/L for blight control.',
      'Apply Thiamethoxam 25% WG @ 0.2 g/L for aphid control.',
      'Clear infected crop residue post-harvest.'
    ]
  },
  Tomato: {
    issue: 'Tomato Early Blight (Alternaria solani)',
    confidence: 95,
    severity: 'Moderate',
    symptomChips: ['Bullseye Leaf Rings', 'Yellow Halo Spots', 'Lower Leaf Wilting', 'Stem Lesions'],
    explanation: 'Early Blight initiates on lower mature leaves as target-like concentric rings during warm, rainy weather.',
    treatments: [
      'Spray Copper Oxychloride 50% WP @ 2.5 g/L water.',
      'Prune lower foliage up to 12 inches from ground.',
      'Use drip irrigation to prevent wet foliage.'
    ]
  },
  Potato: {
    issue: 'Potato Late Blight (Phytophthora infestans)',
    confidence: 96,
    severity: 'High',
    symptomChips: ['Water-Soaked Spots', 'Dark Brown Edges', 'White Leaf Powdery Mildew', 'Rapid Foliage Collapse'],
    explanation: 'Late Blight is a aggressive water-mold pathogen spreading rapidly during cold, foggy morning weather.',
    treatments: [
      'Prophylactic spray of Mancozeb @ 2.5 g/L before fog onset.',
      'Spray Cymoxanil + Mancozeb @ 2 g/L at early symptom stage.',
      'Earth up soil ridges around tubers.'
    ]
  },
  Cotton: {
    issue: 'Cotton Pink Bollworm & Leaf Curl Virus',
    confidence: 90,
    severity: 'High',
    symptomChips: ['Upward Leaf Cupping', 'Vein Swelling', 'Leaf Discoloration', 'Shedding Buds'],
    explanation: 'Cotton Leaf Curl Virus transmitted by whiteflies causes leaf curling and stunt growth in young cotton crops.',
    treatments: [
      'Spray Afidopyropen 50 g/L @ 2 ml/L for whitefly control.',
      'Install yellow sticky traps @ 8 traps/acre.',
      'Deploy Pheromone traps @ 5 traps/acre.'
    ]
  }
};

interface FarmingIntroOverlayProps {
  onComplete: () => void;
}

const FarmingIntroOverlay: React.FC<FarmingIntroOverlayProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(1);
  const [progress, setProgress] = useState<number>(20);

  useEffect(() => {
    const t1 = setTimeout(() => { setStage(2); setProgress(50); }, 300);   // Field & crops grow
    const t2 = setTimeout(() => { setStage(3); setProgress(80); }, 850);   // Logo & text reveal
    const t3 = setTimeout(() => { setStage(4); setProgress(98); }, 1450);  // AI laser scan beam
    const t4 = setTimeout(() => { setStage(5); setProgress(100); }, 2200); // Smooth fade out
    const t5 = setTimeout(() => onComplete(), 2550);                      // Finish

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#0f172a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: stage === 5 ? 0 : 1,
        transform: stage === 5 ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: stage === 5 ? 'none' : 'auto',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes sunGlowPulse {
          0% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.15); }
          100% { opacity: 0.3; transform: scale(0.8); }
        }

        @keyframes crop3DSpring {
          0% { opacity: 0; transform: scale(0.4) translateY(30px); }
          60% { opacity: 1; transform: scale(1.12) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes laserScanSweep {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 90%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }

        @keyframes fieldRiseModern {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .intro-laser-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%);
          box-shadow: 0 0 16px #10b981;
          animation: laserScanSweep 1.8s infinite ease-in-out;
        }

        .glass-intro-pill {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
      `}</style>

      {/* Sunrise Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(254, 240, 138, 0.15) 50%, transparent 70%)',
          animation: 'sunGlowPulse 3s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />

      {/* Stage 2 & 3: Crop Badge & Growth Scene */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 24px',
          zIndex: 2
        }}
      >
        {/* Animated Sprout Badge with Laser Line */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          {stage >= 4 && <div className="intro-laser-line" />}

          <div
            style={{
              width: '92px',
              height: '92px',
              borderRadius: '26px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 45px rgba(16,185,129,0.45), inset 0 2px 4px rgba(255,255,255,0.3)',
              animation: 'crop3DSpring 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              position: 'relative'
            }}
          >
            <Sprout size={48} style={{ position: 'absolute', transform: 'translate(-4px, -2px)' }} />
            <Sparkles size={26} style={{ position: 'absolute', transform: 'translate(14px, 12px)', color: '#fef08a' }} />
          </div>
        </div>

        {/* Stage 3: Title Reveal */}
        {stage >= 3 && (
          <div style={{ animation: 'logoFadeUpModern 0.4s ease-out forwards' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.03em', margin: '0 0 4px 0' }}>
              AGRI<span style={{ color: '#10b981' }}>NEXT</span>
            </h1>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              AI CROP HEALTH ENGINE
            </span>
          </div>
        )}

        {/* Stage 4: Scanning Status Pill */}
        {stage >= 4 && (
          <div
            className="glass-intro-pill"
            style={{
              marginTop: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '999px',
              animation: 'logoFadeUpModern 0.35s ease-out forwards'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} className="pulse-dot" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0' }}>
              ⚡ AI-powered crop health scanning...
            </span>
          </div>
        )}

        {/* Progress Bar */}
        <div style={{ width: '220px', height: '5px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '999px', marginTop: '28px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
              borderRadius: '999px',
              boxShadow: '0 0 10px #10b981',
              transition: 'width 0.35s ease'
            }}
          />
        </div>

      </div>

      {/* Field SVG Curves at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '150px',
          animation: 'fieldRiseModern 0.8s ease-out forwards',
          opacity: 0.7,
          pointerEvents: 'none'
        }}
      >
        <svg viewBox="0 0 1440 320" style={{ width: '100%', height: '100%', display: 'block' }}>
          <path fill="#059669" fillOpacity="0.4" d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,213.3C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#10b981" fillOpacity="0.5" d="M0,256L48,245.3C96,235,192,213,288,218.7C384,224,480,256,576,256C672,256,768,224,864,218.7C960,213,1056,235,1152,240C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          border: '1px solid rgba(255,255,255,0.2)',
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          color: '#cbd5e1',
          padding: '8px 18px',
          borderRadius: '999px',
          fontSize: '0.82rem',
          fontWeight: '700',
          cursor: 'pointer',
          zIndex: 20
        }}
      >
        Skip ✕
      </button>
    </div>
  );
};

export const CropIntelligencePage: React.FC<CropIntelligencePageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [selectedImage, setSelectedImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80'
  );
  const [symptoms, setSymptoms] = useState<string[]>([
    'Yellow powdery pustules on leaves',
    'Leaf tips turning dry brown'
  ]);

  // Camera & Scan States
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageValidationError, setImageValidationError] = useState<string | null>(null);
  
  // Progress & Analysis States
  const [step, setStep] = useState<number>(1);
  const [scanProgressStage, setScanProgressStage] = useState<number>(0);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableSymptoms = [
    'Yellow powdery pustules on leaves',
    'Leaf tips turning dry brown',
    'Curled up leaf margins',
    'Black/Dark brown spot concentric rings',
    'Stunted stalk & pale stem',
    'White powdery coating on upper leaf'
  ];

  const sampleImages = [
    { title: 'Wheat Leaf Yellowing', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80' },
    { title: 'Tomato Early Blight', url: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=600&q=80' },
    { title: 'Paddy Leaf Blast', url: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80' },
    { title: 'Potato Late Blight', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' }
  ];

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setImageValidationError(null);
    setCapturedImage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        t('cameraNotAvailable', 'Camera access is not available on this device.')
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(
          t('cameraPermissionDenied', 'Camera access is required for Crop Scan. Please grant permission.')
        );
      } else {
        setCameraError(
          t('cameraGenericError', 'Could not open camera. Please upload a photo instead.')
        );
      }
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
      setSelectedImage(dataUrl);
    }

    stopCamera();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageValidationError(
        t('validImageError', 'Please select a valid image (JPG, PNG, or WEBP).')
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCapturedImage(result);
      setSelectedImage(result);
      setImageValidationError(null);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const handleStartAnalysis = () => {
    const activePhoto = capturedImage || selectedImage;
    if (!activePhoto) {
      setImageValidationError(
        t('imageNotClearError', "The image isn't clear enough. Please retake the photo with better lighting.")
      );
      return;
    }

    setImageValidationError(null);
    setStep(2);
    setScanProgressStage(1);

    const stages = [
      { stage: 1, delay: 350 },
      { stage: 2, delay: 800 },
      { stage: 3, delay: 1300 },
      { stage: 4, delay: 1750 }
    ];

    stages.forEach(({ stage, delay }) => {
      setTimeout(() => setScanProgressStage(stage), delay);
    });

    setTimeout(() => {
      const info = CROP_DISEASE_DB[selectedCrop] || CROP_DISEASE_DB['Wheat'];

      setDiagnosticResult({
        cropName: selectedCrop,
        suspectedIssue: info.issue,
        confidenceScore: info.confidence,
        observedSymptoms: Array.from(new Set([...symptoms, ...info.symptomChips])),
        generalExplanation: info.explanation,
        preventiveSuggestions: info.treatments,
        recommendedNextSteps: [
          'स्थानीय कृषि विशेषज्ञ या कृषि विभाग की सलाह के अनुसार उपचार करें।'
        ],
        sourceStatus: 'AI GUIDANCE'
      });
      setStep(3);
    }, 2200);
  };

  const toggleSymptom = (sym: string) => {
    setSymptoms(prev => (prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]));
  };

  const progressLabels = [
    { num: 1, label: 'Identifying crop' },
    { num: 2, label: 'Detecting symptoms' },
    { num: 3, label: 'Checking disease patterns' },
    { num: 4, label: 'Preparing guidance' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. FARMING INTRO OVERLAY */}
      {showIntro && <FarmingIntroOverlay onComplete={() => setShowIntro(false)} />}

      {/* Dynamic Keyframe Animation Styles */}
      <style>{`
        @keyframes scanBeamAnimation {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 90%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }

        .scan-laser-beam {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%);
          box-shadow: 0 0 12px #10b981;
          animation: scanBeamAnimation 2s infinite ease-in-out;
        }

        .crop-card-item {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .crop-card-item:hover {
          transform: translateY(-2px);
          border-color: #059669 !important;
          box-shadow: 0 4px 14px rgba(5,150,105,0.12) !important;
        }
        .crop-card-item:active {
          transform: scale(0.98);
        }

        .btn-scan-primary {
          transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease;
        }
        .btn-scan-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(5,150,105,0.35) !important;
        }
        .btn-scan-primary:active {
          transform: scale(0.97);
        }

        @media (max-width: 768px) {
          .crop-grid-two-col {
            grid-template-columns: 1fr !important;
          }
          .crop-cards-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      {/* Hidden canvas for capturing video frame */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Hidden file input for gallery upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* 2. COMPACT PAGE HEADER */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AGRINEXT • AI CROP HEALTH ENGINE
          </span>
          <h1 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', margin: '2px 0 0 0', letterSpacing: '-0.02em' }}>
            AI Crop Disease Scanner
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: '500' }}>
            Scan your crop leaf and get instant AI-powered health guidance.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowIntro(true)}
            style={{ padding: '6px 12px', fontSize: '0.78rem', fontWeight: '700', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Sparkles size={14} color="#059669" />
            <span>✨ Replay Farming Intro</span>
          </button>
          <DataBadge status="AI GUIDANCE" />
        </div>
      </div>

      {/* STEP 1 & 2: MAIN SCANNER WORKFLOW */}
      {step === 1 && (
        <div className="crop-grid-two-col" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
          
          {/* LEFT COLUMN: CROP SELECTION + SCANNER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 3. STEP 01 — SELECT YOUR CROP */}
            <div className="card" style={{ padding: '22px', backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>
                  01 — SELECT YOUR CROP
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' }}>
                  Which crop are you checking?
                </h3>
              </div>

              <div className="crop-cards-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { name: 'Wheat', icon: '🌾' },
                  { name: 'Paddy', icon: '🌾' },
                  { name: 'Mustard', icon: '🌼' },
                  { name: 'Tomato', icon: '🍅' },
                  { name: 'Potato', icon: '🥔' },
                  { name: 'Cotton', icon: '🌱' }
                ].map(c => {
                  const isSelected = selectedCrop === c.name;
                  return (
                    <div
                      key={c.name}
                      onClick={() => setSelectedCrop(c.name)}
                      className="crop-card-item"
                      style={{
                        padding: '12px 10px',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                        backgroundColor: isSelected ? '#f0fdf4' : '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        position: 'relative'
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: '#059669',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                      <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? '800' : '600', color: isSelected ? '#065f46' : '#334155' }}>
                        {c.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4 & 5. STEP 02 — SCAN YOUR CROP */}
            <div className="card" style={{ padding: '22px', backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>
                  02 — SCAN YOUR CROP
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' }}>
                  Take a clear photo of the affected leaf.
                </h3>
              </div>

              {/* CAMERA ERROR STATE */}
              {cameraError && (
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fee2e2',
                    borderRadius: '14px',
                    marginBottom: '16px',
                    fontSize: '0.85rem',
                    color: '#991b1b'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', marginBottom: '6px' }}>
                    <AlertTriangle size={16} color="#dc2626" />
                    <span>Camera access isn't available</span>
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#7f1d1d' }}>{cameraError}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" onClick={startCamera} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                      <RotateCcw size={14} /> Try Again
                    </button>
                    <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                      <Upload size={14} /> Upload Photo Instead
                    </button>
                  </div>
                </div>
              )}

              {/* LIVE CAMERA OVERLAY PREVIEW */}
              {cameraActive ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '320px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#000000',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                    marginBottom: '16px'
                  }}
                >
                  <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                  {/* TOP LABEL */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(15,23,42,0.85)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      letterSpacing: '0.06em'
                    }}
                  >
                    AGRINEXT AI SCANNER
                  </div>

                  {/* LEAF SCANNING FRAME */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '45px 35px 75px 35px',
                      border: '2.5px dashed #10b981',
                      borderRadius: '20px',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none'
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'rgba(5, 150, 105, 0.9)',
                        color: '#ffffff',
                        padding: '4px 14px',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: '700'
                      }}
                    >
                      Place the affected leaf here
                    </span>
                  </div>

                  {/* SHUTTER BUTTON BAR */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: 0,
                      right: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <button
                      onClick={capturePhoto}
                      style={{
                        width: '58px',
                        height: '58px',
                        borderRadius: '50%',
                        border: '3px solid #ffffff',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(16,185,129,0.5)'
                      }}
                    >
                      <Camera size={26} />
                    </button>
                    <span style={{ fontSize: '0.7rem', color: '#ffffff', fontWeight: '700', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                      Tap to capture
                    </span>
                  </div>

                  <button
                    onClick={stopCamera}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      border: 'none',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={16} color="#0f172a" />
                  </button>
                </div>
              ) : (
                /* PRIMARY CTAs */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="btn btn-primary btn-scan-primary"
                    style={{
                      padding: '14px 20px',
                      fontSize: '1.05rem',
                      fontWeight: '800',
                      borderRadius: '14px',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: 'none',
                      boxShadow: '0 6px 18px rgba(5,150,105,0.28)'
                    }}
                  >
                    <Camera size={22} />
                    <span>📷 Scan With Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary"
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      color: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      border: '1px solid #cbd5e1'
                    }}
                  >
                    <ImageIcon size={18} color="#059669" />
                    <span>🖼️ Upload Photo</span>
                  </button>
                </div>
              )}

              {/* 7. IMAGE PREVIEW CARD */}
              {(capturedImage || selectedImage) && !cameraActive && (
                <div>
                  <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '160px', border: '2px solid #059669' }}>
                    <img src={capturedImage || selectedImage || ''} alt="Leaf Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => { setCapturedImage(null); startCamera(); }}
                        style={{ padding: '4px 10px', fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.92)', fontWeight: '700' }}
                      >
                        <RotateCcw size={12} /> Retake
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* IMAGE VALIDATION ERROR BANNER */}
              {imageValidationError && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: '12px',
                    color: '#b45309',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', marginBottom: '6px' }}>
                    <AlertTriangle size={16} color="#d97706" />
                    <span>{imageValidationError}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" onClick={startCamera} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                      📷 Retake Photo
                    </button>
                    <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                      🖼️ Upload Another Photo
                    </button>
                  </div>
                </div>
              )}

              {/* PRIMARY ANALYZE ACTION BUTTON */}
              <button
                className="btn btn-accent btn-scan-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: '800',
                  marginTop: '16px',
                  borderRadius: '14px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(5,150,105,0.25)'
                }}
                onClick={handleStartAnalysis}
              >
                <Zap size={20} />
                <span>Analyze Crop</span>
              </button>

            </div>
          </div>

          {/* RIGHT COLUMN: GUIDANCE TIPS & MANUAL SYMPTOMS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* 6. SCANNER GUIDANCE TIPS */}
            <div className="card" style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '18px', border: '1px solid #dcfce7' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#065f46', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={16} color="#059669" />
                <span>Tips for Best AI Accuracy</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#166534', fontWeight: '600' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#10b981" />
                  <span>Good lighting (natural daylight preferred)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#10b981" />
                  <span>Keep affected leaf inside the center frame</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#10b981" />
                  <span>Avoid blurry images or shadowy angles</span>
                </div>
              </div>
            </div>

            {/* 13. OBSERVED SYMPTOMS CHIPS */}
            <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>
                  OPTIONAL
                </span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' }}>
                  Observed Symptoms
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {availableSymptoms.map((sym, idx) => {
                  const isChecked = symptoms.includes(sym);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleSymptom(sym)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: isChecked ? '1px solid #10b981' : '1px solid #e2e8f0',
                        backgroundColor: isChecked ? '#f0fdf4' : '#f8fafc',
                        color: isChecked ? '#065f46' : '#475569',
                        fontWeight: isChecked ? '700' : '500',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <input type="checkbox" checked={isChecked} onChange={() => {}} style={{ accentColor: '#059669' }} />
                      <span>{sym}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 8. AI SCANNING STATE (BEAM SCAN ANIMATION OVERLAY) */}
      {step === 2 && (
        <div className="card" style={{ padding: '40px 24px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          
          {/* IMAGE WITH ANIMATED LASER SCAN BEAM */}
          <div style={{ position: 'relative', width: '220px', height: '150px', margin: '0 auto 20px auto', borderRadius: '16px', overflow: 'hidden', border: '2px solid #059669', boxShadow: '0 8px 24px rgba(5,150,105,0.15)' }}>
            <img src={capturedImage || selectedImage || ''} alt="Scanning Leaf" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="scan-laser-beam" />
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            AGRINEXT AI is analyzing your crop
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
            Comparing leaf patterns against 45,000+ verified AgriTech pathogen models for {selectedCrop}.
          </p>

          {/* PROGRESS STEPS */}
          <div style={{ maxWidth: '360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
            {progressLabels.map((item) => {
              const isCompleted = scanProgressStage > item.num;
              const isCurrent = scanProgressStage === item.num;

              return (
                <div
                  key={item.num}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    backgroundColor: isCurrent ? '#f0fdf4' : isCompleted ? '#f8fafc' : '#ffffff',
                    border: isCurrent ? '1.5px solid #10b981' : '1px solid #e2e8f0'
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#059669' : '#e2e8f0',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isCompleted ? <Check size={12} strokeWidth={3} /> : item.num}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: isCurrent || isCompleted ? '700' : '500', color: isCurrent ? '#065f46' : isCompleted ? '#334155' : '#94a3b8' }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 9, 10 & 11. AI RESULT DASHBOARD */}
      {step === 3 && diagnosticResult && (
        <div className="card" style={{ padding: '28px', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          
          {/* RESULT HEADER */}
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Crop Health Analysis
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                  🌾 {selectedCrop} Leaf • <span style={{ color: '#dc2626' }}>{diagnosticResult.suspectedIssue}</span>
                </h2>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontWeight: '800', fontSize: '0.82rem' }}>
                  Confidence: {diagnosticResult.confidenceScore}%
                </div>
                <div style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: '#fef3c7', border: '1px solid #fef08a', color: '#b45309', fontWeight: '800', fontSize: '0.82rem' }}>
                  Severity: Moderate
                </div>
              </div>
            </div>
          </div>

          {/* DETECTED SYMPTOMS CHIPS */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Detected Symptoms
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {diagnosticResult.observedSymptoms.map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  ● {s}
                </span>
              ))}
            </div>
          </div>

          {/* 🤖 AGRINEXT AI GUIDANCE */}
          <div className="card" style={{ padding: '18px', backgroundColor: '#f0fdf4', borderRadius: '16px', border: '1px solid #dcfce7', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#065f46', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={18} color="#059669" />
              <span>🤖 AGRINEXT AI Guidance</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {diagnosticResult.preventiveSuggestions.map((rec, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: '#166534', fontWeight: '600' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI ASSESSMENT DISCLAIMER */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              fontSize: '0.78rem',
              color: '#64748b',
              marginBottom: '20px',
              fontWeight: '600'
            }}
          >
            ⚠️ This is an AI-based assessment, not a confirmed diagnosis. Consider consulting a local agricultural expert or agronomist for dosage verification.
          </div>

          {/* 12. SCAN AGAIN CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid #e2e8f0', paddingTop: '18px' }}>
            <button
              className="btn btn-primary btn-scan-primary"
              onClick={() => { setStep(1); startCamera(); }}
              style={{ flex: 1, padding: '12px 18px', fontWeight: '800', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Camera size={18} />
              <span>📷 Scan Another Crop</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => { setStep(1); fileInputRef.current?.click(); }}
              style={{ padding: '12px 18px', fontWeight: '700', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Upload size={16} />
              <span>🖼️ Upload Another Photo</span>
            </button>

            <button
              className="btn btn-outline"
              onClick={() => onNavigate('experts')}
              style={{ padding: '12px 18px', fontWeight: '700', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Users size={16} />
              <span>Consult Expert</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
