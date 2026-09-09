import os

def write_brand_logo_intro():
    code = """import React, { useState, useEffect, useRef } from 'react';
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
"""
    with open('frontend/src/components/common/BrandLogoIntro.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("BrandLogoIntro.tsx written.")

def write_theme_toggle():
    code = """import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false, className = '', size = 'md' }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  const padding = size === 'sm' ? '4px 8px' : size === 'lg' ? '8px 16px' : '6px 12px';
  const minHeight = size === 'sm' ? '30px' : size === 'lg' ? '42px' : '36px';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`agrinext-theme-toggle ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        padding: padding,
        minHeight: minHeight,
        borderRadius: '10px',
        border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#fef08a' : '#475569',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '0.84rem',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: isDark ? 'rotate(15deg)' : 'rotate(0deg)',
        }}
      >
        {isDark ? (
          <Sun size={iconSize} color="#facc15" />
        ) : (
          <Moon size={iconSize} color="#0f172a" />
        )}
      </span>
      {showLabel && (
        <span style={{ color: isDark ? '#f8fafc' : '#334155', fontWeight: 700 }}>
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};
"""
    with open('frontend/src/components/common/ThemeToggle.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("ThemeToggle.tsx written.")

def write_contact_page():
    code = """import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2,
  Clock, Shield, Sparkles, HelpCircle, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'crop-disease',
    urgency: 'normal',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || (!formData.phone && !formData.email) || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }

    const generatedId = 'AGX-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generatedId);
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How fast will AGRINEXT support respond to crop emergency cases?',
      a: 'Urgent crop pest and blight outbreak tickets are reviewed by our AI system instantly and dispatched to regional ICAR/KVK experts within 15 to 30 minutes.'
    },
    {
      q: 'Is the Kisan AI Advisory and Helpline free for all farmers?',
      a: 'Yes, 100% of core diagnostics, Mandi rate feeds, weather advisories, and the 24/7 Kisan Call Center integrations are completely free of charge.'
    },
    {
      q: 'Can I send crop photos over WhatsApp for AI diagnosis?',
      a: 'Yes! Connect with our verified WhatsApp AI bot at +91 98765 43210 and send leaf or fruit photos directly to receive immediate diagnosis and treatment steps.'
    },
    {
      q: 'How do I report incorrect Mandi prices or regional weather anomalies?',
      a: 'Use the inquiry form above selecting "Mandi / Weather Discrepancy" or submit feedback via our Feedback Portal. Our telemetry team will verify and calibrate APMC feeds immediately.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1140px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #172033 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          padding: '36px 28px',
          borderRadius: '20px',
          border: isDark ? '1px solid #263449' : '1px solid #a7f3d0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ffffff',
              color: isDark ? '#34d399' : '#047857',
              fontSize: '0.78rem',
              fontWeight: 800,
              marginBottom: '12px',
              border: isDark ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #bbf7d0',
            }}
          >
            <Sparkles size={13} />
            <span>24/7 Farmer & Stakeholder Support</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#f8fafc' : '#064e3b', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            We\\'re Here to Assist Your Farm & Queries
          </h1>
          <p style={{ fontSize: '0.96rem', color: isDark ? '#cbd5e1' : '#334155', marginTop: '10px', lineHeight: 1.6 }}>
            Whether you need assistance with AI crop disease detection, live Mandi rates, government schemes, or system integration, our dedicated support team is ready to help.
          </p>
        </div>
      </div>

      {/* Grid: Contact Cards & Inquiry Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Direct Helplines & Office Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Toll Free Helpline */}
          <div
            className="card"
            style={{
              padding: '22px',
              backgroundColor: isDark ? '#172033' : '#ffffff',
              borderColor: isDark ? '#263449' : '#e2e8f0',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#064e3b' : '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                flexShrink: 0,
              }}
            >
              <Phone size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Kisan Call Center Toll Free
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', marginTop: '2px' }}>
                1800-180-1551
              </div>
              <div style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                Available 24/7 in 22 regional Indian languages.
              </div>
            </div>
          </div>

          {/* WhatsApp AI Hotline */}
          <div
            className="card"
            style={{
              padding: '22px',
              backgroundColor: isDark ? '#172033' : '#ffffff',
              borderColor: isDark ? '#263449' : '#e2e8f0',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#14532d' : '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
                flexShrink: 0,
              }}
            >
              <MessageSquare size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                WhatsApp AI Crop Bot
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', marginTop: '2px' }}>
                +91 98765 43210
              </div>
              <div style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                Instant photo pathology & spray dosage recommendations.
              </div>
            </div>
          </div>

          {/* Email Support */}
          <div
            className="card"
            style={{
              padding: '22px',
              backgroundColor: isDark ? '#172033' : '#ffffff',
              borderColor: isDark ? '#263449' : '#e2e8f0',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#1e1b4b' : '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b5cf6',
                flexShrink: 0,
              }}
            >
              <Mail size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Official Email Desk
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginTop: '2px' }}>
                support@agrinext.in
              </div>
              <div style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                Government & research desk: helpdesk@agrinext.gov.in
              </div>
            </div>
          </div>

          {/* Headquarters Location */}
          <div
            className="card"
            style={{
              padding: '22px',
              backgroundColor: isDark ? '#172033' : '#ffffff',
              borderColor: isDark ? '#263449' : '#e2e8f0',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#451a03' : '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
                flexShrink: 0,
              }}
            >
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                National Agri-AI Command Center
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginTop: '2px' }}>
                ICAR-IARI Complex, Pusa Campus
              </div>
              <div style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                New Delhi, Delhi 110012, India
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry & Support Form */}
        <div
          className="card"
          style={{
            padding: '28px',
            backgroundColor: isDark ? '#172033' : '#ffffff',
            borderColor: isDark ? '#263449' : '#e2e8f0',
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '36px 16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#064e3b' : '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#064e3b' }}>
                Inquiry Submitted Successfully!
              </h3>
              <p style={{ fontSize: '0.92rem', color: isDark ? '#cbd5e1' : '#475569', marginTop: '8px' }}>
                Your ticket tracking number is:
              </p>
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  borderRadius: '10px',
                  backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                  color: '#10b981',
                  fontFamily: 'monospace',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  marginTop: '12px',
                  letterSpacing: '0.06em',
                }}
              >
                {ticketId}
              </div>
              <p style={{ fontSize: '0.84rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '14px' }}>
                An SMS and email confirmation has been dispatched. Our agricultural expert will reach out shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', phone: '', email: '', category: 'crop-disease', urgency: 'normal', message: '' });
                }}
                className="btn btn-secondary"
                style={{ marginTop: '24px' }}
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                  Send an Inquiry / Support Request
                </h3>
                <p style={{ fontSize: '0.84rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                  Fill out the form below and our agronomists will follow up with you.
                </p>
              </div>

              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Phone & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#111827' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="farmer@agrinext.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#111827' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Category & Urgency */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#111827' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  >
                    <option value="crop-disease">Crop Disease & AI Diagnosis</option>
                    <option value="mandi-rates">Mandi Rates & Price Feeds</option>
                    <option value="weather-alert">Weather & Radar Alert</option>
                    <option value="govt-scheme">Government Scheme Assistance</option>
                    <option value="equipment-rental">Equipment Rental / Service</option>
                    <option value="technical">Technical / Login Issue</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                    Urgency
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#111827' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  >
                    <option value="normal">Normal (within 24 hrs)</option>
                    <option value="urgent">Urgent Crop Outbreak</option>
                    <option value="critical">Critical Field Emergency</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                  Your Message or Question *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your crop condition, symptoms, or question in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px',
                }}
              >
                <Send size={16} />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div
        className="card"
        style={{
          padding: '28px',
          backgroundColor: isDark ? '#172033' : '#ffffff',
          borderColor: isDark ? '#263449' : '#e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <HelpCircle size={22} color="#10b981" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                style={{
                  border: isDark ? '1px solid #263449' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: isDark ? (isOpen ? '#1e293b' : '#111827') : (isOpen ? '#f8fafc' : '#ffffff'),
                  transition: 'background-color 0.2s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="#10b981" /> : <ChevronDown size={18} color="#94a3b8" />}
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: '0 18px 16px',
                      fontSize: '0.88rem',
                      color: isDark ? '#cbd5e1' : '#475569',
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
"""
    with open('frontend/src/pages/ContactPage.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("ContactPage.tsx written.")

def write_feedback_page():
    code = """import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Star, Heart, MessageSquare, ThumbsUp, Send, CheckCircle2,
  Sparkles, Award, Image as ImageIcon, Check, RefreshCw
} from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { currentUser, role } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState('ai-accuracy');
  const [npsScore, setNpsScore] = useState<number>(10);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ratingDescriptions: Record<number, { label: string; color: string }> = {
    1: { label: 'Needs Immediate Improvement 😞', color: '#ef4444' },
    2: { label: 'Fair / Could be Better 😐', color: '#f97316' },
    3: { label: 'Good & Helpful 🙂', color: '#eab308' },
    4: { label: 'Very Good Experience 😊', color: '#10b981' },
    5: { label: 'Outstanding AI Tool! 🚀🌟', color: '#059669' },
  };

  const categories = [
    { id: 'ai-accuracy', label: 'AI Disease & Pest Detection' },
    { id: 'weather-radar', label: 'Weather Forecast & Spray Radar' },
    { id: 'mandi-rates', label: 'Mandi Price Feeds & Transparency' },
    { id: 'ui-ux', label: 'Platform Design, Speed & Ease of Use' },
    { id: 'multilingual', label: 'Regional Language Accuracy' },
    { id: 'new-feature', label: 'New Feature or Module Request' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) {
      alert('Please provide a brief feedback note.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '860px', margin: '0 auto' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #172033 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          padding: '36px 28px',
          borderRadius: '20px',
          border: isDark ? '1px solid #263449' : '1px solid #a7f3d0',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '999px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ffffff',
            color: isDark ? '#34d399' : '#047857',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '12px',
            border: isDark ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #bbf7d0',
          }}
        >
          <Sparkles size={14} color="#eab308" />
          <span>Continuous AI Improvement Program</span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: isDark ? '#f8fafc' : '#064e3b', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Your Feedback Powers Indian Agriculture AI
        </h1>
        <p style={{ fontSize: '0.96rem', color: isDark ? '#cbd5e1' : '#334155', marginTop: '10px', maxWidth: '640px', margin: '10px auto 0', lineHeight: 1.6 }}>
          Help us refine disease diagnostic neural networks, improve regional APMC price precision, and build tools tailored for every Indian farmer.
        </p>
      </div>

      {/* Main Form Card */}
      <div
        className="card"
        style={{
          padding: '32px 28px',
          backgroundColor: isDark ? '#172033' : '#ffffff',
          borderColor: isDark ? '#263449' : '#e2e8f0',
        }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: isDark ? '#064e3b' : '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#f8fafc' : '#064e3b' }}>
              Thank You for Your Valuable Feedback!
            </h3>
            <p style={{ fontSize: '0.96rem', color: isDark ? '#cbd5e1' : '#475569', marginTop: '8px', maxWidth: '520px', margin: '8px auto 0', lineHeight: 1.6 }}>
              Your rating and comments have been delivered directly to the AGRINEXT AI Core Team & Agronomy Research Board.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                marginTop: '20px',
                color: '#10b981',
                fontWeight: 800,
                fontSize: '0.9rem',
              }}
            >
              <Award size={18} />
              <span>Contributed to Model Version v2.4 Calibration</span>
            </div>

            <div style={{ marginTop: '28px' }}>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setComments('');
                  setRating(5);
                }}
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <RefreshCw size={15} />
                <span>Submit Another Review</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            {/* 1. Overall Experience Rating */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                How would you rate your overall AGRINEXT experience?
              </label>

              {/* Star Rating Buttons */}
              <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        transition: 'transform 0.15s ease',
                        transform: active ? 'scale(1.15)' : 'scale(1)',
                      }}
                      title={`${star} Stars`}
                    >
                      <Star
                        size={36}
                        color={active ? '#eab308' : (isDark ? '#334155' : '#cbd5e1')}
                        fill={active ? '#eab308' : 'transparent'}
                      />
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  color: ratingDescriptions[hoverRating || rating]?.color || '#10b981',
                }}
              >
                {ratingDescriptions[hoverRating || rating]?.label}
              </div>
            </div>

            {/* 2. Feedback Category Chips */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '10px' }}>
                Which feature or module are you reviewing?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {categories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: isSelected
                          ? '2px solid #10b981'
                          : (isDark ? '1px solid #334155' : '1px solid #cbd5e1'),
                        backgroundColor: isSelected
                          ? (isDark ? '#064e3b' : '#ecfdf5')
                          : (isDark ? '#111827' : '#ffffff'),
                        color: isSelected
                          ? (isDark ? '#34d399' : '#065f46')
                          : (isDark ? '#f8fafc' : '#334155'),
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{cat.label}</span>
                      {isSelected && <Check size={16} color="#10b981" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Detailed Feedback */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '8px' }}>
                What did you like most, or what should we improve? *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share your thoughts on AI diagnosis speed, weather alerts, Mandi accuracy, or any issues you encountered..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  backgroundColor: isDark ? '#111827' : '#ffffff',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* 4. NPS Likelihood Slider (0 to 10) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155' }}>
                  How likely are you to recommend AGRINEXT to other farmers or colleagues?
                </label>
                <span
                  style={{
                    padding: '2px 10px',
                    borderRadius: '999px',
                    backgroundColor: npsScore >= 9 ? '#dcfce7' : npsScore >= 7 ? '#fef3c7' : '#fee2e2',
                    color: npsScore >= 9 ? '#15803d' : npsScore >= 7 ? '#b45309' : '#b91c1c',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                  }}
                >
                  {npsScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={npsScore}
                onChange={(e) => setNpsScore(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#10b981',
                  cursor: 'pointer',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                <span>0 - Not Likely</span>
                <span>5 - Neutral</span>
                <span>10 - Extremely Likely</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '14px 24px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.96rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px',
              }}
            >
              <Send size={18} />
              <span>Submit Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
"""
    with open('frontend/src/pages/FeedbackPage.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("FeedbackPage.tsx written.")

def write_header():
    code = """import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import type { UserRole } from '../../types';
import {
  Languages, Bell, User as UserIcon, Shield, Sparkles,
  ChevronDown, LogOut, Sprout, ShoppingBag, Award, Wrench,
  HelpCircle, MessageSquare, MapPin
} from 'lucide-react';
import { useFarmLocation } from '../../contexts/FarmLocationContext';
import { ThemeToggle } from '../common/ThemeToggle';

interface HeaderProps {
  onNavigate: (page: string) => void;
  activePage: string;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activePage, onReplayIntro }) => {
  const { currentUser, role, switchRole, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t, openLanguageModal, currentMeta } = useLanguage();
  const { isDark } = useTheme();
  const { notifications } = useData();
  const { location: farmLoc, openPicker } = useFarmLocation();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const rolesList: { id: UserRole; labelKey: string; icon: any }[] = [
    { id: 'farmer', labelKey: 'roleFarmer', icon: Sprout },
    { id: 'buyer', labelKey: 'roleBuyer', icon: ShoppingBag },
    { id: 'expert', labelKey: 'roleExpert', icon: Award },
    { id: 'equipment_owner', labelKey: 'roleEquipmentOwner', icon: Wrench },
    { id: 'admin', labelKey: 'roleAdmin', icon: Shield }
  ];

  const publicNavLinks = [
    { id: 'landing', labelKey: 'navHome', labelFallback: 'Home' },
    { id: 'about', labelKey: 'navAbout', labelFallback: 'About Us' },
    { id: 'how-it-works', labelKey: 'navHowItWorks', labelFallback: 'How It Works' },
    { id: 'why-agrinext', labelKey: 'navWhyAgrinext', labelFallback: 'Why AGRINEXT' },
    { id: 'mandi-rates', labelKey: 'navMandi', labelFallback: 'Mandi Rates' },
    { id: 'contact', labelKey: 'navContact', labelFallback: 'Contact Us' },
    { id: 'feedback', labelKey: 'navFeedback', labelFallback: 'Feedback' },
  ];

  const authNavLinks = [
    { id: 'dashboard', labelKey: 'navDashboard', labelFallback: 'Dashboard' },
    { id: 'farms', labelKey: 'navMyFarm', labelFallback: 'My Farms' },
    { id: 'crops', labelKey: 'navCrops', labelFallback: 'Crops' },
    { id: 'weather', labelKey: 'navWeather', labelFallback: 'Weather' },
    { id: 'mandi-rates', labelKey: 'navMandi', labelFallback: 'Mandi Rates' },
    { id: 'contact', labelKey: 'navContact', labelFallback: 'Help Desk' },
  ];

  const activeNavLinks = isAuthenticated ? authNavLinks : publicNavLinks;

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: isDark ? '#111827' : '#ffffff',
        borderBottom: isDark ? '1px solid #263449' : '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: isDark ? '0 2px 10px rgba(0, 0, 0, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.03)',
      }}
    >
      <style>{`
        .agrinext-header-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          cursor: pointer;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .agrinext-header-brand:hover .agrinext-logo-badge {
          transform: translateY(-1px) scale(1.04);
          box-shadow: 0 4px 14px rgba(16,185,129,0.35) !important;
        }
        .agrinext-header-brand:active {
          transform: scale(0.98);
        }
        .agrinext-nav-btn {
          white-space: nowrap;
          border-radius: 10px;
          padding: 6px 12px;
          font-size: 0.83rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
      `}</style>
      
      {/* Brand Logo & Tagline */}
      <div
        className="agrinext-header-brand"
        onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'landing')}
      >
        <div
          className="agrinext-logo-badge"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
            position: 'relative',
            flexShrink: 0,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          <Sprout size={20} style={{ position: 'absolute', transform: 'translate(-2px, -1px)' }} />
          <Sparkles size={13} style={{ position: 'absolute', transform: 'translate(5px, 4px)', color: '#fef08a' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.22rem', fontWeight: '900', color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            AGRI<span style={{ color: '#10b981' }}>NEXT</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '2px' }}>
            <span style={{ fontSize: '0.53rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: isDark ? '#34d399' : '#047857', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              THE AI OPERATING SYSTEM
            </span>
            <span style={{ fontSize: '0.50rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              FOR MODERN AGRICULTURE
            </span>
          </div>
        </div>
      </div>

      {/* Top Header Navigation Links */}
      <nav
        className="desktop-only"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: isDark ? '#1e293b' : '#f8fafc',
          padding: '3px 5px',
          borderRadius: '12px',
          border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          margin: '0 12px',
          overflowX: 'auto',
          maxWidth: '520px',
        }}
      >
        {activeNavLinks.map((link) => {
          const isActive =
            activePage === link.id ||
            (link.id === 'landing' && activePage === '') ||
            (link.id === 'farms' && activePage === 'farm') ||
            (link.id === 'mandi-rates' && (activePage === 'mandi' || activePage === 'mandi-rates')) ||
            (link.id === 'contact' && (activePage === 'contact' || activePage === 'support'));
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="agrinext-nav-btn"
              style={{
                border: isActive
                  ? (isDark ? '1px solid #059669' : '1px solid #cbd5e1')
                  : '1px solid transparent',
                backgroundColor: isActive
                  ? (isDark ? '#064e3b' : '#ffffff')
                  : 'transparent',
                color: isActive
                  ? (isDark ? '#34d399' : '#047857')
                  : (isDark ? '#cbd5e1' : '#475569'),
                fontWeight: isActive ? 800 : 600,
                boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = isDark ? '#334155' : 'rgba(255,255,255,0.8)';
                  e.currentTarget.style.color = isDark ? '#f8fafc' : '#0f172a';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isDark ? '#cbd5e1' : '#475569';
                }
              }}
            >
              {t(link.labelKey, link.labelFallback)}
            </button>
          );
        })}
      </nav>

      {/* Right Header Action Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Global Theme Toggle (Sun/Moon) */}
        <ThemeToggle size="md" />

        {isAuthenticated ? (
          <>
            {/* Farm Location Pill */}
            <button
              className="btn btn-secondary"
              onClick={openPicker}
              style={{
                padding: '5px 11px',
                fontSize: '0.8rem',
                fontWeight: '700',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#f0fdf4',
                border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #bbf7d0',
                color: isDark ? '#34d399' : '#065f46',
                maxWidth: '170px',
                minHeight: '36px',
              }}
              title={`${t('farmGps', 'Farm GPS')}: ${farmLoc.formattedAddress || `${farmLoc.village || farmLoc.city}, ${farmLoc.district}`}`}
            >
              <MapPin size={14} color="#10b981" style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.78rem' }}>
                {farmLoc.village || farmLoc.city || farmLoc.district}, {farmLoc.state}
              </span>
            </button>

            {/* Language Selector */}
            <button
              className="btn btn-secondary"
              onClick={openLanguageModal}
              style={{
                padding: '5px 11px',
                fontSize: '0.82rem',
                fontWeight: '700',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minHeight: '36px',
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#334155' : '#cbd5e1',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
              title={t('chooseLanguage', 'Choose Language')}
            >
              <Languages size={15} color="#10b981" />
              <span>{currentMeta.nativeName || 'Language'}</span>
            </button>

            {/* Role Switcher Menu */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-outline"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                style={{
                  padding: '5px 11px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  borderRadius: '10px',
                  gap: '5px',
                  minHeight: '36px',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#cbd5e1',
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
              >
                <Sparkles size={14} color="#10b981" />
                <span>{t(rolesList.find(r => r.id === role)?.labelKey || 'roleFarmer')}</span>
                <ChevronDown size={13} />
              </button>

              {showRoleMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '210px',
                    backgroundColor: isDark ? '#172033' : '#ffffff',
                    borderRadius: '12px',
                    boxShadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.6)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    border: isDark ? '1px solid #263449' : '1px solid #e2e8f0',
                    padding: '6px 0',
                    zIndex: 50
                  }}
                >
                  <div style={{ padding: '6px 14px', fontSize: '0.7rem', fontWeight: '800', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {t('roleSelection', 'Select Role')}
                  </div>
                  {rolesList.map(r => {
                    const Icon = r.icon;
                    const isSelected = role === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => {
                          switchRole(r.id);
                          setShowRoleMenu(false);
                          if (r.id === 'admin') onNavigate('admin');
                          else if (r.id === 'buyer') onNavigate('buyer_dash');
                          else if (r.id === 'expert') onNavigate('expert_dash');
                          else if (r.id === 'equipment_owner') onNavigate('service_dash');
                          else onNavigate('dashboard');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '9px 14px',
                          cursor: 'pointer',
                          backgroundColor: isSelected
                            ? (isDark ? 'rgba(16, 185, 129, 0.2)' : 'var(--primary-50)')
                            : 'transparent',
                          color: isSelected
                            ? (isDark ? '#34d399' : 'var(--primary-800)')
                            : (isDark ? '#f8fafc' : 'var(--slate-700)'),
                          fontWeight: isSelected ? '800' : '600',
                          fontSize: '0.88rem'
                        }}
                      >
                        <Icon size={16} color={isSelected ? '#10b981' : (isDark ? '#94a3b8' : 'var(--slate-500)')} />
                        <span>{t(r.labelKey)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onNavigate('notifications')}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: isDark ? '#1e293b' : 'var(--slate-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#f8fafc' : 'var(--slate-700)',
                  border: isDark ? '1px solid #334155' : '1px solid var(--slate-200)',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <Bell size={18} />
              </div>
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isDark ? '2px solid #111827' : '2px solid #ffffff'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>

            {/* User Profile Avatar Menu */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '2px 4px', borderRadius: '12px' }}
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser.name}
                  style={{ width: '36px', height: '36px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #10b981' }}
                />
                <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: '800', color: isDark ? '#f8fafc' : 'var(--slate-800)', lineHeight: 1.2 }}>
                    {currentUser.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: isDark ? '#94a3b8' : 'var(--slate-500)', fontWeight: '600' }}>
                    {farmLoc.district || currentUser.district}, {farmLoc.state || currentUser.state}
                  </span>
                </div>
              </div>

              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '210px',
                    backgroundColor: isDark ? '#172033' : '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.6)' : 'var(--shadow-xl)',
                    border: isDark ? '1px solid #263449' : '1px solid var(--slate-200)',
                    padding: '8px 0',
                    zIndex: 50
                  }}
                >
                  <div
                    onClick={() => { onNavigate('profile'); setShowUserMenu(false); }}
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', color: isDark ? '#f8fafc' : '#0f172a' }}
                  >
                    <UserIcon size={16} />
                    <span>{t('navProfile', 'Profile')}</span>
                  </div>
                  <div
                    onClick={() => { onNavigate('contact'); setShowUserMenu(false); }}
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', color: isDark ? '#f8fafc' : '#0f172a' }}
                  >
                    <HelpCircle size={16} />
                    <span>{t('navContact', 'Support Desk')}</span>
                  </div>
                  <div
                    onClick={() => { onNavigate('feedback'); setShowUserMenu(false); }}
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', color: isDark ? '#f8fafc' : '#0f172a' }}
                  >
                    <MessageSquare size={16} />
                    <span>{t('navFeedback', 'Give Feedback')}</span>
                  </div>
                  <div
                    onClick={() => { logout(); onNavigate('landing'); setShowUserMenu(false); }}
                    style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '700', color: '#ef4444', borderTop: isDark ? '1px solid #263449' : '1px solid #f1f5f9', marginTop: '4px' }}
                  >
                    <LogOut size={16} />
                    <span>{t('logout', 'Sign Out')}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Sign Out Button */}
            <button
              onClick={() => {
                logout();
                onNavigate('landing');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
                color: '#ef4444',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              title={t('logout', 'Sign Out')}
            >
              <LogOut size={15} />
              <span className="desktop-only">{t('logout', 'Sign Out')}</span>
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-secondary"
              onClick={openLanguageModal}
              style={{
                padding: '6px 12px',
                fontSize: '0.84rem',
                fontWeight: '700',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minHeight: '38px',
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#334155' : '#cbd5e1',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
              title={t('chooseLanguage', 'Choose Language')}
            >
              <Languages size={16} color="#10b981" />
              <span>{currentMeta.nativeName || 'Language'}</span>
            </button>

            <button
              className="btn btn-outline"
              onClick={() => onNavigate('role-selection')}
              style={{
                padding: '6px 14px',
                fontSize: '0.84rem',
                fontWeight: '800',
                borderRadius: '12px',
                minHeight: '38px',
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#334155' : '#cbd5e1',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
            >
              {t('signIn', 'Sign In')}
            </button>

            <button
              className="btn btn-primary"
              onClick={() => onNavigate('role-selection')}
              style={{ padding: '6px 16px', fontSize: '0.84rem', fontWeight: '800', borderRadius: '12px', minHeight: '38px' }}
            >
              {t('getStarted', 'Get Started')}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
"""
    with open('frontend/src/components/layout/Header.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Header.tsx written.")

def write_public_header():
    code = """import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Sprout, Sparkles, Languages, LogIn, ArrowRight, LayoutDashboard, LogOut, Phone, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, openLanguageModal, currentMeta } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const { isDark } = useTheme();

  const navLinks = [
    { path: '/', labelKey: 'navHome', labelDefault: 'Home' },
    { path: '/about', labelKey: 'navAbout', labelDefault: 'About Us' },
    { path: '/how-it-works', labelKey: 'navHowItWorks', labelDefault: 'How It Works' },
    { path: '/why-agrinext', labelKey: 'navWhyAgrinext', labelDefault: 'Why AGRINEXT' },
    { path: '/mandi-rates', labelKey: 'navMandi', labelDefault: 'Mandi Rates' },
    { path: '/contact', labelKey: 'navContact', labelDefault: 'Contact Us' },
    { path: '/feedback', labelKey: 'navFeedback', labelDefault: 'Feedback' },
  ];

  return (
    <header
      className="glass-nav-sticky"
      style={{
        height: '70px',
        backgroundColor: isDark ? 'rgba(17, 24, 39, 0.92)' : 'rgba(248, 250, 245, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isDark ? '1px solid #263449' : '1px solid #dcfce7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(20,83,45,0.05)',
      }}
    >
      {/* Brand Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '11px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
            position: 'relative',
            flexShrink: 0,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <Sprout size={20} style={{ position: 'absolute', transform: 'translate(-2px, -1px)' }} />
          <Sparkles size={13} style={{ position: 'absolute', transform: 'translate(5px, 4px)', color: '#fef08a' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.22rem', fontWeight: '900', color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            AGRI<span style={{ color: '#10b981' }}>NEXT</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '2px' }}>
            <span style={{ fontSize: '0.53rem', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', color: isDark ? '#34d399' : '#047857', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              THE AI OPERATING SYSTEM
            </span>
            <span style={{ fontSize: '0.50rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              FOR MODERN AGRICULTURE
            </span>
          </div>
        </div>
      </div>

      {/* Public Top Navbar Navigation Links */}
      <nav
        className="desktop-only"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
          padding: '4px 6px',
          borderRadius: '14px',
          border: isDark ? '1px solid #334155' : '1px solid #dcfce7',
          margin: '0 12px',
          boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.02)',
        }}
      >
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                border: 'none',
                backgroundColor: isActive ? '#16A34A' : 'transparent',
                color: isActive ? '#FFFFFF' : (isDark ? '#cbd5e1' : '#17201A'),
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.84rem',
                padding: '6px 12px',
                borderRadius: '9px',
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 8px rgba(22,163,74,0.3)' : 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {t(link.labelKey, link.labelDefault)}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Theme Toggle, Language Switcher, Sign In & Get Started */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Global Light/Dark Switcher */}
        <ThemeToggle size="md" />

        <button
          onClick={openLanguageModal}
          style={{
            padding: '7px 12px',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '10px',
            backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
            color: isDark ? '#f8fafc' : '#14532D',
            border: isDark ? '1px solid #334155' : '1px solid #dcfce7',
            cursor: 'pointer',
          }}
          title="Switch Language (17 Languages Supported)"
        >
          <Languages size={16} color="#16A34A" />
          <span>{currentMeta.nativeName || 'Language'}</span>
        </button>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* My Dashboard button */}
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '8px 16px',
                fontSize: '0.88rem',
                fontWeight: 800,
                borderRadius: '10px',
                backgroundColor: '#14532D',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(20, 83, 45, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <LayoutDashboard size={16} />
              <span>{t('myDashboard', 'My Dashboard')}</span>
              <ArrowRight size={15} />
            </button>

            {/* Sign Out button */}
            <button
              onClick={() => {
                logout();
                navigate('/', { replace: true });
              }}
              style={{
                padding: '8px 12px',
                fontSize: '0.85rem',
                fontWeight: 800,
                borderRadius: '10px',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                color: '#ef4444',
                border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1.5px solid #fecaca',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
              title={t('logout', 'Sign Out')}
            >
              <LogOut size={15} />
              <span>{t('logout', 'Sign Out')}</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Sign In button */}
            <button
              onClick={() => navigate('/role-selection', { state: { from: { pathname: '/dashboard' } } })}
              style={{
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: '800',
                borderRadius: '10px',
                color: isDark ? '#f8fafc' : '#14532D',
                backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
                border: isDark ? '1.5px solid #334155' : '1.5px solid #16A34A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <LogIn size={15} color="#16A34A" />
              <span>{t('signIn', 'Sign In')}</span>
            </button>

            {/* Get Started button */}
            <button
              onClick={() => navigate('/role-selection', { state: { from: { pathname: '/dashboard' } } })}
              style={{
                padding: '8px 16px',
                fontSize: '0.88rem',
                fontWeight: 800,
                borderRadius: '10px',
                backgroundColor: '#14532D',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(20, 83, 45, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{t('getStarted', 'Get Started')}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
"""
    with open('frontend/src/components/layout/PublicHeader.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("PublicHeader.tsx written.")

def write_sidebar():
    code = """import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import {
  LayoutDashboard,
  Sprout,
  Wheat,
  ShieldAlert,
  Bug,
  Sun,
  Bell,
  User,
  Settings,
  Bot,
  TrendingUp,
  ShoppingBag,
  Landmark,
  Wrench,
  DollarSign,
  Shield,
  Scan,
  Sparkles,
  ChevronRight,
  Info,
  HelpCircle,
  Award,
  MapPin,
  Activity,
  ShieldCheck,
  LogOut,
  MessageSquare,
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

interface NavItem {
  id: string;
  labelKey: string;
  labelFallback: string;
  icon: any;
  badge?: string;
  count?: number;
  isScanner?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const { t, language } = useLanguage();
  const { role, currentUser, logout } = useAuth();
  const { isDark } = useTheme();
  const { notifications } = useData();
  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  const isScannerActive = activePage === 'disease' || activePage === 'disease-detection' || activePage === 'crop_intel';

  let coreNavItems: NavItem[] = [];
  let intelNavItems: NavItem[] = [];
  let ecosystemNavItems: NavItem[] = [];
  let supportNavItems: NavItem[] = [
    { id: 'contact', labelKey: 'navContact', labelFallback: 'Help Desk', icon: HelpCircle },
    { id: 'feedback', labelKey: 'navFeedback', labelFallback: 'Give Feedback', icon: MessageSquare, badge: 'NEW' },
    { id: 'settings', labelKey: 'navSettings', labelFallback: 'Settings', icon: Settings },
  ];

  if (role === 'expert') {
    coreNavItems = [
      { id: 'expert/dashboard', labelKey: 'navDashboard', labelFallback: 'Expert Overview', icon: LayoutDashboard },
      { id: 'expert/consultations', labelKey: 'navDisease', labelFallback: 'Farmer Consultations', icon: ShieldAlert, count: 2 },
      { id: 'expert/disease-cases', labelKey: 'navCropIntel', labelFallback: 'Crop Analysis', icon: Wheat },
      { id: 'hotspots', labelKey: 'navHotspots', labelFallback: 'Regional Hotspots', icon: MapPin },
    ];
    intelNavItems = [
      { id: 'early-warning', labelKey: 'navEarlyWarning', labelFallback: 'Early Warning Model', icon: Activity, badge: 'NEW' },
      { id: 'weather', labelKey: 'navWeather', labelFallback: 'Weather Intelligence', icon: Sun },
      { id: 'ai', labelKey: 'navAI', labelFallback: 'Agrinext AI Advisory', icon: Bot, badge: 'GPT' },
    ];
    ecosystemNavItems = [
      { id: 'official', labelKey: 'navOfficial', labelFallback: 'Agri Official Command', icon: Award, badge: 'GOVT' },
      { id: 'mandi', labelKey: 'navMandi', labelFallback: 'Mandi Rates', icon: TrendingUp },
      { id: 'marketplace', labelKey: 'navMarketplace', labelFallback: 'Crop Marketplace', icon: ShoppingBag },
    ];
  } else if (role === 'buyer') {
    coreNavItems = [
      { id: 'buyer/dashboard', labelKey: 'navDashboard', labelFallback: 'Buyer Overview', icon: LayoutDashboard },
      { id: 'buyer/marketplace', labelKey: 'navMarketplace', labelFallback: 'Produce Marketplace', icon: ShoppingBag },
      { id: 'buyer/mandi', labelKey: 'navMandi', labelFallback: 'Mandi Price Feeds', icon: TrendingUp },
    ];
    intelNavItems = [
      { id: 'weather', labelKey: 'navWeather', labelFallback: 'Weather Advisory', icon: Sun },
      { id: 'ai', labelKey: 'navAI', labelFallback: 'Agrinext AI', icon: Bot, badge: 'GPT' },
    ];
    ecosystemNavItems = [
      { id: 'economics', labelKey: 'navEconomics', labelFallback: 'Procurement Insights', icon: DollarSign },
    ];
  } else {
    coreNavItems = [
      { id: 'dashboard', labelKey: 'navDashboard', labelFallback: 'Dashboard', icon: LayoutDashboard },
      { id: 'disease', labelKey: 'navDisease', labelFallback: 'AI Crop Scanner', icon: ShieldAlert, badge: 'AI', isScanner: true },
      { id: 'farm', labelKey: 'navMyFarm', labelFallback: 'My Farms', icon: Sprout },
      { id: 'crops', labelKey: 'navCrops', labelFallback: 'Crop Cycles', icon: Wheat },
      { id: 'pests', labelKey: 'navPests', labelFallback: 'Pest Monitoring', icon: Bug },
      { id: 'follow-up', labelKey: 'navFollowUp', labelFallback: 'Follow-Up Tracker', icon: ShieldCheck, badge: 'SIH' },
    ];

    intelNavItems = [
      { id: 'early-warning', labelKey: 'navEarlyWarning', labelFallback: 'Early Warning Risk', icon: Activity, badge: 'NEW' },
      { id: 'hotspots', labelKey: 'navHotspots', labelFallback: 'Hotspot GIS Map', icon: MapPin, badge: 'GIS' },
      { id: 'weather', labelKey: 'navWeather', labelFallback: 'Weather & Spray', icon: Sun },
      { id: 'alerts', labelKey: 'navAlerts', labelFallback: 'Farm Alerts', icon: Bell, count: unreadAlertsCount },
      { id: 'ai', labelKey: 'navAI', labelFallback: 'Agrinext AI', icon: Bot, badge: 'GPT' },
    ];

    ecosystemNavItems = [
      { id: 'official', labelKey: 'navOfficial', labelFallback: 'Agri Official Console', icon: Award, badge: 'GOVT' },
      { id: 'mandi', labelKey: 'navMandi', labelFallback: 'Mandi Rates', icon: TrendingUp },
      { id: 'marketplace', labelKey: 'navMarketplace', labelFallback: 'Marketplace', icon: ShoppingBag },
      { id: 'schemes', labelKey: 'navSchemes', labelFallback: 'Govt Schemes', icon: Landmark },
      { id: 'equipment', labelKey: 'navEquipment', labelFallback: 'Farm Equipment', icon: Wrench },
      { id: 'economics', labelKey: 'navEconomics', labelFallback: 'Farm Economics', icon: DollarSign },
    ];
  }

  if (role === 'admin') {
    ecosystemNavItems.push({ id: 'admin', labelKey: 'navAdmin', labelFallback: 'Admin Console', icon: Shield });
  }

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div style={{ marginBottom: '16px' }}>
      <div
        style={{
          fontSize: '0.68rem',
          fontWeight: '800',
          color: isDark ? '#64748b' : '#94a3b8',
          textTransform: 'uppercase',
          padding: '4px 12px 6px',
          letterSpacing: '0.06em',
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            activePage === item.id ||
            (item.id === 'farm' && activePage === 'farms') ||
            (item.id === 'disease' && isScannerActive) ||
            (item.id === 'pests' && activePage === 'pest-monitoring') ||
            (item.id === 'early-warning' && (activePage === 'early-warning' || activePage === 'farmer/early-warning')) ||
            (item.id === 'hotspots' && (activePage === 'hotspots' || activePage === 'farmer/hotspots')) ||
            (item.id === 'follow-up' && (activePage === 'follow-up' || activePage === 'farmer/follow-up')) ||
            (item.id === 'official' && (activePage === 'official' || activePage === 'official/dashboard' || activePage === 'farmer/official')) ||
            (item.id === 'alerts' && activePage === 'notifications') ||
            (item.id === 'contact' && (activePage === 'contact' || activePage === 'farmer/contact' || activePage === 'support')) ||
            (item.id === 'feedback' && (activePage === 'feedback' || activePage === 'farmer/feedback'));

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isActive
                  ? (isDark ? 'rgba(16, 185, 129, 0.18)' : '#ecfdf5')
                  : 'transparent',
                color: isActive
                  ? (isDark ? '#34d399' : '#065f46')
                  : (isDark ? '#cbd5e1' : '#475569'),
                fontWeight: isActive ? '800' : '600',
                fontSize: '0.86rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                boxShadow: isActive ? 'inset 3px 0 0 #10b981' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f8fafc';
                  e.currentTarget.style.color = isDark ? '#f8fafc' : '#0f172a';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isDark ? '#cbd5e1' : '#475569';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} color={isActive ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')} />
                <span>{t(item.labelKey as any) || item.labelFallback}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      backgroundColor: isActive ? '#10b981' : (isDark ? '#1e293b' : '#e0f2fe'),
                      color: isActive ? '#ffffff' : (isDark ? '#38bdf8' : '#0369a1'),
                      border: isActive ? 'none' : (isDark ? '1px solid #334155' : '1px solid #bae6fd'),
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {item.count && item.count > 0 ? (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '999px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                    }}
                  >
                    {item.count}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside
      className="desktop-only"
      style={{
        width: '244px',
        backgroundColor: isDark ? '#0B1220' : '#ffffff',
        borderRight: isDark ? '1px solid #263449' : '1px solid var(--slate-200)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100vh - 70px)',
        position: 'sticky',
        top: '70px',
        overflowY: 'auto',
        padding: '16px 12px 20px',
        zIndex: 30,
      }}
    >
      <div>
        {/* Flagship Quick Scan CTA */}
        <div style={{ marginBottom: '18px', padding: '0 2px' }}>
          <button
            onClick={() => onNavigate('disease')}
            className="btn"
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(5, 150, 105, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(5, 150, 105, 0.35)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Scan size={16} color="#ffffff" />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>
                {t('scanCrop', 'Scan My Crop')}
              </span>
            </div>
            <Sparkles size={16} color="#fef08a" />
          </button>
        </div>

        {/* Group 1: Core Navigation */}
        {renderNavGroup(t('navCoreDiagnostics', 'Core Diagnostics'), coreNavItems)}

        {/* Group 2: Intelligence & Telemetry */}
        {renderNavGroup(t('navTelemetryAlerts', 'Telemetry & Alerts'), intelNavItems)}

        {/* Group 3: Agri Ecosystem */}
        {renderNavGroup(t('navAgriEcosystem', 'Agri Ecosystem'), ecosystemNavItems)}

        {/* Group 4: Support & Feedback */}
        {renderNavGroup(t('navSupportDesk', 'Support & Preferences'), supportNavItems)}
      </div>

      {/* Footer Profile & Status Chip + Sign Out */}
      <div
        style={{
          borderTop: isDark ? '1px solid #263449' : '1px solid var(--slate-200)',
          paddingTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            onClick={() => onNavigate('profile')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '12px',
              border: isDark ? '1px solid #263449' : '1px solid var(--slate-200)',
              backgroundColor: isDark ? '#172033' : '#f8fafc',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s ease',
              minWidth: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? '#172033' : '#f8fafc')}
            title={t('navProfile', 'Profile')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '10px',
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'var(--primary-100)',
                  color: isDark ? '#34d399' : 'var(--primary-800)',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'F'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: isDark ? '#f8fafc' : 'var(--slate-900)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {currentUser?.name || 'Farmer User'}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#10b981', fontWeight: 700, textTransform: 'capitalize' }}>
                  ● {t(role === 'farmer' ? 'roleFarmer' : role === 'buyer' ? 'roleBuyer' : role === 'expert' ? 'roleExpert' : role === 'equipment_owner' ? 'roleEquipmentOwner' : role === 'admin' ? 'roleAdmin' : 'roleFarmer', role || 'Farmer')}
                </div>
              </div>
            </div>
            <ChevronRight size={14} color={isDark ? '#64748b' : '#94a3b8'} />
          </button>

          <button
            onClick={() => {
              logout();
              onNavigate('landing');
            }}
            style={{
              padding: '8px 10px',
              borderRadius: '12px',
              border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease',
              flexShrink: 0,
            }}
            title={t('logout', 'Sign Out')}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
"""
    with open('frontend/src/components/layout/Sidebar.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Sidebar.tsx written.")

def write_main_layout():
    code = """import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';
import { BrandLogoIntro } from '../components/common/BrandLogoIntro';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [showSplash, setShowSplash] = React.useState(false);

  const getActivePage = () => {
    const path = location.pathname.replace('/', '');
    if (!path || path === 'dashboard') return 'dashboard';
    if (path.startsWith('farms')) return 'farm';
    if (path.startsWith('crops')) return 'crops';
    if (path.startsWith('disease')) return 'disease';
    if (path.startsWith('pest')) return 'pests';
    if (path.startsWith('early-warning') || path.startsWith('farmer/early-warning')) return 'early-warning';
    if (path.startsWith('hotspots') || path.startsWith('farmer/hotspots')) return 'hotspots';
    if (path.startsWith('follow-up') || path.startsWith('farmer/follow-up')) return 'follow-up';
    if (path.startsWith('official') || path.startsWith('farmer/official')) return 'official';
    if (path.startsWith('weather')) return 'weather';
    if (path.startsWith('alerts')) return 'alerts';
    if (path.startsWith('contact') || path.startsWith('farmer/contact')) return 'contact';
    if (path.startsWith('feedback') || path.startsWith('farmer/feedback')) return 'feedback';
    if (path.startsWith('profile')) return 'profile';
    if (path.startsWith('settings')) return 'settings';
    return path;
  };

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'farm':
      case 'farms':
        navigate('/farms');
        break;
      case 'crops':
        navigate('/crops');
        break;
      case 'crop_intel':
      case 'disease':
      case 'disease-detection':
        navigate('/disease-detection');
        break;
      case 'pests':
      case 'pest-monitoring':
        navigate('/pest-monitoring');
        break;
      case 'early-warning':
      case 'early_warning':
        navigate('/early-warning');
        break;
      case 'hotspots':
      case 'hotspot-map':
        navigate('/hotspots');
        break;
      case 'follow-up':
      case 'followup':
        navigate('/follow-up');
        break;
      case 'official':
      case 'official-dashboard':
        navigate('/official/dashboard');
        break;
      case 'weather':
        navigate('/weather');
        break;
      case 'alerts':
      case 'notifications':
        navigate('/alerts');
        break;
      case 'contact':
      case 'support':
        navigate('/contact');
        break;
      case 'feedback':
        navigate('/feedback');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'ai':
        navigate('/ai');
        break;
      case 'mandi':
      case 'mandi-rates':
        navigate('/mandi-rates');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'how-it-works':
        navigate('/how-it-works');
        break;
      case 'why-agrinext':
        navigate('/why-agrinext');
        break;
      case 'role-selection':
        navigate('/role-selection');
        break;
      case 'marketplace':
        navigate('/marketplace');
        break;
      case 'experts':
        navigate('/experts');
        break;
      case 'schemes':
        navigate('/schemes');
        break;
      case 'equipment':
        navigate('/equipment');
        break;
      case 'economics':
        navigate('/economics');
        break;
      case 'landing':
        navigate('/');
        break;
      default:
        navigate(`/${page}`);
    }
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: isDark ? '#0B1220' : '#f8fafc' }}>
      {showSplash && <BrandLogoIntro onComplete={() => setShowSplash(false)} />}
      <Header activePage={getActivePage()} onNavigate={handleNavigate} onReplayIntro={() => setShowSplash(true)} />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar activePage={getActivePage()} onNavigate={handleNavigate} />

        <main style={{ flex: 1, padding: '28px 20px', maxWidth: '1240px', margin: '0 auto', width: '100%', paddingBottom: '96px', minWidth: 0 }}>
          <Outlet context={{ onNavigate: handleNavigate }} />
        </main>
      </div>

      <BottomNav activePage={getActivePage()} onNavigate={handleNavigate} />
    </div>
  );
};
"""
    with open('frontend/src/layouts/MainLayout.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("MainLayout.tsx written.")

def write_public_layout():
    code = """import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { PublicHeader } from '../components/layout/PublicHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Sprout, Sparkles, Mail, Phone, Heart } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const isLandingPage = location.pathname === '/';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: isDark ? '#0B1220' : '#F8FAF5', color: isDark ? '#F8FAFC' : '#17201A' }}>
      <PublicHeader />

      <main style={{
        flex: 1,
        padding: isLandingPage ? '0' : '28px 20px',
        maxWidth: isLandingPage ? '100%' : '1240px',
        margin: '0 auto',
        width: '100%',
        minWidth: 0
      }}>
        <Outlet />
      </main>

      {/* Dark Forest Green Public Website Footer */}
      <footer
        style={{
          backgroundColor: isDark ? '#06130d' : '#052E16',
          color: '#dcfce7',
          padding: '48px 24px 24px',
          borderTop: isDark ? '2px solid #0f381e' : '2px solid #14532D',
          marginTop: 'auto',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ maxWidth: '380px' }}>
              <div
                onClick={() => navigate('/')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '12px' }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <Sprout size={20} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  AGRI<span style={{ color: '#16A34A' }}>NEXT</span>
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#bbf7d0' }}>
                {t('footerMission', 'Next-Generation AI Agriculture Operating System for Indian Agriculture. Real-time crop pathology, weather radar, and direct mandi prices.')}
              </p>
            </div>

            {/* Links Columns */}
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EAB308', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                  {t('footerPlatform', 'Platform')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                  <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('navHome', 'Home')}</span>
                  <span onClick={() => navigate('/about')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('navAbout', 'About Us')}</span>
                  <span onClick={() => navigate('/how-it-works')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('navHowItWorks', 'How It Works')}</span>
                  <span onClick={() => navigate('/why-agrinext')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('navWhyAgrinext', 'Why AGRINEXT')}</span>
                  <span onClick={() => navigate('/mandi-rates')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('navMandi', 'Mandi Rates')}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EAB308', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                  Help & Support
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                  <span onClick={() => navigate('/contact')} style={{ cursor: 'pointer', color: '#ffffff' }}>Contact Desk</span>
                  <span onClick={() => navigate('/feedback')} style={{ cursor: 'pointer', color: '#ffffff' }}>Give Feedback</span>
                  <span onClick={() => navigate('/role-selection')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('signIn', 'Sign In')}</span>
                  <span onClick={() => navigate('/role-selection')} style={{ cursor: 'pointer', color: '#ffffff' }}>{t('getStarted', 'Get Started')}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: isDark ? '1px solid #0f381e' : '1px solid #14532D',
              paddingTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.82rem',
              color: '#86efac',
            }}
          >
            <span>© 2026 AGRINEXT Inc. Smart India Hackathon 2026 Flagship Edition.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EAB308', fontWeight: 800 }}>
              <Sparkles size={14} />
              <span>AI Agriculture Operating System</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
"""
    with open('frontend/src/layouts/PublicLayout.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("PublicLayout.tsx written.")

def write_bottom_nav():
    code = """import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LayoutDashboard, Sprout, Scan, Sun, Bell } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { notifications } = useData();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const isScannerActive = activePage === 'disease' || activePage === 'disease-detection' || activePage === 'crop_intel';

  return (
    <nav
      className="mobile-only"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '68px',
        backgroundColor: isDark ? '#111827' : '#ffffff',
        borderTop: isDark ? '1px solid #263449' : '1px solid var(--slate-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        boxShadow: isDark ? '0 -4px 20px rgba(0, 0, 0, 0.5)' : '0 -4px 20px rgba(0, 0, 0, 0.06)',
        padding: '0 8px',
      }}
    >
      {/* 1. Dashboard */}
      <button
        onClick={() => onNavigate('dashboard')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'transparent',
          color: activePage === 'dashboard' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
          gap: '3px',
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        <LayoutDashboard size={20} color={activePage === 'dashboard' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')} />
        <span style={{ fontSize: '0.68rem', fontWeight: activePage === 'dashboard' ? 800 : 600 }}>
          {t('navDashboard', 'Dashboard')}
        </span>
      </button>

      {/* 2. My Farms */}
      <button
        onClick={() => onNavigate('farm')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'transparent',
          color: (activePage === 'farm' || activePage === 'farms') ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
          gap: '3px',
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        <Sprout size={20} color={(activePage === 'farm' || activePage === 'farms') ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')} />
        <span style={{ fontSize: '0.68rem', fontWeight: (activePage === 'farm' || activePage === 'farms') ? 800 : 600 }}>
          {t('navMyFarm', 'My Farms')}
        </span>
      </button>

      {/* 3. CENTER FLOATING AI SCAN BUTTON */}
      <div style={{ position: 'relative', top: '-14px' }}>
        <button
          onClick={() => onNavigate('disease')}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
            border: isDark ? '4px solid #111827' : '4px solid #ffffff',
            boxShadow: '0 8px 20px rgba(5, 150, 105, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
        >
          <Scan size={24} color="#ffffff" />
        </button>
        <div style={{ textAlign: 'center', marginTop: '2px' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: isScannerActive ? '#10b981' : (isDark ? '#f8fafc' : '#0f172a') }}>
            {t('scanCrop', 'Scan')}
          </span>
        </div>
      </div>

      {/* 4. Weather */}
      <button
        onClick={() => onNavigate('weather')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'transparent',
          color: activePage === 'weather' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
          gap: '3px',
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        <Sun size={20} color={activePage === 'weather' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')} />
        <span style={{ fontSize: '0.68rem', fontWeight: activePage === 'weather' ? 800 : 600 }}>
          {t('weather', 'Weather')}
        </span>
      </button>

      {/* 5. Alerts */}
      <button
        onClick={() => onNavigate('alerts')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          backgroundColor: 'transparent',
          color: (activePage === 'alerts' || activePage === 'notifications') ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'),
          gap: '3px',
          padding: '6px 12px',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Bell size={20} color={(activePage === 'alerts' || activePage === 'notifications') ? '#10b981' : (isDark ? '#94a3b8' : '#64748b')} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                minWidth: '16px',
                height: '16px',
                borderRadius: '999px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.68rem', fontWeight: (activePage === 'alerts' || activePage === 'notifications') ? 800 : 600 }}>
          {t('navAlerts', 'Alerts')}
        </span>
      </button>
    </nav>
  );
};
"""
    with open('frontend/src/components/layout/BottomNav.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("BottomNav.tsx written.")

def write_settings_page():
    code = """import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types';
import { Settings, Globe, Bell, Shield, Database, Save, Check, Sun, Moon, Sparkles, Laptop } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsWeatherAlerts, setSmsWeatherAlerts] = useState(true);
  const [pestThresholdNotification, setPestThresholdNotification] = useState(true);
  const [languageChoice, setLanguageChoice] = useState<Language>(language);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setLanguage(languageChoice);
    updateUserProfile({ language: languageChoice });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
          {t('settings.title', 'AGRINEXT System Settings')}
        </h1>
        <p style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
          {t('settings.subtitle', 'Configure language localization, dark/light appearance, real-time alert thresholds, and system preferences.')}
        </p>
      </div>

      {savedSuccess && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5',
            border: isDark ? '1px solid #059669' : '1px solid #a7f3d0',
            color: isDark ? '#34d399' : '#065f46',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          <Check size={18} /> Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Appearance & Dark Mode Settings Card */}
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: isDark ? '#172033' : '#ffffff',
            borderColor: isDark ? '#263449' : '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sun size={20} color="#eab308" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                Appearance & Theme Mode
              </h3>
            </div>
            <ThemeToggle size="md" showLabel={true} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div
              onClick={() => setTheme('light')}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                border: theme === 'light' ? '2px solid #10b981' : (isDark ? '1px solid #334155' : '1px solid #e2e8f0'),
                backgroundColor: theme === 'light' ? (isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4') : (isDark ? '#111827' : '#f8fafc'),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.15s ease',
              }}
            >
              <Sun size={18} color="#eab308" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isDark ? '#f8fafc' : '#0f172a' }}>Light Mode</div>
                <div style={{ fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#64748b' }}>Clean crisp daylight</div>
              </div>
            </div>

            <div
              onClick={() => setTheme('dark')}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                border: theme === 'dark' ? '2px solid #10b981' : (isDark ? '1px solid #334155' : '1px solid #e2e8f0'),
                backgroundColor: theme === 'dark' ? (isDark ? 'rgba(16,185,129,0.15)' : '#f0fdf4') : (isDark ? '#111827' : '#f8fafc'),
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.15s ease',
              }}
            >
              <Moon size={18} color="#facc15" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isDark ? '#f8fafc' : '#0f172a' }}>Dark Mode</div>
                <div style={{ fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#64748b' }}>Night field mode</div>
              </div>
            </div>
          </div>
        </div>

        {/* Language & Regional Settings */}
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: isDark ? '#172033' : '#ffffff',
            borderColor: isDark ? '#263449' : '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Globe size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              Language & Regional Localization
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                Interface Language
              </label>
              <select
                value={languageChoice}
                onChange={(e) => setLanguageChoice(e.target.value as Language)}
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  backgroundColor: isDark ? '#111827' : '#fff',
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.name}) {l.dir === 'rtl' ? '— [RTL]' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Early Warning & Alert Thresholds */}
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: isDark ? '#172033' : '#ffffff',
            borderColor: isDark ? '#263449' : '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Bell size={20} color="#d97706" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              Notification & Alert Thresholds
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#334155' }}>
              <input
                type="checkbox"
                checked={smsWeatherAlerts}
                onChange={(e) => setSmsWeatherAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
              />
              <span>High precipitation & heatwave advisory notifications</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#334155' }}>
              <input
                type="checkbox"
                checked={pestThresholdNotification}
                onChange={(e) => setPestThresholdNotification(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
              />
              <span>Regional disease spore and pest surge alerts</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#334155' }}>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
              />
              <span>Daily Mandi price updates & crop market intelligence</span>
            </label>
          </div>
        </div>

        {/* Backend Connectivity Status */}
        <div
          className="card"
          style={{
            padding: '24px',
            backgroundColor: isDark ? '#172033' : '#ffffff',
            borderColor: isDark ? '#263449' : '#e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Database size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              Backend REST API Configuration
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ padding: '10px 14px', backgroundColor: isDark ? '#111827' : '#f8fafc', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>API URL</div>
              <div style={{ fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', fontFamily: 'monospace', marginTop: '2px' }}>
                {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: isDark ? '#111827' : '#f8fafc', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>API Health Status</div>
              <div style={{ fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                Operational / Healthy
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.95rem',
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Save size={18} />
          <span>Save Preferences</span>
        </button>
      </form>
    </div>
  );
};
"""
    with open('frontend/src/pages/SettingsPage.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
def update_locales_nav():
    locales_dir = 'frontend/src/i18n/locales'
    translations = {
        'en': {'navContact': 'Contact Desk', 'navFeedback': 'Give Feedback', 'navSupportDesk': 'Support & Preferences'},
        'hi': {'navContact': 'सहायता केंद्र (Contact)', 'navFeedback': 'फीडबैक दें (Feedback)', 'navSupportDesk': 'सहायता एवं प्राथमिकताएं'},
        'mr': {'navContact': 'मदत केंद्र (Contact)', 'navFeedback': 'प्रतिक्रिया द्या', 'navSupportDesk': 'मदत आणि प्राधान्ये'},
        'bn': {'navContact': 'সহায়তা কেন্দ্র', 'navFeedback': 'মতামত দিন', 'navSupportDesk': 'সহায়তা ও পছন্দসমূহ'},
        'te': {'navContact': 'సహాయ కేంద్రం', 'navFeedback': 'అభిప్రాయం తెలపండి', 'navSupportDesk': 'మద్దతు & ప్రాధాన్యతలు'},
        'ta': {'navContact': 'உதவி மையம்', 'navFeedback': 'கருத்து தெரிவிக்கவும்', 'navSupportDesk': 'ஆதரவு & விருப்பத்தேர்வுகள்'},
        'gu': {'navContact': 'સહાયતા કેન્દ્ર', 'navFeedback': 'પ્રતિસાદ આપો', 'navSupportDesk': 'સહાય અને પસંદગીઓ'},
        'kn': {'navContact': 'ಸಹಾಯ ಕೇಂದ್ರ', 'navFeedback': 'ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ', 'navSupportDesk': 'ಬೆಂಬಲ ಮತ್ತು ಆದ್ಯತೆಗಳು'},
        'ml': {'navContact': 'സഹായ കേന്ദ്രം', 'navFeedback': 'അഭിപ്രായം അറിയിക്കുക', 'navSupportDesk': 'പിന്തുണ & മുൻഗണനകൾ'},
        'pa': {'navContact': 'ਸਹਾਇਤਾ ਕੇਂਦਰ', 'navFeedback': 'ਫੀਡਬੈਕ ਦਿਓ', 'navSupportDesk': 'ਸਹਾਇਤਾ ਅਤੇ ਤਰਜੀਹਾਂ'},
        'or': {'navContact': 'ସହାୟତା କେନ୍ଦ୍ର', 'navFeedback': 'ମତାମତ ଦିଅନ୍ତୁ', 'navSupportDesk': 'ସହାୟତା ଓ ପସନ୍ଦ'},
        'as': {'navContact': 'সহায়তা কেন্দ্ৰ', 'navFeedback': 'মতামত দিয়ক', 'navSupportDesk': 'সহায়তা আৰু পছন্দসমূহ'},
        'ne': {'navContact': 'सम्पर्क केन्द्र', 'navFeedback': 'प्रतिक्रिया दिनुहोस्', 'navSupportDesk': 'सहायता र प्राथमिकताहरू'},
        'ur': {'navContact': 'رابطہ ڈیسک', 'navFeedback': 'رائے دیں', 'navSupportDesk': 'مدد اور ترجیحات'},
        'fa': {'navContact': 'مرکز تماس', 'navFeedback': 'ارسال بازخورد', 'navSupportDesk': 'پشتیبانی و ترجیحات'},
        'ar': {'navContact': 'مكتب الاتصال', 'navFeedback': 'إرسال ملاحظات', 'navSupportDesk': 'الدعم والتفضيلات'},
        'sa': {'navContact': 'सम्पर्ककेन्द्रम्', 'navFeedback': 'प्रतिपुष्टिं ददातु', 'navSupportDesk': 'साहाय्यं प्राधान्यानि च'},
    }

    for code, terms in translations.items():
        filepath = os.path.join(locales_dir, f'{code}.ts')
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'navContact:' not in content:
                last_bracket = content.rfind('};')
                if last_bracket == -1:
                    last_bracket = content.rfind('}')
                insert_str = "  navContact: '" + terms['navContact'] + "',\n  navFeedback: '" + terms['navFeedback'] + "',\n  navSupportDesk: '" + terms['navSupportDesk'] + "',\n"
                new_content = content[:last_bracket] + insert_str + content[last_bracket:]
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {code}.ts")

if __name__ == '__main__':
    write_brand_logo_intro()
    write_theme_toggle()
    write_contact_page()
    write_feedback_page()
    write_header()
    write_public_header()
    write_sidebar()
    write_main_layout()
    write_public_layout()
    write_bottom_nav()
    write_settings_page()
    update_locales_nav()
    print("All components written successfully!")
