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
          <h1 className="text-title-3">BiteRight</h1>
          <div className="flex items-center space-x-4">
            <span className="text-subhead text-secondary">Hi, {currentUser?.name || currentUser?.email}</span>
            <button onClick={handleLogout} className="btn btn-secondary flex items-center">
              <LogOut size={16} className="mr-xs" />
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-md">
        <div className="card text-center" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="flex justify-center mb-md">
            <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-md)', borderRadius: '50%' }}>
              <Apple size={48} color="var(--color-primary)" />
            </div>
          </div>
          <h2 className="text-title-2 mb-md">Welcome to BiteRight</h2>
          
          {isOnboardingComplete ? (
            <>
              <p className="text-subhead text-secondary mb-lg">
                Your personalized meal plan dashboard will be here.
              </p>
              <p className="text-secondary mb-md">User Email: {currentUser?.email}</p>
              <p className="text-secondary mb-md">User Name: {currentUser?.name}</p>
              <button className="btn btn-primary mt-md" onClick={() => alert("Display meal plan here")}>
                View My Meal Plan
              </button>
            </>
          ) : (
            <>
              <p className="text-subhead text-secondary mb-lg">
                Let's get started by setting up your profile.
              </p>
              <button className="btn btn-primary mt-md" onClick={() => navigate('/onboarding')}>
                Complete Onboarding
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

import Signup from './Signup';
import Login from './Login';
import ProtectedRoute from './components/ProtectedRoute';
import Onboarding from './Onboarding';

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