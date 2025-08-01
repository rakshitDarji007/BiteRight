import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Utensils, AlertTriangle } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { generateMealPlan } from './utils/geminiApi';
import './index.css';

const GoalsStep = ({ onNext, formData, setFormData }) => {
  const goalOptions = [
    { id: 'lose_weight', label: 'Lose Weight', icon: <Target size={20} /> },
    { id: 'gain_weight', label: 'Gain Weight', icon: <Target size={20} /> },
    { id: 'build_muscle', label: 'Build Muscle', icon: <Target size={20} /> },
    { id: 'maintain_weight', label: 'Maintain Weight', icon: <Target size={20} /> },
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { id: 'lightly_active', label: 'Lightly Active (light exercise/sports 1-3 days/week)' },
    { id: 'moderately_active', label: 'Moderately Active (moderate exercise/sports 3-5 days/week)' },
    { id: 'very_active', label: 'Very Active (hard exercise/sports 6-7 days/week)' },
    { id: 'extra_active', label: 'Extra Active (very hard exercise/physical job)' },
  ];

  return (
    <div>
      <h2 className="text-title-2 text-center mb-lg">Your Goals</h2>
      <div className="mb-lg">
        <label className="block text-subhead text-secondary mb-xs">Primary Goal</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          {goalOptions.map((goal) => (
            <button
              key={goal.id}
              type="button"
              className={`btn-secondary flex items-center p-md text-left w-full ${formData.goal === goal.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setFormData({ ...formData, goal: goal.id })}
            >
              <span className="mr-sm">{goal.icon}</span>
              {goal.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-lg">
        <label className="block text-subhead text-secondary mb-xs">Activity Level</label>
        <select
          value={formData.activityLevel}
          onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
          className="input-field w-full"
        >
          <option value="">Select your activity level</option>
          {activityLevels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between">
        <div></div>
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

const PreferencesStep = ({ onNext, onBack, formData, setFormData }) => {
  const preferenceOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'pescatarian', label: 'Pescatarian' },
    { id: 'keto', label: 'Keto' },
    { id: 'paleo', label: 'Paleo' },
    { id: 'low_carb', label: 'Low Carb' },
    { id: 'high_protein', label: 'High Protein' },
    { id: 'gluten_free', label: 'Gluten Free' },
    { id: 'dairy_free', label: 'Dairy Free' },
    { id: 'nut_free', label: 'Nut Free' },
  ];

  const togglePreference = (prefId) => {
    setFormData(prev => {
      const newPreferences = prev.dietaryPreferences.includes(prefId)
        ? prev.dietaryPreferences.filter(id => id !== prefId)
        : [...prev.dietaryPreferences, prefId];
      return { ...prev, dietaryPreferences: newPreferences };
    });
  };

  return (
    <div>
      <h2 className="text-title-2 text-center mb-lg">Your Preferences</h2>
      <div className="mb-lg">
        <label className="block text-subhead text-secondary mb-xs">Dietary Preferences</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-xs">
          {preferenceOptions.map((pref) => (
            <button
              key={pref.id}
              type="button"
              className={`btn-secondary flex items-center p-sm text-left w-full ${formData.dietaryPreferences.includes(pref.id) ? 'ring-2 ring-primary' : ''}`}
              onClick={() => togglePreference(pref.id)}
            >
              <span className="mr-sm">{formData.dietaryPreferences.includes(pref.id) ? '✓' : '+'}</span>
              {pref.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

const RestrictionsStep = ({ onSubmit, onBack, formData, setFormData, isGenerating }) => {
  const [allergyInput, setAllergyInput] = useState('');
  const commonAllergies = ['Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 'Peanuts', 'Wheat', 'Soybeans'];

  const handleAddAllergy = (allergy) => {
    if (allergy && !formData.allergies.includes(allergy)) {
      setFormData({ ...formData, allergies: [...formData.allergies, allergy] });
    }
    setAllergyInput('');
  };

  const handleRemoveAllergy = (allergyToRemove) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter(a => a !== allergyToRemove)
    });
  };

  return (
    <div>
      <h2 className="text-title-2 text-center mb-lg">Your Restrictions</h2>
      
      <div className="mb-lg">
        <label className="block text-subhead text-secondary mb-xs">Allergies</label>
        <div className="flex flex-wrap gap-xs mb-md">
          {formData.allergies.map((allergy) => (
            <span key={allergy} className="bg-gray-700 px-sm py-xs rounded-full text-sm flex items-center">
              {allergy}
              <button
                type="button"
                onClick={() => handleRemoveAllergy(allergy)}
                className="ml-xs text-error hover:text-opacity-80"
                disabled={isGenerating}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            placeholder="Add an allergy (e.g., Eggs)"
            className="input-field flex-grow mr-xs"
            onKeyPress={(e) => e.key === 'Enter' && !isGenerating && handleAddAllergy(allergyInput)}
            disabled={isGenerating}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleAddAllergy(allergyInput)}
            disabled={isGenerating}
          >
            Add
          </button>
        </div>
        <div className="mt-xs text-caption-1 text-secondary">
          Common: {commonAllergies.join(', ')}
        </div>
      </div>

      <div className="mb-lg">
        <label className="block text-subhead text-secondary mb-xs">Other Restrictions</label>
        <textarea
          value={formData.otherRestrictions}
          onChange={(e) => setFormData({ ...formData, otherRestrictions: e.target.value })}
          placeholder="Any other dietary restrictions or dislikes? (e.g., No spicy food, Prefer organic)"
          className="input-field w-full min-h-[100px]"
          disabled={isGenerating}
        />
      </div>

      <div className="flex justify-between">
        <button type="button" className="btn btn-secondary" onClick={onBack} disabled={isGenerating}>
          Back
        </button>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={onSubmit} 
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Finish & Generate Plan'}
        </button>
      </div>
    </div>
  );
};

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    activityLevel: '',
    dietaryPreferences: [],
    allergies: [],
    otherRestrictions: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    console.log("Onboarding completed with ", formData);
    
    setIsGenerating(true);
    try {
        const userDataForApi = {
            ...formData,
            userId: currentUser?.uid
        };

        const generatedPlan = await generateMealPlan(userDataForApi);

        localStorage.setItem('current_meal_plan_for_user_' + currentUser.uid, JSON.stringify(generatedPlan));
        
        if (currentUser?.uid) {
            localStorage.setItem('onboarding_complete_for_user_' + currentUser.uid, 'true');
            console.log("Onboarding marked as complete in localStorage for user:", currentUser.uid);
        } else {
            console.warn("User ID not available in Onboarding component, cannot set flag.");
        }
        
        alert("Meal plan generated successfully! (Simulated)");
        navigate('/'); 
        
    } catch (error) {
        console.error("Error generating meal plan:", error);
        alert("Failed to generate meal plan. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-md">
      <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
        <div className="mb-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary bg-opacity-20 text-primary mb-xs">
            {step === 1 && <Target size={24} />}
            {step === 2 && <Utensils size={24} />}
            {step === 3 && <AlertTriangle size={24} />}
          </div>
          <div className="text-caption-1 text-secondary">
            Step {step} of 3
          </div>
        </div>
        {step === 1 && (
          <GoalsStep
            onNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {step === 2 && (
          <PreferencesStep
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {step === 3 && (
          <RestrictionsStep
            onSubmit={handleSubmit}
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
            isGenerating={isGenerating}
          />
        )}
      </div>
    </div>
  );
};

export default Onboarding;