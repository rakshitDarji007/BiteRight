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
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setCurrentUser(session?.user || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Supabase auth event: ${event}`);
        setSession(session);
        setCurrentUser(session?.user || null);

        if (session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error && error.code !== 'PGRST116') {
              console.error("Error fetching profile in AuthContext:", error);
            } else if (profile) {
              console.log("Profile fetched in AuthContext:", profile);
            } else {
              console.log("No profile found for user in AuthContext, might be created later.");
            }
          } catch (err) {
            console.error("Unexpected error fetching profile in AuthContext:", err);
          }
        }

        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUser]);

  const login = async (email, password) => {
    console.log("Attempting login with:", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Login error:", error.message);
      throw error;
    }
    return data;
  };

  const signup = async (email, password) => {
    console.log("Attempting signup with:", email);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Signup error:", error.message);
      throw error;
    }
    return data;
  };

  const logout = async () => {
    console.log("Logging out user");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      throw error;
    }
  };

  const value = {
    currentUser,
    session,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}