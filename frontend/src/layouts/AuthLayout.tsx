import React from 'react';
import { Sprout, Sparkles, Scan, Sun, Activity, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, openLanguageModal, currentMeta } = useLanguage();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px',
        position: 'relative',
      }}
    >
      <style>{`
        .agrinext-auth-grid {
          display: grid;
          grid-template-columns: 420px 480px;
          gap: 0;
          width: 100%;
          max-width: 900px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.12), 0 0 1px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
        }

        .agrinext-brand-side {
          background: linear-gradient(135deg, #064e3b 0%, #047857 55%, #0f172a 100%);
          padding: 40px 32px;
          color: #ffffff;
          display: flex;
          flexDirection: column;
          justifyContent: space-between;
          position: relative;
          overflow: hidden;
        }

        .agrinext-brand-side::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.25) 0%, transparent 60%);
          pointer-events: none;
        }

        .floating-chip {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          alignItems: center;
          gap: 12px;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .floating-chip:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.18);
        }

        @media (max-width: 860px) {
          .agrinext-auth-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
          }
          .agrinext-brand-side {
            display: none;
          }
        }
      `}</style>

      {/* Top Language Switcher */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 20,
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={openLanguageModal}
          style={{
            padding: '7px 14px',
            fontSize: '0.82rem',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          🌐 {currentMeta.nativeName || 'Language'}
        </button>
      </div>

      {/* Main 2-Column Authentication Layout Container */}
      <div className="agrinext-auth-grid">
        {/* LEFT COLUMN: Visual Rich Brand Panel */}
        <div className="agrinext-brand-side">
          {/* Header Emblem */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
                  position: 'relative',
                }}
              >
                <Sprout size={24} style={{ position: 'absolute', transform: 'translate(-2px, -1px)' }} />
                <Sparkles size={14} style={{ position: 'absolute', transform: 'translate(8px, 6px)', color: '#fef08a' }} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  AGRI<span style={{ color: '#34d399' }}>NEXT</span>
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '3px' }}>
                  AI Agriculture Operating System
                </div>
              </div>
            </Link>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '10px' }}>
              {t('authBrandTitle', 'Intelligent tools for smarter, data-driven agriculture.')}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#d1fae5', lineHeight: 1.5, opacity: 0.9 }}>
              {t('authBrandDesc', 'Unified crop pathology vision, hyper-local spray windows, and verified APMC price feeds.')}
            </p>
          </div>

          {/* Floating UI Feature Chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '24px 0', position: 'relative', zIndex: 2 }}>
            <div className="floating-chip">
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scan size={18} color="#6ee7b7" />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff' }}>AI Pathology Vision</div>
                <div style={{ fontSize: '0.72rem', color: '#a7f3d0' }}>94%+ Diagnostic accuracy</div>
              </div>
            </div>

            <div className="floating-chip">
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(56, 189, 248, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sun size={18} color="#7dd3fc" />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff' }}>Weather Telemetry</div>
                <div style={{ fontSize: '0.72rem', color: '#bae6fd' }}>Optimal spray windows</div>
              </div>
            </div>

            <div className="floating-chip">
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(251, 191, 36, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={18} color="#fde68a" />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#ffffff' }}>Mandi Price Feeds</div>
                <div style={{ fontSize: '0.72rem', color: '#fef08a' }}>Daily APMC modal trends</div>
              </div>
            </div>
          </div>

          {/* Left Footer Trust Note */}
          <div style={{ position: 'relative', zIndex: 2, fontSize: '0.75rem', color: '#a7f3d0', fontWeight: '600' }}>
            ✓ Enterprise-grade precision farming security
          </div>
        </div>

        {/* RIGHT COLUMN: Sign In / Register Card */}
        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
          <div>{children}</div>

          {/* Card Bottom Footer Links */}
          <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
            <div>© 2026 AGRINEXT Inc. All rights reserved.</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '6px' }}>
              <span style={{ cursor: 'pointer', color: '#64748b' }}>Privacy Policy</span>
              <span>•</span>
              <span style={{ cursor: 'pointer', color: '#64748b' }}>Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
