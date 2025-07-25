import React, { useState } from 'react';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import { useUserProfile } from '../../contexts/UserProfileContext';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { createProfile } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleFinish = async (data) => {
    const finalData = { ...formData, ...data };
    setLoading(true);
    setError('');
    
    const success = await createProfile(finalData);

    if (!success) {
      setError('Failed to create your profile. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center">
        <div className="text-center">
          <h1 className="title-2">Creating Your Plan...</h1>
          <p className="body-text">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex-center">
          <div className="text-center">
            <p className="body-text-red">{error}</p>
            <button onClick={() => setStep(3)} className="apple-button-secondary mt-4">
              Try Again
            </button>
          </div>
        </div>
      );
  }

  switch (step) {
    case 1:
      return <OnboardingStep1 onNext={handleNext} initialData={formData} />;
    case 2:
      return <OnboardingStep2 onNext={handleNext} onBack={handleBack} initialData={formData} />;
    case 3:
      return <OnboardingStep3 onNext={handleFinish} onBack={handleBack} initialData={formData} />;
      return null;
  }
}