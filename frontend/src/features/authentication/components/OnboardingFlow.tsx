import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { UserDetailsForm, UserDetailsFormData } from './UserDetailsForm';
import { OtpVerification } from './OtpVerification';
import { VerificationSuccess } from './VerificationSuccess';
import { AadhaarConnected } from './AadhaarConnected';
import { AllSetTransition } from './AllSetTransition';

export type OnboardingStep =
  | 'USER_DETAILS'
  | 'OTP'
  | 'OTP_VERIFIED'
  | 'AADHAAR_LINKED'
  | 'ALL_SET'
  | 'DASHBOARD';

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { register, switchRole, isAuthenticated } = useAuth();
  const { language } = useLanguage();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('USER_DETAILS');
  const [formData, setFormData] = useState<UserDetailsFormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State sequence timer progression
  useEffect(() => {
    let timer: any;

    if (currentStep === 'OTP_VERIFIED') {
      timer = setTimeout(() => {
        setCurrentStep('AADHAAR_LINKED');
      }, 1000);
    } else if (currentStep === 'AADHAAR_LINKED') {
      timer = setTimeout(() => {
        setCurrentStep('ALL_SET');
      }, 1200);
    } else if (currentStep === 'ALL_SET') {
      timer = setTimeout(() => {
        switchRole('farmer');
        if (onComplete) {
          onComplete();
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 1200);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentStep, navigate, onComplete, switchRole]);

  // Handle User Details Form Submission
  const handleDetailsSubmit = async (data: UserDetailsFormData) => {
    setIsLoading(true);
    setFormData(data);

    try {
      // Register farmer user through backend auth service
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'farmer',
        phone: data.phone,
        aadhaarNumber: data.aadhaarNumber,
        state: data.state,
        district: data.district,
        village: data.village,
        language: language,
      });

      // Advance to OTP screen
      setCurrentStep('OTP');
    } catch (err: any) {
      // Even if registration fails due to mock/duplicate email, gracefully allow proceeding in demo mode
      console.warn('Backend registration note:', err.message);
      setCurrentStep('OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOtpVerify = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    // Demo verification logic: accept 6-digit input
    await new Promise((res) => setTimeout(res, 600));
    setIsLoading(false);

    if (otp && otp.length === 6) {
      setCurrentStep('OTP_VERIFIED');
      return true;
    }
    return false;
  };

  const maskedAadhaarDisplay = formData?.aadhaarNumber
    ? `•••• •••• ${formData.aadhaarNumber.slice(-4)}`
    : '•••• •••• 1234';

  const progressStepNumber = (() => {
    switch (currentStep) {
      case 'USER_DETAILS':
        return 1;
      case 'OTP':
      case 'OTP_VERIFIED':
        return 2;
      case 'AADHAAR_LINKED':
        return 3;
      case 'ALL_SET':
      case 'DASHBOARD':
        return 4;
      default:
        return 1;
    }
  })();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(220, 252, 231, 0.7) 0%, rgba(248, 250, 252, 1) 65%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleInCenter {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Progress Steps Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '24px',
          padding: '8px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '999px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: progressStepNumber >= 1 ? '#16A34A' : '#cbd5e1',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            1
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: progressStepNumber >= 1 ? '#14532D' : '#94a3b8' }}>
            Details
          </span>
        </div>

        <span style={{ width: '16px', height: '2px', backgroundColor: progressStepNumber >= 2 ? '#16A34A' : '#e2e8f0' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: progressStepNumber >= 2 ? '#16A34A' : '#cbd5e1',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            2
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: progressStepNumber >= 2 ? '#14532D' : '#94a3b8' }}>
            Verification
          </span>
        </div>

        <span style={{ width: '16px', height: '2px', backgroundColor: progressStepNumber >= 3 ? '#16A34A' : '#e2e8f0' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: progressStepNumber >= 3 ? '#16A34A' : '#cbd5e1',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            3
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: progressStepNumber >= 3 ? '#14532D' : '#94a3b8' }}>
            Identity
          </span>
        </div>

        <span style={{ width: '16px', height: '2px', backgroundColor: progressStepNumber >= 4 ? '#16A34A' : '#e2e8f0' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: progressStepNumber >= 4 ? '#16A34A' : '#cbd5e1',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            4
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: progressStepNumber >= 4 ? '#14532D' : '#94a3b8' }}>
            Complete
          </span>
        </div>
      </div>

      {/* 1. USER DETAILS FORM */}
      {currentStep === 'USER_DETAILS' && (
        <UserDetailsForm
          onSubmit={handleDetailsSubmit}
          isLoading={isLoading}
          onBack={() => navigate('/')}
        />
      )}

      {/* 2. OTP VERIFICATION */}
      {currentStep === 'OTP' && (
        <OtpVerification
          mobileNumber={formData?.phone || '9876543210'}
          onVerify={handleOtpVerify}
          isLoading={isLoading}
          onCancel={() => setCurrentStep('USER_DETAILS')}
        />
      )}

      {/* 3. OTP VERIFIED */}
      {currentStep === 'OTP_VERIFIED' && <VerificationSuccess />}

      {/* 4. AADHAAR LINKED */}
      {currentStep === 'AADHAAR_LINKED' && (
        <AadhaarConnected maskedAadhaar={maskedAadhaarDisplay} />
      )}

      {/* 5. YOU'RE ALL SET */}
      {currentStep === 'ALL_SET' && <AllSetTransition />}
    </div>
  );
};
