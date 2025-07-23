import React, { useState } from 'react';

export default function OnboardingStep2({ onNext, onBack, initialData = {} }) {
    const [selectedGoals, setSelectedGoals] = useState(initialData.goals || []);
    const [activityLevel, setActivityLevel] = useState(initialData.activity_level || '');

    const goals = [
        {}
        {}
        {}
        {}
        {}
    ]
}