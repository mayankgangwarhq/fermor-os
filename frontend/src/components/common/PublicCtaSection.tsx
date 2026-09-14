import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, LogIn, Sparkles, LayoutDashboard } from 'lucide-react';

export const PublicCtaSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <div
      style={{
        marginTop: '48px',
        backgroundColor: '#14532D',
        borderRadius: '24px',
        padding: '44px 32px',
        color: '#ffffff',
        textAlign: 'center',
        boxShadow: '0 16px 36px rgba(20, 83, 45, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid #16A34A',
      }}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(234, 179, 8, 0.2)',
            color: '#EAB308',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 800,
            marginBottom: '16px',
          }}
        >
          <Sparkles size={16} />
          <span>{t('brandTagline', 'AGRINEXT AI Platform')}</span>
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '10px', lineHeight: 1.25, color: '#FFFFFF' }}>
          {t('readyForSmarterDecisions', 'Ready to Make Smarter Farming Decisions?')}
        </h2>

        <p style={{ fontSize: '1.05rem', opacity: 0.9, marginBottom: '28px', lineHeight: 1.6, color: '#DCFCE7' }}>
          {t('publicCtaDesc', "Explore AGRINEXT's AI-powered agriculture platform for yield maximization and disease protection.")}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: '#16A34A',
                color: '#ffffff',
                padding: '12px 28px',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '0.98rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <LayoutDashboard size={18} />
              <span>{t('myDashboard', 'My Dashboard')}</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/role-selection', { state: { from: { pathname: '/dashboard' } } })}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: '1.5px solid #DCFCE7',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <LogIn size={18} />
                <span>{t('signIn', 'Sign In')}</span>
              </button>

              <button
                onClick={() => navigate('/onboarding')}
                style={{
                  backgroundColor: '#16A34A',
                  color: '#ffffff',
                  padding: '12px 26px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>{t('getStarted', 'Get Started')}</span>
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
