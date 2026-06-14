// ==============================
// App Component
// ==============================
// Root component that sets up routing and auth context.

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import IssueDetails from './pages/IssueDetails';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

/**
 * Main app content (separated so it can use auth context)
 */
const AppContent = () => {
  const { user, loading } = useAuth();

  // Show a loading state while checking auth
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                user ? (
                  <Navigate to={user.role === 'Admin' ? '/admin' : '/dashboard'} />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <Register />}
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/report"
              element={
                <PrivateRoute>
                  <ReportIssue />
                </PrivateRoute>
              }
            />
            <Route
              path="/issues/:id"
              element={
                <PrivateRoute>
                  <IssueDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

/**
 * Landing page for unauthenticated users
 */
const LandingPage = () => {
  return (
    <div className="landing">
      <div className="landing-content">
        <h1>Welcome to CivicConnect</h1>
        <p>
          A simple platform for reporting and tracking civic issues in your
          community. Report potholes, broken streetlights, garbage problems,
          and more.
        </p>
        <div className="landing-buttons">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * Root App component
 */
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
