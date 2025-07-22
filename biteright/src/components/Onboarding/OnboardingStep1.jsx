import React, { useState } from 'react';

export default function OnboardingStep1({ onNext, initialData = {} }) {
  const [formData, setFormData] = useState({
    age: initialData.age || '',
    weight: initialData.weight || '',
    height: initialData.height || '',
    gender: initialData.gender || '',
    ...initialData
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="apple-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 className="title-medium text-center">Tell us about yourself</h2>
      <p className="body-text text-center mb-4">
        We need some basic information to create your personalized meal plans
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Age
          </label>
          <input
            type="number"
            placeholder="Enter your age"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--apple-border-radius)',
              border: '1px solid var(--apple-light-gray)',
              fontSize: '16px',
              fontFamily: 'Inter'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Weight (kg)
          </label>
          <input
            type="number"
            placeholder="Enter your weight"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--apple-border-radius)',
              border: '1px solid var(--apple-light-gray)',
              fontSize: '16px',
              fontFamily: 'Inter'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Height (cm)
          </label>
          <input
            type="number"
            placeholder="Enter your height"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--apple-border-radius)',
              border: '1px solid var(--apple-light-gray)',
              fontSize: '16px',
              fontFamily: 'Inter'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
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
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button type="submit" className="apple-button" style={{ width: '100%' }}>
          Continue
        </button>
      </form>
    </div>
  );
}