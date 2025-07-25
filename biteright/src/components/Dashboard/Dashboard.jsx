import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { getActiveMealPlan, generateNewMealPlan } from '../../firebase/firestore';
import { LogOut, AlertTriangle } from 'lucide-react';
import SkeletonPlan from './SkeletonPlan';

const DayPlan = ({ day, meals }) => (
  <div className="apple-card mb-6">
    <h3 className="title-3 mb-4 capitalize">{day}</h3>
    <div className="space-y-3">
      {Object.entries(meals).map(([mealType, description]) => (
        <div key={mealType}>
          <p className="headline capitalize">{mealType.replace('_', ' ')}</p>
          <p className="body-text-secondary">{description}</p>
        </div>
      ))}
    </div>
  </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
  <div className="apple-card-red text-center py-8">
    <AlertTriangle className="mx-auto mb-4" size={40} />
    <h2 className="title-3 mb-2">An Error Occurred</h2>
    <p className="body-text-secondary mb-6">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="apple-button-secondary-red">
        Try Again
      </button>
    )}
  </div>
);

export default function Dashboard() {
  const { logout } = useAuth();
  const { profile } = useUserProfile();
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInitialPlan = async () => {
    if (profile) {
      setLoading(true);
      setError('');
      try {
        const plan = await getActiveMealPlan();
        setMealPlan(plan);
      } catch (err) {
        setError('Could not load your meal plan.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchInitialPlan();
  }, [profile]);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError('');
    try {
      const newPlan = await generateNewMealPlan(profile);
      setMealPlan(newPlan);
    } catch (err) {
      setError(err.message || 'Failed to generate a new plan.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <SkeletonPlan />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={handleGeneratePlan} />;
    }
    if (mealPlan) {
      return (
        <div>
          {Object.entries(mealPlan.plan_data).map(([day, meals]) => (
            <DayPlan key={day} day={day} meals={meals} />
          ))}
        </div>
      );
    }
    return (
      <div className="text-center apple-card py-12">
        <h2 className="title-2 mb-2">Welcome!</h2>
        <p className="body-text mb-6">You don't have an active meal plan yet.</p>
        <button onClick={handleGeneratePlan} className="apple-button">
          Generate My First Plan
        </button>
      </div>
    );
  };

  return (
    <div className="container py-8" style={{ maxWidth: '600px' }}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="title-large">Your Plan</h1>
        <button onClick={logout} className="apple-icon-button" aria-label="Sign Out">
          <LogOut size={20} />
        </button>
      </header>
      <main>
        {renderContent()}
      </main>
      {!loading && !error && mealPlan && (
        <div className="mt-8 text-center">
          <button onClick={handleGeneratePlan} className="apple-button-secondary">
            Generate a New Plan
          </button>
        </div>
      )}
    </div>
  );
}