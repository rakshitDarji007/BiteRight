import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = () => {
      const storedUser = localStorage.getItem('biteright_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
        } catch (e) {
          console.error("Failed to parse stored user data", e);
        }
      }
      setLoading(false);
    };

    const timer = setTimeout(checkUserSession, 500);
    return () => clearTimeout(timer);
  }, []);

  const login = (userData) => {
    console.log("Logging in user:", userData);
    setCurrentUser(userData);
    localStorage.setItem('biteright_user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log("Logging out user");
    setCurrentUser(null);
    localStorage.removeItem('biteright_user');
  };

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}