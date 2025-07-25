import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProfileProvider, useUserProfile } from './contexts/UserProfileContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/SignUp';
import Onboarding from './components/Onboarding/Onboarding';
import Dashboard from './components/Dashboard/Dashboard'; // Correctly imports the Dashboard

/**
 * This component contains the core logic for deciding what to show the user.
 */
function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser } = useAuth();
  const { hasProfile, loading: profileLoading } = useUserProfile();

  // Show a loading indicator while we check for a user and their profile
  if (profileLoading) {
    return (
      <div className="flex-center">
        <p className="body-text">Loading...</p>
      </div>
    );
  }

  // If a user is logged in...
  if (currentUser) {
    // ...and they have a profile, show the main Dashboard.
    if (hasProfile) {
      return <Dashboard />;
    } else {
      // ...but they don't have a profile, start the Onboarding flow.
      return <Onboarding />;
    }
  }

  // If no user is logged in and they clicked "Get Started"...
  if (showAuth) {
    // ...show the Login or Signup forms.
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

  // If no user is logged in, show the main landing page.
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

/**
 * The main App component wraps everything in the necessary context providers.
 */
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