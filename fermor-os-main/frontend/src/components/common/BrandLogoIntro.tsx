import React, { useState, useEffect, useRef } from 'react';
import { Sprout, Sparkles, Scan, ArrowRight } from 'lucide-react';

interface BrandLogoIntroProps {
  onComplete: () => void;
}

export const BrandLogoIntro: React.FC<BrandLogoIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('CALIBRATING SPECTRAL TELEMETRY...');
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const completedRef = useRef<boolean>(false);

  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      handleFinish();
      return;
    }

    // Sequence timelines
    // 0ms - 400ms: Initial reveal
    // 400ms - 1100ms: AI Scan beam pass
    const tScan = setTimeout(() => {
      setPhase(1);
      setStatusText('CONNECTING APMC & WEATHER RADAR...');
    }, 450);

    // 1100ms - 1800ms: Typography reveal
    const tText = setTimeout(() => {
      setPhase(2);
      setStatusText('CALIBRATING NEURAL PATHOLOGY ENGINE...');
    }, 1100);

    // 1800ms - 2600ms: Full Crop Intelligence initialization
    const tIntel = setTimeout(() => {
      setPhase(3);
      setStatusText('INITIALIZING CROP INTELLIGENCE...');
    }, 1800);

    // 2700ms: Complete and transition out
    const tDone = setTimeout(() => {
      handleFinish();
    }, 2800);

    // Smooth progress counter from 0% to 100%
    const startTime = Date.now();
    const duration = 2600;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const current = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(current);
      if (current >= 100) {
        clearInterval(progressInterval);
      }
    }, 30);

    return () => {
      clearTimeout(tScan);
      clearTimeout(tText);
      clearTimeout(tIntel);
      clearTimeout(tDone);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div
      className={`agrinext-cinematic-intro ${isExiting ? 'intro-exit' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#060D17',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.03)' : 'scale(1)',
        pointerEvents: isExiting ? 'none' : 'auto',
      }}
    >
      <style>{`
        /* Cinematic Intro Custom Keyframes */
        @keyframes introBgPulse {
          0% { opacity: 0.5; transform: scale(0.98); }
          50% { opacity: 0.85; transform: scale(1.02); }
          100% { opacity: 0.5; transform: scale(0.98); }
        }

        @keyframes logoRevealScale {
          0% { opacity: 0; transform: scale(0.94) translateY(12px); filter: blur(6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
        }

        @keyframes laserScanSweep {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        @keyframes gridLinesForm {
          0% { opacity: 0; transform: scaleY(0.7); }
          100% { opacity: 0.35; transform: scaleY(1); }
        }

        @keyframes textRevealUp {
          0% { opacity: 0; transform: translateY(14px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }

        @keyframes taglinesFade {
          0% { opacity: 0; transform: translateY(8px); letter-spacing: 0.28em; }
          100% { opacity: 0.9; transform: translateY(0); letter-spacing: 0.2em; }
        }

        @keyframes dataPointFloat {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-35px) rotate(180deg); opacity: 0.7; }
          100% { transform: translateY(-70px) rotate(360deg); opacity: 0; }
        }

        @keyframes softGlowHalo {
          0% { box-shadow: 0 0 25px rgba(16, 185, 129, 0.25); }
          50% { box-shadow: 0 0 45px rgba(16, 185, 129, 0.55), 0 0 70px rgba(5, 150, 105, 0.3); }
          100% { box-shadow: 0 0 25px rgba(16, 185, 129, 0.25); }
        }

        .intro-skip-btn:hover {
          background-color: rgba(255, 255, 255, 0.12) !important;
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Skip Button (Top-Right) */}
      <button
        type="button"
        onClick={handleFinish}
        className="intro-skip-btn"
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          padding: '7px 16px',
          borderRadius: '999px',
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#94a3b8',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 50,
        }}
        title="Skip intro animation"
      >
        <span>Skip</span>
        <ArrowRight size={13} />
      </button>

      {/* Ambient Deep Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, rgba(6, 78, 59, 0.06) 45%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          animation: 'introBgPulse 5s ease-in-out infinite',
        }}
      />

      {/* Layer 6: Subtle Digital Agricultural Crop Grid Lines forming behind */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'gridLinesForm 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, opacity: 0.2 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="agriGrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="0.75" />
              <circle cx="0" cy="0" r="1.5" fill="rgba(52, 211, 153, 0.5)" />
            </pattern>
            <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#060D17" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#060D17" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#060D17" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#agriGrid)" />
          <rect width="100%" height="100%" fill="url(#gridFade)" />
        </svg>

        {/* Telemetry Corner Badges */}
        <div style={{ position: 'absolute', top: '24px', left: '24px', fontSize: '0.68rem', fontFamily: 'monospace', color: '#34d399', opacity: 0.5, letterSpacing: '0.08em' }}>
          [LAT 28.6139° N / NDVI_V2.4]
        </div>
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', fontSize: '0.68rem', fontFamily: 'monospace', color: '#64748b', opacity: 0.5, letterSpacing: '0.08em' }}>
          [TELEMETRY_ENGINE: ONLINE]
        </div>
        <div style={{ position: 'absolute', bottom: '24px', right: '24px', fontSize: '0.68rem', fontFamily: 'monospace', color: '#64748b', opacity: 0.5, letterSpacing: '0.08em' }}>
          [APMC_GRID_SYNC: 2026]
        </div>
      </div>

      {/* Floating Micro Particles / Spectral Data Points */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${3 + (i % 3)}px`,
            height: `${3 + (i % 3)}px`,
            borderRadius: '50%',
            backgroundColor: i % 2 === 0 ? '#10b981' : '#fef08a',
            top: `${25 + (i * 8)}%`,
            left: `${18 + (i * 9)}%`,
            animation: `dataPointFloat ${3 + (i * 0.4)}s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s`,
            boxShadow: '0 0 8px currentColor',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Central Content Container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 24px',
          zIndex: 10,
          maxWidth: '540px',
        }}
      >
        {/* Logo Badge Container with Viewfinder Reticle Corners */}
        <div
          style={{
            position: 'relative',
            marginBottom: '26px',
            animation: 'logoRevealScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Subtle Outer Focus Rings */}
          <div
            style={{
              position: 'absolute',
              inset: '-14px',
              borderRadius: '32px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              pointerEvents: 'none',
            }}
          />

          {/* HUD Corner Reticle Marks */}
          <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '12px', height: '12px', borderTop: '2px solid #10b981', borderLeft: '2px solid #10b981', borderRadius: '3px 0 0 0' }} />
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '12px', height: '12px', borderTop: '2px solid #10b981', borderRight: '2px solid #10b981', borderRadius: '0 3px 0 0' }} />
          <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '12px', height: '12px', borderBottom: '2px solid #10b981', borderLeft: '2px solid #10b981', borderRadius: '0 0 0 3px' }} />
          <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '12px', height: '12px', borderBottom: '2px solid #10b981', borderRight: '2px solid #10b981', borderRadius: '0 0 3px 0' }} />

          {/* Central Logo Box */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 45px rgba(16, 185, 129, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.35)',
              position: 'relative',
              overflow: 'hidden',
              animation: 'softGlowHalo 3s ease-in-out infinite',
            }}
          >
            <Sprout size={44} style={{ position: 'absolute', transform: 'translate(-3px, -2px)' }} />
            <Sparkles size={24} style={{ position: 'absolute', transform: 'translate(14px, 12px)', color: '#fef08a' }} />

            {/* Futuristic AI Scanning Laser Beam Passing Through Logo */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent 0%, #34d399 20%, #ffffff 50%, #34d399 80%, transparent 100%)',
                boxShadow: '0 0 14px 2px #34d399, 0 0 24px rgba(16, 185, 129, 0.8)',
                animation: 'laserScanSweep 1.8s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* Step 5: Reveal Brand Name and Tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: phase >= 1 ? 1 : 0,
            animation: phase >= 1 ? 'textRevealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
          }}
        >
          {/* AGRINEXT Title */}
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              margin: 0,
              textShadow: '0 2px 16px rgba(0, 0, 0, 0.5)',
            }}
          >
            AGRI<span style={{ color: '#10b981', textShadow: '0 0 25px rgba(16, 185, 129, 0.6)' }}>NEXT</span>
          </h1>

          {/* Exact Tagline: THE AI OPERATING SYSTEM FOR MODERN AGRICULTURE */}
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              opacity: phase >= 2 ? 1 : 0,
              animation: phase >= 2 ? 'taglinesFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
            }}
          >
            <div
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#a7f3d0',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              THE AI OPERATING SYSTEM
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#94a3b8',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
              }}
            >
              FOR MODERN AGRICULTURE
            </div>
          </div>
        </div>

        {/* Step 7: Minimalist Progress Indicator */}
        <div
          style={{
            marginTop: '36px',
            width: '100%',
            maxWidth: '260px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {/* Progress Bar Track */}
          <div
            style={{
              width: '100%',
              height: '3px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 80%, #fef08a 100%)',
                borderRadius: '999px',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.7)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          {/* Dynamic Telemetry Status Text */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              fontSize: '0.64rem',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: '#64748b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ color: '#10b981' }}>{statusText}</span>
            <span style={{ color: '#94a3b8' }}>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
