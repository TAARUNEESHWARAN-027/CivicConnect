// ==============================
// Authentication Context
// ==============================
// Provides authentication state (user, token, login/logout functions)
// to all components in the application.

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile } from '../services/api';

// Create the auth context
const AuthContext = createContext(null);

/**
 * AuthProvider component
 * Wraps the app and provides auth state to all children.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a stored token and verify it
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await getProfile();
          setUser(data.user);
        } catch (error) {
          // Token is invalid or expired, clear it
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  /**
   * Login: Save token and set user state
   */
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  /**
   * Logout: Clear token and user state
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
