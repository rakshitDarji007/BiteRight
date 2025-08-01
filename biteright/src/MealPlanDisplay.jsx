import React, { useState, useEffect } from 'react';
import { Calendar, Utensils, Plus } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import './index.css';

const MealPlanDisplay = () => {
  const { currentUser } = useAuth();
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMealPlan = () => {
      try {
        if (!currentUser?.uid) {
          throw new Error("User not authenticated.");
        }

        const storedPlan = localStorage.getItem('current_meal_plan_for_user_' + currentUser.uid);
        if (storedPlan) {
          const parsedPlan = JSON.parse(storedPlan);
          setMealPlan(parsedPlan);
        } else {
          setError("No meal plan found. Please complete onboarding first.");
        }
      } catch (err) {
        console.error("Failed to load meal plan:", err);
        setError("Failed to load meal plan. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] py-lg">
        <div className="card text-center py-lg px-lg">
          <p className="text-subhead">Loading your meal plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] py-lg">
        <div className="card text-center py-lg px-lg">
          <p className="text-error text-subhead">{error}</p>
          <button className="btn btn-primary mt-md" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] py-lg">
        <div className="card text-center py-lg px-lg">
          <p className="text-subhead">No meal plan available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-md px-md">
      <header className="mb-xl">
        <h1 className="text-title-1">Your Meal Plan</h1>
        <p className="text-subhead text-secondary mt-xs">{mealPlan.summary}</p>
        <div className="flex items-center text-caption-1 text-secondary mt-xs">
          <Calendar size={16} className="mr-xs" />
          <span>Generated on {new Date(mealPlan.generatedAt).toLocaleDateString()}</span>
        </div>
      </header>

      <div className="meal-grid mb-xl">
        {mealPlan.days.slice(0, 3).map((day) => (
          <div key={day.day} className="card transition-all duration-200 hover:shadow-floating">
            <h2 className="text-title-3 mb-lg pb-xs border-b border-gray-700">Day {day.day}</h2>
            <ul className="space-y-md">
              {day.meals.map((meal, index) => (
                <li key={index} className="border-b border-gray-700 pb-md last:border-0 last:pb-0 transition-opacity duration-200 hover:opacity-90">
                  <div className="flex items-start">
                    <div style={{
                      backgroundColor: 'var(--color-primary)',
                      opacity: '0.2',
                      padding: 'var(--spacing-xs)',
                      borderRadius: 'var(--border-radius-default)'
                    }} className="flex-shrink-0 mr-md mt-xxs">
                      <Utensils size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-body">{meal.type}: {meal.name}</h3>
                      <p className="text-sm text-secondary mt-xs">{meal.description}</p>
                      {meal.calories && (
                        <div className="text-caption-1 text-tertiary mt-xs flex flex-wrap gap-xs">
                          <span>Cal: {meal.calories}</span>
                          {meal.protein && <span>Protein: {meal.protein}g</span>}
                          {meal.carbs && <span>Carbs: {meal.carbs}g</span>}
                          {meal.fat && <span>Fat: {meal.fat}g</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="btn btn-primary flex items-center px-lg py-sm text-subhead">
          <Plus size={18} className="mr-xs" />
          Generate New Plan
        </button>
      </div>
    </div>
  );
};

export default MealPlanDisplay;