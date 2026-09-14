import React from 'react';
import { OnboardingFlow } from '../components/OnboardingFlow';

interface OnboardingPageProps {
  onComplete?: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  return <OnboardingFlow onComplete={onComplete} />;
};

export default OnboardingPage;

