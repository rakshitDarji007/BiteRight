import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  const fetchUser = useCallback(async () => {
    console.log("AuthProvider (Simple): fetchUser called");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("AuthProvider (Simple): fetchUser got session", session?.user?.id || null);
      setSession(session);
      setCurrentUser(session?.user || null);
    } catch (error) {
      console.error("AuthProvider (Simple): Error in fetchUser:", error);
    } finally {
      setLoading(false);
      console.log("AuthProvider (Simple): fetchUser finished, setLoading(false) called");
    }
  }, []);

  useEffect(() => {
    console.log("AuthProvider (Simple): useEffect running");
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`AuthProvider (Simple): Supabase auth event: ${event}`, session?.user?.id || null);
      setSession(session);
      setCurrentUser(session?.user || null);
      setLoading(false);
      console.log("AuthProvider (Simple): Auth state changed, setLoading(false) called");
    });

    return () => {
      console.log("AuthProvider (Simple): Cleaning up auth listener");
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [fetchUser]);

  const login = async (email, password) => {
    console.log("AuthProvider (Simple): Attempting login with:", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("AuthProvider (Simple): Login error:", error.message);
      throw error;
    }
    console.log("AuthProvider (Simple): Login successful for:", data.user?.id);
    return data;
  };

  const signup = async (email, password) => {
    console.log("AuthProvider (Simple): Attempting signup with:", email);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("AuthProvider (Simple): Signup error:", error.message);
      throw error;
    }
    console.log("AuthProvider (Simple): Signup initiated for:", data.user?.id);
    return data;
  };

  const logout = async () => {
    console.log("AuthProvider (Simple): Logging out user");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("AuthProvider (Simple): Logout error:", error.message);
      throw error;
    }
    console.log("AuthProvider (Simple): Logout successful");
  };

  const value = {
    currentUser,
    session,
    login,
    signup,
    logout
  };

  console.log("AuthProvider (Simple) rendering, loading:", loading);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Initializing Auth...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}