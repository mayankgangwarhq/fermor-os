import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, Award, ShoppingBag, ArrowRight, Sparkles, ArrowLeft, Languages } from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const { t, openLanguageModal, currentMeta } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const roleCards = [
    {
      id: 'farmer',
      title: t('roleFarmer', 'Farmer'),
      description: t('roleFarmerDesc', 'Manage crops, monitor farm conditions, and access AI crop disease diagnosis and alerts.'),
      cta: `${t('continueBtn', 'Continue →')} (${t('roleFarmer', 'Farmer')})`,
      route: '/login/farmer',
      icon: Sprout,
      color: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
      badge: t('primaryUserBadge', 'Primary Workspace'),
    },
    {
      id: 'expert',
      title: t('roleExpert', 'Agriculture Expert'),
      description: t('roleExpertDesc', 'Provide agronomic guidance, review laboratory referrals, validate AI diagnoses, and support farmers.'),
      cta: `${t('continueBtn', 'Continue →')} (${t('roleExpert', 'Expert')})`,
      route: '/login/expert',
      icon: Award,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      borderColor: '#ddd6fe',
      badge: t('agronomistBadge', 'Agronomist Console'),
    },
    {
      id: 'buyer',
      title: t('roleBuyer', 'Market Buyer'),
      description: t('roleBuyerDesc', 'Discover farm produce directly from farmers, negotiate bulk purchases, and track mandi price trends.'),
      cta: `${t('continueBtn', 'Continue →')} (${t('roleBuyer', 'Buyer')})`,
      route: '/login/buyer',
      icon: ShoppingBag,
      color: '#d97706',
      bgColor: '#fffbeb',
      borderColor: '#fde68a',
      badge: t('traderPortalBadge', 'Direct Marketplace'),
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
      }}
    >
      {/* Top Navbar Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            fontSize: '0.85rem',
            borderRadius: '10px',
          }}
        >
          <ArrowLeft size={16} />
          <span>{t('navHome', 'Back to Home')}</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={openLanguageModal}
          style={{ padding: '8px 14px', fontSize: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Languages size={16} color="var(--primary-600)" />
          <span>{currentMeta.nativeName || 'Language'}</span>
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '1080px', marginTop: '40px' }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 6px 16px rgba(16,185,129,0.35)',
                position: 'relative',
              }}
            >
              <Sprout size={26} style={{ position: 'absolute', transform: 'translate(-2px, -1px)' }} />
              <Sparkles size={14} style={{ position: 'absolute', transform: 'translate(9px, 7px)', color: '#fef08a' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                AGRI<span style={{ color: '#10b981' }}>NEXT</span>
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '3px' }}>
                {t('brandTagline', 'AI Agriculture Operating System')}
              </div>
            </div>
          </Link>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            {t('roleSelection', 'Choose Your Role')}
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748b', fontWeight: '500' }}>
            {t('chooseLanguageSub', 'Select how you want to use AGRINEXT')}
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {roleCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className="card card-interactive"
                onClick={() => navigate(card.route, { state: location.state })}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        backgroundColor: card.bgColor,
                        border: `1px solid ${card.borderColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: card.color,
                        boxShadow: `0 4px 12px ${card.color}20`,
                      }}
                    >
                      <Icon size={28} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        backgroundColor: card.bgColor,
                        color: card.color,
                        border: `1px solid ${card.borderColor}`,
                      }}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, marginBottom: '24px' }}>
                    {card.description}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontSize: '0.95rem', fontWeight: '800', color: card.color }}>
                    {card.cta}
                  </span>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: card.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                    }}
                  >
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
