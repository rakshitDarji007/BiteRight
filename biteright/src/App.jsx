import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './index.css';
import { Apple, LogOut } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

const AppDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
     logout();
     navigate('/login');
  };

  const isOnboardingComplete = localStorage.getItem('onboarding_complete_for_user_' + currentUser?.uid);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="p-md border-b border-gray-800">
        <div className="container flex justify-between items-center">
          <h1 className="text-title-3 flex items-center">
            <Apple size={24} className="mr-xs text-primary" />
            BiteRight
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-subhead text-secondary hidden sm:inline">Hi, {currentUser?.name || currentUser?.email}</span>
            <button onClick={handleLogout} className="btn btn-secondary flex items-center">
              <LogOut size={16} className="mr-xs" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-md">
        {isOnboardingComplete ? (
          <MealPlanDisplay />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="card text-center" style={{ maxWidth: '600px', width: '100%' }}>
              <div className="flex justify-center mb-md">
                <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-md)', borderRadius: '50%' }}>
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