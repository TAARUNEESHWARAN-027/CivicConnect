// ==============================
// Dashboard Page
// ==============================
// Shows the logged-in user's reported issues and their statuses.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllIssues } from '../services/api';
import { useAuth } from '../context/AuthContext';
import IssueCard from '../components/IssueCard';
import './Dashboard.css';

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const { user } = useAuth();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await getAllIssues();
        setIssues(data.issues);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // Filter issues by status
  const filteredIssues =
    filter === 'All'
      ? issues
      : issues.filter((issue) => issue.status === filter);

  // Count issues by status
  const statusCounts = {
    All: issues.length,
    Pending: issues.filter((i) => i.status === 'Pending').length,
    'In Progress': issues.filter((i) => i.status === 'In Progress').length,
    Resolved: issues.filter((i) => i.status === 'Resolved').length,
  };

  if (loading) {
    return <div className="loading-text">Loading your issues...</div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {user.name}. Here are your reported issues.</p>
      </div>

      {/* Status summary cards */}
      <div className="dashboard-stats">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className={`stat-card card ${
              filter === status ? 'stat-active' : ''
            }`}
            onClick={() => setFilter(status)}
          >
            <div className="stat-number">{count}</div>
            <div className="stat-label">{status}</div>
          </div>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Issues list */}
      <div className="dashboard-issues">
        <div className="section-header">
          <h2>
            {filter === 'All' ? 'All Issues' : `${filter} Issues`}
          </h2>
          <Link to="/report" className="btn btn-primary">
            Report New Issue
          </Link>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="empty-state card">
            <p>No issues found.</p>
            <Link to="/report" className="btn btn-outline">
              Report Your First Issue
            </Link>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
