import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import { getActiveMealPlan, generateNewMealPlan } from '../../firebase/firestore';
import { LogOut } from 'lucide-react';

const DayPlan = ({ day, meals }) => (
    <div className="apple-card mb-6">
        <h3 className="title-3 mb-4">{day}</h3>
        <div className="space-y-3">
            {Object.entries(meals).map(([mealType, description]) => (
                <div key={mealType}>
                    <p className="headline capitalize">{mealType}</p>
                    <p className="body-text-secondary">{description}</p>
                </div>
            ))}
        </div>
    </div>
);

export default function Dashboard() {
    const { logout } = useAuth();
    const { profile } = useUserProfile();
    const [mealPlan, setMealPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchPlan = async () => {
            if (profile) {
                setLoading(true);
                const plan = await getActiveMealPlan();
                setMealPlan(plan);
                setLoading(false);
            }
        };
        fetchPlan();
    }, [profile]);

    const handleGeneratePlan = async () => {
        setLoading(true);
        setError('');
        try {
            const newPlan = await generateNewMealPlan(profile);
            setMealPlan(newPlan);
        } catch (err) {
            setError('Failed to generate a new plan. Please try again.');
            console.error(err);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex-center">
                <h1 className="title-2">Loading Your Plan...</h1>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="title-large">Your Plan</h1>
                <button onClick={logout} className="apple-icon-button" aria-label="Sign Out">
                    <LogOut size={20} />
                </button>
            </header>

            {error && <p className="body-text-red mb-4">{error}</p>}

            {mealPlan ? (
                <div>
                    {Object.entries(mealPlan.plan_data).map(([day, meals]) => (
                        <DayPlan key={day} day={day} meals={meals} />
                    ))}
                </div>
            ) : (
                <div className="text-center apple-card py-12">
                    <h2 className="title-2 mb-2">Welcome, {profile.name}!</h2>
                    <p className="body-text mb-6">You dont't have an active meal plan yet.</p>
                    <button onClick={handleGeneratePlan} className="apple-button">
                        Generate My First Plan
                    </button>
                </div>
            )}

            {mealPlan && (
                <div className="mt-8 text-center">
                    <button onClick={handleGeneratePlan} className="apple-button-secondary">
                        Generate a New Plan
                    </button>
                </div>
            )}
        </div>
    );
}
