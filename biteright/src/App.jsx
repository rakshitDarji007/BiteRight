import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProfileProvider, useUserProfile } from './contexts/UserProfileContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/SignUp';
import Onboarding from './components/Onboarding/Onboarding';

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser, logout } = useAuth();
  const { hasProfile, loading: profileLoading } = useUserProfile();

  if (profileLoading) {
    return (
      <div className="flex-center">
        <p className="body-text">Loading...</p>
      </div>
    );
  }

  if (currentUser) {
    if (hasProfile) {
      return (
        <div className="flex-center">
          <div className="container text-center">
            <h1 className="title-large">Your Personalized Plan</h1>
            <p className="body-text mb-4">Welcome back, {currentUser.email}</p>
            <button onClick={logout} className="apple-button-secondary">
              Sign Out
            </button>
          </div>
        </div>
      );
    } else {
      return <Onboarding />;
    }
  }

  if (showAuth) {
    return (
      <div className="flex-center">
        <div className="container">
          {isLogin ? (
            <Login onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <Signup onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-center">
      <div className="container">
        <div className="text-center">
          <h1 className="title-large">BiteRight</h1>
          <p className="body-text mb-8">
            Your AI-powered meal planning companion
          </p>
          <button onClick={() => setShowAuth(true)} className="apple-button">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProfileProvider>
        <AppContent />
      </UserProfileProvider>
    </AuthProvider>
  );
}

export default App;