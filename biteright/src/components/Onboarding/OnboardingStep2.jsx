import React, { useState } from 'react';

export default function OnboardingStep2({ onNext, onBack, initialData = {} }) {
  const [selectedGoals, setSelectedGoals] = useState(initialData.goals || []);
  const [activityLevel, setActivityLevel] = useState(initialData.activity_level || '');

  const goals = [
    { id: 'lose_weight', label: 'Lose Weight', description: 'Reduce body weight' },
    { id: 'gain_weight', label: 'Gain Weight', description: 'Increase body weight' },
    { id: 'build_muscle', label: 'Build Muscle', description: 'Increase muscle mass' },
    { id: 'maintain_weight', label: 'Maintain Weight', description: 'Keep current weight' },
    { id: 'improve_health', label: 'Improve Health', description: 'General wellness' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { value: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
  ];

  const toggleGoal = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({
      goals: selectedGoals,
      activity_level: activityLevel
    });
  };

  return (
    <div className="apple-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 className="title-medium text-center">What are your goals?</h2>
      <p className="body-text text-center mb-4">
        Select your fitness and health goals (you can choose multiple)
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
            Goals
          </label>
          <div style={{ display: 'grid', gap: '8px' }}>
            {goals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--apple-border-radius)',
                  border: selectedGoals.includes(goal.id) 
                    ? '2px solid var(--apple-blue)' 
                    : '1px solid var(--apple-light-gray)',
                  backgroundColor: selectedGoals.includes(goal.id) 
                    ? 'rgba(0, 122, 255, 0.1)' 
                    : 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'Inter'
                }}
              >
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>{goal.label}</div>
                <div style={{ fontSize: '14px', color: 'var(--apple-gray)' }}>{goal.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
            Activity Level
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--apple-border-radius)',
              border: '1px solid var(--apple-light-gray)',
              fontSize: '16px',
              fontFamily: 'Inter'
            }}
          >
            <option value="">Select activity level</option>
            {activityLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label} - {level.description}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button" 
            onClick={onBack}
            className="apple-button-secondary" 
            style={{ flex: 1 }}
          >
            Back
          </button>
          <button 
            type="submit" 
            className="apple-button" 
            style={{ flex: 1 }}
            disabled={selectedGoals.length === 0 || !activityLevel}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}