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
    }

    const handleFinish = async (data) => {
        const finalData = { ...formData, ...data };
        setLoading(true);
        setError('');
        const success = await createProfile(finalData);
        if (!success) {
            setError('Not enough rizz to create profile💀. PLease Try Later');
            setLoading(false);
        }
    };

    if(loading) return <div className='flex-center'>Creating your profile...</div>
    if(error) return <div className='flex-center'>{error}</div>


    switch(step) {
        case 1:
            return <OnboardingStep1 onNext={handleNext} initialData={formData} />;
        case 2:
            return <OnboardingStep2 onNext={handleNext} initialData={formData} />;
        case 3:
            return <OnboardingStep3 onNext={handleNext} initialData={formData} />;
        default:
            return <div className='flex-center'>Setup Complete!</div>
    }
}