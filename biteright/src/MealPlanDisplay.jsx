import React, { useState, useEffect } from 'react';
import { Calendar, Utensils, Plus, ShoppingCart } from 'lucide-react';
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
      <div className="flex min-h-screen items-center justify-center p-md">
        <div className="card text-center" style={{ width: '100%', maxWidth: '400px' }}>
          <p>Loading your meal plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-md">
        <div className="card text-center" style={{ width: '100%', maxWidth: '400px' }}>
          <p className="text-error">{error}</p>
          <button className="btn btn-primary mt-md" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center p-md">
        <div className="card text-center" style={{ width: '100%', maxWidth: '400px' }}>
          <p>No meal plan available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-md">
      <header className="mb-lg">
        <h1 className="text-title-1">Your Meal Plan</h1>
        <p className="text-subhead text-secondary mt-xs">{mealPlan.summary}</p>
        <div className="flex items-center text-caption-1 text-secondary mt-xs">
          <Calendar size={16} className="mr-xs" />
          <span>Generated on {new Date(mealPlan.generatedAt).toLocaleDateString()}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {mealPlan.days.slice(0, 3).map((day) => (
          <div key={day.day} className="card">
            <h2 className="text-title-3 mb-md">Day {day.day}</h2>
            <ul className="space-y-md">
              {day.meals.map((meal, index) => (
                <li key={index} className="border-b border-gray-700 pb-md last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="bg-primary bg-opacity-20 p-xs rounded mr-md flex-shrink-0">
                      <Utensils size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{meal.type}: {meal.name}</h3>
                      <p className="text-sm text-secondary mt-xs">{meal.description}</p>
                      {meal.calories && (
                        <div className="text-caption-1 text-secondary mt-xs">
                          Calories: {meal.calories} | Protein: {meal.protein || 'N/A'}g | Carbs: {meal.carbs || 'N/A'}g | Fat: {meal.fat || 'N/A'}g
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

      <div className="flex justify-center mt-xl">
        <button className="btn btn-primary flex items-center">
          <Plus size={16} className="mr-xs" />
          Generate New Plan
        </button>
      </div>
    </div>
  );
};

export default MealPlanDisplay;