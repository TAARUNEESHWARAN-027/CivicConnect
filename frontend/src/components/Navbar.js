// ==============================
// Navbar Component
// ==============================
// Displays the navigation bar with links based on auth state.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">&#9878;</span>
          CivicConnect
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/report" className="nav-link">
                Report Issue
              </Link>
              {user.role === 'Admin' && (
                <Link to="/admin" className="nav-link">
                  Admin Panel
                </Link>
              )}
              <span className="nav-user">
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn btn-outline nav-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary nav-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
