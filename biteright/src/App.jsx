import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './index.css';
import { Apple, LogOut } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './supabaseClient';

const AppDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    console.log("AppDashboard useEffect running, currentUser:", currentUser);
    const checkOnboardingStatus = async () => {
        setCheckingOnboarding(true);
        if (!currentUser?.uid) {
            console.log("No currentUser.uid, setting onboarding to incomplete");
            setIsOnboardingComplete(false);
            setCheckingOnboarding(false);
            return;
        }

        try {
            console.log("Fetching onboarding status for:", currentUser.uid);
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('onboarding_complete')
              .eq('id', currentUser.uid)
              .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.log("Profile not found for user");
                    setIsOnboardingComplete(false);
                } else {
                    console.error("Error checking onboarding status:", error);
                    setIsOnboardingComplete(false);
                }
            } else {
                console.log("Profile found, onboarding_complete:", profile?.onboarding_complete);
                setIsOnboardingComplete(profile?.onboarding_complete === true);
            }
        } catch (err) {
            console.error("Unexpected error checking onboarding status:", err);
            setIsOnboardingComplete(false);
        } finally {
            console.log("Finished checking onboarding status");
            setCheckingOnboarding(false);
        }
    };

    checkOnboardingStatus();
  }, [currentUser]);

  const handleLogout = async () => {
     try {
        await logout();
        navigate('/login');
     } catch (err) {
        console.error("Logout error in AppDashboard:", err);
     }
  };

  if (checkingOnboarding) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] py-lg">
            <div className="card text-center py-lg px-lg">
                <p className="text-subhead">Loading dashboard...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-md px-md border-b border-gray-800">
        <div className="container flex justify-between items-center">
          <h1 className="text-title-3 flex items-center">
            <Apple size={24} className="mr-xs text-primary" />
            BiteRight
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-subhead text-secondary hidden sm:inline">Hi, {currentUser?.user_metadata?.name || currentUser?.email}</span>
            <button onClick={handleLogout} className="btn btn-secondary flex items-center">
              <LogOut size={16} className="mr-xs" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow py-md px-md">
        {isOnboardingComplete ? (
          <MealPlanDisplay />
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
            <div className="card text-center" style={{ maxWidth: '600px', width: '100%' }}>
              <div className="flex justify-center mb-md">
                <div style={{
                  backgroundColor: 'var(--color-surface)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--border-radius-circle)'
                }}>
                  <Apple size={48} color="var(--color-primary)" />
                </div>
              </div>
              <h2 className="text-title-2 mb-md">Welcome to BiteRight</h2>
              <p className="text-subhead text-secondary mb-lg">
                Let's get started by setting up your profile.
              </p>
              <button className="btn btn-primary mt-md" onClick={() => navigate('/onboarding')}>
                Complete Onboarding
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

import Signup from './Signup';
import Login from './Login';
import ProtectedRoute from './components/ProtectedRoute';
import Onboarding from './Onboarding';
import MealPlanDisplay from './MealPlanDisplay';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <AppDashboard />
            </ProtectedRoute>
          } />
          <Route path="/onboarding" element={
             <ProtectedRoute>
               <Onboarding />
             </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;