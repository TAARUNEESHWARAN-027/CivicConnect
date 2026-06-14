// ==============================
// PrivateRoute Component
// ==============================
// Wraps protected pages to redirect unauthenticated users to login.
// Can also restrict access to Admin-only pages.

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Admin-only page but user is not admin - redirect to dashboard
  if (adminOnly && user.role !== 'Admin') {
    return <Navigate to="/dashboard" />;
  }

  // Authorized - render the children
  return children;
};

export default PrivateRoute;
