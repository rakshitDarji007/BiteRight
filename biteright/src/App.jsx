import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/SignUp';

function AppContent() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser, logout } = useAuth();

  if (currentUser) {
    return (
      <div className="flex-center">
        <div className="container">
          <div className="text-center">
            <h1 className="title-large">Welcome to BiteRight!</h1>
            <p className="body-text mb-4">Hello, {currentUser.email}</p>
            <button onClick={logout} className="apple-button-secondary">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
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
      <AppContent />
    </AuthProvider>
  );
}

export default App;
