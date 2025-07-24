import React, { useState } from 'react';

export default function OnboardingStep3({ onNext, onBack, initialData = {} }) {
  const [dietaryRestrictions, setDietaryRestrictions] = useState(initialData.dietary_restrictions || []);
  const [allergies, setAllergies] = useState(initialData.allergies || []);
  const [customAllergy, setCustomAllergy] = useState('');

  const restrictions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'halal', label: 'Halal' },
    { id: 'kosher', label: 'Kosher' },
    { id: 'gluten_free', label: 'Gluten Free' },
    { id: 'dairy_free', label: 'Dairy Free' },
    { id: 'keto', label: 'Keto' },
    { id: 'paleo', label: 'Paleo' },
    { id: 'low_carb', label: 'Low Carb' },
    { id: 'mediterranean', label: 'Mediterranean' }
  ];

  const commonAllergies = [
    'Peanuts', 'Tree nuts', 'Milk', 'Eggs', 'Fish', 'Shellfish', 'Soy', 'Wheat'
  ];

  const toggleRestriction = (restrictionId) => {
    setDietaryRestrictions(prev => 
      prev.includes(restrictionId) 
        ? prev.filter(id => id !== restrictionId)
        : [...prev, restrictionId]
    );
  };

  const toggleAllergy = (allergy) => {
    setAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(item => item !== allergy)
        : [...prev, allergy]
    );
  };

  const addCustomAllergy = () => {
    if (customAllergy && !allergies.includes(customAllergy)) {
      setAllergies(prev => [...prev, customAllergy]);
      setCustomAllergy('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({
      dietary_restrictions: dietaryRestrictions,
      allergies: allergies
    });
  };

  return (
    <div className="apple-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 className="title-medium text-center">Dietary Preferences</h2>
      <p className="body-text text-center mb-4">
        Tell us about your dietary restrictions and allergies
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
            Dietary Restrictions (Optional)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
            {restrictions.map((restriction) => (
              <button
                key={restriction.id}
                type="button"
                onClick={() => toggleRestriction(restriction.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--apple-border-radius)',
                  border: dietaryRestrictions.includes(restriction.id) 
                    ? '2px solid var(--apple-blue)' 
                    : '1px solid var(--apple-light-gray)',
                  backgroundColor: dietaryRestrictions.includes(restriction.id) 
                    ? 'rgba(0, 122, 255, 0.1)' 
                    : 'white',
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                  fontSize: '14px'
                }}
              >
                {restriction.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
            Allergies (Optional)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '12px' }}>
            {commonAllergies.map((allergy) => (
              <button
                key={allergy}
                type="button"
                onClick={() => toggleAllergy(allergy)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--apple-border-radius)',
                  border: allergies.includes(allergy) 
                    ? '2px solid var(--apple-red)' 
                    : '1px solid var(--apple-light-gray)',
                  backgroundColor: allergies.includes(allergy) 
                    ? 'rgba(255, 59, 48, 0.1)' 
                    : 'white',
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                  fontSize: '14px'
                }}
              >
                {allergy}
              </button>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Add custom allergy"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--apple-border-radius)',
                border: '1px solid var(--apple-light-gray)',
                fontSize: '14px',
                fontFamily: 'Inter'
              }}
            />
            <button
              type="button"
              onClick={addCustomAllergy}
              className="apple-button-secondary"
              style={{ padding: '8px 16px' }}
            >
              Add
            </button>
          </div>
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
          >
            Complete Setup
          </button>
        </div>
      </form>
    </div>
  );
}