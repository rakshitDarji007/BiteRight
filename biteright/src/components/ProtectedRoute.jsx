import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  console.log("ProtectedRoute: checking access, loading:", loading, "currentUser:", currentUser?.id || null);

  if (loading) {
    console.log("ProtectedRoute: Still loading auth state...");
    return <div className="flex items-center justify-center min-h-screen">Checking authentication...</div>;
  }

  if (!currentUser) {
    console.log("ProtectedRoute: No currentUser, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute: User authenticated, rendering children for user:", currentUser.id);
  return children;
};

export default ProtectedRoute;